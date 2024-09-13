"use client";
import React, { useState, useEffect } from "react";
import Modal from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { FaAsterisk } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ContactUsProps = {
  open: boolean;
  onClose: () => void;
};

const ContactUs: React.FC<ContactUsProps> = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    whatsappConsent: false,
  });
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    // Check if the element is an input of type checkbox
    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      setFormData({
        ...formData,
        [name]: e.target.checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    setIsFormSubmitted(true);
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  return (
    <>
      <ToastContainer />
      <Modal
        open={open}
        onClose={onClose}
        center
        styles={{
          modal: {
            maxWidth: "1000px",
            width: "90%",
            borderRadius: "5px",
            padding: "1rem",
            overflowY: "auto",
          },
          overlay: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px",
          },
        }}
      >
        <div className="flex flex-col md:flex-row px-2 sm:px-5 py-10 rounded-sm">
          <div className="md:w-1/2 flex flex-col bg-sky-200 rounded p-4 sm:px-4">
            <img
              src="images/home/smart-logo.png"
              alt="Smart Grader Logo"
              className="w-32 lg:w-44"
            />
            <div className="text-gray-600 font-spline font-bold text-2xl sm:text-3xl mb-10 md:w-10/12">
              Discover the Power of AI Driven Recruiting Automation with
              SmartGrader
            </div>
          </div>
          <div className="md:w-1/2 px-2 sm:px-4">
            {isFormSubmitted ? (
              <div className="flex flex-col text-gray-600 items-center w-full justify-center font-spline">
                <img
                  alt=""
                  loading="lazy"
                  src="/images/home/ThanksMsg.jpg"
                  className="mt-1.5"
                />
                <div className="text-2xl font-bold mb-1">
                  Thanks for contacting us!
                </div>
                <div className="text-lg">We have received your message</div>
                <div className="text-lg">
                  and will reach out to you immediately!
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-lg text-gray-600 font-spline font-bold sm:text-2xl mt-4">
                  Payment Assistance and Inquiries
                </h2>
                <div className="flex gap-5">
                  <div className="w-1/2">
                    <div className="flex items-center">
                      <span className="mr-2 text-gray-700 font-spline font-semibold">
                        First Name
                      </span>
                      <FaAsterisk size={10} color="red" />
                    </div>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="John"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="p-3 leading-4 rounded-md border border-solid border-neutral-400 w-full focus:border-neutral-500 focus:ring-neutral-500 focus:outline-none"
                    />
                  </div>
                  <div className="w-1/2">
                    <div className="flex items-center">
                      <span className="mr-2 text-gray-700 font-spline font-semibold">
                        Last Name
                      </span>
                      <FaAsterisk size={10} color="red" />
                    </div>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Doe"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="p-3 leading-4 rounded-md border border-solid border-neutral-400 w-full focus:border-neutral-500 focus:ring-neutral-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-gray-700 font-spline font-semibold">
                    Work Email
                  </span>
                  <FaAsterisk size={10} color="red" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="john.doe@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="p-3 leading-4 rounded-md border border-solid border-neutral-400 w-full focus:border-neutral-500 focus:ring-neutral-500 focus:outline-none"
                />
                <div className="flex items-center">
                  <span className="mr-2 text-gray-700 font-spline font-semibold">
                    Phone
                  </span>
                  <FaAsterisk size={10} color="red" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="123-456-7890"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="p-3 leading-4 rounded-md border border-solid border-neutral-400 w-full focus:border-neutral-500 focus:ring-neutral-500 focus:outline-none"
                />
                <div className="flex items-center">
                  <span className="mr-2 text-gray-700 font-spline font-semibold">
                    Message
                  </span>
                  <FaAsterisk size={10} color="red" />
                </div>
                <textarea
                  name="message"
                  placeholder="Enter your message here..."
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="p-3 leading-4 rounded-md border border-solid border-neutral-400 w-full focus:border-neutral-500 focus:ring-neutral-500 focus:outline-none"
                ></textarea>
                <div className="flex justify-start items-start">
                  <input
                    type="checkbox"
                    name="whatsappConsent"
                    checked={formData.whatsappConsent}
                    onChange={handleChange}
                    className="mr-2 mt-1 mb-5"
                  />
                  <span className="text-gray-600 font-spline font-light text-md">
                    I wish to receive further updates and confirmation via
                    WhatsApp.
                  </span>
                </div>
                <div className="text-gray-600 font-spline font-extralight text-xs">
                  By sharing your contact details, you agree to our{" "}
                  <a
                    href="/privacy-policy"
                    target="_blank"
                    className="text-blue-500"
                  >
                    privacy policy
                  </a>
                  .
                </div>
                <button
                  type="submit"
                  className="bg-[#01AFF4] text-white px-2 sm:px-6 py-3 mt-6 mb-10 mx-auto font-spline text-sm rounded hover:bg-blue-500 transition duration-300 flex cursor-pointer w-full sm:w-4/5 lg:w-3/5 justify-center items-center"
                >
                  <div className="font-spline font-medium">SUBMIT</div>
                </button>
              </form>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ContactUs;
