import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAuth, logoutUser } from '../api/auth';
import { getAllChats, createChat, deleteChat } from '../api/chat';
import { FaTrash, FaBars } from 'react-icons/fa';
import ChatContainer from '../components/ChatContainer';
import { toast } from 'react-hot-toast';

const Chats = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const fetchChats = async () => {
    try {
      const res = await getAllChats();
      setChats(res.data.chats || []);
    } catch (err) {
      toast.error("Failed to fetch chats.");
    }
  };

  useEffect(() => {
    const verifyUser = async () => {
      try {
        await checkAuth();
        await fetchChats();
      } catch (err) {
        toast.error("You are not logged in!");
        navigate('/');
      }
    };
    verifyUser();
  }, [navigate]);

  const handleNewChat = async () => {
    try {
      const res = await createChat();
      toast.success('New chat created');
      setChats([...chats, res.data.chat]);
      setSelectedChat(res.data.chat._id);
      setSidebarOpen(false); // auto-close on mobile
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create chat');
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Hamburger Button for Mobile */}
      <button
        className="absolute top-4 left-4 z-50 text-white text-2xl md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <FaBars />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-2/3 sm:w-1/2 md:w-1/3 bg-gray-800 border-r border-gray-700 z-40 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:flex md:flex-col justify-between p-4`}
      >
        <div>
          <button
            onClick={handleNewChat}
            className="mb-4 px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded text-white font-medium w-full"
          >
            + New Chat
          </button>

          {chats.length === 0 && <p className="text-gray-400">No chats yet.</p>}
          {chats.map((chat) => (
            <div
              key={chat._id}
              className={`flex justify-between items-center px-3 py-2 mb-2 rounded cursor-pointer transition ${
                selectedChat === chat._id
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <span
                onClick={() => {
                  setSelectedChat(chat._id);
                  setSidebarOpen(false); // close sidebar on mobile
                }}
                className="truncate max-w-[80%]"
              >
                {chat.latestMessage || 'Untitled Chat'}
              </span>

              <FaTrash
                className="text-red-400 hover:text-red-600"
                onClick={async () => {
                  try {
                    await deleteChat(chat._id);
                    setChats((prev) => prev.filter((c) => c._id !== chat._id));
                    if (selectedChat === chat._id) setSelectedChat(null);
                  } catch (err) {
                    toast.error("Failed to delete chat");
                  }
                }}
              />
            </div>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={async () => {
            try {
              await logoutUser();
              navigate('/');
              window.location.reload();
            } catch (err) {
              toast.error('Failed to logout');
            }
          }}
          className="mt-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white font-semibold"
        >
          Logout
        </button>
      </div>

      {/* Chat Panel */}
      <div className="flex-1 h-full">
        <ChatContainer chatId={selectedChat} onMessageSent={fetchChats} />
      </div>
    </div>
  );
};

export default Chats;
