"use client";

import React, { useState, useEffect } from "react";

const ApodVsAiPage = () => {
  const [apod, setApod] = useState(null); // Store APOD metadata
  const [aiData, setAiData] = useState(null); // Store AI image and metadata
  const [loading, setLoading] = useState(true); // Handle loading state
  const [error, setError] = useState(null); // Handle error state
  const [selectedImage, setSelectedImage] = useState(null); // Track selected image (apod or ai)
  const [showFullDescription, setShowFullDescription] = useState(false); // Toggle full description
  const [result, setResult] = useState(null); // Store result of the user's guess
  const [imagesOrder, setImagesOrder] = useState([]); // To randomize image order

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

        // Randomize image order
        const randomizedOrder =
          Math.random() > 0.5 ? ["apod", "ai"] : ["ai", "apod"];
        setImagesOrder(randomizedOrder);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApodAndAiImage();
  }, []);

  // Cap description to 200 words
  const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  // Handle the user's guess and show the result
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

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <h1 className="text-4xl font-bold text-center">
        Today's NASA or Not Mission
      </h1>
      <h3 className="text-xl font-semibold text-center">
        Can you distinguish between reality and AI in the vastness of space?
      </h3>
      <p className="max-w-md text-lg text-center">
        Simply select which image you believe is the real NASA photo, then hit
        submit to test your skills. Good luck, space explorer!
      </p>

      {result && (
        <div className="p-4 text-lg font-bold text-center text-black bg-gray-100 border-2 border-gray-200 rounded-lg shadow-lg">
          {result}
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => window.location.reload()}
              className="p-2 text-white transition-all bg-green-500 border-2 rounded-xl hover:bg-green-600"
            >
              Play Again
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="p-2 text-white transition-all bg-blue-500 border-2 rounded-xl hover:bg-blue-600"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}

      {!result && (
        <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
          {imagesOrder.map((imageType) => (
            <div
              key={imageType}
              className={`flex flex-col gap-4 p-6 border-2 rounded-xl w-full max-w-sm transition-all ${
                selectedImage === imageType
                  ? "border-blue-500 bg-white text-black shadow-lg"
                  : "border-gray-200 bg-gray-900"
              } ${
                selectedImage === null
                  ? "hover:bg-gray-800 hover:text-white"
                  : ""
              } cursor-pointer`}
              onClick={() => setSelectedImage(imageType)}
            >
              {imageType === "apod" && (
                <>
                  <img
                    src={apod.url}
                    alt={apod.title}
                    className="object-cover w-full h-auto rounded-lg"
                  />
                  <p className="text-sm">
                    {truncateText(apod.explanation, 50)}
                  </p>
                  {!showFullDescription && (
                    <button
                      onClick={() => setShowFullDescription(true)}
                      className="text-blue-500 underline"
                    >
                      More
                    </button>
                  )}
                  {showFullDescription && <p>{apod.explanation}</p>}
                </>
              )}
              {imageType === "ai" && (
                <>
                  <img
                    src={aiData.imageUrl}
                    alt={aiData.title}
                    className="object-cover w-full h-auto rounded-lg"
                  />
                  <p className="text-sm">
                    {truncateText(aiData.description, 50)}
                  </p>
                  {!showFullDescription && (
                    <button
                      onClick={() => setShowFullDescription(true)}
                      className="text-blue-500 underline"
                    >
                      More
                    </button>
                  )}
                  {showFullDescription && <p>{aiData.description}</p>}
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Submit Button */}
      {!result && (
        <div className="mt-4">
          <button
            onClick={handleSubmit}
            disabled={!selectedImage}
            className={`p-3 border-2 rounded-xl text-white ${
              selectedImage
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-400 cursor-not-allowed"
            } transition-all`}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default ApodVsAiPage;
