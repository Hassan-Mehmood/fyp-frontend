"use client";
import React, { use, useState } from "react";
import {
  Search,
  Calendar,
  Trash2,
  MessageSquare,
  Bot,
  Clock,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

const ChatSessionCard = ({ session, onContinue, onDelete }) => (
  <div className="bg-gray-800 rounded-lg shadow-md p-4 mb-6 hover:shadow-lg transition-shadow duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center">
        <Bot size={24} className="text-blue-500 mr-3" />
        <h3 className="text-xl font-semibold text-white">
          {session.characterName}
        </h3>
      </div>
      <span className="text-sm text-gray-400 flex items-center">
        <Clock size={16} className="mr-1" />
        {session.date}
      </span>
    </div>
    <p className="text-gray-300 mb-6">{session.lastMessage}</p>
    <div className="flex justify-between items-center">
      <button
        onClick={() => onContinue(session.id)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 flex items-center"
      >
        <MessageSquare size={18} className="mr-2" />
        Continue Chat
      </button>
      <button
        onClick={() => onDelete(session.id)}
        className="text-red-500 hover:text-red-600 transition duration-300"
      >
        <Trash2 size={18} />
      </button>
    </div>
  </div>
);

const ChatHistoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const { user } = useUser();

  const { data } = useQuery({
    queryKey: ["chats", user?.id],
    queryFn: async () => {
      const response = await axios.get(
        `http://127.0.0.1:8000/users/chats/${user?.id}`
      );
      return response.data;
    },
  });

  console.log("data", data);

  // Placeholder data - replace with actual chat history data in a real application
  // const chatSessions = [
  //   {
  //     id: 1,
  //     characterName: "Friendly Assistant",
  //     date: "2024-09-27",
  //     lastMessage:
  //       "Sure, I can help you with that task. What specific information do you need?",
  //   },
  //   {
  //     id: 2,
  //     characterName: "Creative Writer",
  //     date: "2024-09-26",
  //     lastMessage:
  //       "Your story idea sounds intriguing! Let's brainstorm some character development ideas.",
  //   },
  //   {
  //     id: 3,
  //     characterName: "Code Helper",
  //     date: "2024-09-25",
  //     lastMessage:
  //       "The bug in your code appears to be in the loop condition. Let's take a closer look.",
  //   },
  //   {
  //     id: 4,
  //     characterName: "Language Tutor",
  //     date: "2024-09-24",
  //     lastMessage:
  //       "Great job on that sentence! Now, let's practice some more complex grammatical structures.",
  //   },
  //   {
  //     id: 5,
  //     characterName: "Fitness Coach",
  //     date: "2024-09-23",
  //     lastMessage:
  //       "Based on your goals, I recommend increasing your protein intake and adding more resistance training.",
  //   },
  // ];

  // const filteredSessions = chatSessions.filter(
  //   (session) =>
  //     session.characterName.toLowerCase().includes(searchTerm.toLowerCase()) &&
  //     (selectedDate ? session.date === selectedDate : true)
  // );

  const handleContinueChat = (sessionId) => {
    console.log(`Continuing chat session: ${sessionId}`);
    // Implement logic to navigate to the chat interface with the selected session
  };

  const handleDeleteChat = (sessionId) => {
    console.log(`Deleting chat session: ${sessionId}`);
    // Implement logic to delete the chat session
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="p-8 max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Your Chat History</h1>
          <p className="text-xl text-gray-400">
            Review and continue your conversations with AI companions
          </p>
        </header>

        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          {/* Search Bar */}
          <div className="relative w-full md:w-64 mb-4 md:mb-0">
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-gray-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          </div>

          {/* Date Picker */}
          <div className="flex items-center">
            <Calendar className="mr-2 text-gray-400" size={20} />
            <input
              type="date"
              className="border rounded-lg px-4 py-2 text-gray-900"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-6">
          {data?.chats.map((chat) => (
            <ChatSessionCard
              key={chat.id}
              session={chat}
              onContinue={handleContinueChat}
              onDelete={handleDeleteChat}
            />
          ))}
        </div>

        {/* {filteredSessions.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p>
              No chat sessions found. Start a new conversation with an AI
              companion!
            </p>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default ChatHistoryPage;
