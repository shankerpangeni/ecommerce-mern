import { Product } from "./../models/product.models.js";
import { Shop } from "./../models/shop.models.js";
import cloudinary from "./../config/cloudinary.js";

/**
 * ✅ Create Product (Admin Only)
 */
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, brand, category, shop, genderSpecific, stock, discountedPrice } = req.body;

    // Required fields check
    if (!name || !description || !price || !brand || !category || !shop) {
      return res.status(400).json({ message: "All required fields must be provided", success: false });
    }

    // Admin check
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    const shopExists = await Shop.findById(shop);
    if (!shopExists) return res.status(404).json({ message: "Shop not found", success: false });

    // Images handling
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least 1 image required", success: false });
    }
    if (req.files.length > 5) {
      return res.status(400).json({ message: "Maximum 5 images allowed", success: false });
    }

    const images = req.files.map(file => ({
      url: file.path,
      public_id: file.filename || file.path.split('/').pop()
    }));

    const product = await Product.create({
      name,
      description,
      price,
      brand,
      category,
      shop,
      genderSpecific,
      stock,
      discountedPrice,
      images,
    });

    return res.status(201).json({ message: "Product created successfully", product, success: true });

  } catch (error) {
    console.error("Create Product Error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

/**
 * ✅ Get All Products
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("shop" , "name location images");
    if (!product) {
      return res.status(404).json({ message: "Product not found", success: false });
    }
    return res.status(200).json({ message: "Product found", product, success: true });
  } catch (error) {
    console.error("Get Product By ID Error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

/**
 * ✅ Update Product (Admin Only)
 */
export const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;

    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Unauthorized", success: false });

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found", success: false });

    const {
      name,
      description,
      price,
      brand,
      category,
      genderSpecific,
      stock,
      discountedPrice,
      removeImages, // array of public_ids to remove
    } = req.body;

    // 1️⃣ Remove images from Cloudinary if needed
    if (removeImages && Array.isArray(removeImages) && removeImages.length > 0) {
      const deletePromises = removeImages.map((pid) => cloudinary.uploader.destroy(pid));
      await Promise.all(deletePromises);
      product.images = product.images.filter((img) => !removeImages.includes(img.public_id));
    }

    // 2️⃣ Add new images if uploaded
    if (req.files && req.files.length > 0) {
      if (product.images.length + req.files.length > 5) {
        return res
          .status(400)
          .json({ message: "Maximum 5 images allowed", success: false });
      }

      const newImages = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename || file.path.split("/").pop(),
      }));

      product.images = [...product.images, ...newImages];
    }

    // 3️⃣ Update other fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = price;
    if (brand) product.brand = brand;
    if (category) product.category = category;
    if (genderSpecific) product.genderSpecific = genderSpecific;
    if (stock !== undefined) product.stock = stock;
    if (discountedPrice !== undefined) product.discountedPrice = discountedPrice;
    if (req.body.shop) product.shop = req.body.shop;

    await product.save();

    return res
      .status(200)
      .json({ message: "Product updated successfully", product, success: true });
  } catch (error) {
    console.error("Update Product Error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

/**
 * ✅ Delete Product (Admin Only)
 */
export const deleteProduct = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Unauthorized", success: false });

    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found", success: false });

    // Delete all images from Cloudinary
    if (product.images && product.images.length > 0) {
      const deletePromises = product.images.map(img => cloudinary.uploader.destroy(img.public_id));
      await Promise.all(deletePromises);
    }

    await Product.findByIdAndDelete(id);

    return res.status(200).json({ message: "Product deleted & images removed", success: true });
  } catch (error) {
    console.error("Delete Product Error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};


 export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("shop", "name location rating");
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found", success: false });
    }

    return res.status(200).json({ message: "Products fetched", products, success: true });
  } catch (error) {
    console.error("Get All Products Error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
