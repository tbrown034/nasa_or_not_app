"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const DailyGamePage = () => {
  const [apodData, setApodData] = useState(null); // Store APOD metadata
  const [aiData, setAiData] = useState(null); // Store AI image and metadata
  const [loading, setLoading] = useState(true); // Handle loading state
  const [error, setError] = useState(null); // Handle error state
  const [selectedImage, setSelectedImage] = useState(null); // Track selected image
  const [result, setResult] = useState(null); // Track result

  useEffect(() => {
    const fetchDailyPair = async () => {
      try {
        setLoading(true);

        // Step 1: Check if today's pair exists in the database
        const response = await fetch("/api/checkDailyPair");
        const data = await response.json();

        if (data.exists) {
          // Step 2: If pair exists, set it from the database
          setApodData(data.nasaApod);
          setAiData(data.aiApod);
        } else {
          // Step 3: If pair doesn't exist, fetch today's APOD and generate AI image
          const apodResponse = await fetch("/api/nasa");
          if (!apodResponse.ok) {
            throw new Error("Error fetching today's APOD");
          }
          const apodData = await apodResponse.json();

          // Generate AI image using DALL·E
          const aiResponse = await fetch("/api/dalle", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ metadata: apodData }),
          });
          if (!aiResponse.ok) {
            throw new Error("Error generating AI image");
          }
          const aiData = await aiResponse.json();

          // Step 4: Store both in the database as a transaction
          const storeResponse = await fetch("/api/storeDailyPair", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ nasaApod: apodData, aiApod: aiData }),
          });

          if (!storeResponse.ok) {
            throw new Error(
              "Error storing the APOD and AI pair in the database"
            );
          }

          // Step 5: Retry step 1 by setting the data
          setApodData(apodData);
          setAiData(aiData);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyPair();
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

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  const images = [
    { type: "apod", url: apodData.url },
    { type: "ai", url: aiData.imageUrl },
  ];

  // Randomly shuffle the order of images
  const shuffledImages = images.sort(() => Math.random() - 0.5);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-4xl font-bold text-center">Daily NASA or Not Game</h1>
      <h3 className="text-xl font-semibold text-center">
        Can you distinguish between reality and AI in the vastness of space?
      </h3>

      <div className="mt-4 text-center">
        <h3 className="text-2xl font-bold">{apodData.title}</h3>
        <p className="text-lg">
          {new Date(apodData.date).toLocaleDateString()}
        </p>
        <p className="text-md">
          {apodData.description.length > 200
            ? apodData.description.substring(0, 200) + "... More"
            : apodData.description}
        </p>
        {apodData.copyright && <p className="italic">© {apodData.copyright}</p>}
      </div>

      {!result ? (
        <div className="flex flex-col items-center justify-center gap-4 mt-4 sm:flex-row">
          {shuffledImages.map((image) => (
            <div
              key={image.type}
              className={`cursor-pointer border-4 rounded-xl hover:bg-gray-100 hover:border-gray-400 ${
                selectedImage === image.type ? "bg-white border-blue-500" : ""
              }`}
              onClick={() => handleImageSelect(image.type)}
            >
              <div className="overflow-hidden w-80 h-80">
                <img
                  src={image.url}
                  alt={image.type === "apod" ? "NASA APOD" : "AI Generated"}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center mt-4">
          <p className="mb-4 text-lg font-bold text-center">{result}</p>
          <div className="flex gap-4">
            <Link href="/" className="btn-primary">
              Back to Home
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Play Again
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

export default DailyGamePage;
