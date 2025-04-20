const express = require("express");
const { sendPushNotification } = require("../controllers/notificationController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/push", authMiddleware, sendPushNotification);

module.exports = router;
