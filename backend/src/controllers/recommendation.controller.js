import { Product } from "../models/product.models.js";
import { Interaction } from "../models/interaction.models.js";

const actionWeights = {
  view: 1,
  click: 2,
  add_to_cart: 3,
  purchase: 5,
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const { keyword, brand, category, gender, minPrice, maxPrice, sort } = req.query;
    const query = {};

    // ✅ Search
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { brand: { $regex: keyword, $options: "i" } },
        { category: { $regex: keyword, $options: "i" } },
        { genderSpecific: { $regex: keyword, $options: "i" } },
      ];
    }

    // ✅ Filters
    if (brand) query.brand = brand;
    if (category) query.category = category;
    if (gender) query.genderSpecific = gender;
    if (minPrice) query.price = { ...query.price, $gte: Number(minPrice) };
    if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };

    // If user actually applied filters OR searched — return filtered results (not recommendation)
    const filtersApplied = keyword || brand || category || gender || minPrice || maxPrice;
    let products = [];

    if (filtersApplied) {
      products = await Product.find(query).populate("shop", "name location").sort(
        sort === "price_asc" ? { price: 1 } :
        sort === "price_desc" ? { price: -1 } :
        sort === "rating" ? { rating: -1 } :
        {}
      );

      return res.status(200).json({
        message: "Filtered/search results",
        products,
        success: true,
      });
    }

    // ✅ No search/filter (homepage) → Try collaborative recommendations
    if (req.user) {
      const userId = req.user._id;
      const interactions = await Interaction.find({ user: userId });

      const userProductIds = interactions.map(i => i.product.toString());

      if (userProductIds.length > 0) {
        const similarInteractions = await Interaction.find({
          product: { $in: userProductIds },
          user: { $ne: userId }
        });

        const scores = {};
        for (let i of similarInteractions) {
          const pid = i.product.toString();
          if (!userProductIds.includes(pid)) {
            scores[pid] = (scores[pid] || 0) + actionWeights[i.action];
          }
        }

        const recommendedIds = Object.entries(scores)
          .sort((a, b) => b[1] - a[1])
          .map(([pid]) => pid)
          .slice(0, 6);

        products = await Product.find({ _id: { $in: recommendedIds } }).populate("shop", "name location");
      }
    }

    // ✅ Cold Start → fallback (most popular / highest rated)
    if (!products || products.length < 6) {
      const fallbackProducts = await Product.find()
        .populate("shop", "name location")
        .sort({ rating: -1 })
        .limit(6);

      products = fallbackProducts;
    }

    return res.status(200).json({
      message: "Homepage smart recommendations",
      products,
      success: true,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to fetch products",
      success: false,
    });
  }
};
