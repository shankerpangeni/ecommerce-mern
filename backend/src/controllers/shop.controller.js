import { Shop } from "./../models/shop.models.js";
import cloudinary from "./../config/cloudinary.js";

/**
 * Create a new shop (Admin only) with optional images upload
 */
export const createShop = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized", success: false });
    }

    const { name, description, location, rating, contact } = req.body;

    if (!name || !description || !location) {
      return res.status(400).json({ message: "Required fields missing", success: false });
    }

    // Handle images uploaded via multer-cloudinary
    const images = req.files?.map(file => ({
      url: file.path,
      public_id: file.filename,
    })) || [];

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
    console.error("Create Shop Error:", error);
    res.status(500).json({ message: "Failed to create shop", success: false });
  }
};

/**
 * Get all shops
 */
export const getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find();
    res.status(200).json({ shops, success: true });
  } catch (error) {
    console.error("Get All Shops Error:", error);
    res.status(500).json({ message: "Failed to fetch shops", success: false });
  }
};

/**
 * Get shop by ID
 */
export const getShopById = async (req, res) => {
  try {
    const { id } = req.params;
    const shop = await Shop.findById(id);

    if (!shop) {
      return res.status(404).json({ message: "Shop not found", success: false });
    }

    res.status(200).json({ shop, success: true });
  } catch (error) {
    console.error("Get Shop By ID Error:", error);
    res.status(500).json({ message: "Failed to fetch shop", success: false });
  }
};

/**
 * Update shop (Admin only), supports add/remove images
 */
export const updateShop = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized", success: false });
    }

    const shop = await Shop.findById(id);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found", success: false });
    }

    const { name, description, location, rating, contact, removeImages } = req.body;

    // Remove images from Cloudinary if requested
    if (removeImages && removeImages.length > 0) {
      const deletePromises = removeImages.map(public_id => cloudinary.uploader.destroy(public_id));
      await Promise.all(deletePromises);

      shop.images = shop.images.filter(img => !removeImages.includes(img.public_id));
    }

    // Add new uploaded images
    if (req.files?.length > 0) {
      const newImages = req.files.map(file => ({
        url: file.path,
        public_id: file.filename,
      }));
      shop.images = [...shop.images, ...newImages];
    }

    // Update other fields
    if (name) shop.name = name;
    if (description) shop.description = description;
    if (location) shop.location = location;
    if (rating) shop.rating = rating;
    if (contact) shop.contact = contact;

    await shop.save();

    res.status(200).json({ message: "Shop updated successfully", shop, success: true });
  } catch (error) {
    console.error("Update Shop Error:", error);
    res.status(500).json({ message: "Failed to update shop", success: false });
  }
};

/**
 * Delete shop (Admin only) and clean up Cloudinary images
 */
export const deleteShop = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized", success: false });
    }

    const shop = await Shop.findById(id);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found", success: false });
    }

    // Delete all images from Cloudinary
    if (shop.images?.length > 0) {
      const deletePromises = shop.images.map(img => cloudinary.uploader.destroy(img.public_id));
      await Promise.all(deletePromises);
    }

    await Shop.findByIdAndDelete(id);

    res.status(200).json({ message: "Shop deleted successfully", success: true });
  } catch (error) {
    console.error("Delete Shop Error:", error);
    res.status(500).json({ message: "Failed to delete shop", success: false });
  }
};
