"use client";
import React, { useState, useEffect, use } from "react";
import { Search, Filter, PlusCircle, Heart } from "lucide-react";
import MainContent from "../../components/MainContent"; // Import the MainContent component
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

const CharacterCard = ({
  name,
  description,
  image,
  onSelect,
  isFavorite,
  onToggleFavorite,
}) => (
  <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 relative">
    <img src={image} alt={name} className="w-full h-48 object-cover" />

    <button
      onClick={onToggleFavorite}
      className="absolute top-2 right-2 text-red-500 hover:scale-110 transition-transform"
    >
      {isFavorite ? "❤️" : "♡"} {/* ❤️ / ♡ */}
    </button>
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2 text-white">{name}</h3>
      <p className="text-sm text-gray-300 mb-4">{description}</p>
      <button
        onClick={onSelect}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
      >
        Select Character
      </button>
    </div>
  </div>
);

const CharacterSelectionPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCharacter, setSelectedCharacter] = useState(null); // Track selected character
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { user } = useUser();

  const { data, isLoading, error } = useQuery({
    queryKey: ["bots", user?.id],
    queryFn: async () => {
      if (!user) return { bots: [] };
      const botsRes = await axios.get(`http://127.0.0.1:8000/bots/all/${user.id}`);
      
      return {
        bots: botsRes.data.bots, // your list of all bots with favorite property
      };
    },
    enabled: !!user, // only run this query if user is defined
  });

  if (isLoading) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }

  const handleToggleFavorite = async (botId: string) => {
    const userId = user?.id;
    if (!userId) {
      console.error("User not logged in");
      return;
    }

    // Find the bot in the current data
    const botIndex = data?.bots.findIndex(bot => bot.id === botId);
    if (botIndex === -1) return;

    const currentFavoriteStatus = data.bots[botIndex].favorite;

    // Optimistically update the UI
    data.bots[botIndex].favorite = !currentFavoriteStatus;

    try {
      if (currentFavoriteStatus) {
        // Remove from favorites
        await axios.post(`http://127.0.0.1:8000/bots/remove-favourite`, {
          botId,
          userId,
        });
      } else {
        // Add to favorites
        await axios.post(`http://127.0.0.1:8000/bots/add-favourite`, {
          botId,
          userId,
        });
      }
    } catch (error) {
      console.error("Failed to update favorite", error);
      // Revert the optimistic update on error
      data.bots[botIndex].favorite = currentFavoriteStatus;
    }
  };

  // Filter bots based on search term and favorite filter
  const filteredBots = data?.bots.filter(bot => {
    const matchesSearch = bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bot.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFavoriteFilter = showFavoritesOnly ? bot.favorite : true;
    
    return matchesSearch && matchesFavoriteFilter;
  }) || [];

  if (selectedCharacter) {
    return <MainContent selectedCharacter={selectedCharacter} />;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="p-8 max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your AI Companion</h1>
          <p className="text-xl text-gray-400">
            Select from our pre-configured characters or create your own
          </p>
        </header>

        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="relative w-full md:w-64 mb-4 md:mb-0">
            <input
              type="text"
              placeholder="Search characters..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-gray-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
          </div>
          
          {/* Favorites Filter Toggle */}
          <div className="flex items-center">
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center px-4 py-2 rounded-lg transition duration-300 ${
                showFavoritesOnly 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Heart 
                size={20} 
                className={`mr-2 ${showFavoritesOnly ? 'fill-current' : ''}`}
              />
              {showFavoritesOnly ? 'Show All' : 'Show Favorites'}
            </button>
          </div>
        </div>

        {/* Show count and filter status */}
        <div className="mb-4 text-gray-400">
          {showFavoritesOnly && (
            <p>Showing {filteredBots.length} favorite bot{filteredBots.length !== 1 ? 's' : ''}</p>
          )}
          {!showFavoritesOnly && searchTerm && (
            <p>Found {filteredBots.length} bot{filteredBots.length !== 1 ? 's' : ''} matching "{searchTerm}"</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredBots.map((char) => (
            <CharacterCard
              key={char.id}
              name={char.name}
              description={char.description}
              image={char.avatar}
              onSelect={() => setSelectedCharacter(char)}
              isFavorite={char.favorite}
              onToggleFavorite={() => handleToggleFavorite(char.id)}
            />
          ))}
        </div>

        {/* Show message when no bots match the filter */}
        {filteredBots.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            {showFavoritesOnly ? (
              <div>
                <Heart size={48} className="mx-auto mb-4 text-gray-600" />
                <p className="text-lg">No favorite bots yet</p>
                <p className="text-sm">Click the heart icon on any bot to add it to your favorites!</p>
              </div>
            ) : (
              <div>
                <Search size={48} className="mx-auto mb-4 text-gray-600" />
                <p className="text-lg">No bots found matching "{searchTerm}"</p>
                <p className="text-sm">Try adjusting your search terms</p>
              </div>
            )}
          </div>
        )}

        <div className="text-center">
          <button className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition duration-300 flex items-center justify-center mx-auto">
            <PlusCircle size={24} className="mr-2" />
            Create Custom Character
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterSelectionPage;