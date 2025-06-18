"use client";
import React, { useState, useEffect, use } from "react";
import { Search, Filter, PlusCircle } from "lucide-react";
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
  <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
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
  const [favorites, setFavorites] = useState<string[]>([]);
  const { user } = useUser();

  const { data, isLoading, error } = useQuery({
    queryKey: ["botsAndFavs", user?.id],
    queryFn: async () => {
      if (!user) return { bots: [], favIds: [] };
      const [botsRes, favRes] = await Promise.all([
        axios.get(`http://127.0.0.1:8000/bots/all/${user.id}`),
        axios.get(`http://127.0.0.1:8000/bots/favourite-bots/${user.id}`),
      ]);

      return {
        bots: botsRes.data.bots, // your list of all bots
        favIds: favRes.data.favorites.map((bot: any) => bot.id), // array of favorite‑bot IDs
      };
    },
    enabled: !!user, // only run this query if user is defined
  });

  useEffect(() => {
    if (data) {
      setFavorites(data.favIds);
    }
  }, [data]);

  if (isLoading) {
    return <div className="text-center text-gray-400">Loading...</div>;
  }
  const handleToggleFavorite = async (botId: string) => {
    const userId = user?.id;
    if (!userId) {
      console.error("User not logged in");
      return;
    }

    if (favorites.includes(botId)) {
      // Remove from favorites
      setFavorites(favorites.filter((id) => id !== botId));

      await axios.post(`http://127.0.0.1:8000/bots/remove-favourite`, {
        botId,
        userId,
      });
    } else {
      // Add to favorites
      setFavorites([...favorites, botId]);
      try {
        await axios.post(`http://127.0.0.1:8000/bots/add-favourite`, {
          botId,
          userId,
        });
      } catch (error) {
        console.error("Failed to update favorite", error);
      }
    }
  };

  console.log("data", data);

  // // Placeholder data - replace with actual character data in a real application
  // const characters = [
  //   {
  //     id: 1,
  //     name: "Friendly Assistant",
  //     category: "General",
  //     description: "A helpful AI for everyday tasks.",
  //     image: "/api/placeholder/300/200",
  //   },
  //   {
  //     id: 2,
  //     name: "Creative Writer",
  //     category: "Creative",
  //     description: "An AI to help with writing and brainstorming.",
  //     image: "/api/placeholder/300/200",
  //   },
  //   {
  //     id: 3,
  //     name: "Code Helper",
  //     category: "Technical",
  //     description: "Assists with programming and debugging.",
  //     image: "/api/placeholder/300/200",
  //   },
  //   {
  //     id: 4,
  //     name: "Language Tutor",
  //     category: "Educational",
  //     description: "Helps you learn new languages.",
  //     image: "/api/placeholder/300/200",
  //   },
  //   {
  //     id: 5,
  //     name: "Fitness Coach",
  //     category: "Health",
  //     description: "Provides workout plans and nutrition advice.",
  //     image: "/api/placeholder/300/200",
  //   },
  //   {
  //     id: 6,
  //     name: "Travel Planner",
  //     category: "Lifestyle",
  //     description: "Helps plan your perfect vacation.",
  //     image: "/api/placeholder/300/200",
  //   },
  // ];

  // const categories = [
  //   "All",
  //   "General",
  //   "Creative",
  //   "Technical",
  //   "Educational",
  //   "Health",
  //   "Lifestyle",
  // ];

  // const filteredCharacters = characters.filter(
  //   (char) =>
  //     (selectedCategory === "All" || char.category === selectedCategory) &&
  //     char.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  // // If a character is selected, render the MainContent component instead
  // if (selectedCharacter) {
  //   return <MainContent selectedCharacter={selectedCharacter} />;
  // }

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
          {/* <div className="flex items-center">
            <Filter className="mr-2 text-gray-400" size={20} />
            <select
              className="border rounded-lg px-4 py-2 text-gray-900"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {data?.bots.map((char) => (
            <CharacterCard
              key={char.id}
              name={char.name}
              description={char.description}
              image={char.avatar}
              onSelect={() => setSelectedCharacter(char)}
              isFavorite={favorites.includes(char.id)}
              onToggleFavorite={() => handleToggleFavorite(char.id)}
            />
          ))}
        </div>

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
