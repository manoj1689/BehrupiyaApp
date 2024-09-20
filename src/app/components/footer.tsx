"use client";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function Footer() {
  return (
    <div className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-4 md:px-0">
        {/* Left Section: Text Content */}
        <div className="md:w-1/2 text-left mb-8 md:mb-0">
          <h2 className="text-2xl font-semibold">UNLEASH YOUR INNER</h2>
          <h1 className="text-5xl font-bold text-blue-500 mt-2">Behrupiya</h1>
          <p className="mt-2">Where Tradition meets Technology</p>

          {/* Footer Links */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Column 1 */}
            <div>
              <h3 className="font-semibold mb-2">Behrupiya.AI</h3>
              <ul>
                <li className="mb-2">Blogs</li>
                <li className="mb-2">Our Products</li>
                <li className="mb-2">Mobile App</li>
                <li className="mb-2">Pricing</li>
              </ul>
            </div>
            {/* Column 2 */}
            <div>
              <h3 className="font-semibold mb-2">Company</h3>
              <ul>
                <li className="mb-2">API</li>
                <li className="mb-2">About us</li>
              </ul>
            </div>
            {/* Column 3 */}
            <div>
              <h3 className="font-semibold mb-2">Legal</h3>
              <ul>
                <li className="mb-2">Privacy policy</li>
                <li className="mb-2">Terms and conditions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Section: Image */}
        <div className="md:w-1/3">
          <img
            src="/images/New/footer_img.png"
            alt="Behrupiya"
            className="max-w-full h-auto object-contain"
          />
        </div>
      </div>

      {/* Bottom Section: Slogan and Social Media Icons */}
      <div className="mt-12 border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
        {/* Left Column */}
        <div className="flex flex-1 justify-start md:justify-center mb-4 md:mb-0">
          <p className="text-center md:text-left">
            Endless Possibilities. Just Imagine.
          </p>
        </div>

        {/* Right Column */}
        <div className="flex flex-1 justify-end md:justify-center space-x-6 text-2xl">
          <a href="#" className="hover:text-gray-500">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="#" className="hover:text-gray-500">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#" className="hover:text-gray-500">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="hover:text-gray-500">
            <i className="fab fa-linkedin"></i>
          </a>
        </div>
      </div>
    </div>
  );
}
