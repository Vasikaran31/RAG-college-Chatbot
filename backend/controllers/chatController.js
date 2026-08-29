const ragService = require("../services/ragService");

// In-Memory Chat Session History
let chatHistory = [
  {
    id: "msg-welcome",
    sender: "bot",
    text: "Hello! Welcome to Apex Institute of Technology & Science (AITS) Assistant. How can I help you today with admissions, courses, fees, or hostel facilities?",
    timestamp: new Date().toISOString(),
    citations: [],
    confidenceScore: 1.0
  }
];

/**
 * Handle user query with RAG search & synthesis
 */
exports.queryChat = (req, res) => {
  try {
    const { message, categoryFilter } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Query message cannot be empty." });
    }

    const userMessage = {
      id: `msg-user-${Date.now()}`,
      sender: "user",
      text: message.trim(),
      timestamp: new Date().toISOString()
    };
    chatHistory.push(userMessage);

    // 1. Retrieve top matching vector chunks
    let chunks = ragService.retrieveRelevantChunks(message, 4);

    // Filter by category if requested
    if (categoryFilter && categoryFilter !== "All") {
      const filtered = chunks.filter((c) => c.category.toLowerCase() === categoryFilter.toLowerCase());
      if (filtered.length > 0) {
        chunks = filtered;
      }
    }

    // 2. Synthesize Grounded RAG Answer
    const ragResult = ragService.generateRAGAnswer(message, chunks);

    const botResponse = {
      id: `msg-bot-${Date.now()}`,
      sender: "bot",
      text: ragResult.answer,
      citations: ragResult.citations,
      confidenceScore: ragResult.confidenceScore,
      timestamp: new Date().toISOString()
    };

    chatHistory.push(botResponse);

    return res.json({
      success: true,
      userMessage,
      botResponse
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Get full chat history
 */
exports.getHistory = (req, res) => {
  return res.json({
    success: true,
    history: chatHistory
  });
};

/**
 * Clear chat history
 */
exports.clearHistory = (req, res) => {
  chatHistory = [
    {
      id: "msg-welcome",
      sender: "bot",
      text: "Chat history cleared. How can I assist you with AITS college information?",
      timestamp: new Date().toISOString(),
      citations: [],
      confidenceScore: 1.0
    }
  ];
  return res.json({ success: true, message: "Chat history cleared successfully" });
};
