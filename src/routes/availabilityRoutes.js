const express = require("express");
const { createAvailability, getAllAvailability, deleteAvailability ,searchAvailability} = require("../controllers/availabilityController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createAvailability);
router.get("/", authMiddleware, getAllAvailability);
router.delete("/:id", authMiddleware, deleteAvailability);
router.get("/search", authMiddleware, searchAvailability);


module.exports = router;
    