const ragService = require("../services/ragService");

/**
 * List all knowledge base documents
 */
exports.getAllDocuments = (req, res) => {
  try {
    const docs = ragService.getAllDocuments();
    return res.json({
      success: true,
      count: docs.length,
      documents: docs
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Upload & Ingest new document content
 */
exports.ingestDocument = (req, res) => {
  try {
    const { title, category, department, content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Document content is required for ingestion." });
    }

    const createdDoc = ragService.addDocument({
      title: title || "Uploaded Campus Document",
      category: category || "General",
      department: department || "Administration",
      content: content.trim()
    });

    return res.status(201).json({
      success: true,
      message: "Document ingested and re-indexed into vector database successfully",
      document: createdDoc
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Get all vector chunks for knowledge base inspection
 */
exports.getAllChunks = (req, res) => {
  try {
    const chunks = ragService.getAllChunks();
    return res.json({
      success: true,
      count: chunks.length,
      chunks
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Delete document from knowledge base
 */
exports.deleteDocument = (req, res) => {
  try {
    const { id } = req.params;
    const removed = ragService.deleteDocument(id);

    if (!removed) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    return res.json({
      success: true,
      message: "Document deleted and index updated successfully"
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
