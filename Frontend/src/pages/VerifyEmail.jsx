import React, { useState, useContext } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import { GiSpellBook } from "react-icons/gi";

const VerifyEmail = () => {
  const { login } = useContext(AuthContext);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const response = await api.post("/Auth/verify-email", { email, otp });
      const { token, user } = response.data;
      login(token, user);
      setSuccess("Email verified successfully! Redirecting...");
      setTimeout(() => {
        if (user.role === "Admin") {
          navigate("/dashboard");
        } else if (user.role === "Staff") {
          navigate("/staff/orders");
        } else {
          navigate("/login");
        }
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setSuccess("");
    try {
      await api.post("/Auth/resend-otp", { email });
      setSuccess("OTP resent successfully! Please check your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP.");
    }
  };

  return (
    <div className="w-full h-screen bg-[#e8dfd6] flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-4 left-4 text-black font-semibold text-lg flex items-center gap-2 z-20">
        <GiSpellBook className="w-8 h-8 text-green-700" />
        <span className="text-xl font-bold text-green-700">Foliana</span>
      </div>
      <div className="rounded-2xl shadow-xl w-full max-w-md px-8 py-10 text-center z-10 backdrop-blur-md bg-white/30 border border-black/50">
        <div className="flex justify-between mb-6">
          <Link to="/login" className="text-sm font-medium text-black">
            LOGIN
          </Link>
          <Link
            to="/register"
            className="text-sm font-medium text-gray-400 hover:text-green-600"
          >
            SIGN UP
          </Link>
        </div>
        <h2 className="text-2xl font-bold mb-6 text-[#c7916c]">
          Verify Your Email
        </h2>
        {error && (
          <div className="text-white bg-[#e57373] text-sm mb-4 p-2 rounded-md animate-fade-in">
            {error}
          </div>
        )}
        {success && (
          <div className="text-white bg-green-600 text-sm mb-4 p-2 rounded-md animate-fade-in">
            {success}
          </div>
        )}
        <form className="flex flex-col gap-4" onSubmit={handleOtpSubmit}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none"
            required
          />
          <button
            type="submit"
            className="bg-[#c7916c] text-white py-2 rounded-md font-medium hover:bg-[#b87b58] transition"
          >
            Verify
          </button>
          <button
            type="button"
            onClick={handleResendOtp}
            className="text-sm text-[#c7916c] hover:underline"
          >
            Resend OTP
          </button>
        </form>
      </div>
      <div className="absolute -bottom-10 w-full z-0">
        <div className="absolute bottom-0 w-full h-[120px] bg-white z-[-1]" />
        <svg viewBox="0 0 2000 180" className="w-full h-60">
          <path
            fill="#ffffff"
            d="M0,100 C500,250 1500,-30 2000,100 L2000,180 L0,180 Z"
          />
        </svg>
        <svg
          viewBox="0 0 3000 100"
          className="w-full h-24 absolute bottom-10 left-0"
        >
          <path
            d="M0,30 Q250,150 500,30 T1000,30 T1500,30 T2000,30 T2500,30 T3000,30"
            stroke="#7cc8f9"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M0,50 Q250,-50 500,50 T1000,50 T1500,50 T2000,50 T2500,50 T3000,50"
            stroke="#92f2b8"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M0,70 Q250,130 500,70 T1000,70 T1500,70 T2000,70 T2500,70 T3000,70"
            stroke="#99dbff"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-in;
        }
      `}</style>
    </div>
  );
};

export default VerifyEmail;
