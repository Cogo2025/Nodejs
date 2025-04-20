const Connection = require("../models/Connection");

// Send Connection Request
exports.sendConnectionRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;

    if (!receiverId) {
      return res.status(400).json({ message: "Receiver ID is required" });
    }

    const connection = new Connection({
      senderId: req.user.userId,
      receiverId,
    });

    await connection.save();

    // Emit secure WebSocket event
    req.io.emit("sendNotification", {
      receiverId,
      message: "You have a new connection request!",
    });

    res.status(201).json({ message: "Connection request sent", secureUrl: `https://localhost:5000/api/connections` });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// Get Connection Requests (For Receiver)
exports.getConnectionRequests = async (req, res) => {
  try {
    const requests = await Connection.find({ receiverId: req.user.userId, status: "pending" })
      .populate("senderId", "name email");

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Accept Connection Request
exports.acceptConnectionRequest = async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    if (connection.receiverId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    connection.status = "connected";
    await connection.save();

    res.json({ message: "Connection request accepted", connection });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get Connected Users
exports.getConnectedUsers = async (req, res) => {
  try {
    const connections = await Connection.find({
      $or: [{ senderId: req.user.userId }, { receiverId: req.user.userId }],
      status: "connected",
    })
      .populate("senderId", "name email")
      .populate("receiverId", "name email");

    res.json(connections);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
