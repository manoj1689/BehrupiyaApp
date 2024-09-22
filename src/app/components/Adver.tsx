import React from "react";

const Adver = () => {
  return (
    <>
      <div className="relative">
        <section className="mx-auto bg-black text-white relative">
          {/* Full cover image */}
          <img 
            src="/images/New/back-gr.jpeg" 
            alt="Background" 
            className="w-full min-h-80 object-cover"
          />

          <div className="absolute inset-0 flex flex-col justify-center items-center z-10">
            <div className="flex flex-col justify-center items-center">
              {/* Circular button */}
              <span className="bg-red-500 text-xs py-2 px-4 mb-12 rounded-full  items-center justify-center">
                <span className="mr-2 w-2.5 h-2.5 bg-red-700 rounded-full"></span>
                OUR PRODUCTS
              </span>
              <h1 className="text-4xl text-center sm:text-5xl lg:text-6xl font-bold">
              Go Further with Behrupiya
            </h1>

            <div className="text-gray-400 text-sm md:text-base m-8 justify-center text-center lg:w-full  max-w-2xl">
              Revolutionize your creative workflow with <span className="text-yellow-500">Behrupiya AI</span> Tool Suite.
              From generating stunning AI art to crafting captivating videos and
              enhancing.
            </div>
            </div>

           
          </div>
        </section>
      </div>
    </>
  );
};

export default Adver;

