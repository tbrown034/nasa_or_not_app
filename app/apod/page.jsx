"use client";

import React, { useState, useEffect } from "react";

const Page = () => {
  const [apod, setApod] = useState(null); // State for storing APOD data
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling

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

  return (
    <div className="flex flex-col gap-4 ">
      <h1>NASA Picutre of the Day</h1>
      {loading && <p>Loading...</p>}{" "}
      {/* Show loading message while data is being fetched */}
      {error && <p>Error: {error}</p>}{" "}
      {/* Display error message if there is one */}
      {!loading &&
        !error &&
        apod && ( // Only display data if not loading, no error, and data exists
          <div className="flex flex-col gap-4 p-4 border-2 border-white rounded-xl">
            <h2>{apod.data.title}</h2>
            <img
              className="w-40 h-40"
              src={apod.data.url}
              alt={apod.data.title}
            />
            <p>{apod.data.explanation}</p>
            <p>{apod.data.copyright}</p>
          </div>
        )}
    </div>
  );
};

export default Page;
