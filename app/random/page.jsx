"use client";

import React, { useState, useEffect } from "react";

const RandomPage = () => {
  const [randomApods, setRandomApods] = useState([]); // State for storing random APODs
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling

  // Function to fetch random APODs based on the 'count'
  const fetchRandomApods = async (count = 1) => {
    try {
      setLoading(true); // Set loading state to true at the start

      // Fetch random APODs using the 'count' parameter
      const response = await fetch(`/api/nasa?count=${count}`);

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setRandomApods(data); // Update the state with the fetched random APODs
    } catch (error) {
      setError(error.message); // Store the error message in state
    } finally {
      setLoading(false); // Set loading to false after fetch is done
    }
  };

  // Load one random APOD on mount by default
  useEffect(() => {
    fetchRandomApods(1);
  }, []); // Empty dependency array ensures this effect runs once on mount

  return (
    <div className="flex flex-col gap-4">
      <h1>Random NASA Pictures of the Day</h1>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      {/* Display the random APODs */}
      {!loading &&
        !error &&
        randomApods.length > 0 &&
        randomApods.map((randomApod, index) => (
          <div
            key={index}
            className="flex flex-col gap-4 p-4 border-2 border-white rounded-xl"
          >
            <h2>{randomApod.title}</h2>
            <img
              className="w-40 h-40"
              src={randomApod.url}
              alt={randomApod.title}
            />
            <p>{randomApod.explanation}</p>
            <p>{randomApod.copyright}</p>
          </div>
        ))}

      {/* Buttons to load random APODs */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => fetchRandomApods(1)}
          className="p-2 border-2 rounded-xl hover:bg-white hover:text-blue-800 active:bg-blue-800 active:text-white"
        >
          Another Random Image
        </button>
        <button
          onClick={() => fetchRandomApods(2)}
          className="p-2 border-2 rounded-xl hover:bg-white hover:text-blue-800 active:bg-blue-800 active:text-white"
        >
          Two Random Images
        </button>
        <button
          onClick={() => fetchRandomApods(3)}
          className="p-2 border-2 rounded-xl hover:bg-white hover:text-blue-800 active:bg-blue-800 active:text-white"
        >
          Three Random Images
        </button>
      </div>
    </div>
  );
};

export default RandomPage;
