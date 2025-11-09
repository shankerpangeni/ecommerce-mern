// src/controllers/payment.controller.js
import Stripe from "stripe";
import { Cart } from "../models/cart.models.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch the user's cart
    const cart = await Cart.findOne({ user: userId }).populate("products.product");
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty", success: false });
    }

    // Convert cart items into Stripe line items
    const lineItems = cart.products.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.product.name },
        unit_amount: item.product.price * 100, // amount in cents
      },
      quantity: item.quantity,
    }));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-failed`,
      metadata: { userId: userId.toString() }, // important for webhook
    });

    res.status(200).json({
      success: true,
      url: session.url, // frontend will redirect user to this
    });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    res.status(500).json({ message: "Payment initiation failed", success: false });
  }
};
