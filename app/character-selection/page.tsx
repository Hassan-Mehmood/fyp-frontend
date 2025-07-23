"use client";
import React, { useState, useEffect, use } from "react";
import { Search, Filter, PlusCircle, Heart, Crown, X, CreditCard } from "lucide-react"; // ADDED: Crown, X, CreditCard icons
import MainContent from "../../components/MainContent"; // Import the MainContent component
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import axiosInstance from "@/utils/axios";

const PremiumPopup = ({ bot, onClose, onPurchase, isLoading }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-2xl shadow-2xl max-w-md w-full mx-auto border border-purple-500/30">
      {/* Close Button */}
      <div className="flex justify-end p-4">
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>
      
      <div className="px-6 pb-6 -mt-4">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-3">
            <Crown className="text-white" size={32} />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-white mb-2">
          Premium Bot
        </h2>
        
        <div className="text-center mb-6">
          <img 
            src={bot.avatar} 
            alt={bot.name} 
            className="w-20 h-20 rounded-full mx-auto mb-3 border-2 border-purple-400"
          />
          <h3 className="text-xl font-semibold text-white mb-2">{bot.name}</h3>
          <p className="text-gray-300 text-sm mb-4">{bot.description}</p>
        </div>
        
        <div className="bg-black/20 rounded-lg p-4 mb-6">
          <h4 className="text-white font-semibold mb-3 flex items-center">
            <Crown size={16} className="mr-2 text-yellow-400" />
            Premium Features:
          </h4>
          <ul className="text-gray-300 text-sm space-y-2">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
              Advanced AI capabilities
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
              Exclusive personality traits
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
              Priority response time
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
              Extended conversation memory
            </li>
          </ul>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={onPurchase}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ) : (
              <CreditCard size={20} className="mr-2" />
            )}
            {isLoading ? 'Processing...' : 'Purchase Premium Bot'}
          </button>
          
          <button
            onClick={onClose}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  </div>
);

const CharacterCard = ({
  name,
  description,
  image,
  onSelect,
  isFavorite,
  onToggleFavorite,
  hasAccess, 
  isPremium 
}) => (
  <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 relative">
    <img src={image} alt={name} className="w-full h-48 object-cover" />

    {/* ADDED: Premium Badge */}
    {isPremium && (
      <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
        <Crown size={12} className="mr-1" />
        PREMIUM
      </div>
    )}

    <button
      onClick={onToggleFavorite}
      className="absolute top-2 right-2 text-red-500 hover:scale-110 transition-transform"
    >
      {isFavorite ? "❤️" : "♡ "} {/* ❤️ / ♡ */}
    </button>
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2 text-white">{name}</h3>
      <p className="text-sm text-gray-300 mb-4">{description}</p>
      <button
        onClick={onSelect}
        className={`w-full py-2 rounded transition duration-300 font-semibold ${
          isPremium && !hasAccess
            ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        {isPremium && !hasAccess ? 'Unlock Premium' : 'Select Character'}
      </button>
    </div>
  </div>
);

const CharacterSelectionPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCharacter, setSelectedCharacter] = useState(null); 
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  const [selectedPremiumBot, setSelectedPremiumBot] = useState(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { user } = useUser();

  const { data, isLoading, error } = useQuery({
    queryKey: ["bots", user?.id],
    queryFn: async () => {
      if (!user) return { bots: [] };
      const botsRes = await axiosInstance.get(`/bots/all/${user.id}`);
      
      return {
        bots: botsRes.data.bots, 
      };
    },
    enabled: !!user, 
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
        await axiosInstance.post(`/bots/remove-favourite`, {
          botId,
          userId,
        });
      } else {
        await axiosInstance.post(`/bots/add-favourite`, {
          botId,
          userId,
        });
      }
    } catch (error) {
      console.error("Failed to update favorite", error);
      data.bots[botIndex].favorite = currentFavoriteStatus;
    }
  };

  const handleCharacterSelect = (character) => {
    if (character.has_access === false) {
      setSelectedPremiumBot(character);
      setShowPremiumPopup(true);
    } else {
      setSelectedCharacter(character);
    }
  };

  const handlePremiumPurchase = async () => {
    if (!selectedPremiumBot || !user?.id) return;
    
    setIsPurchasing(true);
    
    try {
      const response = await axiosInstance.post('/bots/buy-bot', {
        userId: user.id,
        botId: selectedPremiumBot.id
      });
      
      if (response.status === 200) {
        const botIndex = data?.bots.findIndex(bot => bot.id === selectedPremiumBot.id);
        if (botIndex !== -1) {
          data.bots[botIndex].has_access = true;
        }
        
        setShowPremiumPopup(false);
        setSelectedCharacter(selectedPremiumBot);
        setSelectedPremiumBot(null);
      }
    } catch (error) {
      console.error("Failed to purchase premium bot", error);
      alert("Failed to purchase premium bot. Please try again.");
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleClosePremiumPopup = () => {
    setShowPremiumPopup(false);
    setSelectedPremiumBot(null);
  };

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
              onSelect={() => handleCharacterSelect(char)} 
              isFavorite={char.favorite}
              onToggleFavorite={() => handleToggleFavorite(char.id)}
              hasAccess={char.has_access} 
              isPremium={char.has_access === false} 
            />
          ))}
        </div>

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
      </div>

      {showPremiumPopup && selectedPremiumBot && (
        <PremiumPopup
          bot={selectedPremiumBot}
          onClose={handleClosePremiumPopup}
          onPurchase={handlePremiumPurchase}
          isLoading={isPurchasing}
        />
      )}
    </div>
  );
};

export default CharacterSelectionPage;