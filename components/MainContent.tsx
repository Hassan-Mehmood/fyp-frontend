"use client";
import React, { useEffect, useRef, useState } from "react";
import { Send, User, Bot, Trash2, Settings, Search, Plus, Mic, MoreHorizontal } from "lucide-react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

type Message = {
  id: number;
  content: string;
  role: "user" | "assistant";
};

const MODELS = [
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", color: "bg-teal-500" },
  { id: "gpt-4.1", name: "GPT-4.1", provider: "OpenAI", color: "bg-blue-500" },
  { id: "gpt-4.1-mini", name: "GPT-4.1-mini", provider: "OpenAI", color: "bg-blue-400" },
  { id: "gpt-4o-mini", name: "GPT-4o-mini", provider: "OpenAI", color: "bg-teal-400" },
  { id: "gemma2-9b-it", name: "Gemma2-9b", provider: "Groq", color: "bg-purple-500" },
  { id: "groq-1.5", name: "Groq-1.5", provider: "Groq", color: "bg-purple-600" },
  { id: "llama-3.1-8b-instant", name: "Llama-3.1-8b", provider: "Groq", color: "bg-orange-500" },
  { id: "llama-3.3-70b-versatile", name: "Llama-3.3-70b", provider: "Groq", color: "bg-orange-600" },
  { id: "llama3-8b-8192", name: "Llama3-8b", provider: "Groq", color: "bg-orange-400" },
  { id: "gemini-2.0-flash", name: "Gemini-2.0-Flash", provider: "Google", color: "bg-yellow-500" },
  { id: "gemini-2.0-pro", name: "Gemini-2.0-Pro", provider: "Google", color: "bg-yellow-600" },
  { id: "gemini-2.5-flash", name: "Gemini-2.5-Flash", provider: "Google", color: "bg-yellow-400" },
  { id: "gemini-2.5-pro", name: "Gemini-2.5-Pro", provider: "Google", color: "bg-yellow-500" },
];

const MainContent = ({ selectedCharacter = { id: 1, name: "Assistant" } }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useUser();
  
  const { data: messageHistory } = useQuery({
    queryKey: ["messageHistory", user?.id, selectedCharacter?.id],
    queryFn: async () => {
      if (!user?.id || !selectedCharacter?.id) return [];
      const response = await axios.get(
        `http://127.0.0.1:8000/chat/${user.id}/${selectedCharacter.id}`
      );
      setMessages(response.data.chat_history || []);
      return response.data;
    },
    // refetchOnWindowFocus: ,
    // refetchOnMount: false,
    // refetchOnReconnect: false,
    // refetchInterval: 10000,
  });
  

  const isLoading = false; // Set to false for demo

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
          model: selectedModel.id,
          user_id: user?.id,
          bot_id: selectedCharacter?.id,
          chat_history: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        });

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

  const handleResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      const maxHeight = 120;
      if (textareaRef.current.scrollHeight > maxHeight) {
        textareaRef.current.style.height = `${maxHeight}px`;
        textareaRef.current.style.overflowY = "auto";
      } else {
        textareaRef.current.style.overflowY = "hidden";
      }
    }
  };

  useEffect(() => {
    handleResize();
  }, [inputMessage]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full ${selectedModel.color} flex items-center justify-center text-white font-bold text-sm`}>
                {selectedModel.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">{selectedModel.name}</h1>
                <p className="text-sm text-gray-400">{selectedModel.provider}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
              <Search className="w-5 h-5 text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Model Selector Pills */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-3">
        <div className="flex items-center space-x-2 overflow-x-auto">
          {MODELS.slice(0, 4).map((model) => (
            <button
              key={model.id}
              onClick={() => setSelectedModel(model)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                selectedModel.id === model.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${model.color}`}></div>
              <span>{model.name}</span>
            </button>
          ))}
          <button
            onClick={() => setShowModelSelector(!showModelSelector)}
            className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all"
          >
            <Plus className="w-3 h-3" />
            <span>More</span>
          </button>
        </div>
        
        {/* Extended Model Selector */}
        {showModelSelector && (
          <div className="mt-3 p-4 bg-gray-750 rounded-lg border border-gray-600">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    setSelectedModel(model);
                    setShowModelSelector(false);
                  }}
                  className={`flex items-center space-x-2 p-3 rounded-lg text-sm transition-all text-left ${
                    selectedModel.id === model.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${model.color}`}></div>
                  <div>
                    <div className="font-medium">{model.name}</div>
                    <div className="text-xs text-gray-400">{model.provider}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-6">
            <div className={`w-20 h-20 rounded-full ${selectedModel.color} flex items-center justify-center text-white font-bold text-2xl mb-4`}>
              {selectedModel.name.charAt(0)}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Chat with {selectedModel.name}</h2>
            <p className="text-gray-400 text-center max-w-md">
              Start a conversation with {selectedModel.name}. Ask questions, get creative, or explore ideas together.
            </p>
          </div>
        ) : (
          <div className="px-6 py-4 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] ${
                    message.role === "user"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-700 text-gray-100"
                  } rounded-2xl px-4 py-3 relative group`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    {message.role === "user" ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <div className={`w-4 h-4 rounded-full ${selectedModel.color}`}></div>
                    )}
                    <span className="text-sm font-medium">
                      {message.role === "user" ? "You" : selectedModel.name}
                    </span>
                  </div>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </div>
                  <button
                    onClick={() => handleDeleteMessage(message.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3 text-white" />
                  </button>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-700 rounded-2xl px-4 py-3 max-w-[70%]">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className={`w-4 h-4 rounded-full ${selectedModel.color}`}></div>
                    <span className="text-sm font-medium text-gray-300">{selectedModel.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-400 ml-2">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
        <div className="flex items-end space-x-3">
          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
            <Plus className="w-5 h-5 text-gray-400" />
          </button>
          
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Start a new chat"
              className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-xl px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-gray-600 transition-colors"
              rows={1}
              style={{ minHeight: '48px' }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-600 rounded-lg transition-colors">
              <Mic className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className={`p-2 rounded-lg transition-all ${
              inputMessage.trim()
                ? "bg-purple-600 hover:bg-purple-700 text-white"
                : "bg-gray-700 text-gray-500 cursor-not-allowed"
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainContent;