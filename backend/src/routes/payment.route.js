import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { createCheckoutSession } from "../controllers/payment.controller.js";
import { stripeWebhook } from "./../webhooks/payment.webhook.js";

const router = express.Router();

router.post("/checkout", isAuthenticated, createCheckoutSession);

// Stripe raw body needed for verification
router.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);

export default router;
