"use client";

export default function Footer() {
  return (
    <div className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="md:w-1/2 text-left mb-8 md:mb-0">
          <h2 className="text-2xl font-semibold">UNLEASH YOUR INNER</h2>
          <h1 className="text-5xl font-bold text-blue-500 mt-2">Behrupiya</h1>
          <p className="mt-2">Where Tradition meets Technology</p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Behrupiya.AI</h3>
              <ul>
                <li className="mb-2">Blogs</li>
                <li className="mb-2">Our Products</li>
                <li className="mb-2">Mobile App</li>
                <li className="mb-2">Pricing</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Company</h3>
              <ul>
                <li className="mb-2">API</li>
                <li className="mb-2">About us</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Legal</h3>
              <ul>
                <li className="mb-2">Privacy policy</li>
                <li className="mb-2">Terms and conditions</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="md:w-1/3">
          <img
            src="/images/New/footer_img.png"
            alt="Behrupiya"
            className="max-w-full h-auto"
          />
        </div>
      </div>
      <div className="mt-12 border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
        <p className="mb-4 md:mb-0">Endless Possibilities. Just Imagine.</p>
        <div className="flex space-x-6 text-2xl">
          <i className="fa fa-facebook"></i>
          <i className="fa fa-instagram"></i>
          <i className="fa fa-twitter"></i>
          <i className="fa fa-linkedin"></i>
        </div>
      </div>
    </div>
  );
}
