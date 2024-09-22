"use client";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function Footer() {
  return (
    <div className="bg-gradient-to-b from-black to-gray-800 text-white py-12">
      <div className="container mx-auto flex flex-col lg:flex-row justify-between items-start border-b border-gray-700 px-4 md:px-0">
        {/* Left Section: Text Content */}
        <div className="flex  flex-col w-full justify-center text-left mb-8 md:mb-0 p-4">
          <div className="flex justify-center lg:justify-start">
            <img
              src="/images/New/footer_logo.png"
              alt="Behrupiya"
              className="max-w-full lg:ml-8 h-auto object-contain mb-4"
            />
          </div>

          {/* Footer Links */}
          <div className="flex  mt-8 flex-row ">
            <div className="flex flex-col sm:flex-row w-full  sm:w-2/3 lg:w-1/2">
              <div className="flex w-full sm:w-1/2 flex-col">
                {/* Column 1 */}
                <h3 className="font-semibold mb-2">Behrupiya.AI</h3>
                <ul>
                  <li className="mb-2">Blogs</li>
                  <li className="mb-2">Our Products</li>
                  <li className="mb-2">Mobile App</li>
                  <li className="mb-2">Pricing</li>
                </ul>
              </div>
              {/* Column 2 */}
              <div className="flex w-full sm:w-1/2 mt-8 sm:mt-0 flex-col">
                <h3 className="font-semibold mb-2">Company</h3>
                <ul>
                  <li className="mb-2">API</li>
                  <li className="mb-2">About us</li>
                </ul>
              </div>
              {/* Column 3 */}
            </div>
            <div className="flex w-full sm:w-1/3 lg:w-1/2">
              <div className="flex flex-col  ">
                <h3 className="font-semibold mb-2">Legal</h3>
                <ul>
                  <li className="mb-2">Privacy policy</li>
                  <li className="mb-2">Terms and conditions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Image */}
        <div className=" w-full flex justify-center">
          <img
            src="/images/New/footer_img.png"
            alt="Behrupiya"
            className="max-w-full h-auto object-contain"
          />
        </div>
      </div>

      {/* Bottom Section: Slogan and Social Media Icons */}
      <div className="container mx-auto  pt-6 flex flex-col md:flex-row justify-between items-center">
        {/* Left Column */}
        <div className="flex flex-1 justify-start md:ml-8 mb-4 md:mb-0">
          <p className="">Endless Possibilities. Just Imagine.</p>
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
