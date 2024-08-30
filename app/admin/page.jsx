"use client";

import React, { useState, useEffect } from "react";

const AdminPage = () => {
  const [nasaApods, setNasaApods] = useState([]);
  const [aiApods, setAiApods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(""); // State for filtering
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "ascending",
  }); // State for sorting

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const nasaResponse = await fetch("/api/database?nasa_apod=true");
        if (!nasaResponse.ok) {
          throw new Error("Failed to fetch NASA APODs");
        }
        const nasaData = await nasaResponse.json();
        setNasaApods(nasaData);

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

  // Handle delete operation
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/database?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the image pair");
      }

      setNasaApods(nasaApods.filter((apod) => apod.id !== id));
      setAiApods(aiApods.filter((aiApod) => aiApod.id !== id));
    } catch (error) {
      setError(error.message);
    }
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

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? " ↑" : " ↓";
    }
    return null;
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = (data) => {
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  };

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
                {[
                  "id",
                  "title",
                  "explanation",
                  "date",
                  "url",
                  "copyright",
                  "date_time_added",
                ].map((key) => (
                  <th
                    key={key}
                    className="px-4 py-3 text-left border-b border-gray-700 border-dotted cursor-pointer hover:bg-gray-600"
                    onClick={() => handleSort(key)}
                  >
                    {key.charAt(0).toUpperCase() +
                      key.slice(1).replace("_", " ")}{" "}
                    {getSortIndicator(key)}
                  </th>
                ))}
                <th className="px-4 py-3 text-left border-b border-gray-700 border-dotted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData(filteredNasaApods).map((apod) => (
                <tr
                  key={apod.id}
                  className="transition-colors hover:bg-gray-700"
                >
                  <td className="px-4 py-3 text-left border-b border-gray-700 border-dotted">
                    {apod.id}
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
                  <td className="px-4 py-3 text-left border-b border-gray-700 border-dotted">
                    <button
                      onClick={() => handleDelete(apod.id)}
                      className="px-2 py-1 text-red-600 border border-red-600 rounded hover:bg-red-600 hover:text-white"
                    >
                      Delete
                    </button>
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
                {[
                  "id", // Retained 'id' here
                  "title",
                  "explanation",
                  "date",
                  "url",
                  "copyright", // Added 'copyright' here
                  "date_time_added",
                ].map((key) => (
                  <th
                    key={key}
                    className="px-4 py-3 text-left border-b border-gray-700 border-dotted cursor-pointer hover:bg-gray-600"
                    onClick={() => handleSort(key)}
                  >
                    {key.charAt(0).toUpperCase() +
                      key.slice(1).replace("_", " ")}{" "}
                    {getSortIndicator(key)}
                  </th>
                ))}
                <th className="px-4 py-3 text-left border-b border-gray-700 border-dotted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData(filteredAiApods).map((aiApod) => (
                <tr
                  key={aiApod.id} // Using 'id' as the key
                  className="transition-colors hover:bg-gray-700"
                >
                  <td className="px-4 py-3 text-left border-b border-gray-700 border-dotted">
                    {aiApod.id} {/* Displaying 'id' */}
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
                    {aiApod.copyright || "N/A"} {/* Displaying 'copyright' */}
                  </td>
                  <td className="px-4 py-3 text-left border-b border-gray-700 border-dotted">
                    {formatDate(aiApod.date_time_added)}
                  </td>
                  <td className="px-4 py-3 text-left border-b border-gray-700 border-dotted">
                    <button
                      onClick={() => handleDelete(aiApod.id)} // Using 'id' for deletion
                      className="px-2 py-1 text-red-600 border border-red-600 rounded hover:bg-red-600 hover:text-white"
                    >
                      Delete
                    </button>
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
