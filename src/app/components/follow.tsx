"use client";

import React from "react";

export default function Follower() {
  return (
    <>
      <div className="bg-gray-800 relative">
        <div
          className=" text-white bg-no-repeat bg-center bg-cover "
          style={{
            backgroundImage: `url('/images/New/banner_without_btn.jpg')`, // Replace with your image path
          }}
        >
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4 ">
            <div className="flex flex-col lg:w-1/2 bg-orange-500m md:mx-8 text-center min-h-96 justify-center items-center lg:text-left md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold font-raleway  mb-4">
                Follow Us on Discord
              </h1>
              <div className="text-sm md:text-lg font-raleway font-semibold  mb-8 text-center lg:w-2/3">
                Connect and share innovative ideas with over <span className="text-yellow-500">63K+ </span>creative
                like-minded people.
              </div>
              <div className="flex justify-center md:justify-start space-x-4">
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <img
                    src="/images/New/AStore.png"
                    alt="App Store"
                    className="w-52"
                  />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <img
                    src="/images/New/GPlay.png"
                    alt="Play Store"
                    className="w-52"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
