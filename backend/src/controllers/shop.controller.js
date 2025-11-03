import { Shop } from "../models/shop.models.js";

// Create a new shop (Admin only)
export const createShop = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized", success: false });
    }

    const { name, description, location, rating, contact, images } = req.body;

    if (!name || !description || !location) {
      return res.status(400).json({ message: "Required fields missing", success: false });
    }

    const shop = await Shop.create({
      name,
      description,
      location,
      rating: rating || 0,
      contact,
      images,
    });

    res.status(201).json({ message: "Shop created successfully", shop, success: true });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create shop", success: false });
  }
};

// Get all shops
export const getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find();

    res.status(200).json({ shops, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch shops", success: false });
  }
};

// Get shop by ID
export const getShopById = async (req, res) => {
  try {
    const { id } = req.params;
    const shop = await Shop.findById(id);

    if (!shop) {
      return res.status(404).json({ message: "Shop not found", success: false });
    }

    res.status(200).json({ shop, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch shop", success: false });
  }
};

// Update shop (Admin only)
export const updateShop = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized", success: false });
    }

    const updatedShop = await Shop.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedShop) {
      return res.status(404).json({ message: "Shop not found", success: false });
    }

    res.status(200).json({ message: "Shop updated successfully", shop: updatedShop, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update shop", success: false });
  }
};

// Delete shop (Admin only)
export const deleteShop = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized", success: false });
    }

    const deletedShop = await Shop.findByIdAndDelete(id);

    if (!deletedShop) {
      return res.status(404).json({ message: "Shop not found", success: false });
    }

    res.status(200).json({ message: "Shop deleted successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete shop", success: false });
  }
};
