import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDb from "./src/utils/connectDb.js";
import userRoutes from "./src/routes/user.route.js";
import productRoutes from "./src/routes/product.route.js";
import shopRoutes from "./src/routes/shop.route.js";
import recommendationRoutes from "./src/routes/recommendation.route.js";
import cartRoutes from "./src/routes/cart.route.js";
import paymentRoutes from "./src/routes/payment.route.js";
import orderRoutes from "./src/routes/order.route.js"

dotenv.config();
const app = express();

// Cookies
app.use(cookieParser());

// CORS
const allowedOrigins = [
  "http://localhost:3000",
  "https://ecommerce-mern-seven-zeta.vercel.app/"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS error: Origin ${origin} not allowed`));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// ⚠️ Stripe webhook route must come before JSON parser
app.use(
  "/api/v1/payment/webhook",
  express.raw({ type: "application/json" }) // raw body for Stripe signature verification
);

// For all other routes, parse JSON
app.use(express.json());

// API Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/shop", shopRoutes);
app.use("/api/v1/recommendation", recommendationRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/order",orderRoutes);

// Connect DB & listen
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Backend running on port", port);
  connectDb();
});
