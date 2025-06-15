"use client"
import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';

const CreateCustomBotPage = () => {
  const [botName, setBotName] = useState('');
  const [botDescription, setBotDescription] = useState('');
  const [botPersonality, setBotPersonality] = useState('');
  const [botExpertise, setBotExpertise] = useState('');
  const [botAvatar, setBotAvatar] = useState(null);
  const [botType, setBotType] = useState('free');

  const { user } = useUser();

const handleSubmit = async (e) => {
  e.preventDefault();
   if (!user) {
      alert('You must be signed in to create a bot.');
      return;
    }
    const userId = user.id;
    console.log(userId)

  let avatarBase64 = '';
  if (botAvatar) {
    const reader = new FileReader();
    reader.readAsDataURL(botAvatar);
    reader.onloadend = async () => {
      avatarBase64 = reader.result;

      const payload = {
        name: botName,
        description: botDescription,
        prompt: botPersonality, 
        avatar: avatarBase64,
        visibility: botType,
      };

      try {
        const response = await fetch(`http://127.0.0.1:8000/bots/create/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          throw new Error('Failed to create bot');
        }

        const data = await response.json();
        console.log('Bot created:', data);
        alert('Bot created successfully!');
        setBotName('');
        setBotDescription('');
        setBotPersonality('');
        setBotExpertise('');
        setBotAvatar(null);
        setBotType('free');
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to create bot. Please try again.');
      }
    };
    return;
  }
};



  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Create Custom Bot</h1>
      
      <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6 space-y-6">
        <div>
          <label htmlFor="botName" className="block text-sm font-medium text-gray-300 mb-2">
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
          <label htmlFor="botDescription" className="block text-sm font-medium text-gray-300 mb-2">
            Bot Description
          </label>
          <textarea
            id="botDescription"
            value={botDescription}
            onChange={(e) => setBotDescription(e.target.value)}
            rows="3"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>

        <div>
          <label htmlFor="botPersonality" className="block text-sm font-medium text-gray-300 mb-2">
            Bot Personality
          </label>
          <input
            type="text"
            id="botPersonality"
            value={botPersonality}
            onChange={(e) => setBotPersonality(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Friendly, Professional, Humorous"
          />
        </div>

        <div>
          <label htmlFor="botExpertise" className="block text-sm font-medium text-gray-300 mb-2">
            Bot Expertise
          </label>
          <input
            type="text"
            id="botExpertise"
            value={botExpertise}
            onChange={(e) => setBotExpertise(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Programming, Writing, Fitness"
          />
        </div>

        <div>
          <label htmlFor="botAvatar" className="block text-sm font-medium text-gray-300 mb-2">
            Bot Avatar
          </label>
          <input
            type="file"
            id="botAvatar"
            onChange={(e) => setBotAvatar(e.target.files[0])}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            accept="image/*"
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
                value="free"
                checked={botType === 'free'}
                onChange={() => setBotType('free')}
                className="form-radio text-blue-600"
              />
              <span className="ml-2 text-white">Free</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="premium"
                checked={botType === 'premium'}
                onChange={() => setBotType('premium')}
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