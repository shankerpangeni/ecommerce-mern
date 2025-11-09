import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { createCheckoutSession } from "../controllers/payment.controller.js";
import { stripeWebhook } from "./../webhooks/payment.webhook.js";

const router = express.Router();

// Webhook route (raw body is already handled in index.js)
router.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);

// Authenticated checkout
router.post("/checkout", isAuthenticated, createCheckoutSession);

export default router;
