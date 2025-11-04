import Stripe from "stripe";
import { Cart } from "./../models/cart.models.js";
import { Order } from "./../models/order.models.js";
import { sendEmail } from "./../utils/emailService.js";
import { User } from "./../models/user.models.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhook = async (req, res) => {
  try {
    const sig = req.headers["stripe-signature"];
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // ✅ After Payment Success
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata.userId;

      const cart = await Cart.findOne({ user: userId }).populate("items.product");
      const user = await User.findById(userId);

      if (cart && user) {
        const items = cart.items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        }));

        // ✅ Create Order
        await Order.create({
          user: userId,
          items,
          totalAmount: session.amount_total / 100,
          paymentMethod: "card",
          paymentStatus: "paid",
          orderStatus: "confirmed",
        });

        // ✅ Clean Cart
        await Cart.findOneAndDelete({ user: userId });

        // ✅ Send Email Receipt
        const emailHTML = `
          <h2>✅ Payment Successful!</h2>
          <p>Hi ${user.name},</p>
          <p>Thank you for your purchase!</p>
          <p><strong>Order Total:</strong> $${(session.amount_total / 100).toFixed(2)}</p>
          <br/>
          <p>Your order has been confirmed and is being processed.</p>
          <br/>
          <p>🛒 Ecommerce Store</p>
        `;

        await sendEmail(user.email, "Your Order Receipt ✅", emailHTML);
      }
    }

    res.json({ received: true });

  } catch (error) {
    console.error("Webhook error:", error.message);
    res.status(400).send(`Webhook error: ${error.message}`);
  }
};
