"use client";

import React, { useState, useEffect } from "react";

const AdminPage = () => {
  const [nasaApods, setNasaApods] = useState([]);
  const [aiApods, setAiApods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(""); // State for filtering
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null }); // State for sorting

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch NASA APODs
        const nasaResponse = await fetch("/api/database?nasa_apod=true");
        if (!nasaResponse.ok) {
          throw new Error("Failed to fetch NASA APODs");
        }
        const nasaData = await nasaResponse.json();
        setNasaApods(nasaData);

        // Fetch AI APODs
        const aiResponse = await fetch("/api/database?ai_apod=true");
        if (!aiResponse.ok) {
          throw new Error("Failed to fetch AI APODs");
        }
        const aiData = await aiResponse.json();
        setAiApods(aiData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle filtering by title or date
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  // Function to format date to MM/DD/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  const filteredNasaApods = nasaApods.filter(
    (apod) =>
      apod.title.toLowerCase().includes(filter.toLowerCase()) ||
      apod.date.includes(filter)
  );

  const filteredAiApods = aiApods.filter(
    (aiApod) =>
      aiApod.title.toLowerCase().includes(filter.toLowerCase()) ||
      aiApod.date.includes(filter)
  );

  // Sorting logic
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? " ^" : " v";
    }
    return null;
  };

  const sortedNasaApods = [...filteredNasaApods].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const sortedAiApods = [...filteredAiApods].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  if (loading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen px-6 py-8 text-white bg-gray-900">
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-center">
        Admin Dashboard
      </h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Filter by title or date..."
          value={filter}
          onChange={handleFilterChange}
          className="w-full p-3 text-black rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* NASA APOD Table */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">NASA APOD Table</h2>
        <div className="overflow-x-auto shadow-lg rounded-xl">
          <table className="min-w-full text-sm text-white bg-gray-800 border-collapse rounded-xl">
            <thead>
              <tr className="bg-gray-700">
                <th
                  className="px-4 py-3 text-left border-b border-gray-700 border-dotted cursor-pointer hover:bg-gray-600"
                  onClick={() => handleSort("id")}
                >
                  ID {getSortIndicator("id")}
                </th>
                <th
                  className="px-4 py-3 text-left border-b border-gray-700 border-dotted cursor-pointer hover:bg-gray-600"
                  onClick={() => handleSort("title")}
                >
                  Title {getSortIndicator("title")}
                </th>
                <th
                  className="px-4 py-3 text-left border-b border-gray-700 border-dotted cursor-pointer hover:bg-gray-600"
                  onClick={() => handleSort("explanation")}
                >
                  Explanation {getSortIndicator("explanation")}
                </th>
                <th
                  className="px-4 py-3 text-left border-b border-gray-700 border-dotted cursor-pointer hover:bg-gray-600"
                  onClick={() => handleSort("date")}
                >
                  Date {getSortIndicator("date")}
                </th>
                <th className="px-4 py-3 text-left border-b border-gray-700 border-dotted">
                  URL
                </th>
                <th
                  className="px-4 py-3 text-left border-b border-gray-700 border-dotted cursor-pointer hover:bg-gray-600"
                  onClick={() => handleSort("copyright")}
                >
                  Copyright {getSortIndicator("copyright")}
                </th>
                <th
                  className="px-4 py-3 text-left border-b border-gray-700 border-dotted cursor-pointer hover:bg-gray-600"
                  onClick={() => handleSort("date_time_added")}
                >
                  Date Added {getSortIndicator("date_time_added")}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedNasaApods.map((apod, index) => (
                <tr
                  key={apod.id}
                  className="transition-colors hover:bg-gray-700"
                >
                  <td className="px-4 py-3 text-left border-b border-gray-700 border-dotted">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 text-left border-b border-gray-700 border-dotted">
                    {apod.title}
                  </td>
                  <td className="px-4 py-3 text-left border-b border-gray-700 border-dotted">
                    {apod.explanation.length > 100
                      ? `${apod.explanation.substring(0, 100)}...`
                      : apod.explanation}
                  </td>
                  <td className="px-4 py-3 text-left border-b border-gray-700 border-dotted">
                    {formatDate(apod.date)}
                  </td>
                  <td className="px-4 py-3 text-left border-b border-gray-700 border-dotted">
                    <a
                      href={apod.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      View Image
                    </a>
                  </td>
                  <td className="px-4 py-3 text-left border-b border-gray-700 border-dotted">
                    {apod.copyright || "NASA"}
                  </td>
                  <td className="px-4 py-3 text-left border-b border-gray-700 border-dotted">
                    {formatDate(apod.date_time_added)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* AI APOD Table */}
      <section>
        <h2 className="mb-4 text-2xl font-semibold">AI APOD Table</h2>
        <div className="overflow-x-auto shadow-lg rounded-xl">
          <table className="min-w-full text-sm text-white bg-gray-800 border-collapse rounded-xl">
            <thead>
              <tr className="bg-gray-700">
                <th
                  className="px-4 py-3 text-left border-b border-gray-700 border-dotted cursor-pointer hover:bg-gray-600"
                  onClick={() => handleSort("id")}
                >
                  ID {getSortIndicator("id")}
                </th>
                <th
                  className="px-4 py-3 text-left border-b border-gray-700 border-dotted cursor-pointer hover:bg-gray-600"
                  onClick={() => handleSort("nasa_apod_id")}
                >
                  NASA APOD ID {getSortIndicator("nasa_apod_id")}
                </th>
                <th
                  className="px-4 py-3 text-left border-b border-gray-700 border-dotted cursor-pointer hover:bg-gray-600"
                  onClick={() => handleSort("title")}
                >
                  Title {getSortIndicator("title")}
                </th>
                <th
                  className="px-4 py-3 text-left border-b border-gray-700 border-dotted cursor-pointer hover:bg-gray-600"
                  onClick={() => handleSort("explanation")}
                >
                  Explanation {getSortIndicator("explanation")}
                </th>
                <th
                  className="px-4 py-3 text-left border-b border-gray-700 border-dotted cursor-pointer hover:bg-gray-600"
                  onClick={() => handleSort("date")}
                >
                  Date {getSortIndicator("date")}
                </th>
                <th className="px-4 py-3 text-left border-b border-gray-700 border-dotted">
                  URL
                </th>
                <th
                  className="px-4 py-3 text-left border-b border-gray-700 border-dotted cursor-pointer hover:bg-gray-600"
                  onClick={() => handleSort("date_time_added")}
                >
                  Date Added {getSortIndicator("date_time_added")}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedAiApods.map((aiApod) => (
                <tr
                  key={aiApod.id}
                  className="transition-colors hover:bg-gray-700"
                >
                  <td className="px-4 py-3 text-left border-b border-gray-700 border-dotted">
                    {aiApod.id}
                  </td>
                  <td className="px-4 py-3 text-left border-b border-gray-700 border-dotted">
                    {aiApod.nasa_apod_id}
                  </td>
                  <td className="px-4 py-3 text-left border-b border-gray-700 border-dotted">
                    {aiApod.title}
                  </td>
                  <td className="px-4 py-3 text-left border-b border-gray-700 border-dotted">
                    {aiApod.explanation.length > 100
                      ? `${aiApod.explanation.substring(0, 100)}...`
                      : aiApod.explanation}
                  </td>
                  <td className="px-4 py-3 text-left border-b border-gray-700 border-dotted">
                    {formatDate(aiApod.date)}
                  </td>
                  <td className="px-4 py-3 text-left border-b border-gray-700 border-dotted">
                    <a
                      href={aiApod.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      View Image
                    </a>
                  </td>
                  <td className="px-4 py-3 text-left border-b border-gray-700 border-dotted">
                    {formatDate(aiApod.date_time_added)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminPage;
