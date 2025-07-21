"use client";
import React, { useEffect, useRef, useState } from "react";
import { Send, User, Bot, Trash2, Settings, Search, Plus, Mic, MoreHorizontal, Paperclip, X, FileText, Download, Eye, File, Image } from "lucide-react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from 'next/navigation';
import axiosInstance from "@/utils/axios";

type Message = {
  id: string | number;
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

const getFileTypeFromUrl = (url: string, fileName?: string): string => {
  const lowerUrl = url.toLowerCase();
  const lowerFileName = fileName?.toLowerCase() || '';
  
  if (lowerUrl.includes('.pdf') || lowerFileName.includes('.pdf')) return 'application/pdf';
  if (lowerUrl.includes('.png') || lowerFileName.includes('.png')) return 'image/png';
  if (lowerUrl.includes('.jpg') || lowerUrl.includes('.jpeg') || lowerFileName.includes('.jpg') || lowerFileName.includes('.jpeg')) return 'image/jpeg';
  if (lowerUrl.includes('.gif') || lowerFileName.includes('.gif')) return 'image/gif';
  if (lowerUrl.includes('.webp') || lowerFileName.includes('.webp')) return 'image/webp';
  if (lowerUrl.includes('.svg') || lowerFileName.includes('.svg')) return 'image/svg+xml';
  if (lowerUrl.includes('.doc') || lowerUrl.includes('.docx') || lowerFileName.includes('.doc') || lowerFileName.includes('.docx')) return 'application/msword';
  if (lowerUrl.includes('.txt') || lowerFileName.includes('.txt')) return 'text/plain';
  if (lowerUrl.includes('.md') || lowerFileName.includes('.md')) return 'text/markdown';
  
  return 'application/octet-stream';
};

const getFileNameFromUrl = (url: string): string => {
  try {
    const urlParts = url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const cleanFileName = fileName.split('?')[0];
    return decodeURIComponent(cleanFileName);
  } catch {
    return 'Unknown file';
  }
};

const downloadFile = async (filePath: string, fileName: string) => {
  try {
    // Handle blob URLs (for temporary files)
    if (filePath.startsWith('blob:')) {
      const link = document.createElement('a');
      link.href = filePath;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // For server files, try fetching with proper headers
    const response = await fetch(filePath, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });

    if (!response.ok) {
      // If fetch fails, try opening in new window
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download failed:', error);
    // Fallback: try opening in new window
    try {
      const link = document.createElement('a');
      link.href = filePath;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (fallbackError) {
      console.error('Fallback download also failed:', fallbackError);
      alert('Download failed. Please try right-clicking the file and selecting "Save as..."');
    }
  }
};



const ImageDisplay = ({ filePath, fileName, fileType }: { filePath: string; fileName: string; fileType?: string }) => {
  const [imageError, setImageError] = useState(false);
  
  const handleDownload = () => {
    downloadFile(filePath, fileName);
  };

  if (imageError) {
    return (
      <div className="flex items-center space-x-3 bg-gray-600 rounded-lg p-3 mt-2 border border-gray-500">
        <div className="p-2 bg-gray-500 rounded-lg">
          <Image className="w-6 h-6 text-gray-300" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-white">{fileName}</div>
          <div className="text-xs text-red-400">Image preview unavailable</div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.open(filePath, '_blank')}
            className="p-1.5 hover:bg-gray-500 rounded transition-colors"
            title="View image"
          >
            <Eye className="w-4 h-4 text-gray-300" />
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 hover:bg-gray-500 rounded transition-colors"
            title="Download image"
          >
            <Download className="w-4 h-4 text-gray-300" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <div className="relative group">
        <img
          src={filePath}
          alt={fileName}
          className="max-w-full max-h-64 rounded-lg object-contain bg-gray-800 border border-gray-600"
          onError={() => setImageError(true)}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <button
              onClick={() => window.open(filePath, '_blank')}
              className="p-2 bg-gray-800 bg-opacity-75 hover:bg-opacity-100 rounded-lg transition-all"
              title="View full size"
            >
              <Eye className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 bg-gray-800 bg-opacity-75 hover:bg-opacity-100 rounded-lg transition-all"
              title="Download image"
            >
              <Download className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
      <div className="text-xs text-gray-400 mt-1 flex items-center space-x-2">
        <Image className="w-3 h-3" />
        <span>{fileName}</span>
      </div>
    </div>
  );
};

const PDFDisplay = ({ filePath, fileName }: { filePath: string; fileName: string }) => {
  const handleDownload = () => {
    downloadFile(filePath, fileName);
  };

  return (
    <div className="mt-2 bg-gray-600 rounded-lg border border-gray-500 overflow-hidden">
      <div className="flex items-center justify-between p-3 bg-gray-700 border-b border-gray-500">
        <div className="flex items-center space-x-3">
          <div className="bg-red-500 rounded-lg p-2 flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">{fileName}</div>
            <div className="text-xs text-gray-300 flex items-center space-x-2">
              <span className="px-2 py-0.5 bg-red-500 rounded text-xs font-medium text-white">
                PDF
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1 ml-3">
          <button
            onClick={() => window.open(filePath, '_blank')}
            className="p-1.5 hover:bg-gray-500 rounded-lg transition-colors"
            title="Open PDF in new tab"
          >
            <Eye className="w-4 h-4 text-gray-300" />
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 hover:bg-gray-500 rounded-lg transition-colors"
            title="Download PDF"
          >
            <Download className="w-4 h-4 text-gray-300" />
          </button>
        </div>
      </div>
      
      <div className="h-64 bg-gray-800">
        <iframe
          src={`${filePath}#view=FitH`}
          className="w-full h-full border-0"
          title={fileName}
          onError={(e) => {
            console.error('PDF iframe error:', e);
            (e.target as HTMLIFrameElement).style.display = 'none';
          }}
        />
      </div>
    </div>
  );
};

const DocumentDisplay = ({ filePath, fileName, fileType }: { filePath: string; fileName: string; fileType: string }) => {
  const getFileIcon = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('pdf')) return { icon: <FileText className="w-5 h-5 text-white" />, color: 'bg-red-500', name: 'PDF' };
    if (lowerType.includes('doc')) return { icon: <FileText className="w-5 h-5 text-white" />, color: 'bg-blue-500', name: 'DOC' };
    if (lowerType.includes('text') || lowerType.includes('txt')) return { icon: <FileText className="w-5 h-5 text-white" />, color: 'bg-gray-500', name: 'TXT' };
    if (lowerType.includes('markdown') || lowerType.includes('md')) return { icon: <FileText className="w-5 h-5 text-white" />, color: 'bg-purple-500', name: 'MD' };
    return { icon: <FileText className="w-5 h-5 text-white" />, color: 'bg-gray-500', name: 'FILE' };
  };

  const fileInfo = getFileIcon(fileType);

  return (
    <div className="mt-2 bg-gray-600 rounded-lg p-4 border border-gray-500 hover:bg-gray-550 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`${fileInfo.color} rounded-lg p-2 flex items-center justify-center`}>
            {fileInfo.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">{fileName}</div>
            <div className="text-xs text-gray-300 flex items-center space-x-2">
              <span className="px-2 py-0.5 bg-gray-700 rounded text-xs font-medium">
                {fileInfo.name}
              </span>
              {fileType.includes('pdf') && (
                <button 
                  onClick={() => window.open(filePath, '_blank')}
                  className="text-xs text-purple-400 hover:text-purple-300"
                >
                  View PDF
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1 ml-3">
          <button
            onClick={() => window.open(filePath, '_blank')}
            className="p-1.5 hover:bg-gray-500 rounded-lg transition-colors"
            title="View document"
          >
            <Eye className="w-4 h-4 text-gray-300" />
          </button>
          <a
            href={filePath}
            download={fileName}
            className="p-1.5 hover:bg-gray-500 rounded-lg transition-colors"
            title="Download document"
          >
            <Download className="w-4 h-4 text-gray-300" />
          </a>
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

  const getFileIcon = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('pdf')) return { icon: '📄', color: 'bg-red-500' };
    if (lowerType.includes('doc')) return { icon: '📘', color: 'bg-blue-500' };
    if (lowerType.includes('text')) return { icon: '📝', color: 'bg-gray-500' };
    return { icon: '📎', color: 'bg-gray-500' };
  };

  const fileInfo = getFileIcon(file.type);

  return (
    <div className="absolute bottom-full left-0 w-full mb-2">
      <div className="bg-gray-700 rounded-lg p-3 border border-gray-600 shadow-lg">
        <div className="flex items-start justify-between space-x-3">
          <div className="flex-1">
            {previewUrl ? (
              <div className="space-y-2">
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt={file.name}
                    className="max-w-32 max-h-20 rounded object-cover border border-gray-500"
                  />
                  <div className="absolute top-1 right-1 bg-black bg-opacity-50 rounded px-1 py-0.5">
                    <span className="text-xs text-white">IMG</span>
                  </div>
                </div>
                <div className="text-sm text-gray-300 truncate">{file.name}</div>
                <div className="text-xs text-gray-400">{formatFileSize(file.size)}</div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <div className={`${fileInfo.color} rounded-lg p-2 flex items-center justify-center`}>
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-300 truncate">{file.name}</div>
                  <div className="text-xs text-gray-400">
                    {file.type.split('/')[1]?.toUpperCase() || 'FILE'} • {formatFileSize(file.size)}
                  </div>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={onRemove}
            className="p-1 hover:bg-gray-600 rounded-full transition-colors flex-shrink-0"
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
    const searchParams = useSearchParams();
  const botId = searchParams.get('bot');

   const [currentBot, setCurrentBot] = useState(
    selectedCharacter || { id: 1, name: "Assistant" }
  );
   useEffect(() => {
    if (botId && botId !== currentBot.id.toString()) {
      // Fetch bot details or use the botId to set the current bot
      setCurrentBot({ id: parseInt(botId), name: "Assistant" }); // Update with actual bot data
    }
  }, [botId]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

// Add this function to scroll to bottom
const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
};

// Add this useEffect to auto-scroll when messages update
useEffect(() => {
  scrollToBottom();
}, [messages, isTyping]);

  const { user } = useUser();
  
const { data: messageHistory } = useQuery({
  queryKey: ["messageHistory", user?.id, currentBot?.id],
  queryFn: async () => {
    if (!user?.id || !currentBot?.id) return [];
    
    try {
      const response = await axiosInstance.get(
        `/chat/${user.id}/${currentBot.id}`,
      );
      
      // Sort messages by created_at (assuming the backend sends this field)
      const sortedHistory = (response.data.chat_history || [])
        .sort((a, b) => {
          // If created_at exists, use it; otherwise fall back to message order
          if (a.created_at && b.created_at) {
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          }
          return 0; // Keep original order if no timestamps
        })
        .map((msg: Message, index: number) => {
          // Ensure each message has a unique ID
          const messageWithId = {
            ...msg,
            id: msg.id || `${msg.role}-${index}-${msg.created_at || Date.now()}`,
          };
          
          // Handle file path and type detection
          if (messageWithId.file_path && !messageWithId.file_type) {
            const detectedFileType = getFileTypeFromUrl(messageWithId.file_path, messageWithId.file_name || undefined);
            const detectedFileName = messageWithId.file_name || getFileNameFromUrl(messageWithId.file_path);
            
            return {
              ...messageWithId,
              file_type: detectedFileType,
              file_name: detectedFileName
            };
          }
          return messageWithId;
        });
      
      // Only set messages if they're different to avoid unnecessary re-renders
      setMessages(prevMessages => {
        const newMessagesStr = JSON.stringify(sortedHistory);
        const prevMessagesStr = JSON.stringify(prevMessages);
        if (newMessagesStr !== prevMessagesStr) {
          return sortedHistory;
        }
        return prevMessages;
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching message history:', error);
      return [];
    }
  },
  enabled: !!user?.id && !!selectedCharacter?.id,
  refetchOnMount: true, 
  refetchOnWindowFocus: false, 
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
  if (!inputMessage.trim() && !selectedFile) return;

  let tempFileUrl = null;
  
  // Create temp URL for immediate display - for ALL file types including PDF
  if (selectedFile) {
    tempFileUrl = URL.createObjectURL(selectedFile);
  }

  // Generate unique ID for the message
  const messageId = `user-${Date.now()}-${Math.random()}`;
  
  const userMessage: Message = {
    id: messageId,
    content: inputMessage,
    role: "user",
    file_name: selectedFile?.name || null,
    file_type: selectedFile?.type || null,
    file_size: selectedFile?.size || null,
    file_path: tempFileUrl,
  };

  // Store current state before clearing
  const currentInput = inputMessage;
  const currentFile = selectedFile;
  const currentFileType = selectedFile?.type || null;
  const currentFileName = selectedFile?.name || null;
  
  // Add user message immediately
  setMessages(prevMessages => [...prevMessages, userMessage]);
  
  // Clear input immediately after adding message
  setInputMessage("");
  setSelectedFile(null);
  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
  setIsTyping(true);

  try {
    const formData = new FormData();
    formData.append("message", currentInput);
    formData.append("model", selectedModel.id);
    formData.append("user_id", user?.id || "");
    formData.append("bot_id", selectedCharacter?.id.toString() || "");
    
    // Get current messages for chat history (without the new user message to avoid duplication)
    formData.append("chat_history", JSON.stringify(messages.map((m) => ({
      role: m.role,
      content: m.content,
      file_path: m.file_path || null,
    }))));
    
    if (currentFile) {
      formData.append("file", currentFile);
    }
    
    const response = await axiosInstance.post("/chat", formData);
    

    // Update user message with actual file path from server if file was uploaded
  if (currentFile) {
  const safeFilePath = response.data.file_path || tempFileUrl;
  setMessages(prev => prev.map(msg => {
    if (msg.id === messageId) {
      // Only revoke temp URL if we're replacing it
      if (response.data.file_path && tempFileUrl) {
        URL.revokeObjectURL(tempFileUrl);
      }
      return {
        ...msg,
        file_path: safeFilePath,
        file_type: currentFileType,
        file_name: currentFileName
      };
    }
    return msg;
  }));
}


    // Add bot response with unique ID
    const botResponse: Message = {
      id: `bot-${Date.now()}-${Math.random()}`,
      content: response.data.content,
      role: "assistant",
      file_path: null,
      file_name: null,
      file_type: null,
      file_size: null,
    };

    // Add bot response after a small delay to ensure proper ordering
    setTimeout(() => {
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 100);

  } catch (error) {
    console.error("Chat error:", error);
    
    // Clean up temp URL on error
    if (tempFileUrl) {
      URL.revokeObjectURL(tempFileUrl);
    }
    
    const errorMessage: Message = {
      id: `error-${Date.now()}-${Math.random()}`,
      content: "Error fetching response.",
      role: "assistant",
      file_path: null,
      file_name: null,
      file_type: null,
      file_size: null,
    };
    
    setTimeout(() => {
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    }, 100);
  }
};
  const handleDeleteMessage = (id: string | number) => {
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

  const isPDFFile = (fileType: string) => {
    return fileType && fileType.includes('pdf');
  };

const renderFileDisplay = (message: Message) => {
  if (!message.file_path) return null;
  
  // Ensure we have file_type, try to detect if missing
  let fileType = message.file_type;
  if (!fileType && message.file_path) {
    fileType = getFileTypeFromUrl(message.file_path, message.file_name || undefined);
  }
  
  if (!fileType) return null;

  const fileName = message.file_name || getFileNameFromUrl(message.file_path);

  if (isImageFile(fileType)) {
    return (
      <ImageDisplay 
        filePath={message.file_path} 
        fileName={fileName} 
        fileType={fileType}
      />
    );
  }

  if (isPDFFile(fileType)) {
    return (
      <PDFDisplay 
        filePath={message.file_path} 
        fileName={fileName} 
      />
    );
  }

  return (
    <DocumentDisplay 
      filePath={message.file_path} 
      fileName={fileName} 
      fileType={fileType}
    />
  );
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
            
            {/* Updated file rendering logic */}
            {message.file_path && message.file_type && (
              <div>
                {renderFileDisplay(message)}
              </div>
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
      
      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
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