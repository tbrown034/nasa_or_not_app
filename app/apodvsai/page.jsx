"use client";

import React, { useState, useEffect } from "react";

const ApodVsAiPage = () => {
  const [apod, setApod] = useState(null); // Store APOD metadata
  const [aiData, setAiData] = useState(null); // Store AI image and metadata
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        {/* Display the Real APOD */}
        <div className="flex flex-col gap-4 p-4 border-2 border-white rounded-xl ">
          <h2>NASA Picture of the Day</h2>
          <h3>{apod.title}</h3>
          <img src={apod.url} alt={apod.title} />

          <p>{apod.explanation}</p>
          {apod.copyright && <p>Copyright: {apod.copyright}</p>}
        </div>

        {/* Display the AI-generated Image with the same metadata */}
        <div className="flex flex-col gap-4 p-4 border-2 border-white rounded-xl">
          <h2>AI-Generated Image</h2>
          {aiData && (
            <>
              <h3>{aiData.title}</h3>

              <img src={aiData.imageUrl} alt={aiData.title} />
              <p>{aiData.description}</p>
              {aiData.copyright && <p>Copyright: {aiData.copyright}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApodVsAiPage;
