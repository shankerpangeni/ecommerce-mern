import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Token is required", success: false });
    }

    const decoded = jwt.verify(token, process.env.SECRET_JWT);
    if (!decoded) {
      return res.status(401).json({ message: "Token verification failed.", success: false });
    }

    // ✅ Fetch user from DB to include role and other fields
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found", success: false });
    }

    req.user = user; // attach full user
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error during authentication.", success: false });
  }
};
