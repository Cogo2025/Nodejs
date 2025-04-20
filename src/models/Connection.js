const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "connected"], default: "pending" },
  },
  { timestamps: true }
);

const Connection = mongoose.model("Connection", connectionSchema);

module.exports = Connection;
