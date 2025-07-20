"use client";
import React, { useState } from "react";
import {
  Search,
  Calendar,
  Trash2,
  MessageSquare,
  Bot,
  Clock,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import MainContent from "@/components/MainContent";

const ChatSessionCard = ({ session, onContinue, onDelete }) => {
  const { bot, id, updated_at, message } = session;

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 mb-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <Bot size={24} className="text-blue-500 mr-3" />
          <div>
            <h3 className="text-xl font-semibold text-white">{bot?.name || "Unnamed Bot"}</h3>
            <p className="text-sm text-gray-400">{bot?.description || "No description"}</p>
          </div>
        </div>
        <span className="text-sm text-gray-400 flex items-center">
          <Clock size={16} className="mr-1" />
          {new Date(updated_at).toLocaleDateString()}
        </span>
      </div>

      <p className="text-gray-300 mb-6 line-clamp-2">{message}</p>

      <div className="flex justify-between items-center">
        <button
          onClick={() => onContinue(id, bot?.id)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 flex items-center"
        >
          <MessageSquare size={18} className="mr-2" />
          Continue Chat
        </button>
        <button
          onClick={() => onDelete(id)}
          className="text-red-500 hover:text-red-600 transition duration-300"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

const ChatHistoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const router = useRouter();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [selectedCharacter, setSelectedCharacter] = useState(null);
const [isChatActive, setIsChatActive] = useState(false);


  // Fetch chat history
  const { data, isLoading, error } = useQuery({
    queryKey: ["chats", user?.id],
    queryFn: async () => {
      if (!user?.id) return { chats: [] };
      const response = await axios.get(
        `http://127.0.0.1:8000/users/chats/${user.id}`
      );
      return response.data;
    },
    enabled: !!user?.id,
  });

  // Delete chat mutation
  const deleteChatMutation = useMutation({
    mutationFn: async (sessionId) => {
      await axios.delete(`http://127.0.0.1:8000/chat/session/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${user?.id}`,
        }
      });
    },
    onSuccess: () => {
      // Refresh the chat list after deletion
      queryClient.invalidateQueries(['chats', user?.id]);
    },
    onError: (error) => {
      console.error('Error deleting chat:', error);
      // You might want to show a toast notification here
    }
  });

  // Filter chats based on search term and date
  const filteredChats = data?.chats?.filter((chat) => {
    const matchesSearch = searchTerm === "" || 
      chat.bot?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.bot?.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate = selectedDate === "" || 
      new Date(chat.updated_at).toDateString() === new Date(selectedDate).toDateString();

    return matchesSearch && matchesDate;
  }) || [];

const handleContinueChat = async (sessionId, botId) => {
  if (!botId) {
    console.error('Bot ID is missing');
    return;
  }

  try {
    await queryClient.prefetchQuery({
      queryKey: ["messageHistory", user?.id, botId],
      queryFn: async () => {
        const response = await axios.get(
          `http://127.0.0.1:8000/chat/${user.id}/${botId}`,
          {
            headers: {
              'Authorization': `Bearer ${user.id}`,
            }
          }
        );
        return response.data;
      },
    });

    setSelectedCharacter({ id: botId, sessionId }); // you can enhance this if more info is needed
    setIsChatActive(true);
  } catch (error) {
    console.error('Error prefetching message history:', error);
  }
};


  const handleDeleteChat = (sessionId) => {
    if (window.confirm('Are you sure you want to delete this chat? This action cannot be undone.')) {
      deleteChatMutation.mutate(sessionId);
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDate("");
  };

  if (isLoading) {
    return (
      <div className="bg-gray-900 min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your chat history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 min-h-screen text-white flex items-center justify-center">
        <div className="text-center text-red-400">
          <p className="text-xl mb-2">Error loading chat history</p>
          <p className="text-gray-400">Please try refreshing the page</p>
        </div>
      </div>
    );
  }
  if (isChatActive && selectedCharacter) {
  return <MainContent selectedCharacter={selectedCharacter} />;
}

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="p-8 max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Your Chat History</h1>
          <p className="text-xl text-gray-400">
            Review and continue your conversations with AI companions
          </p>
        </header>

        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-gray-900 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
          </div>

          {/* Date Filter */}
          <div className="relative w-full md:w-64">
            <input
              type="date"
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-gray-900 bg-white"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <Calendar
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
          </div>

          {/* Clear Filters Button */}
          {(searchTerm || selectedDate) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition duration-300"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6 text-gray-400">
          {searchTerm || selectedDate ? (
            <p>
              Found {filteredChats.length} chat{filteredChats.length !== 1 ? 's' : ''}
              {searchTerm && ` matching "${searchTerm}"`}
              {selectedDate && ` from ${new Date(selectedDate).toLocaleDateString()}`}
            </p>
          ) : (
            <p>Showing all {filteredChats.length} chat{filteredChats.length !== 1 ? 's' : ''}</p>
          )}
        </div>

        {/* Chat Sessions */}
        <div className="space-y-6">
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <ChatSessionCard
                key={chat.id}
                session={chat}
                onContinue={handleContinueChat}
                onDelete={handleDeleteChat}
              />
            ))
          ) : (
            <div className="text-center text-gray-400 py-12">
              {searchTerm || selectedDate ? (
                <div>
                  <Search size={48} className="mx-auto mb-4 text-gray-600" />
                  <p className="text-lg">No chats found</p>
                  <p className="text-sm">Try adjusting your search or date filter</p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div>
                  <MessageSquare size={48} className="mx-auto mb-4 text-gray-600" />
                  <p className="text-lg">No chat history yet</p>
                  <p className="text-sm">Start a conversation with an AI companion to see your chats here</p>
                  <button
                    onClick={() => router.push('/characters')}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                  >
                    Choose a Character
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Loading state for delete operation */}
        {deleteChatMutation.isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-white">Deleting chat...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistoryPage;