const express = require("express");
const router = express.Router();
const knowledgeController = require("../controllers/knowledgeController");

router.get("/", knowledgeController.getAllDocuments);
router.post("/upload", knowledgeController.ingestDocument);
router.get("/chunks", knowledgeController.getAllChunks);
router.delete("/:id", knowledgeController.deleteDocument);

module.exports = router;
