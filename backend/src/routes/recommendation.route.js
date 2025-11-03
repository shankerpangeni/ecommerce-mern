import express from "express";
import { getRecommendedProducts } from "./../controllers/recommendation.controller.js";
import { isAuthenticatedOptional } from "./../middleware/isAuthenticatedOptional.js"; // optional auth

const router = express.Router();

// Home / landing page recommendations (works even if user is not logged in)
router.get("/search", isAuthenticatedOptional, getRecommendedProducts);

export default router;
