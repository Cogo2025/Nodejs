const express = require("express");
const { createJob, getAllJobs, deleteJob ,searchJobs} = require("../controllers/jobController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createJob);
router.get("/", authMiddleware, getAllJobs);
router.delete("/:id", authMiddleware, deleteJob);
router.get("/search", authMiddleware, searchJobs);


module.exports = router;
