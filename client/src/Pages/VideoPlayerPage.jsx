import React, { useEffect, useState } from "react";
import YouTubeApp from "../Components/YoutubeApp.jsx";
import AddNotes from "../Components/forms/AddNotes";
import { useParams } from "react-router-dom";
import { getChaptersById } from "../Api/chapters.js";
import { extractVideoId } from "../Constants/index.js";

const VideoPlayerPage = () => {
  const { chapterId } = useParams(); // Get chapter ID from URL params
  const [videoId, setVideoId] = useState("");
  const [chapter, setChapter] = useState(null); // Initialize as null to check loading state

  // Function to fetch chapter data
  const fetchChapter = async () => {
    try {
      const chapterData = await getChaptersById(chapterId); // Fetch chapter data
      setChapter(chapterData);
      if (chapterData.video_link) {
        const videoId = extractVideoId(chapterData.video_link); // Extract video ID
        setVideoId(videoId);
      }
    } catch (error) {
      console.error("Error fetching chapter data:", error);
    }
  };

  useEffect(() => {
    fetchChapter(); // Fetch chapter when component mounts or chapterId changes
  }, [chapterId]);

  // Return loading state while waiting for data
  if (!chapter) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Chapter Title and Description */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold">{chapter.title}</h1>
          <p className="text-lg text-gray-300 mt-2">{chapter.description}</p>
        </div>

        {/* Main Content: Video Player and Notes */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Video Player Section */}
          <div className="lg:w-2/3 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Video Player</h2>
            <YouTubeApp videoId={videoId} />
          </div>

          {/* Notes Section */}
          <div className="lg:w-1/3 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Add Notes</h2>
            <AddNotes journeyId={chapter.journey_id} chapterId={chapter.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerPage;
