"use client";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { AlertCircle, CheckCircle, Upload, X, Image as ImageIcon } from "lucide-react";

const CreateCustomBotPage = () => {
  const [botName, setBotName] = useState("");
  const [botDescription, setBotDescription] = useState("");
  const [botPrompt, setBotPrompt] = useState("");
  const [botType, setBotType] = useState("PUBLIC");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const { user } = useUser();

  const CLOUDINARY_CLOUD_NAME = "dhknifbwu";
  const CLOUDINARY_UPLOAD_PRESET = "ai_chatbots";

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        showToast("Please select a valid image file (JPEG, PNG, GIF, or WebP)", "error");
        return;
      }

      const maxSize = 5 * 1024 * 1024; 
      if (file.size > maxSize) {
        showToast("Image size must be less than 5MB", "error");
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'bot-avatars'); 

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return;

    setImageUploading(true);
    try {
      const imageUrl = await uploadToCloudinary(selectedImage);
      console.log(imageUrl)
      setUploadedImageUrl(imageUrl);
      showToast("Image uploaded successfully!", "success");
    } catch (error) {
      showToast("Failed to upload image. Please try again.", "error");
    } finally {
      setImageUploading(false);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview("");
    setUploadedImageUrl("");
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!user) {
    showToast("You must be signed in to create a bot.", "error");
    return;
  }

  setLoading(true);
  let finalImageUrl = uploadedImageUrl; 

  if (selectedImage && !uploadedImageUrl) {
    setImageUploading(true);
    try {
      const imageUrl = await uploadToCloudinary(selectedImage);
      finalImageUrl = imageUrl; 
      setUploadedImageUrl(imageUrl); 
    } catch (error) {
      showToast("Failed to upload image. Please try again.", "error");
      setImageUploading(false);
      setLoading(false);
      return;
    }
    setImageUploading(false);
  }

  const payload = {
    name: botName,
    description: botDescription,
    prompt: botPrompt,
    visibility: botType,
    avatar: finalImageUrl || null, 
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

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const resetForm = () => {
    setBotName("");
    setBotDescription("");
    setBotPrompt("");
    setBotType("PUBLIC");
    setSelectedImage(null);
    setImagePreview("");
    setUploadedImageUrl("");
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
              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bot Avatar
                </label>
                
                {!imagePreview ? (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer hover:border-gray-500 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-400">
                          <span className="font-medium">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="w-full h-32 bg-gray-700 rounded-lg overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Bot avatar preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    
                    {!uploadedImageUrl && (
                      <button
                        type="button"
                        onClick={handleImageUpload}
                        disabled={imageUploading}
                        className="mt-2 w-full bg-green-600 hover:bg-green-700 disabled:bg-green-600 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center"
                      >
                        {imageUploading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Upload to Cloud
                          </>
                        )}
                      </button>
                    )}
                    
                    {uploadedImageUrl && (
                      <div className="mt-2 text-sm text-green-400 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Image uploaded successfully
                      </div>
                    )}
                  </div>
                )}
              </div>

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
                  Prompt
                </label>
               <textarea
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
                    <input
                      type="radio"
                      name="botType"
                      value="PUBLIC"
                      checked={botType === "PUBLIC"}
                      onChange={(e) => setBotType(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 ${botType === "PUBLIC" ? "border-blue-500 bg-blue-500" : "border-gray-400"}`}>
                      {botType === "PUBLIC" && <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>
                    <span className="text-white">Public</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="botType"
                      value="PRIVATE"
                      checked={botType === "PRIVATE"}
                      onChange={(e) => setBotType(e.target.value)}
                      className="sr-only"
                    />
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
                  disabled={loading || imageUploading}
                  className={`w-full py-3 px-4 rounded-md text-white font-medium transition duration-150 ${
                    loading || imageUploading
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
        <div className="fixed top-4 right-4 max-w-xs bg-white rounded-lg shadow-lg overflow-hidden z-50">
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