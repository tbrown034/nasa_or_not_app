"use client";

import React, { useState, useEffect } from "react";

const PlayPage = () => {
  const [pair, setPair] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [result, setResult] = useState(null);

  const fetchRandomPair = async () => {
    try {
      setLoading(true);
      setError(null);
      setSelectedImage(null);
      setResult(null);

      const response = await fetch("/api/database?random_pair=true");
      if (!response.ok) {
        throw new Error("Failed to fetch a random image pair");
      }

      const data = await response.json();
      setPair(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomPair();
  }, []);

  const handleImageSelect = (choice) => {
    setSelectedImage(choice);
  };

  const handleSubmit = () => {
    if (selectedImage === "nasa") {
      setResult("Correct! That's the real NASA Picture of the Day.");
    } else if (selectedImage === "ai") {
      setResult(
        "Incorrect. That's the AI-generated image. AI is getting cleverer!"
      );
    }
  };

  const handleNext = () => {
    fetchRandomPair(); // Fetch a new random pair when the user clicks "Next"
  };

  if (loading) return <p className="text-center">Loading...</p>;

  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  if (!pair)
    return (
      <p className="text-center">
        Failed to load images. Please try again later.
      </p>
    );

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-4xl font-bold text-center">Play: NASA or AI</h1>
      <h3 className="text-xl font-semibold text-center">
        Can you distinguish between reality and AI in the vastness of space?
      </h3>

      {/* Display image information */}
      <div className="mt-4 text-center">
        <h3 className="text-2xl font-bold">{pair.nasa.title}</h3>
        <p className="text-lg">
          {new Date(pair.nasa.date).toLocaleDateString()}
        </p>
        <p className="text-md">{pair.nasa.explanation.substring(0, 200)}...</p>
        {pair.nasa.copyright && (
          <p className="italic">© {pair.nasa.copyright}</p>
        )}
      </div>

      {/* Image selection */}
      {!result ? (
        <div className="flex flex-col items-center justify-center gap-4 mt-4 sm:flex-row">
          <div
            className={`cursor-pointer border-4 rounded-xl hover:bg-gray-100 hover:border-gray-400 ${
              selectedImage === "nasa" ? "bg-white border-blue-500" : ""
            }`}
            onClick={() => handleImageSelect("nasa")}
          >
            <div className="overflow-hidden w-80 h-80">
              <img
                src={pair.nasa.url}
                alt={pair.nasa.title}
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
                src={pair.ai.url}
                alt={pair.ai.title}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center mt-4">
          <p className="mb-4 text-lg font-bold text-center">{result}</p>
          <div className="flex gap-4">
            <button
              onClick={handleNext}
              className="p-2 text-white bg-blue-600 border-2 border-blue-600 rounded-xl hover:bg-blue-500 active:bg-blue-400"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Submit button */}
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

export default PlayPage;
