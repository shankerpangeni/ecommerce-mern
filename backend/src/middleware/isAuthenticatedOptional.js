// isAuthenticatedOptional.js
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

export const isAuthenticatedOptional = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) return next(); // continue without user

  try {
    const decoded = jwt.verify(token, process.env.SECRET_JWT);
    req.user = await User.findById(decoded.id);
  } catch (err) {
    console.log("Optional auth failed:", err.message);
  }
  next();
};
