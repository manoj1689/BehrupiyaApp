"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { FaUser } from "react-icons/fa";
import React, { useState } from "react";
import Image from "next/image";
import { Popover, ArrowContainer } from "react-tiny-popover";
import BehrupiyaLogo from "../../../public/images/New/BehrupiyaLogo.png";
import CreditButton from "./creditButton";
import { GoTriangleDown } from "react-icons/go";
import Link from "next/link";
export default function Header() {
  const { data: session } = useSession();
  console.log(session);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const togglePopover = () => {
    setIsPopoverOpen(!isPopoverOpen);
  };

  return (
    <header className="w-full  py-4  flex justify-between items-center shadow-md border-b border-white bg-gradient-to-b from-gray-900 to-black">
      {/* Left: Logo */}
      <div className="flex w-2/5  sm:w-1/3 px-4  md:w-1/5 justify-center items-center">
        <Link href="/" passHref>
          <Image
            src={BehrupiyaLogo}
            alt="User Profile"
            className="bg-transparent"
          />
        </Link>
      </div>

      {/* Center: Navigation Links */}
      <div className="hidden md:flex  text-white text-sm font-medium justify-center gap-5 lg:gap-8 items-center w-3/5">
        <Link href="/blog" passHref>
          <span className="hover:text-gray-300 font-raleway font-bold transition duration-200 cursor-pointer">
            Blog
          </span>
        </Link>
        <a
          href="#"
          className="hover:text-gray-300 font-raleway font-bold transition duration-200"
        >
          Our Products
        </a>
        <a
          href="#"
          className="hover:text-gray-300 font-raleway font-bold transition duration-200"
        >
          App Download
        </a>
        <a
          href="#"
          className="hover:text-gray-300 font-raleway font-bold transition duration-200"
        >
          Pricing
        </a>
      </div>

      {/* Right: Sign In and Launch App buttons */}
      <div className="flex  justify-center  items-center w-3/5 sm:w-2/3  md:w-1/5">
        <div className="flex justify-center items-center gap-2 sm:gap-5 ">
          {session ? (
            <>
              <div className="">
                <CreditButton />
              </div>
            </>
          ) : (
            ""
          )}

          <nav className="flex justify-center items-center space-x-4 ">
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
                    className="popover-arrow-container mt-4 "
                    arrowClassName="popover-arrow mt-4"
                  >
                    <div className="bg-white p-4  rounded-3xl shadow-lg">
                      {session.user && (
                        <>
                        <div className="flex gap-2 mb-4 ">
                        <div className="flex flex-col  justify-center items-center " >
                            <span className="block bg-cyan-600 rounded-full text-white px-3 py-2 text-2xl  font-sans font-bold ">
                              {session?.user?.name
                                ? session.user.name.charAt(0).toUpperCase() 
                                : "U"}{" "}
                              {/* Fallback to 'Guest' or another placeholder */}
                            </span>
                          </div>
                          <div>
                            <span className="block font-sans font-extrabold text-xl">
                              {session.user.name} {/* User's name */}
                            </span>
                            <span className="block font-sans font-light text-sm">
                              {session.user.email}
                              {/* User's Email */}
                            </span>
                          </div>

                        </div>
                       
                         <div className="flex w-full justify-center items-center">
                         <button
                            onClick={() => signOut()}
                            className="px-8 py-2 my-2 bg-red-500 text-white  font-sans font-bold rounded-full hover:bg-red-600"
                          >
                            Logout
                          </button>
                         </div>
                       
                        </>
                      )}
                    </div>
                  </ArrowContainer>
                )}
                onClickOutside={() => setIsPopoverOpen(false)}
              >
                <div
                  onClick={togglePopover}
                  className="cursor-pointer  "
                >
                  <div className="flex justify-center items-end gap-1 ">
                  <div className="bg-sky-600 rounded-full p-2" >
                  <FaUser size={25} color="white" />
                  </div>
                
                <div>
                <div className="w-0 h-0 border-l-[12px] border-b-[12px] border-transparent border-b-white"></div>

            
                </div>
                  </div>
                 
                </div>

              </Popover>
            ) : (
              <>
                <div>
                  <button
                    onClick={() => signIn("google")}
                    className="flex  text-white items-center text-sm sm:text-md  font-raleway font-bold text-nowrap justify-center"
                  >
                    Sign In
                  </button>
                </div>
                <div>
                  <button className="flex p-2 rounded-full bg-gradient-to-r text-sm sm:text-md text-nowrap font-raleway font-bold from-blue-400 to-blue-600 text-white text-md items-center justify-center">
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
