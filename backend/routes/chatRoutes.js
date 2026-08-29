const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

router.post("/query", chatController.queryChat);
router.get("/history", chatController.getHistory);
router.delete("/history", chatController.clearHistory);

module.exports = router;
