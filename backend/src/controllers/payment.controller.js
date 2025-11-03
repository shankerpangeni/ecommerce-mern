import Stripe from "stripe";
import { Cart } from "../models/cart.models.js";
import { Order } from "../models/order.models.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Create Checkout Session (Full Cart)
export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user._id;

    // ✅ Fetch user cart
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty", success: false });
    }

    // ✅ Convert cart items to Stripe checkout lineItems
    const lineItems = cart.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.product.name },
        unit_amount: item.product.price * 100, // cents
      },
      quantity: item.quantity,
    }));

    // ✅ Create stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-failed`,
      metadata: { userId: userId.toString() },
    });

    return res.status(200).json({
      success: true,
      url: session.url,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Payment initiation failed", success: false });
  }
};
