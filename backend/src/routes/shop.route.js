import express from "express";
import {
  createShop,
  getAllShops,
  getShopById,
  updateShop,
  deleteShop,
} from "../controllers/shop.controller.js";

import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { cloudinaryUploader } from "../middleware/upload.js"; // multer-storage-cloudinary

const router = express.Router();

// ✅ Create Shop with optional images
router.post(
  "/create",
  isAuthenticated,
  (req, res, next) => {
    const upload = cloudinaryUploader("shops", "shop").array("images", 5); // max 5 images
    upload(req, res, err => {
      if (err) return res.status(400).json({ message: err.message, success: false });
      next();
    });
  },
  createShop
);

// ✅ Get all shops
router.get("/getall", isAuthenticated, getAllShops);

// ✅ Get shop by ID
router.get("/get/:id", isAuthenticated, getShopById);

// ✅ Update Shop + Add/Remove Images
router.put(
  "/update/:id",
  isAuthenticated,
  (req, res, next) => {
    const upload = cloudinaryUploader("shops", req.params.id).array("images", 5);
    upload(req, res, err => {
      if (err) return res.status(400).json({ message: err.message, success: false });
      next();
    });
  },
  updateShop
);

// ✅ Delete Shop
router.delete("/delete/:id", isAuthenticated, deleteShop);

export default router;
