import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const PayButton = ({ amount, rideId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      // 1. Create order on backend
      const { data: order } = await axios.post("http://localhost:4000/api/payment/create-order", {
        amount, // in INR
      });

      // 2. Open Razorpay checkout
      const options = {
        key: "rzp_test_PETv4cthKjP0oS", // Your Razorpay Key ID (not secret!)
        amount: order.amount,
        currency: order.currency,
        name: "Uber Clone",
        description: "Ride Payment",
        order_id: order.id,
        handler: async function (response) {
          console.log("Razorpay Payment Response:", response);
          // Send these to your backend for verification and ride update
          try {
            const verifyRes = await axios.post("http://localhost:4000/api/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              rideId: rideId,
            });
            if (verifyRes.data.success) {
              alert("Payment verified and successful!");
              navigate('/home');
            } else {
              alert("Payment verification failed!");
            }
          } catch (err) {
            alert("Error verifying payment: " + (err.response?.data?.message || err.message));
          }
        },
        prefill: {
          name: "Krishal",
          email: "krishal@gmail.com",
          contact: "7984396060",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className={`
        w-full
        py-3
        rounded-full
        bg-black
        text-white
        text-lg
        font-bold
        shadow-lg
        transition
        duration-200
        hover:bg-gray-900
        active:scale-95
        flex
        items-center
        justify-center
        gap-2
        disabled:opacity-50
        disabled:cursor-not-allowed
      `}
      style={{
        letterSpacing: "0.5px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
      }}
    >
      <svg
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        className="mr-2"
      >
        <rect width="24" height="24" rx="12" fill="#fff" />
        <path
          d="M7 12h10M12 7v10"
          stroke="#000"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      {isLoading ? "Processing..." : "Pay Now"}
    </button>
  );
};

export default PayButton;
