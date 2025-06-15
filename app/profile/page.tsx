import React from "react";
import {
  User,
  CreditCard,
  MessageSquare,
  Bot,
  Settings,
  PlusCircle,
} from "lucide-react";

const ProfileSection = ({ icon, title, children }) => (
  <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
    {" "}
    {/* Changed to dark background */}
    <div className="flex items-center mb-4">
      {icon}
      <h2 className="text-xl font-semibold ml-2 text-white">{title}</h2>{" "}
      {/* White text for section title */}
    </div>
    {children}
  </div>
);

const ProfilePage = () => {
  // Placeholder data - replace with actual user data in a real application
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    credits: 100,
    totalChats: 25,
    favoriteBots: ["Assistant Bot", "Creative Writer", "Code Helper"],
  };

  return (
    <div className="p-8 max-w-6xl mx-auto bg-gray-900">
      {" "}
      {/* Dark background for the entire page */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Your Profile</h1>{" "}
        {/* White text for the main title */}
        <p className="text-xl text-gray-300">
          Manage your account and view your Instant Bots activity
        </p>{" "}
        {/* Light gray for subtitle */}
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ProfileSection
            icon={<User size={24} className="text-blue-500" />}
            title="Account Information"
          >
            <p className="text-white">
              <strong>Name:</strong> {user.name}
            </p>{" "}
            {/* White text for details */}
            <p className="text-white">
              <strong>Email:</strong> {user.email}
            </p>
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
              Edit Profile
            </button>
          </ProfileSection>

          <ProfileSection
            icon={<MessageSquare size={24} className="text-green-500" />}
            title="Chat Activity"
          >
            <p className="text-white">
              You've had {user.totalChats} conversations with our bots.
            </p>{" "}
            {/* White text for details */}
            <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300">
              View Chat History
            </button>
          </ProfileSection>

          <ProfileSection
            icon={<Bot size={24} className="text-purple-500" />}
            title="Favorite Bots"
          >
            <ul className="list-disc list-inside text-white">
              {" "}
              {/* White text for list */}
              {user.favoriteBots.map((bot, index) => (
                <li key={index}>{bot}</li>
              ))}
            </ul>
            <button className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition duration-300">
              Manage Favorites
            </button>
          </ProfileSection>
        </div>

        <div>
          <ProfileSection
            icon={<CreditCard size={24} className="text-yellow-500" />}
            title="Credits"
          >
            <p className="text-3xl font-bold text-center my-4 text-white">
              {user.credits}
            </p>{" "}
            {/* White text for credits */}
            <button className="w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition duration-300">
              Buy More Credits
            </button>
          </ProfileSection>

          <ProfileSection
            icon={<PlusCircle size={24} className="text-indigo-500" />}
            title="Custom Bots"
          >
            <p className="text-white">Create your own AI companion!</p>{" "}
            {/* White text for description */}
            <button className="mt-4 w-full bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition duration-300">
              Create Custom Bot
            </button>
          </ProfileSection>

          <ProfileSection
            icon={<Settings size={24} className="text-gray-500" />}
            title="Settings"
          >
            <button className="w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300">
              Manage Settings
            </button>
          </ProfileSection>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
