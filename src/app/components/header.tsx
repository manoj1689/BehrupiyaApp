"use client";

import { CreditButton } from "./creditButton";
import { useSession, signIn, signOut } from "next-auth/react";
import { FaUser } from "react-icons/fa";
import React, { useState } from "react";
import Image from "next/image";
import { Popover, ArrowContainer } from "react-tiny-popover";
import BehrupiyaLogo from "../../../public/images/New/BehrupiyaLogo.png";
import googleLogo from "../../../public/images/New/SignIn.png";
import { div } from "framer-motion/client";

export default function Header() {
  const { data: session } = useSession();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const togglePopover = () => {
    setIsPopoverOpen(!isPopoverOpen);
  };

  return (
    <header className="w-full p-4 flex justify-between items-center shadow-md border-b border-white bg-gradient-to-b from-gray-900 to-black">
      {/* Left: Logo */}
      <div className="flex w-1/3 sm:w-1/6 justify-center items-center">
        <Image
          src={BehrupiyaLogo}
          alt="User Profile"
          className="bg-transparent"
        />
      </div>

      {/* Center: Navigation Links */}
      <div className="hidden md:flex space-x-8 text-white text-sm font-medium justify-center items-center w-4/6">
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
      </div>

      {/* Right: Sign In and Launch App buttons */}
      <div className="flex sm:space-x-4 justify-end sm:justify-center items-center w-2/3 sm:w-1/6">
        <div className="flex flex-row space-x-6 justify-end items-center">
          <div>
            <CreditButton />
          </div>
          <nav className="flex items-center space-x-4">
            {/* Show user profile image or Sign In button */}
            {session ? (
              <Popover
                isOpen={isPopoverOpen}
                positions={["bottom"]}
                content={({ position, childRect, popoverRect }) => (
                  <ArrowContainer
                    position={position}
                    childRect={childRect}
                    popoverRect={popoverRect}
                    arrowColor={"white"}
                    arrowSize={10}
                    arrowStyle={{ opacity: 1 }}
                    className="popover-arrow-container"
                    arrowClassName="popover-arrow"
                  >
                    <div className="bg-white p-4 rounded shadow-lg text-sky-600">
                      {session.user && (
                        <>
                          <span className="block font-medium mb-2">
                            {session.user.name} {/* User's name */}
                          </span>
                          <button
                            onClick={() => signOut()}
                            className="px-4 py-2 bg-red-500 text-white w-full rounded-full hover:bg-red-600"
                          >
                            Logout
                          </button>
                        </>
                      )}
                    </div>
                  </ArrowContainer>
                )}
                onClickOutside={() => setIsPopoverOpen(false)}
              >
                <div onClick={togglePopover} className="cursor-pointer bg-white rounded-full p-2">
                  <FaUser size={20} color="black" />
                </div>
              </Popover>
            ) : (
              <>
                <div></div>
                <div>
                  <button
                    onClick={() => signIn("google")}
                    className="flex  text-white items-center  justify-center"
                  >
                    Sign In
                  </button>
                </div>
                <div>
                  <button className="flex p-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 text-white text-md font-medium  items-center justify-center">
                    Launch App
                  </button>
                </div>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
