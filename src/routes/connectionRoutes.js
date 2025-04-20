const express = require("express");
const {
  sendConnectionRequest,
  getConnectionRequests,
  acceptConnectionRequest,
  getConnectedUsers,
} = require("../controllers/connectionController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, sendConnectionRequest);
router.get("/requests", authMiddleware, getConnectionRequests);
router.put("/accept/:id", authMiddleware, acceptConnectionRequest);
router.get("/connected", authMiddleware, getConnectedUsers);

module.exports = router;
