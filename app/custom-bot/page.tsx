"use client";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { AlertCircle, CheckCircle } from "lucide-react";

const CreateCustomBotPage = () => {
  const [botName, setBotName] = useState("");
  const [botDescription, setBotDescription] = useState("");
  const [botPrompt, setBotPrompt] = useState("");
  const [botType, setBotType] = useState("PUBLIC");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" as "success" | "error" });
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast("You must be signed in to create a bot.", "error");
      return;
    }

    setLoading(true);
    
    const payload = {
      name: botName,
      description: botDescription,
      prompt: botPrompt,
      visibility: botType,
    };

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/bots/create/${user.id}`,
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
      showToast("Bot created successfully!", "success");
      resetForm();
    } catch (error) {
      console.error("Error:", error);
      showToast("Failed to create bot. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const resetForm = () => {
    setBotName("");
    setBotDescription("");
    setBotPrompt("");
    setBotType("PUBLIC");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white">Create Custom Bot</h1>
          <p className="mt-2 text-gray-400">Design your unique AI assistant</p>
        </div>

        <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                  placeholder="Enter bot name"
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
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                  placeholder="Describe what your bot does"
                  required
                ></textarea>
              </div>

              <div>
                <label
                  htmlFor="botPrompt"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Bot Personality
                </label>
                <input
                  type="text"
                  id="botPrompt"
                  value={botPrompt}
                  onChange={(e) => setBotPrompt(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                  placeholder="e.g., Friendly, Professional, Humorous"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Bot Type
                </label>
                <div className="flex space-x-6">
                  <label className="flex items-center cursor-pointer">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 ${botType === "PUBLIC" ? "border-blue-500 bg-blue-500" : "border-gray-400"}`}>
                      {botType === "PUBLIC" && <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>
                    <span className="text-white">Public</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 ${botType === "PRIVATE" ? "border-blue-500 bg-blue-500" : "border-gray-400"}`}>
                      {botType === "PRIVATE" && <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>
                    <span className="text-white">Private</span>
                  </label>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-md text-white font-medium transition duration-150 ${
                    loading
                      ? "bg-blue-600 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </span>
                  ) : (
                    "Create Bot"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 max-w-xs bg-white rounded-lg shadow-lg overflow-hidden">
          <div className={`px-4 py-3 flex items-center ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
            {toast.type === "success" ? (
              <CheckCircle className="h-5 w-5 text-white mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 text-white mr-2" />
            )}
            <p className="text-sm font-medium text-white">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCustomBotPage;