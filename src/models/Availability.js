const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
  {
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Driver who posted availability
    truckType: { type: String, required: true }, // Type of truck the driver can operate
    driverType: { type: String, required: true }, // Driver category
    location: { type: String, required: true }, // Available location
    availableFrom: { type: Date, required: true }, // Start date
    availableUntil: { type: Date, required: true }, // End date
  },
  { timestamps: true }
);

const Availability = mongoose.model("Availability", availabilitySchema);

module.exports = Availability;
