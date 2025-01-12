import React from 'react';
import YouTube from 'react-youtube'; // If you want to use react-youtube

const YouTubeApp = ({ videoId }) => {
  // Options for the YouTube player
  const opts = {
    height: '470', // Default height (adjusted for responsiveness)
    width: '760',  // Default width (adjusted for responsiveness)
    playerVars: {
      autoplay: 0, // Disable autoplay by default
    },
  };

  return (
    <div className="w-full aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden shadow-lg">
      {videoId ? (
        <YouTube videoId={videoId} opts={opts} className="w-full h-full" />
      ) : (
        <div className="flex items-center justify-center h-full text-white">
          <p>No video selected</p>
        </div>
      )}
    </div>
  );
};

export default YouTubeApp;
