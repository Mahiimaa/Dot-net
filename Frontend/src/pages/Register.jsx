import React, { useState, useContext } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";

const Register = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
  
    // Client-side validation
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError("Please fill in all required fields.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
  
    try {
      const response = await api.post("/Auth/register", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      const { token, user } = response.data;
      login(token, user);
      setSuccess("Registration successful! Redirecting...");
      setTimeout(() => {
        navigate(user.role === "Admin" ? "/dashboard" : "/login");
      }, 2000);
    } catch (err) {
      console.error("Registration error:", err.response?.data);
      if (err.response) {
        if (err.response.status === 409) {
          setError("An account with this email already exists.");
        } else if (err.response.status === 400) {
          // Improved error handling for validation errors
          const errors = err.response.data.errors;
          if (errors) {
            const errorMessages = Object.values(errors).flat().join(", ");
            setError(errorMessages || "Please provide valid registration details.");
          } else {
            setError(err.response.data.message || "Please provide valid registration details.");
          }
        } else {
          setError(err.response.data.message || "Registration failed. Please try again.");
        }
      } else {
        setError("Unable to connect to the server. Please check your connection.");
      }
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await api.post("/Auth/verify-email", {
        email: formData.email,
        otp: otp,
      });
      const { token, user } = response.data;
      login(token, user);
      setSuccess("Email verified successfully! Redirecting...");
      setTimeout(() => {
        navigate(user.role === "Admin" ? "/dashboard" : "/home");
      }, 2000);
    } catch (err) {
      console.error("OTP verification error:", err.response?.data);
      setError(err.response?.data.message || "Invalid OTP. Please try again.");
    }
  };

  const handleSocialLogin = (provider) => {
    // TODO: Implement social login (Google/Facebook)
    // Example: Redirect to backend OAuth endpoint (/Auth/google or /Auth/facebook)
    alert(`Social login with ${provider} is not implemented yet.`);
  };

  return (
    <div className="w-full h-screen bg-[#e8dfd6] flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-4 left-4 text-black font-semibold text-lg flex items-center gap-2 z-20">
        <span className="text-xl">📖</span> Foliana
      </div>
      <div className="rounded-2xl shadow-xl w-full max-w-md px-8 py-10 text-center z-10 backdrop-blur-md bg-white/30 border border-black/50">
        <div className="flex justify-between mb-6">
          <Link
            to="/login"
            className="text-sm font-medium text-gray-400 hover:text-black"
          >
            LOGIN
          </Link>
          <Link
            to="/register"
            className="text-sm font-medium text-green-600"
          >
            SIGN UP
          </Link>
        </div>
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
        {!isVerificationStep ? (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleInputChange}
            className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleInputChange}
            className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleInputChange}
            className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none"
            required
          />
          <button
            type="submit"
            className="bg-[#c7916c] text-white py-2 rounded-md font-medium hover:bg-[#b87b58] transition"
          >
            Create account
          </button>
        </form>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleOtpSubmit}>
            <input
              type="text"
              name="otp"
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
              Verify Email
            </button>
          </form>
        )}
        {!isVerificationStep && (
          <>
        <div className="my-4 text-sm text-gray-500">OR</div>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => handleSocialLogin("Facebook")}
            className="bg-white border p-2 rounded-full shadow-md hover:scale-105 transition"
          >
            <FaFacebookF className="text-blue-600" />
          </button>
          <button
            onClick={() => handleSocialLogin("Google")}
            className="bg-white border p-2 rounded-full shadow-md hover:scale-105 transition"
          >
            <FcGoogle />
          </button>
        </div>
        </>
        )}
      </div>
      <div className="absolute -bottom-10 w-full z-0">
        <div className="absolute bottom-0 w-full h-[120px] bg-white z-[-1]" />
        <svg viewBox="0 0 2000 180" className="w-full h-60">
          <path
            fill="#ffffff"
            d="M0,100 C500,250 1500,-30 2000,100 L2000,180 L0,180 Z"
          />
        </svg>
        <svg viewBox="0 0 3000 100" className="w-full h-24 absolute bottom-10 left-0">
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

export default Register;