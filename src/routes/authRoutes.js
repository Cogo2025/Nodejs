const express = require("express");
const { check } = require("express-validator");
const { signup, login, googleSignup, sendVerificationEmail, verifyOtp,verifyEmail } = require("../controllers/authController");

const router = express.Router();

// Signup Route
router.post(
  "/signup",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Valid email is required").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
    check("userType", "User type must be driver or owner").isIn(["driver", "owner"]),
  ],
  signup
);

// Login Route
router.post(
  "/login",
  [
    check("email", "Valid email is required").isEmail(),
    check("password", "Password is required").exists(),
  ],
  login
);

// Google Signup
router.post("/google-signup", googleSignup);

// Send verification email
router.post("/send-verification-email", sendVerificationEmail);

router.get("/verify-email", verifyEmail);


// OTP verification
router.post("/verify-otp", verifyOtp);

module.exports = router;
