"use client";
import React, { useEffect, useRef, useState } from "react";
import { Send, User, Bot, Trash2, Settings } from "lucide-react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

type Message = {
  id: number;
  content: string;
  role: "user" | "assistant";
};

const MODELS = [
  "openai:gpt-4o",
  "openai:gpt-4.1",
  "openai:gpt-4.1-mini",
  "openai:gpt-4o-mini",
  "groq:gemma2-9b-it",
  "groq:groq-1.5",
  "groq:llama-3.1-8b-instant",
  "groq:llama-3.3-70b-versatile",
  "groq:meta-llama/llama-guard-4-12b",
  "google:gemini-2.0-flash",
  "google:gemini-2.0-pro",
  "google:gemini-2.5-flash",
  "google:gemini-2.5-pro",
  "groq:llama3-8b-8192"
].filter((model, index, self) => self.indexOf(model) === index); // Remove duplicates

const MainContent = ({ selectedCharacter }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[0]); // Default model
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useUser();

  // ... rest of your existing code remains the same ...

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
          model: selectedModel, // Use selected model instead of hardcoded value
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

  // ... rest of your existing code remains the same ...

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Professional Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {selectedCharacter?.name?.charAt(0) || "E"}
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">{selectedCharacter?.name || "Expert Bot"}</h1>
              <div className="flex items-center text-sm text-gray-500">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                Online
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-grow overflow-auto p-4 space-y-4 bg-gray-50">
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
                  ? "bg-blue-600 text-white"
                  : "bg-white shadow-sm text-gray-800 border border-gray-200"
              } relative group`}
            >
              <div className="flex items-center space-x-2 mb-1">
                {message.role === "user" ? (
                  <User className="text-white" size={16} />
                ) : (
                  <Bot className="text-blue-600" size={16} />
                )}
                <span className="font-medium">
                  {message.role === "user" ? "You" : "Assistant"}
                </span>
              </div>
              <p className="whitespace-pre-wrap">{message.content}</p>
              <button
                // onClick={() => handleDeleteMessage(message.id)}
                className="absolute top-2 right-2 p-1 rounded-full bg-gray-200 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <p className="text-gray-500 mt-1">Assistant is typing...</p>
            </div>
          </div>
        )}
      </div>

      {/* Professional Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="mb-3">
          <label htmlFor="model-select" className="block text-sm font-medium text-gray-700 mb-1">
            Select AI Model:
          </label>
          <select
            id="model-select"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
           className="w-full px-3 py-2 border border-blue-300 rounded-md bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {MODELS.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end space-x-2">
          <div className="flex-grow">
            <textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => {
                setInputMessage(e.target.value);
              }}
              placeholder="Type your message here..."
              className="w-full rounded-lg p-3 bg-gray-50 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={2}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className={`p-3 rounded-lg ${
              inputMessage.trim()
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            } transition duration-150 ease-in-out`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainContent;