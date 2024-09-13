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
            <a
              href="#"
              className="bg-black text-white py-3 px-5 rounded-md flex items-center space-x-2 hover:bg-gray-800"
            >
              <i className="fa fa-apple text-2xl"></i>
              <span>App Store</span>
            </a>
            <a
              href="#"
              className="bg-white text-black py-3 px-5 rounded-md flex items-center space-x-2 hover:bg-gray-200"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Google_Play_Store_badge_EN.svg/512px-Google_Play_Store_badge_EN.svg.png"
                alt="Google Play"
                className="h-6"
              />
              <span>Google Play</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
