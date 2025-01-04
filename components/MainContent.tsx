"use client"
import React, { useState } from 'react';
import { Send, User, Bot, Trash2 } from 'lucide-react';
import { useEffect, useRef } from 'react';

const MainContent = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef(null);
  const handleResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset the height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Adjust height based on content

      // Set the max height (in pixels)
      const maxHeight = 150; // Example: limit to 150px height
      if (textareaRef.current.scrollHeight > maxHeight) {
        textareaRef.current.style.height = `${maxHeight}px`; // Stop expanding beyond max height
        textareaRef.current.style.overflow = 'hidden'; // Enable scroll if content exceeds max height
      } else {
        textareaRef.current.style.overflowY = 'hidden'; // Hide scroll if within limit
      }
    }
  };

  useEffect(() => {
    handleResize(); // Trigger the resize when the component is rendered
  }, []);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = { id: Date.now(), text: inputMessage, sender: 'user' };
      setMessages([...messages, newMessage]);
      setInputMessage('');
      setIsTyping(true);
      // Simulate API call
      setTimeout(() => {
        setIsTyping(false);
        const botResponse = { id: Date.now() + 1, text: "This is a professional bot response.", sender: 'bot' };
        setMessages(msgs => [...msgs, botResponse]);
      }, 1500);
    }
  };

  const handleDeleteMessage = (id) => {
    setMessages(messages.filter(message => message.id !== id));
  };


  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4">
        {/* ... (header content remains the same) ... */}
      </header>

      {/* Chat Area */}
      <div className="flex-grow overflow-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-lg p-3 max-w-xs lg:max-w-md ${
              message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-white shadow-md'
            } relative group`}>
              <div className="flex items-center space-x-2 mb-1">
                {message.sender === 'user' ? (
                  <User className="text-white" size={16} />
                ) : (
                  <Bot className="text-blue-500" size={16} />
                )}
                <span className="font-semibold">{message.sender === 'user' ? 'You' : 'Expert Bot'}</span>
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
            handleResize(); // Trigger resize on input change
          }}
          placeholder="Type your message here..."
          className="flex-grow rounded-lg p-2 bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={1} // Start with 1 row
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
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