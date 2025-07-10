import React, { useEffect, useState, useRef } from 'react';
import { getChat, sendMessage } from '../api/chat';
import { FiImage } from 'react-icons/fi';

const ChatContainer = ({ chatId, onMessageSent }) => {
  const [chat, setChat] = useState(null);
  const [input, setInput] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState('');
  const bottomRef = useRef(null);

  const loadChat = async () => {
    try {
      const res = await getChat(chatId);
      setChat(res.data.chat);
    } catch (err) {
      console.error("Failed to load chat", err);
    }
  };

  useEffect(() => {
    if (chatId) loadChat();
  }, [chatId]);

  const handleSend = async () => {
    if (!input.trim() && !image) return;

    setPendingQuestion(input || '[Image]');
    setLoading(true);
    const formData = new FormData();
    formData.append('message', input);
    if (image) formData.append('image', image);

    setInput('');
    setImage(null);

    try {
      await sendMessage(chatId, formData);
      await loadChat();
      if (onMessageSent) onMessageSent();
    } catch (err) {
      alert('Failed to send message');
    } finally {
      setLoading(false);
      setPendingQuestion('');
    }
  };

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat, loading]);

  if (!chat) return <div className="p-6 text-gray-400">Select a chat to begin</div>;

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white p-4">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-6 mb-4">
        {chat.conversation.map((msg, i) => (
          <div key={i} className="space-y-2">
            {/* User message */}
            <div className="flex justify-end">
              <div className="bg-amber-600 px-4 py-2 rounded-xl max-w-[70%] text-white">
                <strong>You:</strong> {msg.message}
                {msg.imageUrl && (
                  <img src={msg.imageUrl} alt="sent" className="mt-2 rounded max-w-full" />
                )}
              </div>
            </div>

            {/* Gemini answer */}
            <div className="flex justify-start">
              <div className="bg-gray-700 px-4 py-2 rounded-xl max-w-[70%] text-gray-100">
                <strong>Beanie:</strong> {msg.answer}
              </div>
            </div>
          </div>
        ))}

        {/* Typing... */}
        {loading && pendingQuestion && (
          <div className="space-y-2">
            <div className="flex justify-end">
              <div className="bg-amber-600 px-4 py-2 rounded-xl max-w-[70%] text-white">
                <strong>You:</strong> {pendingQuestion}
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-gray-700 px-4 py-2 rounded-xl max-w-[70%] italic text-gray-400">
                Beanie is typing...
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Section */}
      <div className="flex items-center gap-2">
        <label htmlFor="image-upload" className="cursor-pointer">
          <FiImage className="text-2xl text-amber-400" />
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="hidden"
        />

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded text-white font-semibold transition"
        >
          Send
        </button>
      </div>

      {/* Preview image */}
      {image && (
        <div className="mt-2 text-sm text-gray-400">
          📎 Attached: {image.name}
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
