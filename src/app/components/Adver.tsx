import React from "react";

const Adver = () => {
  return (
    <section
      className="relative bg-cover bg-center text-white py-20 px-4"
      style={{
        backgroundImage: "url('/images/New/back-gr.jpeg')", // Replace with actual path to your image
        backgroundColor: "#24272c", // Fallback color
      }}
    >
      {/* Overlay to make text more readable */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="mb-5">
          {/* Circular button */}
          <button className="bg-red-500 text-xs py-2 px-4 rounded-full flex items-center justify-center">
            <span className="mr-2 w-2.5 h-2.5 bg-red-700 rounded-full"></span>
            OUR PRODUCTS
          </button>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold">
          Go Further with Behrupiya
        </h1>

        <p className="text-gray-400 text-sm md:text-base mt-4 max-w-2xl">
          Revolutionize your creative workflow with Behrupiya AI Tool Suite.
          From generating stunning AI art to crafting captivating videos and
          enhancing.
        </p>
      </div>
    </section>
  );
};

export default Adver;
