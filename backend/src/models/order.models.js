import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true, // snapshot of the price during purchase
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["cod", "card", "esewa", "khalti"],
      default: "card", // since you’re using Stripe
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    stripeSessionId: {
      type: String, // store the Stripe session ID
      required: true,
      unique: true,
    },

    shippingAddress: {
      fullName: { type: String },
      phone: { type: String },
      address: { type: String },
      city: { type: String },
      postalCode: { type: String },
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
