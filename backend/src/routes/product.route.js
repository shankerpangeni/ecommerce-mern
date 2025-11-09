import express from "express";
import {
  createProduct,
  updateProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
} from "../controllers/product.controller.js";

import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { multipleUpload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ✅ Create Product + Upload Images
router.post("/create", isAuthenticated, multipleUpload("products"), createProduct);

// ✅ Update Product + Upload Images
router.put("/update/:id", isAuthenticated, multipleUpload("products"), updateProduct);

// ✅ Get Products
router.get("/getall", getAllProducts);
router.get("/get/:id", getProductById);

// ✅ Delete Product
router.delete("/delete/:id", isAuthenticated, deleteProduct);

export default router;
