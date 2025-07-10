const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  latestMessage: {
    type: String,
    default: "New Chat",
  },
}, { timestamps: true });

module.exports = mongoose.model("Chats",ChatSchema);
