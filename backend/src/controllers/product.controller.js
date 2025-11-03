import { Product } from "./../models/product.models.js";
import { Shop } from "./../models/shop.models.js";

// ✅ Create Product (Admin Only)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, brand, category, shop, genderSpecific, stock, discountedPrice } = req.body;

    if (!name || !description || !price || !brand || !category || !shop) {
      return res.status(400).json({ message: "All required fields must be provided", success: false });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    const shopExists = await Shop.findById(shop);
    if (!shopExists) {
      return res.status(404).json({ message: "Shop not found", success: false });
    }

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
    });

    return res.status(201).json({
      message: "Product created successfully",
      product,
      success: true,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ✅ Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("shop", "name location rating");

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found", success: false });
    }

    return res.status(200).json({
      message: "Products fetched",
      success: true,
      products,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ✅ Get Product by ID
export const getProductById = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findById(id).populate("shop");
    if (!product) {
      return res.status(404).json({ message: "Product not found", success: false });
    }

    return res.status(200).json({
      message: "Product found",
      success: true,
      product,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ✅ Update Product (Admin Only)
export const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found", success: false });
    }

    return res.status(200).json({
      message: "Product updated",
      success: true,
      product: updatedProduct,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// ✅ Delete Product (Admin Only)
export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found", success: false });
    }

    return res.status(200).json({
      message: "Product deleted successfully",
      success: true,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
