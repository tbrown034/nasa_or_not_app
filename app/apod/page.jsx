"use client";

import React, { useState, useEffect } from "react";

const Page = () => {
  const [apod, setApod] = useState(null); // State for storing APOD data
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling
  const [showFullExplanation, setShowFullExplanation] = useState(false); // State for showing full explanation

  useEffect(() => {
    const fetchApod = async () => {
      try {
        setLoading(true); // Set loading state to true at the start

        // Fetch the APOD data from the backend API
        const response = await fetch("/api/nasa/");

        // Check if the response is okay (status 200-299)
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setApod(data); // Update the state with the fetched data
      } catch (error) {
        setError(error.message); // Store the error message in state
      } finally {
        setLoading(false); // Set loading to false after fetch is done
      }
    };

    fetchApod(); // Call the function to fetch the APOD data
  }, []); // Empty dependency array ensures this effect runs once on mount

  const handleToggleExplanation = () => {
    setShowFullExplanation(!showFullExplanation);
  };

  const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return text;
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 text-white bg-gray-900">
      <h1 className="mb-6 text-4xl font-bold text-center">
        NASA Picture of the Day
      </h1>
      {loading && <p className="text-lg">Loading...</p>}{" "}
      {/* Show loading message while data is being fetched */}
      {error && <p className="text-lg text-red-500">Error: {error}</p>}{" "}
      {/* Display error message if there is one */}
      {!loading &&
        !error &&
        apod && ( // Only display data if not loading, no error, and data exists
          <div className="flex flex-col items-center max-w-screen-md gap-6 p-6 border-2 border-gray-700 rounded-xl">
            <h2 className="text-2xl font-semibold text-center">{apod.title}</h2>
            <img
              className="object-contain w-full rounded-lg shadow-lg max-h-96"
              src={apod.url}
              alt={apod.title}
            />
            <div className="text-lg text-justify">
              <p>
                {showFullExplanation
                  ? apod.explanation
                  : truncateText(apod.explanation, 50)}
              </p>
              <button
                onClick={handleToggleExplanation}
                className="mt-4 text-blue-500 hover:underline"
              >
                {showFullExplanation ? "Show Less" : "Read More"}
              </button>
            </div>
            {apod.copyright && (
              <p className="text-sm italic text-gray-400">© {apod.copyright}</p>
            )}
          </div>
        )}
    </div>
  );
};

export default Page;
