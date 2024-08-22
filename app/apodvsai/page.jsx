"use client";

import React, { useState, useEffect } from "react";

const ApodVsAiPage = () => {
  const [apod, setApod] = useState(null);
  const [aiData, setAiData] = useState(null); // Store AI image and metadata
  const [selectedImage, setSelectedImage] = useState(null); // Track selected image
  const [result, setResult] = useState(""); // Store the result of the user's guess
  const [loading, setLoading] = useState(true); // Handle loading state
  const [error, setError] = useState(null); // Handle error state

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
        setApod(apodData);

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

  const handleSelectImage = (image) => {
    setSelectedImage(image);
  };

  const handleSubmit = () => {
    if (selectedImage === "apod") {
      setResult("Correct! That's the real NASA Picture of the Day.");
    } else if (selectedImage === "ai") {
      setResult(
        "Incorrect. That's the AI-generated image. AI is getting cleverer!"
      );
    } else {
      setResult("Please select an image before submitting.");
    }
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

      {/* Display Title, Date, Description, and Copyright */}
      <div className="my-4 text-center">
        <h3 className="text-2xl font-semibold">{apod.title}</h3>
        <p className="text-lg text-gray-300">
          {new Date(apod.date).toLocaleDateString()}
        </p>
        <p className="text-lg">
          {apod.explanation.slice(0, 200)}...{" "}
          <span className="text-blue-400 cursor-pointer">More</span>
        </p>
        {apod.copyright && <p className="text-gray-400">© {apod.copyright}</p>}
      </div>

      {/* Display Images Side by Side with Equal Size */}
      <div className="flex flex-wrap justify-center gap-8">
        <div
          className={`flex flex-col items-center border-4 p-4 rounded-xl ${
            selectedImage === "apod"
              ? "border-blue-400"
              : "hover:border-gray-500"
          }`}
          onClick={() => handleSelectImage("apod")}
        >
          <img
            src={apod.url}
            alt={apod.title}
            className="object-cover rounded-md w-80 h-80"
          />
        </div>

        <div
          className={`flex flex-col items-center border-4 p-4 rounded-xl ${
            selectedImage === "ai" ? "border-blue-400" : "hover:border-gray-500"
          }`}
          onClick={() => handleSelectImage("ai")}
        >
          <img
            src={aiData.imageUrl}
            alt={aiData.title}
            className="object-cover rounded-md w-80 h-80"
          />
        </div>
      </div>

      {/* Instructions Text Below Images */}
      <p className="mt-4 text-lg text-center">
        Simply select which image you believe is the real NASA photo, then hit
        submit to test your skills. Good luck, space explorer!
      </p>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="px-4 py-2 mt-4 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 active:bg-blue-700"
      >
        Submit
      </button>

      {/* Display Result */}
      {result && (
        <div className="p-4 mt-4 text-lg font-bold text-center text-black bg-gray-100 rounded-lg shadow-lg">
          {result}
        </div>
      )}
    </div>
  );
};

export default ApodVsAiPage;
