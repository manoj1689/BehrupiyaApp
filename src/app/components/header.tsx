"use client";

export default function Header() {
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
        <button className="text-white text-sm hover:text-gray-300 transition duration-200">
          Sign in
        </button>
        <button className="bg-[#01AFF4] text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200">
          Launch App
        </button>
      </div>
    </header>
  );
}
