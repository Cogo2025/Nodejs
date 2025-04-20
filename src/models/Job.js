const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Job posted by owner
    truckType: { type: String, required: true }, // Type of truck needed
    driverType: { type: String, required: true }, // Driver category
    location: { type: String, required: true }, // Job location
    timeDuration: { type: String, required: true }, // Duration (e.g., "2 days")
    lorryPhotos: [{ type: String }], 
    likesCount: { type: Number, default: 0 },// Images of the lorry (URLs)
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
