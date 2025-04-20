const Availability = require("../models/Availability");

// Create an Availability Post (Driver only)
exports.createAvailability = async (req, res) => {
  try {
    if (req.user.userType !== "driver") {
      return res.status(403).json({ message: "Only drivers can post availability" });
    }

    const { truckType, driverType, location, availableFrom, availableUntil } = req.body;
    
    const availability = new Availability({
      driverId: req.user.userId,
      truckType,
      driverType,
      location,
      availableFrom,
      availableUntil,
    });

    await availability.save();
    res.status(201).json({ message: "Availability posted successfully", availability });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get All Availability Posts
exports.getAllAvailability = async (req, res) => {
  try {
    const availabilityPosts = await Availability.find().populate("driverId", "name email");
    res.json(availabilityPosts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete Availability Post (Driver Only)
exports.deleteAvailability = async (req, res) => {
  try {
    const availability = await Availability.findById(req.params.id);

    if (!availability) return res.status(404).json({ message: "Availability not found" });

    if (availability.driverId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Availability.findByIdAndDelete(req.params.id);
    res.json({ message: "Availability deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// Search Available Drivers (Owners search for drivers)
exports.searchAvailability = async (req, res) => {
    try {
      const { truckType, location, driverType } = req.query;
      let query = {};
  
      if (truckType) query.truckType = truckType;
      if (location) query.location = location;
      if (driverType) query.driverType = driverType;
  
      const availableDrivers = await Availability.find(query).populate("driverId", "name email");
      res.json(availableDrivers);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };
  