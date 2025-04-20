const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: { type: String, enum: ["driver", "owner"], required: true },
    phone: { type: String }, 
    dob: { type: Date },  
    gender: { type: String, enum: ["male", "female", "other"] }, 
    licenseNumber: { type: String }, 
    cinNumber: { type: String }, 
    profilePhoto: { type: String }, 
    likesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
