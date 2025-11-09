import cloudinary from "./src/config/cloudinary.js";

cloudinary.uploader.upload("test.jpeg", { folder: "test" }, (err, result) => {
  console.log(err, result);
});
