import { Cart } from "./../models/cart.models.js";
import { Product } from "./../models/product.models.js";

export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;
    

    if (!productId || !quantity) {
      return res.status(400).json({ message: "Product and quantity required", success: false });
    }

    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({ message: "Product not found", success: false });
    }

    let cart = await Cart.findOne({ user: userId });



    

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        products: [{ product: productId, quantity ,productTotal:productsTotal }],
      });
    } else {
      if (!cart.products) cart.products = [];

      const itemIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.products[itemIndex].quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }
    }

    await cart.save();
    return res.status(200).json({
      message: "Cart updated successfully",
      cart,
      success: true,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Cart update failed", success: false });
  }
};


export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate({path: "products.product" , populate:{
      path:"shop",
      model:"Shop",
    }});
       // ✅ fixed typo

    if (!cart) {
      return res.status(404).json({
        message: "No cart found",
        success: false,
        cart: []
      });
    }

    return res.status(200).json({
      message: "Cart fetched successfully",
      cart,
      success: true
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch cart", success: false });
  }
};




// Update item quantity
export const updateCartItemQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { quantity } = req.body;

    let cart = await Cart.findOne({ user: userId }).populate("products.product");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found", success: false });
    }

    const itemIndex = cart.products.findIndex(
      (item) => item.product._id.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not in cart", success: false });
    }

    if (quantity <= 0) {
      cart.products.splice(itemIndex, 1);
    } else {
      cart.products[itemIndex].quantity = quantity;
    }

    await cart.save();

    return res.status(200).json({
      message: "Quantity updated",
      cart, // products.product is populated
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update quantity", success: false });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) return res.status(404).json({ message: "Cart not found", success: false });

    cart.products = cart.products.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    return res.status(200).json({ message: "Item removed successfully", cart, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to remove item", success: false });
  }
};



