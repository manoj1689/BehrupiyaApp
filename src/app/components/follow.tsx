"use client";

export default function Follower() {
  return (
    <div
      className=" text-white py-16 bg-cover bg-center"
      style={{
        backgroundImage: `url('/images/New/banner_without_btn.jpg')`, // Replace with your image path
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-4 ">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Follow Us on Discord
          </h1>
          <p className="text-lg mb-8">
            Connect and share innovative ideas with over 63K+ creative
            like-minded people.
          </p>
          <div className="flex justify-center md:justify-start space-x-4">
            <a href="#" target="_blank" rel="noopener noreferrer" className="">
              <img
                src="/images/New/AStore.png"
                alt="App Store"
                className="w-52"
              />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="">
              <img
                src="/images/New/GPlay.png"
                alt="Play Store"
                className="w-52 "
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
