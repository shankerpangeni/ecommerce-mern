import { cloudinaryUploader } from "./upload.js";

/**
 * Returns a middleware for single file upload to Cloudinary
 * @param {string} folderName - Cloudinary folder name
 * @param {string} fieldName - name of the form field containing the file
 */
export const singleUpload = (folderName, fieldName) => {
  return (req, res, next) => {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated.",
      });
    }

    const upload = cloudinaryUploader(folderName, req.user._id).single(fieldName);

    upload(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }
      next();
    });
  };
};


export const multipleUpload = (folderName) => {
  return (req, res, next) => {
    if (!req.user?._id) {
      return res.status(401).json({ success: false, message: "User not authenticated." });
    }

    const upload = cloudinaryUploader(folderName, req.user._id).array("images", 5);

    upload(req, res, (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  };
};