const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Use environment variables
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Nodemailer error:", error);
  } else {
    console.log("✅ Nodemailer is ready to send emails");
  }
});

module.exports = transporter; // Export transporter
