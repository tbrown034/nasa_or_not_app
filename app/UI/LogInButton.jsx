"use client";
import React from "react";
import Link from "next/link";

const LoginButton = () => {
  return (
    <div>
      <Link
        href="/admin"
        className="p-2 border-2 rounded-xl hover:bg-white hover:text-blue-800 active:bg-blue-800 active:text-white"
      >
        Admin
      </Link>
    </div>
  );
};

export default LoginButton;
