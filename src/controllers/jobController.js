const Job = require("../models/Job");

// Create a Job Post (Owner only)
exports.createJob = async (req, res) => {
  try {
    if (req.user.userType !== "owner") {
      return res.status(403).json({ message: "Only owners can post jobs" });
    }

    const { truckType, driverType, location, timeDuration, lorryPhotos } = req.body;
    
    const job = new Job({
      ownerId: req.user.userId,
      truckType,
      driverType,
      location,
      timeDuration,
      lorryPhotos,
    });

    await job.save();
    res.status(201).json({ message: "Job posted successfully", job });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get All Job Posts
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("ownerId", "name email");
    res.json({ secureUrl: `https://localhost:5000/api/jobs`, jobs });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// Delete Job Post (Owner Only)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.ownerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Search Jobs (Drivers search for job posts)
exports.searchJobs = async (req, res) => {
    try {
      const { truckType, location, driverType } = req.query;
      let query = {};
  
      if (truckType) query.truckType = truckType;
      if (location) query.location = location;
      if (driverType) query.driverType = driverType;
  
      const jobs = await Job.find(query).populate("ownerId", "name email");
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };
  
