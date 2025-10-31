import { User } from "./../models/user.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { fullname, email, password, phoneNumber, role } = req.body;

    if (!fullname || !email || !password || !phoneNumber) {
      return res.status(401).json({
        message: "Something is missing in input.",
        success: false,
      });
    }

    let existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(401).json({
        message: "User with this email alerady exists.",
        success: false,
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    let user = await User.create({
      email,
      phoneNumber,
      fullname,
      role,
      password: hashPassword,
    });

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
    };

    return res.status(201).json({
      message: "User Registered Successfullly.",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Registered Failed with Server error.",
      success: false,
    });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        message: "Something is missing.",
        success: false,
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invallid email or password",
        success: false,
      });
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      return res.status(401).json({
        message: "Invalid email or password.",
        success: false,
      });
    }

    const tokenData = {
      id: user._id,
    };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,

      sameSite: "None",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    user = {
      _id: user._id,
      email: user.email,
      fullname: user.fullname,
      phoneNumber: user.phoneNumber,
    };

    res.status(200).json({
      message: "User Logged in successfully.",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    return res
      .cookie("token", "", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 0,
      })
      .json({
        message: "Successfully logout.",
        success: true,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

