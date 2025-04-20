const Like = require("../models/Like");
const Job = require("../models/Job"); // Import Job Model (If Needed)
const User = require("../models/User"); // Import User Model (If Needed)

// Like a Job Post or Driver Profile
exports.likeTarget = async (req, res) => {
    try {
      const { targetId, targetType } = req.body;
      const userId = req.user.userId; // Extract from JWT
  
      if (!["job", "driver"].includes(targetType)) {
        return res.status(400).json({ message: "Invalid target type" });
      }
  
      // Check if already liked
      const existingLike = await Like.findOne({ userId, targetId, targetType });
      if (existingLike) {
        return res.status(400).json({ message: "Already liked" });
      }
  
      // Create new like entry
      const like = new Like({ userId, targetId, targetType });
      await like.save();
  
      // Increase like count in Job or User model
      if (targetType === "job") {
        await Job.findByIdAndUpdate(targetId, { $inc: { likesCount: 1 } });
      } else if (targetType === "driver") {
        await User.findByIdAndUpdate(targetId, { $inc: { likesCount: 1 } });
      }
  
      res.status(201).json({ message: "Liked successfully", like });
    } catch (error) {
      res.status(500).json({ message: "Error liking target", error });
    }
  };

// Unlike a Job Post or Driver Profile
exports.unlikeTarget = async (req, res) => {
    try {
      const { targetId, targetType } = req.body;
      const userId = req.user.userId;
  
      const like = await Like.findOneAndDelete({ userId, targetId, targetType });
  
      if (!like) {
        return res.status(404).json({ message: "Like not found" });
      }
  
      // Decrease like count in Job or User model
      if (targetType === "job") {
        await Job.findByIdAndUpdate(targetId, { $inc: { likesCount: -1 } });
      } else if (targetType === "driver") {
        await User.findByIdAndUpdate(targetId, { $inc: { likesCount: -1 } });
      }
  
      res.json({ message: "Unliked successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error unliking target", error });
    }
  };
  

// Get Liked Items for a User
exports.getUserLikes = async (req, res) => {
  try {
    const userId = req.user.userId;

    const likes = await Like.find({ userId }).populate("targetId");

    res.json({ message: "User likes retrieved", likes });
  } catch (error) {
    res.status(500).json({ message: "Error fetching likes", error });
  }
};
