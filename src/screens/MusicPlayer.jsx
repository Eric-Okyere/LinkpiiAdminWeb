import React, { useState } from "react";

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Handlers for play/pause and skipping
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const skipBackward = () => {
    console.log("Skipping backward...");
  };

  const skipForward = () => {
    console.log("Skipping forward...");
  };

  return (
    <div className="flex items-center justify-between w-full px-4 mb-4">
      {/* Skip Backward */}
      <button
        className="w-10 h-10 flex justify-center items-center bg-gray-200 rounded-full hover:bg-gray-300"
        onClick={skipBackward}
        style={{ backgroundColor: "lightgray" }} // Debugging background
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 9V5l-7 7 7 7v-4h11V9H10z"
          />
        </svg>
      </button>

      {/* Play/Pause */}
      <button
        className="w-12 h-12 flex justify-center items-center bg-gray-200 rounded-full hover:bg-gray-300"
        onClick={togglePlayPause}
        style={{ backgroundColor: "lightblue" }} // Debugging background
      >
        {isPlaying ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        )}
      </button>

      {/* Skip Forward */}
      <button
        className="w-10 h-10 flex justify-center items-center bg-gray-200 rounded-full hover:bg-gray-300"
        onClick={skipForward}
        style={{ backgroundColor: "lightcoral" }} // Debugging background
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M14 5v4h11v6H14v4l-7-7 7-7z"
          />
        </svg>
      </button>
    </div>
  );
};

export default AudioPlayer;
