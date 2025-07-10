const axios = require("axios");
const Chats = require("../models/Chats");
const Conversation = require("../models/Conversation");
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

exports.createChat = async (req, res) => {
  try {
    console.log("🚀 user from middleware:", req.user);

    const userId = req.user?.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID missing from request" });
    }

    const chat = await Chats.create({ user: userId });
    console.log("✅ New chat created:", chat);

    res.status(201).json({ chat });
  } catch (error) {
    console.error("❌ Chat creation error:", error);
    res.status(500).json({
      message: error.message || "Error creating chat",
    });
  }
};


exports.getallChats = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log("🧠 Fetching chats for:", userId); // Debug log

    const chats = await Chats.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({ chats });
  } catch (error) {
    console.error("❌ Failed to fetch chats:", error);
    res.status(500).json({ message: "Failed to fetch chats" });
  }
};


exports.addConversation = async (req, res) => {
  try {
    const chat = await Chats.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({
        message: "No chat found with this ID",
      });
    }

    const { question } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ message: "Question is required" });
    }

    console.log("📨 User Question:", question);

    // Step 1: Call Gemini API
    console.log("🧠 Asking Gemini:", question);
const geminiRes = await axios.post(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
  {
    contents: [
      {
        role: "user",
        parts: [{ text: question }]
      }
    ]
  },
  {
    headers: {
      'Content-Type': 'application/json',
    },
  }
);


    const answer = geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text || "No answer from Gemini";
    console.log("🤖 Gemini Answer:", answer);

    // Step 2: Create new conversation
    const conversation = await Conversation.create({
      chat: chat._id,
      question,
      answer,
    });

    // Step 3: Update latest message
    const updatedChat = await Chats.findByIdAndUpdate(
      chat._id,
      {
        latestMessage: question,
        updatedAt: new Date(),
      },
      { new: true }
    );

    res.status(201).json({
      message: "Conversation added successfully",
      conversation,
      updatedChat,
    });
  } catch (error) {
    console.error("🔥 Error in addConversation:", error.message);
    res.status(500).json({
      message: error.message || "Error adding conversation",
    });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const chatId = req.params.id;
    console.log("📥 Chat ID received:", chatId);

    const chat = await Chats.findById(chatId);
    if (!chat) {
      console.log("❌ Chat not found for ID:", chatId);
      return res.status(404).json({ message: "Chat not found" });
    }
    console.log("✅ Chat found:", chat);

    const conversations = await Conversation.find({ chat: chatId }).sort({ createdAt: 1 });
    console.log(`🗨️ Found ${conversations.length} conversation(s) for chat ${chatId}:`);
    conversations.forEach((conv, i) => {
      console.log(`  #${i + 1}: Q=${conv.question}, A=${conv.answer}`);
    });

    const formattedConversations = conversations.map((conv) => ({
      sender: chat.user.toString(), // Adjust this if sender should be different
      message: conv.question,
      answer: conv.answer,
    }));

    const responsePayload = {
      chat: {
        _id: chat._id,
        user: chat.user.toString(),
        conversation: formattedConversations,
      },
    };

    console.log("📤 Sending response:", JSON.stringify(responsePayload, null, 2));
    res.status(200).json(responsePayload);
  } catch (error) {
    console.error("🔥 Error in getConversation:", error.message);
    res.status(500).json({
      message: error.message || "Error fetching conversations",
    });
  }
};



exports.deleteChat = async (req, res) => {
  try {
    const chatId = req.params.id;

    const chat = await Chats.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Optional: check if the logged-in user owns the chat
    if (chat.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: "You are not authorized to delete this chat" });
    }

    // Delete the chat
    await Chats.findByIdAndDelete(chatId);

    // Delete all related conversations
    await Conversation.deleteMany({ chat: chatId });

    res.status(200).json({ message: "Chat and its conversations deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Error deleting chat" });
  }
};
