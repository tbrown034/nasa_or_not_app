"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const RandomApodVsAiPage = () => {
  const [apod, setApod] = useState(null);
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [result, setResult] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchRandomApodAndAiImage = async () => {
      try {
        setApod(null);
        setAiData(null);
        setLoading(true);
        setError(null);

        // Fetch a random APOD using the NASA API
        const apodResponse = await fetch("/api/nasa?count=1");
        if (!apodResponse.ok) {
          throw new Error(
            `Error fetching random APOD: ${apodResponse.statusText}`
          );
        }
        const apodData = (await apodResponse.json())[0]; // Get the first item from the array
        setApod(apodData);

        // Send the APOD metadata to the DALL·E endpoint to generate the AI image
        const aiResponse = await fetch("/api/dalle", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ metadata: apodData }),
        });

        if (!aiResponse.ok) {
          throw new Error("Failed to generate AI image");
        }

        const aiData = await aiResponse.json();
        setAiData(aiData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomApodAndAiImage();
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

  const handleSaveToDatabase = async () => {
    try {
      setSaveError(null);
      setSaveSuccess(false);

      const response = await fetch("/api/database", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nasaData: apod,
          aiData: { imageUrl: aiData.imageUrl },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save data to the database");
      }

      setSaveSuccess(true);
    } catch (error) {
      setSaveError(error.message);
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;

  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  if (!apod || !aiData)
    return (
      <p className="text-center">
        Failed to load images. Please try again later.
      </p>
    );

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-4xl font-bold text-center">
        Random NASA or Not Challenge
      </h1>
      <h3 className="text-xl font-semibold text-center">
        Can you distinguish between reality and AI in the vastness of space?
      </h3>

      {/* Display APOD info */}
      <div className="mt-4 text-center">
        <h3 className="text-2xl font-bold">{apod.title}</h3>
        <p className="text-lg">{new Date(apod.date).toLocaleDateString()}</p>
        <p className="text-md">{apod.explanation.substring(0, 200)}...</p>
        {apod.copyright && <p className="italic">© {apod.copyright}</p>}
      </div>

      {/* Image selection */}
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

      {/* Save to Database button */}
      <button
        onClick={handleSaveToDatabase}
        className="p-2 mt-4 text-white bg-green-600 border-2 border-green-600 rounded-xl hover:bg-green-500 active:bg-green-400"
        disabled={saveSuccess}
      >
        {saveSuccess ? "Saved to Database" : "Save to Database"}
      </button>

      {/* Save Error Display */}
      {saveError && (
        <p className="text-center text-red-500">Error: {saveError}</p>
      )}
    </div>
  );
};

export default RandomApodVsAiPage;
