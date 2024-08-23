"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const ApodVsAiPage = () => {
  const [apod, setApod] = useState(null); // Store APOD metadata
  const [aiData, setAiData] = useState(null); // Store AI image and metadata
  const [loading, setLoading] = useState(true); // Handle loading state
  const [error, setError] = useState(null); // Handle error state
  const [selectedImage, setSelectedImage] = useState(null); // Track selected image
  const [result, setResult] = useState(null); // Track result
  const [showFullDescription, setShowFullDescription] = useState(false); // Toggle for full description

  useEffect(() => {
    const fetchApodAndAiImage = async () => {
      try {
        setLoading(true);

        // Fetch today's APOD using the NASA route
        const apodResponse = await fetch("/api/nasa");
        if (!apodResponse.ok) {
          throw new Error(`Error: ${apodResponse.statusText}`);
        }
        const apodData = await apodResponse.json();
        setApod(apodData); // Set APOD data

        // Send the APOD metadata to the DALL·E endpoint to generate the AI image
        const aiResponse = await fetch("/api/dalle", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ metadata: apodData }), // Send metadata from APOD
        });
        if (!aiResponse.ok) {
          throw new Error("Failed to generate AI image");
        }

        const aiData = await aiResponse.json();
        setAiData(aiData); // Set AI data (includes imageUrl and metadata)
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApodAndAiImage();
  }, []);

  const handleImageSelect = (choice) => {
    setSelectedImage(choice);
  };

  const handleSubmit = () => {
    if (selectedImage === "apod") {
      setResult("Correct! That's the real NASA Picture of the Day.");
    } else if (selectedImage === "ai") {
      setResult(
        "Incorrect. That's the AI-generated image. AI is getting cleverer!"
      );
    }
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-4xl font-bold text-center">
        Today's NASA or Not Mission
      </h1>
      <h3 className="text-xl font-semibold text-center">
        Can you distinguish between reality and AI in the vastness of space?
      </h3>

      <div className="mt-4 text-center">
        <h3 className="text-2xl font-bold">{apod.title}</h3>
        <p className="text-lg">{new Date(apod.date).toLocaleDateString()}</p>
        <p className="text-md">
          {showFullDescription
            ? apod.explanation
            : apod.explanation.substring(0, 200) + "..."}
          <button
            onClick={toggleDescription}
            className="ml-2 text-blue-500 hover:underline"
          >
            {showFullDescription ? "Show Less" : "More"}
          </button>
        </p>
        {apod.copyright && <p className="italic">© {apod.copyright}</p>}
      </div>

      {!result ? (
        <div className="flex flex-col items-center justify-center gap-4 mt-4 sm:flex-row">
          <div
            className={`cursor-pointer border-4 rounded-xl hover:bg-gray-100 hover:border-gray-400 ${
              selectedImage === "apod" ? "bg-white border-blue-500" : ""
            }`}
            onClick={() => handleImageSelect("apod")}
          >
            <div className="overflow-hidden w-80 h-80">
              <img
                src={apod.url}
                alt={apod.title}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          <div
            className={`cursor-pointer border-4 rounded-xl hover:bg-gray-100 hover:border-gray-400 ${
              selectedImage === "ai" ? "bg-white border-blue-500" : ""
            }`}
            onClick={() => handleImageSelect("ai")}
          >
            <div className="overflow-hidden w-80 h-80">
              <img
                src={aiData.imageUrl}
                alt={aiData.title}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center mt-4">
          <p className="mb-4 text-lg font-bold text-center">{result}</p>
          <div className="flex gap-4">
            <Link
              href="/"
              className="p-2 text-white bg-blue-600 border-2 border-blue-600 rounded-xl hover:bg-blue-500 active:bg-blue-400"
            >
              Back to Home
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="p-2 text-white bg-blue-600 border-2 border-blue-600 rounded-xl hover:bg-blue-500 active:bg-blue-400"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {!result && (
        <button
          onClick={handleSubmit}
          className="p-2 mt-4 text-white bg-blue-600 border-2 border-blue-600 rounded-xl hover:bg-blue-500 active:bg-blue-400"
          disabled={!selectedImage}
        >
          Submit
        </button>
      )}
    </div>
  );
};

export default ApodVsAiPage;
