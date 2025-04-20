const express = require("express");
const { getProfile, updateProfile, deleteAccount } = require("../controllers/userControllers");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get User Profile
router.get("/profile", authMiddleware, getProfile);

// Update Profile
router.put("/profile", authMiddleware, updateProfile);

// Delete Account
router.delete("/profile", authMiddleware, deleteAccount);

module.exports = router;
