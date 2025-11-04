import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  uploadProductImages
} from "../controllers/product.controller.js";

import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { uploadProduct } from "../middleware/upload.js"; // multer-storage-cloudinary for products

const router = express.Router();

// ✅ Create Product + Upload Images (max 5)
router.post(
  "/create",
  isAuthenticated,
  uploadProduct.array("images", 5),
  createProduct
);

// ✅ Get All Products
router.get("/getall", isAuthenticated, getAllProducts);

// ✅ Get Product By ID
router.get("/get/:id", isAuthenticated, getProductById);

// ✅ Update Product + Replace/Add Images
router.put(
  "/update/:id",
  isAuthenticated,
  uploadProduct.array("images", 5),
  updateProduct
);

// ✅ Delete Product
router.delete("/delete/:id", isAuthenticated, deleteProduct);

// ✅ Add Images Only (Optional)
router.post(
  "/upload-images/:id",
  isAuthenticated,
  uploadProduct.array("images", 5),
  uploadProductImages
);

export default router;
