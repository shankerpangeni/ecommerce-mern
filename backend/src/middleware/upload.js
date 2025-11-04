import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

/**
 * Returns a multer upload middleware for Cloudinary
 * @param {string} folderName - base folder like "profile-pic", "products", etc.
 * @param {string} id - unique identifier (userId, productId)
 */
export const cloudinaryUploader = (folderName, id) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `ecommerce/${folderName}/${id}`,
      allowed_formats: ["jpg", "jpeg", "png"],
    },
  });

  return multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB max file size
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith("image/")) {
        cb(new Error("Only image files are allowed!"), false);
      } else {
        cb(null, true);
      }
    },
  });
};
