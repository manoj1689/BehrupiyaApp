import React, { useState, useEffect, useContext } from "react";
import { MyContext } from '../context/CreditContex'; // Fixed the path if necessary
import axios from "axios";
import { useSession } from "next-auth/react";
import { loadRazorpayScript } from "../../utils/razorpay"; // Utility to load Razorpay script
import { IoMdAddCircleOutline } from "react-icons/io";
import { Session } from "inspector";

const CreditButton: React.FC = () => {
  const { data: session } = useSession();
  const { state, setState } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    if (session && session.user?.email) {
      fetchCredits(session.user.email);
    }
  }, [session]);

  const fetchCredits = async (email: string) => {
    try {
      const response = await axios.get("/api/get-credits", {
        params: { email },
      });
      setCredits(response.data.credits);
      setState(response.data.credits); // Update context state
    } catch (error) {
      console.error("Error fetching credits:", error);
      setMessage("Failed to fetch credits details.");
    }
  };

  const handleDeductCredit = async (email: string,credit:number) => {
    setLoading(true);
    setMessage(null);
   
    try {
      const response = await axios.post("/api/update-credits", {
        email,
        credits:-1, // Deduct 1 credit
      });

      setCredits(response.data.credits);
      setState(response.data.credits); // Update context state
      setMessage(`Credits updated! Remaining credits: ${response.data.credits}`);
    } catch (error) {
      console.error("Error updating credits:", error);
      setMessage("Failed to update credits.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCredit = async () => {
    if (!session || !session.user?.email) {
      setMessage("User is not authenticated.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Load Razorpay script
      const razorpayLoaded = await loadRazorpayScript();

      if (!razorpayLoaded) {
        setMessage("Razorpay SDK failed to load.");
        return;
      }

      // Create a payment order
      const orderResponse = await axios.post("/api/create-payment-order", {
        amount: 1, // Specify the amount here
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        name: "Your Company",
        description: "Add Credits",
        order_id: orderResponse.data.id,
        handler: async (response: any) => {
          const paymentData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            email: session.user?.email,
          };

          // Verify payment
          const verifyResponse = await axios.post(
            "/api/verify-payment",
            paymentData
          );

          // Update credits state
          const newCredits = verifyResponse.data.credits;
          setCredits(newCredits);
          setState(newCredits); // Update context state
          setMessage(`Credits added! New balance: ${newCredits}`);
        },
        prefill: {
          email: session.user.email,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error processing payment:", error);
      setMessage("Failed to process payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex  ">
      {state !== null && state > 0 && (
        <div className="flex gap-2 p-2 rounded-full text-sm sm:text-md font-bold text-white bg-orange-400 justify-center items-center">
          <span><IoMdAddCircleOutline size={20} color="white" /></span>
          <span>Credit:{state}</span>
        </div>
      )}

      {/* If credits are 0, show "Add Credit" button */}
      {state === 0 && (
        <button
          onClick={handleAddCredit}
          disabled={loading}
          className="bg-red-400 text-white text-sm px-4 py-2 flex gap-2 justify-center items-center rounded-full hover:bg-red-500 transition duration-300"
        >
          <span><IoMdAddCircleOutline size={20} color="white" /></span>
          <span>{loading ? "Processing..." : "Add credit"}</span>
        </button>
      )}

      {/* Show "Deduct Credit" button only if credits are greater than 0 */}
      {/* {credits !== null && credits > 0 && (
        <button
          onClick={() => handleDeductCredit(session?.user?.email!)}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          {loading ? "Updating..." : "Deduct Credit"}
        </button>
      )}

      {message && <p className="mt-2 text-sm text-gray-700">{message}</p>} */}
    </div>
  );
};

export default CreditButton;


