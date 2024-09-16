"use client";

import { CreditButton } from "./creditButton";
import { useSession, signIn, signOut } from "next-auth/react";
import React, { useState } from "react";
import Image from "next/image";
import googleLogo from "../../../public/images/New/SignIn.png";

export default function Header() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [demo, setDemo] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setDemo(false);
  };
  return (
    <header className="w-full bg-black py-4 px-8 flex justify-between items-center shadow-md">
      {/* Left: Logo */}
      <div className="text-[#00A7E1] text-2xl font-bold tracking-wide">
        Behrupiya
      </div>

      {/* Center: Navigation Links */}
      <nav className="hidden md:flex space-x-8 text-white text-sm font-medium">
        <a href="#" className="hover:text-gray-300 transition duration-200">
          Blog
        </a>
        <a href="#" className="hover:text-gray-300 transition duration-200">
          Our Products
        </a>
        <a href="#" className="hover:text-gray-300 transition duration-200">
          App Download
        </a>
        <a href="#" className="hover:text-gray-300 transition duration-200">
          Pricing
        </a>
      </nav>

      {/* Right: Sign In and Launch App buttons */}
      <div className="flex items-center space-x-4">
        <div className="hidden lg:flex flex-row basis-1/4 space-x-6 justify-end items-center">
          <nav className="flex items-center space-x-4">
            {/* Show user profile image if logged in */}
            {session ? (
              <>
                {session.user?.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt="User Profile"
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="w-40 h-6 bg-blue-500 rounded-full flex items-center"
              >
                <Image
                  src={googleLogo}
                  alt="Google logo"
                  // Adjusted smaller height
                  className="mr-10"
                />
              </button>
            )}
          </nav>
        </div>
        <CreditButton />
        {/* <button className="bg-[#01AFF4] text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200">
          Launch App
        </button> */}
      </div>
    </header>
  );
}
