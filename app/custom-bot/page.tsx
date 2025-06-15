"use client";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";

const CreateCustomBotPage = () => {
  const [botName, setBotName] = useState("");
  const [botDescription, setBotDescription] = useState("");
  const [botPrompt, setBotPrompt] = useState("");
  const [botType, setBotType] = useState("PUBLIC");

  const { user } = useUser();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!user) {
      alert("You must be signed in to create a bot.");
      return;
    }
    const userId = user.id;
    console.log(userId);

    const payload = {
      name: botName,
      description: botDescription,
      prompt: botPrompt,
      visibility: botType,
    };

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/bots/create/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create bot");
      }

      const data = await response.json();
      console.log("Bot created:", data);
      alert("Bot created successfully!");
      setBotName("");
      setBotDescription("");
      setBotPrompt("");
      setBotType("free");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create bot. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Create Custom Bot</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 rounded-lg p-6 space-y-6"
      >
        <div>
          <label
            htmlFor="botName"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Bot Name
          </label>
          <input
            type="text"
            id="botName"
            value={botName}
            onChange={(e) => setBotName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="botDescription"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Bot Description
          </label>
          <textarea
            id="botDescription"
            value={botDescription}
            onChange={(e) => setBotDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>

        <div>
          <label
            htmlFor="botPersonality"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Prompt
          </label>
          <input
            type="text"
            id="botPersonality"
            value={botPrompt}
            onChange={(e) => setBotPrompt(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Friendly, Professional, Humorous"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Bot Type
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="PUBLIC"
                checked={botType === "PUBLIC"}
                onChange={() => setBotType("PUBLIC")}
                className="form-radio text-blue-600"
              />
              <span className="ml-2 text-white">Free</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="PRIVATE"
                checked={botType === "PRIVATE"}
                onChange={() => setBotType("PRIVATE")}
                className="form-radio text-blue-600"
              />
              <span className="ml-2 text-white">Premium</span>
            </label>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Create Bot
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCustomBotPage;
