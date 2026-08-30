const ragService = require("../services/ragService");

// In-Memory Chat Session Store Keyed by User ID / Session
// ⚠️  NOTE: This store lives in server memory and is wiped on every Render restart.
//    Chat persistence for the end-user is handled by frontend localStorage.
const userChatHistories = {};

/** Generate a collision-safe unique ID */
const uid = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const getWelcomeMessage = (userName) => ({
  id: uid('msg-welcome'),
  sender: "bot",
  text: `Hello ${userName ? userName : ''}! Welcome to Apex Institute of Technology & Science (AITS) Assistant. How can I help you today with admissions, courses, fees, or hostel facilities?`,
  timestamp: new Date().toISOString(),
  citations: [],
  confidenceScore: 1.0
});

/**
 * Handle user query with RAG search & synthesis
 */
exports.queryChat = (req, res) => {
  try {
    const { message, categoryFilter, userId, userName } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Query message cannot be empty." });
    }

    const sessionKey = userId || "guest";

    if (!userChatHistories[sessionKey]) {
      userChatHistories[sessionKey] = [getWelcomeMessage(userName)];
    }

    const userMessage = {
      id: uid('msg-user'),
      sender: "user",
      text: message.trim(),
      timestamp: new Date().toISOString()
    };
    userChatHistories[sessionKey].push(userMessage);

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
      id: uid('msg-bot'),
      sender: "bot",
      text: ragResult.answer,
      citations: ragResult.citations,
      confidenceScore: ragResult.confidenceScore,
      timestamp: new Date().toISOString()
    };

    userChatHistories[sessionKey].push(botResponse);

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
 * Get full chat history for user session
 */
exports.getHistory = (req, res) => {
  const sessionKey = req.query.userId || "guest";
  const history = userChatHistories[sessionKey] || [getWelcomeMessage()];
  return res.json({
    success: true,
    history
  });
};

/**
 * Clear chat history for user session
 */
exports.clearHistory = (req, res) => {
  const sessionKey = req.body.userId || req.query.userId || "guest";
  userChatHistories[sessionKey] = [
    {
      id: uid('msg-cleared'),
      sender: "bot",
      text: "Chat history cleared. How can I assist you with AITS college information?",
      timestamp: new Date().toISOString(),
      citations: [],
      confidenceScore: 1.0
    }
  ];
  return res.json({ success: true, message: "Chat history cleared successfully" });
};
