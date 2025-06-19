"use client";
import React, { useEffect, useRef, useState } from "react";
import { Send, User, Bot, Trash2 } from "lucide-react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

type Message = {
  id: number;
  content: string;
  role: "user" | "assistant";
};

const MainContent = ({ selectedCharacter }) => {
  console.log("Selected Character:", selectedCharacter);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [botId, setBotId] = useState<string | null>(null);

  const { user } = useUser();

  const { data: messageHistory, isLoading } = useQuery({
    queryKey: ["messageHistory", user?.id, selectedCharacter?.id],
    queryFn: async () => {
      if (!user?.id || !selectedCharacter?.id) return [];
      const response = await axios.get(
        `http://127.0.0.1:8000/chat/${user.id}/${selectedCharacter.id}`
      );

      console.log("Fetched message history:", response.data);

      setMessages(response.data.chat_history);

      return response.data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: 10000, // Refetch every 10 seconds
  });

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
        content: inputMessage,
        role: "user",
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInputMessage("");
      setIsTyping(true);

      try {
        const response = await axios.post("http://127.0.0.1:8000/chat", {
          message: inputMessage,
          model: "groq:llama3-8b-8192",
          user_id: user?.id,
          bot_id: selectedCharacter?.id,
          chat_history: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        });

        console.log("API Response:", response.data);

        const botResponse: Message = {
          id: Date.now() + 1,
          content: response.data.content,
          role: "assistant",
        };

        setMessages((prev) => [...prev, botResponse]);
      } catch (error) {
        console.error("Chat error:", error);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 2,
            content: "Error fetching response.",
            role: "assistant",
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading messages...</p>
      </div>
    );
  }

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
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`rounded-lg p-3 max-w-xs lg:max-w-md ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-white shadow-md text-black"
              } relative group`}
            >
              <div className="flex items-center space-x-2 mb-1">
                {message.role === "user" ? (
                  <User className="text-white" size={16} />
                ) : (
                  <Bot className="text-blue-500" size={16} />
                )}
                <span className="font-semibold">
                  {message.role === "user" ? "You" : "Expert Bot"}
                </span>
              </div>
              <p>{message.content}</p>
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
