"use client";
import React, { useEffect, useState } from "react";

const Footer = () => {
  const [year, setYear] = useState(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  if (!year) return null; // Avoid rendering until the year is set on the client

  return (
    <footer className="text-white">
      <div className="flex justify-center">
        <p>&copy; {year}</p>
      </div>
    </footer>
  );
};

export default Footer;
