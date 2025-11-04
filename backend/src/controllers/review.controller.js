import { Review } from "./../models/review.models.js";
import { Product } from "./../models/product.models.js";
import { Order } from "./../models/order.models.js";

// Add or Update Review
export const addReview = async (req, res) => {
  try {
    const user = req.user._id;
    const { productId, rating, comment } = req.body;

    if (!rating || !productId) {
      return res.status(400).json({ message: "Rating and Product required", success: false });
    }

    // ✅ Check if the user purchased this product
    const purchased = await Order.findOne({
      user,
      "products.product": productId
    });

    if (!purchased) {
      return res.status(403).json({ message: "Buy product first to review", success: false });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ user, product: productId });

    if (existingReview) {
      // update
      existingReview.rating = rating;
      existingReview.comment = comment;
      await existingReview.save();
    } else {
      await Review.create({ product: productId, user, rating, comment });
    }

    await calculateAverageRating(productId);

    return res.status(200).json({ message: "Review saved", success: true });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Review failed", success: false });
  }
};

// Get all reviews of a product
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
      .populate("user", "name");

    res.status(200).json({ reviews, success: true });

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews", success: false });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const user = req.user._id;
    const { reviewId } = req.params;

    const review = await Review.findOne({ _id: reviewId, user });

    if (!review) {
      return res.status(404).json({ message: "Review not found", success: false });
    }

    await review.deleteOne();

    await calculateAverageRating(review.product);

    res.status(200).json({ message: "Review removed", success: true });

  } catch (err) {
    res.status(500).json({ message: "Failed to delete review", success: false });
  }
};

// ✅ Helper: Update Product Rating
const calculateAverageRating = async (productId) => {
  const reviews = await Review.find({ product: productId });

  const avgRating =
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length || 0;

  await Product.findByIdAndUpdate(productId, {
    rating: avgRating.toFixed(1),
    numberOfReviews: reviews.length,
  });
};
