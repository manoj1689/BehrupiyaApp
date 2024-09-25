import React from "react";
import { motion } from "framer-motion";
import { PricingData, PricingPlan } from "../types/types";
import { IoMdTrophy } from "react-icons/io";
import { FaBoltLightning } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
// Pricing data
const pricingData: PricingData = {
  title: "Get Started with Behrupiya.Ai",
  plans: [
    {
      name: "Standard",
      users: "16K",
      price: "$2.99",
      credits: 200,
      monthly_discount: "30% off",
      billed: "Billed Monthly",
      description:
        "For newcomers exploring, with limited features and image generation.",
      Details: "what`s included",
      features: [
        "Fast Processing",
        "All Styles & Models",
        "Commercial License",
      ],
      excluded_features: ["Android Access", "Early Access to new features"],
      popularity: "16K+",
    },
    {
      name: "Premium",
      users: "24K",
      price: "$9.99",
      credits: 1200,
      monthly_discount: "30% off",
      billed: "Billed Monthly",
      description: "Seamless Android & Web access, expanded capabilities.",
      Details: "All Professional features,Plus",
      features: [
        "Fast Processing",
        "All Styles & Models",
        "Commercial License",
        "Android Access",
        "Early Access to new features",
      ],
      excluded_features: [],
      popularity: "100K+",
    },
    {
      name: "Professional",
      users: "30K",
      price: "$4.99",
      credits: 500,
      monthly_discount: "30% off",
      billed: "Billed Monthly",
      description: "Serious users for personal/commercial images.",
      Details: "All Standrad features,Plus",
      features: [
        "Fast Processing",
        "All Styles & Models",
        "Commercial License",
        "Android Access",
      ],
      excluded_features: ["Early Access to new features"],
      popularity: "40K+",
    },
  ],
  note: "The 5 Credit value is Equal to 1 Generate 1 Image in Onetime.",
};

// Pricing card with motion
const PricingCard: React.FC<{ plan: PricingPlan }> = ({ plan }) => {
  return (
    <motion.div
      className="bg-gray-800 w-full lg:w-1/3  lg:mx-8 xl:mx-12 text-white hover:border border-blue-600 rounded-lg px-6 text-left shadow-lg py-12"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex justify-between">
        <div className="text-3xl font-bold">{plan.name}</div>
        <div className="flex justify-center items-center gap-2">
          {" "}
          <span>{plan.users} </span>
          <span>
            <IoMdTrophy size={20} />
          </span>{" "}
        </div>
      </div>

      <div className="mt-4 text-md font-raleway font-medium">
        {plan.description}
      </div>
      <p className="text-5xl font-bold my-2 font-serif ">{plan.price}</p>
      <p className="text-lg text-blue-400 font-bold font-serif">
        {plan.credits} CREDITS
      </p>
      <div className="flex items-center gap-2">
        <p className="text-xs mt-1 p-2 text-white font-bold bg-sky-900 rounded-md opacity-75">
          {plan.billed}
        </p>
        <p className="text-sm text-white flex justify-center items-center gap-2">
          {" "}
          <span>
            <FaBoltLightning />
          </span>{" "}
          <span>{plan.monthly_discount}</span>
        </p>
      </div>

      <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg w-full">
        Subscribe
      </button>
      {/* Gray Line Below Subscribe Button */}
      <div className="my-12 border-t border-gray-600"></div>

      <div className="mt-4">
        <h4 className="font-semibold">{plan.Details}</h4>
        <span className="ml-5 mt-2">
          {plan.features.map((feature, index) => (
            <>
              <span className="flex items-center gap-5">
                <span>
                  <FaCheck size={12} className="text-green-400" />
                </span>
                <span key={index} className="text-md">
                  {feature}
                </span>
              </span>
            </>
          ))}
        </span>
        {plan.excluded_features.length > 0 && (
          <>
            <span className=" mt-2">
              {plan.excluded_features.map((excluded, index) => (
                <>
                  <span className="flex items-center gap-5">
                    <span>
                      <IoClose size={20} className="text-red-400" />
                    </span>
                    <span key={index} className="text-md text-gray-600">
                      {excluded}
                    </span>
                  </span>
                </>
              ))}
            </span>
          </>
        )}
      </div>
    </motion.div>
  );
};

const PricingPage: React.FC = () => {
  return (
    <div className=" bg-black flex flex-col   py-12  items-center text-center">
      <div className="flex justify-center">
        <div className="border border-white px-4 py-2 flex gap-1 justify-center items-center text-white text-[12px] font-raleway rounded-full  ">
          <span>
            <FaHeart color="red" />
          </span>{" "}
          <span>OUR PRICING</span>
        </div>
      </div>

      <motion.h1
        className="text-white text-5xl text-md justify-center   font-raleway font-bold mt-12 mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {" "}
        <div className="">{pricingData.title}</div>
      </motion.h1>

      <div className="container mx-auto max-lg:px-4 flex flex-col lg:flex-row  max-lg:gap-5  justify-center my-8  lg:my-12  ">
        {pricingData.plans.map((plan, index) => (
          <PricingCard key={index} plan={plan} />
        ))}
      </div>

      <motion.p
        className="text-gray-400 font-raleway font-bold mt-8 text-lg mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        {pricingData.note}
      </motion.p>
    </div>
  );
};

export default PricingPage;
