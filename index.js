const express = require("express");
const https = require("https");
const http = require("http");
const fs = require("fs");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./src/config/db");

dotenv.config();
const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// Socket.io and server setup
let server;
let io;

const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

// Check if running locally (NODE_ENV !== 'production') and use HTTPS
if (process.env.NODE_ENV !== "production") {
  const sslOptions = {
    key: fs.readFileSync("./ssl/key.pem"),
    cert: fs.readFileSync("./ssl/cert.pem"),
  };

  server = https.createServer(sslOptions, app);
  console.log("🔐 Using HTTPS in development");
} else {
  server = http.createServer(app);
  console.log("🌐 Using HTTP in production (Render provides HTTPS)");
}

io = new Server(server, {
  cors: { origin: "*" },
});

// Store online users
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  socket.on("userConnected", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("sendNotification", ({ receiverId, message }) => {
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveNotification", message);
    }
  });

  socket.on("disconnect", () => {
    for (let [key, value] of onlineUsers.entries()) {
      if (value === socket.id) {
        onlineUsers.delete(key);
      }
    }
    console.log("User disconnected:", socket.id);
  });
});

connectDB();

app.get("/", (req, res) => {
  res.send("API is running securely...");
});

app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/user", require("./src/routes/userRoutes"));
app.use("/api/jobs", require("./src/routes/jobRoutes"));
app.use("/api/availability", require("./src/routes/availabilityRoutes"));
app.use("/api/connections", require("./src/routes/connectionRoutes"));
app.use("/api/notifications", require("./src/routes/notificationRoutes"));
app.use("/api/likes", require("./src/routes/likeRoutes"));
app.use("/api/files", require("./src/routes/fileRoutes"));

server.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on ${process.env.NODE_ENV === "production" ? "http" : "https"}://${HOST}:${PORT}`);
});
