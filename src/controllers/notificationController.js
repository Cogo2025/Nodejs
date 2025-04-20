const admin = require("../config/firebase");

// Send Push Notification
exports.sendPushNotification = async (req, res) => {
  try {
    const { deviceToken, title, body } = req.body;

    if (!deviceToken) return res.status(400).json({ message: "Device token is required" });

    const message = {
      notification: { title, body },
      token: deviceToken,
    };

    await admin.messaging().send(message);

    res.json({ message: "Push notification sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send notification", error });
  }
};
