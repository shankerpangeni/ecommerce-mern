import Stripe from "stripe";
import { Cart } from "../models/cart.models.js";
import { Order } from "../models/order.models.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhook = async (req, res) => {
  try {
    const sig = req.headers["stripe-signature"];
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // ✅ Event: Payment Success
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata.userId;

      const cart = await Cart.findOne({ user: userId }).populate("items.product");

      if (cart) {
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

        // ✅ Clean User Cart
        await Cart.findOneAndDelete({ user: userId });
      }
    }

    res.json({ received: true });

  } catch (error) {
    console.log(error);
    res.status(400).send(`Webhook error: ${error.message}`);
  }
};
