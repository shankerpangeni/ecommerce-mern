import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  createShop,
  getAllShops,
  getShopById,
  updateShop,
  deleteShop
} from "../controllers/shop.controller.js";

const router = express.Router();

// Public routes
router.get("/", getAllShops);
router.get("/:id", getShopById);

// Admin routes
router.post("/create", isAuthenticated, createShop);
router.put("/update/:id", isAuthenticated, updateShop);
router.delete("/delete/:id", isAuthenticated, deleteShop);

export default router;
