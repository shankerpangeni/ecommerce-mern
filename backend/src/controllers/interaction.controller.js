import { Interaction } from "../models/interactionModel.js";

// ✅ Create / Log User Interaction
export const logInteraction = async (req, res) => {
  try {
    const { productId, action } = req.body;
    const userId = req.user.id; // from auth middleware

    if (!productId || !action) {
      return res.status(400).json({
        success: false,
        message: "Product and action are required"
      });
    }

    const interaction = await Interaction.create({
      user: userId,
      product: productId,
      action,
    });

    res.status(201).json({
      success: true,
      message: "Interaction logged successfully",
      interaction,
    });

  } catch (error) {
    console.error("Interaction Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to log interaction",
    });
  }
};

// ✅ Get user interactions (optional but helpful for analytics)
export const getUserInteractions = async (req, res) => {
  try {
    const userId = req.user.id;

    const interactions = await Interaction.find({ user: userId })
      .populate("product", "name price brand category");

    res.status(200).json({
      success: true,
      interactions,
    });

  } catch (error) {
    console.error("Fetch Interaction Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch data",
    });
  }
};
