import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "./../controllers/product.controller.js";

import { isAuthenticated } from "./../middleware/isAuthenticated.js";

const router = express.Router();

// ✅ RESTful Routes
router.post("/create", isAuthenticated, createProduct);
router.get("/getall", isAuthenticated, getAllProducts);
router.get("/get/:id", isAuthenticated, getProductById);
router.put("/update/:id", isAuthenticated, updateProduct);
router.delete("/delete/:id", isAuthenticated, deleteProduct);

export default router;
