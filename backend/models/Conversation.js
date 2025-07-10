const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Conversation", ConversationSchema);
