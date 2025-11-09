import Stripe from "stripe";
import { Cart } from "../models/cart.models.js";
import { Order } from "../models/order.models.js";
import { User } from "../models/user.models.js";
import { sendEmail } from "../utils/emailService.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhook = async (req, res) => {
  let event;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("FATAL: STRIPE_WEBHOOK_SECRET is not set in environment.");
    return res.status(500).send("Server Misconfiguration");
  }

  try {
    const sig = req.headers["stripe-signature"];

    // Use req.body (from express.raw) for signature verification
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );
    console.log(`[Stripe Webhook] Successfully verified event: ${event.type} (${event.id})`);

  } catch (err) {
    // This happens if the body is tampered with OR if express.raw() is not used for this route
    console.error(`[Stripe Webhook] Signature verification failed for event ${req.headers['stripe-signature']}:`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle checkout session completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId; // Use optional chaining for safety

    console.log(`[Order Fulfillment] Attempting fulfillment for session ${session.id}.`);
    console.log(`[Order Fulfillment] Extracted userId: ${userId}`);
    
    // Check if the critical metadata is present
    if (!userId) {
      console.error(`[Order Fulfillment] CRITICAL ERROR: Metadata 'userId' is missing on session ${session.id}. Fulfillment aborted.`);
      // Return a 200 so Stripe doesn't retry, but log the error internally
      return res.status(200).json({ received: true, message: "Missing metadata, aborted processing." });
    }

    try {
      // Fetch cart and user
      const cart = await Cart.findOne({ user: userId }).populate("products.product");
      const user = await User.findById(userId);

      if (!cart || !user) {
        // This usually means the user/cart was deleted or the userId was invalid (but not null/undefined)
        console.error(`[Order Fulfillment] Cart or User not found for userId: ${userId} (Session: ${session.id}).`);
        // Return a 200 to prevent retries on stale data
        return res.status(200).json({ received: true, message: "Cart or user not found, order creation skipped." });
      }

      // Prepare order items
      const items = cart.products.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      }));
      
      const totalAmount = session.amount_total / 100;

      // Create order
      const newOrder = await Order.create({
        user: userId,
        items,
        totalAmount,
        paymentMethod: "card",
        paymentStatus: "paid",
        orderStatus: "confirmed",
        stripeSessionId: session.id, // Store Stripe session ID
        shippingAddress: {
          fullName: user.fullname || "",
          phone: user.phoneNumber || "",
          address: user.address || "",
          city: user.city || "",
          postalCode: user.postalCode || "",
        },
      });
      console.log(`[DB SUCCESS] Order ${newOrder._id} created for user ${user.email}.`);

      // Clear user cart
      await Cart.findOneAndDelete({ user: userId });
      console.log(`[DB SUCCESS] Cart cleared for user ${user.email}.`);

      // Send email receipt
      const emailHTML = `
        <h2>✅ Payment Successful!</h2>
        <p>Hi ${user.fullname || "Customer"},</p>
        <p>Thank you for your purchase (Order ID: ${newOrder._id})!</p>
        <p><strong>Total Paid:</strong> $${totalAmount.toFixed(2)}</p>
        <p>Your order is confirmed and is being processed.</p>
      `;

      await sendEmail(user.email, "Your Order Receipt ✅", emailHTML);
      console.log(`[Email SUCCESS] Receipt sent to ${user.email}.`);

    } catch (err) {
      // Catch any Mongoose or network errors
      console.error("[CRITICAL DB/EMAIL ERROR] Error creating order or sending email:", err);
      // Return a 500 to signal a temporary failure and prompt Stripe to retry
      return res.status(500).send("Internal server error during fulfillment");
    }
  } else {
    // Log any unhandled event types
    console.log(`[Stripe Webhook] Received unhandled event type: ${event.type}`);
  }

  // Respond to Stripe to acknowledge receipt
  res.status(200).json({ received: true });
};