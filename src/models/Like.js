const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Can be a Job Post or Driver Profile
    targetType: { type: String, enum: ["job", "driver"], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Like", LikeSchema);
