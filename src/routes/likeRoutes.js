const express = require("express");
const { likeTarget, unlikeTarget, getUserLikes } = require("../controllers/likeControllers");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/like", authMiddleware, likeTarget);
router.post("/unlike", authMiddleware, unlikeTarget);
router.get("/my-likes", authMiddleware, getUserLikes);

module.exports = router;
