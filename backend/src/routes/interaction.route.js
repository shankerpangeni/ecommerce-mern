import express from "express";
import { logInteraction, getUserInteractions } from "./../controllers/interactionController.js";
import { isAuthenticated } from "./../middleware/isAuthenticated.js";

const router = express.Router();

// 🔹 Record an interaction (view/click/add_to_cart/purchase)
router.post("/log", protect, logInteraction);

// 🔹 Get interaction history (optional)
router.get("/my-interactions", protect, getUserInteractions);

export default router;
