"use client";
import React, { useEffect, useRef, useState } from "react";
import { Send, User, Bot, Trash2 } from "lucide-react";
import axios from "axios";

type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
};

const MainContent = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [userId, setUserId] = useState<string | null>(null);
const [botId, setBotId] = useState<string | null>(null);


useEffect(() => {
  const uid = localStorage.getItem("user_id"); 
  if (!uid) {
    console.error("User ID not found!");
    return;
  }
  setUserId(uid);

  axios
    .get(`http://127.0.0.1:8000/bots`, { params: { user_id: uid } })
    .then((res) => {
      const botList = res.data?.data;
      if (botList?.length > 0) {
        setBotId(botList[0].id); 
      } else {
        console.error("No bots found for this user.");
      }
    })
    .catch((err) => {
      console.error("Error fetching bots:", err);
    });
}, []);




  const handleResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      const maxHeight = 150;
      if (textareaRef.current.scrollHeight > maxHeight) {
        textareaRef.current.style.height = `${maxHeight}px`;
        textareaRef.current.style.overflow = "hidden";
      } else {
        textareaRef.current.style.overflowY = "hidden";
      }
    }
  };

  useEffect(() => {
    handleResize();
  }, []);

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      const userMessage: Message = {
        id: Date.now(),
        text: inputMessage,
        sender: "user",
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInputMessage("");
      setIsTyping(true);

      try {
      const response = await axios.post("http://127.0.0.1:8000/chat", {
        message: inputMessage,
        model: "gpt-3.5",
        user_id: userId,
        bot_id: botId,
        chat_history: updatedMessages.map((m) => ({
          role: m.sender,
          content: m.text,
        })),
      });


        const botResponse: Message = {
          id: Date.now() + 1,
          text: response.data.content,
          sender: "bot",
        };

        setMessages((prev) => [...prev, botResponse]);
      } catch (error) {
        console.error("Chat error:", error);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 2,
            text: "Error fetching response.",
            sender: "bot",
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleDeleteMessage = (id: number) => {
    setMessages(messages.filter((message) => message.id !== id));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4"></header>
        
      {/* Chat Area */}
      <div className="flex-grow overflow-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`rounded-lg p-3 max-w-xs lg:max-w-md ${
                message.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-white shadow-md"
              } relative group`}
            >
              <div className="flex items-center space-x-2 mb-1">
                {message.sender === "user" ? (
                  <User className="text-white" size={16} />
                ) : (
                  <Bot className="text-blue-500" size={16} />
                )}
                <span className="font-semibold">
                  {message.sender === "user" ? "You" : "Expert Bot"}
                </span>
              </div>
              <p>{message.text}</p>
              <button
                onClick={() => handleDeleteMessage(message.id)}
                className="absolute top-2 right-2 p-1 rounded-full bg-gray-200 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white rounded-lg p-3 shadow-md">
              <p className="text-gray-500">Expert Bot is typing...</p>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-gray-800 p-4">
        <div className="flex items-center space-x-2">
          <textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={(e) => {
              setInputMessage(e.target.value);
              handleResize();
            }}
            placeholder="Type your message here..."
            className="flex-grow rounded-lg p-2 bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          >
            <Send size={20} />
          </button>
        </div>
        <div className="mt-2 flex justify-between text-sm text-gray-400">
          <span>Powered by GROQ API</span>
          <span>Credits: 100</span>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
