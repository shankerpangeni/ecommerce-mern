import { Cart } from "../models/cart.models.js";
import { Order } from "../models/order.models.js";
import { Product } from "../models/product.models.js";

// Create order from user cart
export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ message: "Cart is empty", success: false });
    }

    // Calculate total amount
    let totalAmount = 0;
    cart.items.forEach(item => {
      totalAmount += item.product.price * item.quantity;
    });

    const order = await Order.create({
      user: userId,
      items: cart.items,
      totalAmount,
    });

    // Clear cart after order placed
    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Order placed successfully",
      order,
      success: true,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Order creation failed", success: false });
  }
};

// Get logged-in user's orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("items.product");

    res.status(200).json({ orders, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch orders", success: false });
  }
};

// Admin: Get all orders
export const getAllOrders = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized", success: false });
    }

    const orders = await Order.find().populate("items.product").populate("user", "fullname email");

    res.status(200).json({ orders, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch orders", success: false });
  }
};

// Admin: Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized", success: false });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found", success: false });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: "Order status updated", order, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update order status", success: false });
  }
};



export const getOrderBySessionId = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const order = await Order.findOne({ stripeSessionId: sessionId })
      .populate("items.product")
      .populate("user");

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    res.status(200).json({ success: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch order" });
  }
};
