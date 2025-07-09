"use client";

import { useState, useRef, useEffect } from "react";
import { UserProfile } from "@clerk/nextjs";

export default function EditProfileSection() {
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfile(false);
      }
    }

    if (showProfile) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfile]);

  return (
    <div>
      <button
        onClick={() => setShowProfile(true)}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
      >
        Edit Profile
      </button>

      {showProfile && (
        <div
          ref={profileRef}
          className="mt-6 bg-white rounded shadow-lg p-4"
        >
          <UserProfile />
        </div>
      )}
    </div>
  );
}
