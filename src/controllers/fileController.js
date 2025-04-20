
require("dotenv").config();
exports.uploadFile = async (req, res) => {
  try {
    console.log("Request received for file upload");

    if (!req.file) {
      console.error("No file uploaded");
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("File uploaded successfully:", req.file);

    res.json({ message: "File uploaded successfully", fileUrl: req.file.path });
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).json({ message: "File upload failed", error });
  }
};
