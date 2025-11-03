import express from "express";
import { addReview, getProductReviews, deleteReview } from "./../controllers/review.controller.js";
import { isAuthenticated } from "./../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/add", isAuthenticated, addReview);
router.get("/:productId", getProductReviews);
router.delete("/:reviewId", isAuthenticated, deleteReview);

export default router;
