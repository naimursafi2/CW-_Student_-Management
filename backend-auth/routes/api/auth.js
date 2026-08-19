const express = require("express");
const router = express.Router();
const authController = require("../../controllers/authController.js");
const { protect, requireVerifiedEmail } = require("../../middleware/authMiddleware.js");
const upload = require("../../middleware/uploadMiddleware.js");

// Public authentication routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/verify-email/:token", authController.verifyEmail);
router.post("/resend-verification", authController.resendVerification);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);

// Protected routes
router.get("/me", protect, requireVerifiedEmail, authController.getMe);

// Profile picture route with Multer error handling
router.patch(
  "/profile-picture",
  protect,
  requireVerifiedEmail,
  (req, res, next) => {
    upload.single("profilePicture")(req, res, (error) => {
      if (error) {
        return res.status(400).json({ success: false, message: error.message });
      }
      next();
    });
  },
  authController.updateProfilePicture
);

module.exports = router;