import express from "express";
import { isAuthenticated } from "./../middleware/isAuthenticated.js";
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderBySessionId
} from "./../controllers/order.controller.js";

const router = express.Router();

// User routes
router.post("/create", isAuthenticated, createOrder);
router.get("/my-orders", isAuthenticated, getUserOrders);

// Admin routes
router.get("/all", isAuthenticated, getAllOrders);
router.put("/update-status/:orderId", isAuthenticated, updateOrderStatus);

router.get("/session/:sessionId", isAuthenticated, getOrderBySessionId);

export default router;
