const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
require("dotenv").config();
const admin = require("../config/firebase");
const validator = require("validator");
const transporter = require("../config/email");


// User Signup
exports.signup = async (req, res) => {
  const { name, email, password, userType } = req.body;

  // Validate password
  if (!validator.isStrongPassword(password, { minLength: 8, minNumbers: 1, minUppercase: 1, minSymbols: 1 })) {
    return res.status(400).json({ message: "Password must be at least 8 characters with 1 number, 1 uppercase letter, and 1 symbol" });
  }

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword, userType });

    await user.save();
    const token = jwt.sign({ userId: user._id, userType }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ message: "User registered successfully", token,userType, });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Google Signup
exports.googleSignup = async (req, res) => {
  try {
    const { googleToken, userType } = req.body;

    if (!googleToken) {
      return res.status(400).json({ message: "Google Token is required." });
    }

    // Verify Firebase ID Token
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(googleToken);
    } catch (error) {
      return res.status(401).json({ message: "Invalid Firebase ID Token", error });
    }

    let { email, name, picture } = decodedToken;

    if (!email) {
      return res.status(400).json({ message: "Google account does not provide an email." });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name: name || "Google User",
        email,
        userType,
        profilePhoto: picture,
        password: "GoogleAuth", // Temporary password to bypass validation
      });

      try {
        await user.save();
      } catch (saveError) {
        return res.status(500).json({ message: "User creation failed", error: saveError });
      }
    }

    // Generate JWT token
    const jwtToken = jwt.sign({ userId: user._id, userType }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ message: "Google Signup/Login successful", token: jwtToken });
  } catch (error) {
    res.status(500).json({ message: "Google authentication failed", error });
  }
};

// User Login
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ message: "Login successful", token ,secureUrl: `https://localhost:5000/api/user/profile`,userType:user.userType,});
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.sendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate verification token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const verificationLink = `https://localhost:5000/api/auth/verify-email?token=${token}`;

    console.log(`📧 Sending verification email to: ${email}`);

    const mailOptions = {
      from: "cogo2025@gmail.com",
      to: email, // Send to the user trying to verify
      subject: "Email Verification",
      html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("🚨 Error sending verification email:", error);
        return res.status(500).json({ message: "Failed to send verification email", error });
      }
      console.log("✅ Verification email sent:", info.response);
      res.json({ message: "Verification email sent", verificationLink });
    });

  } catch (error) {
    console.error("🚨 Error in sendVerificationEmail:", error);
    res.status(500).json({ message: "Email verification failed", error });
  }
};



exports.verifyOtp = async (req, res) => {
  try {
    const { phoneNumber, otpToken } = req.body;

    const decodedToken = await admin.auth().verifyIdToken(otpToken);
    if (decodedToken.phone_number !== phoneNumber) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    res.json({ message: "Phone number verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "OTP verification failed", error });
  }
};


exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Verification token is required" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isVerified = true; // Update user's verification status
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Email verification failed", error });
  }
};
