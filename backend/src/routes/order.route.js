import express from "express";
import { isAuthenticated } from "./../middlewares/auth.js";
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
} from "./../controllers/order.controller.js";

const router = express.Router();

// User routes
router.post("/create", isAuthenticated, createOrder);
router.get("/my-orders", isAuthenticated, getUserOrders);

// Admin routes
router.get("/all", isAuthenticated, getAllOrders);
router.put("/update-status/:orderId", isAuthenticated, updateOrderStatus);

export default router;
