import express from "express";
import { isAuthenticated } from "./../middlewares/auth.js";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItemQuantity
} from "./../controllers/cart.controller.js";

const router = express.Router();

// Add item to cart
router.post("/add", isAuthenticated, addToCart);

// Get user cart
router.get("/", isAuthenticated, getCart);

// Remove item from cart
router.delete("/remove/:productId", isAuthenticated, removeFromCart);

// Update item quantity (+/-)
router.put("/update/:productId", isAuthenticated, updateCartItemQuantity);

export default router;
