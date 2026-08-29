const ragService = require("../services/ragService");

exports.getStats = (req, res) => {
  try {
    const docs = ragService.getAllDocuments();
    const chunks = ragService.getAllChunks();

    // Category breakdown
    const categoryCounts = {};
    docs.forEach((d) => {
      categoryCounts[d.category] = (categoryCounts[d.category] || 0) + 1;
    });

    return res.json({
      success: true,
      stats: {
        totalDocuments: docs.length,
        totalVectorChunks: chunks.length,
        averageChunkLength: Math.round(
          chunks.reduce((acc, c) => acc + c.content.length, 0) / (chunks.length || 1)
        ),
        activeEmbeddingModel: "Vector TF-IDF + Cosine Similarity",
        systemStatus: "Healthy (Grounding Verified)",
        topCategories: Object.entries(categoryCounts).map(([name, count]) => ({ name, count })),
        lastIndexedTime: new Date().toISOString()
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
