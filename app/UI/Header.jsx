import React from "react";

import Link from "next/link";
import LoginButton from "./LogInButton";
const Header = () => {
  return (
    <nav className="flex items-center justify-between py-4">
      <Link
        href="/"
        className="text-2xl font-bold text-white hover:text-gray-400"
      >
        NASA or Not
      </Link>
      <div className="hidden gap-4 text-white sm:flex">
        <Link href="/game" className="transition hover:text-gray-400">
          Play Now
        </Link>
        <Link
          href="https://apod.nasa.gov/apod/archivepix.html"
          className="transition hover:text-gray-400"
        >
          NASA Picture of the Day Archive
        </Link>
        <Link href="/about" className="transition hover:text-gray-400">
          About
        </Link>
      </div>
      <div className="hidden sm:flex">
        <LoginButton />
      </div>
      <div className="flex p-2 border-2 rounded-xl hover:bg-white hover:text-blue-800 active:bg-blue-800 active:text-white sm:hidden">
        Admin
      </div>
    </nav>
  );
};

export default Header;
