import express from "express";
import { register, login, logout, uploadProfilePic, getCurrentUser } from './../controllers/user.controller.js';
import { isAuthenticated } from './../middleware/isAuthenticated.js';
import { singleUpload } from './../middleware/uploadMiddleware.js';

const router = express.Router();

// Auth routes
router.post('/login', login);
router.post('/register', register);
router.get('/logout', logout);
// routes/user.route.js
router.get("/me", isAuthenticated, getCurrentUser);


// Profile picture upload
router.post(
  '/upload-profile',
  isAuthenticated,
  singleUpload('profile-pic', 'profilePic'),
  uploadProfilePic
);

export default router;
