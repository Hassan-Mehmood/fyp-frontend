"use client";
import React, { useEffect, useRef, useState } from "react";
import { Send, User, Bot, Trash2, Settings, Search, Plus, Mic, MoreHorizontal, Paperclip, X, FileText, Download, Eye } from "lucide-react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

type Message = {
  id: number;
  content: string;
  role: "user" | "assistant";
  file_path?: string | null;
  file_name?: string | null;
  file_type?: string | null;
  file_size?: number | null;
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

const ImageDisplay = ({ filePath, fileName }: { filePath: string; fileName: string }) => {
  const [imageError, setImageError] = useState(false);
  
  if (imageError) {
    return (
      <div className="flex items-center space-x-2 bg-gray-600 rounded-lg p-3 mt-2">
        <FileText className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-300">{fileName}</span>
        <span className="text-xs text-red-400">(Preview unavailable)</span>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <img
        src={filePath}
        alt={fileName}
        className="max-w-full max-h-64 rounded-lg object-contain bg-gray-800"
        onError={() => setImageError(true)}
        loading="lazy"
      />
      <div className="text-xs text-gray-400 mt-1">{fileName}</div>
    </div>
  );
};

const DocumentDisplay = ({ filePath, fileName, fileType }: { filePath: string; fileName: string; fileType: string }) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('text')) return '📝';
    if (type.includes('doc')) return '📄';
    return '📎';
  };

  return (
    <div className="mt-2 bg-gray-600 rounded-lg p-3 border border-gray-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{getFileIcon(fileType)}</div>
          <div>
            <div className="text-sm font-medium text-white">{fileName}</div>
            <div className="text-xs text-gray-400">{fileType}</div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {filePath && (
            <>
              <button
                onClick={() => window.open(filePath, '_blank')}
                className="p-1.5 hover:bg-gray-500 rounded transition-colors"
                title="View file"
              >
                <Eye className="w-4 h-4 text-gray-300" />
              </button>
              <a
                href={filePath}
                download={fileName}
                className="p-1.5 hover:bg-gray-500 rounded transition-colors"
                title="Download file"
              >
                <Download className="w-4 h-4 text-gray-300" />
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const FilePreview = ({ file, onRemove }: { file: File; onRemove: () => void }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="absolute bottom-full left-0 w-full mb-2">
      <div className="bg-gray-700 rounded-lg p-3 border border-gray-600">
        <div className="flex items-start justify-between space-x-3">
          <div className="flex-1">
            {previewUrl ? (
              <div className="space-y-2">
                <img
                  src={previewUrl}
                  alt={file.name}
                  className="max-w-32 max-h-20 rounded object-cover"
                />
                <div className="text-sm text-gray-300">{file.name}</div>
                <div className="text-xs text-gray-400">{formatFileSize(file.size)}</div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="text-2xl">
                  {file.type.includes('pdf') ? '📄' : 
                   file.type.includes('text') ? '📝' : '📎'}
                </div>
                <div>
                  <div className="text-sm text-gray-300">{file.name}</div>
                  <div className="text-xs text-gray-400">
                    {file.type} • {formatFileSize(file.size)}
                  </div>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={onRemove}
            className="p-1 hover:bg-gray-600 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

const MainContent = ({ selectedCharacter = { id: 1, name: "Assistant" } }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isLoading = false; 

  const handleSendMessage = async () => {
    if (inputMessage.trim() || selectedFile) {
      let tempFileUrl = null;
      if (selectedFile && selectedFile.type.startsWith('image/')) {
        tempFileUrl = URL.createObjectURL(selectedFile);
      }

      const userMessage: Message = {
        id: Date.now(),
        content: inputMessage,
        role: "user",
        file_name: selectedFile?.name || null,
        file_type: selectedFile?.type || null,
        file_size: selectedFile?.size || null,
        file_path: tempFileUrl, // Use temp URL for immediate display
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      
      const currentFile = selectedFile;
      setInputMessage("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setIsTyping(true);

      try {
        const formData = new FormData();
        formData.append("message", inputMessage);
        formData.append("model", selectedModel.id);
        formData.append("user_id", user?.id || "");
        formData.append("bot_id", selectedCharacter?.id.toString() || "");
        formData.append("chat_history", JSON.stringify(updatedMessages.map((m) => ({
          role: m.role,
          content: m.content,
          file_path: m.file_path || null,
        }))));
        if (currentFile) {
          formData.append("file", currentFile);
          console.log("File appended:", currentFile.name);
        }
        
        const response = await axios.post("http://127.0.0.1:8000/chat", formData);

        if (currentFile && response.data.file_path) {
          setMessages(prev => prev.map(msg => {
            if (msg.id === userMessage.id) {
              if (tempFileUrl) {
                URL.revokeObjectURL(tempFileUrl);
              }
              return { ...msg, file_path: response.data.file_path };
            }
            return msg;
          }));
        }

        const botResponse: Message = {
          id: Date.now() + 1,
          content: response.data.content,
          role: "assistant",
        };

        setMessages((prev) => [...prev, botResponse]);
      } catch (error) {
        console.error("Chat error:", error);
        
        if (tempFileUrl) {
          URL.revokeObjectURL(tempFileUrl);
        }
        
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

  const isImageFile = (fileType: string) => {
    return fileType && fileType.startsWith('image/');
  };

  useEffect(() => {
    handleResize();
  }, [inputMessage]);

  useEffect(() => {
    return () => {
      messages.forEach(message => {
        if (message.file_path && message.file_path.startsWith('blob:')) {
          URL.revokeObjectURL(message.file_path);
        }
      });
    };
  }, [messages]);

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
                  
                  {message.content && (
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </div>
                  )}
                  
                  {message.file_path && message.file_type && (
                    isImageFile(message.file_type) ? (
                      <ImageDisplay 
                        filePath={message.file_path} 
                        fileName={message.file_name || 'Image'} 
                      />
                    ) : (
                      <DocumentDisplay 
                        filePath={message.file_path} 
                        fileName={message.file_name || 'Document'} 
                        fileType={message.file_type}
                      />
                    )
                  )}
                  
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
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,.pdf,.txt,.md,.doc,.docx"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Paperclip className="w-5 h-5 text-gray-400" />
          </button>
          
          <div className="flex-1 relative">
            {selectedFile && (
              <FilePreview file={selectedFile} onRemove={handleRemoveFile} />
            )}
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
            disabled={!inputMessage.trim() && !selectedFile}
            className={`p-2 rounded-lg transition-all ${
              inputMessage.trim() || selectedFile
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