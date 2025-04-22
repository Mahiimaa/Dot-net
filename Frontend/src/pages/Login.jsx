import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin =() => {
    e.preventDefault();
    console.log("Logging in with:", { username, password, rememberMe });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f2ec]">
      <div className="absolute top-4 left-6 font-bold text-xl flex items-center gap-2">
        <span>✈️</span>
        <span>Foliana</span>
      </div>

      <div className="bg-[#f7f2ec] w-full max-w-md p-8 rounded-xl shadow-xl border border-gray-300 text-center">
        <div className="flex justify-center gap-12 mb-6 text-lg font-semibold">
          <span className="text-green-600 border-b-2 border-green-600 pb-1">LOGIN</span>
          <span className="text-black">SIGN UP</span>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none"
          />

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="accent-[#083c43]"
            />
            <label>Remember me</label>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-[#c4845c] text-white rounded hover:bg-[#a96f4f] transition"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-sm">
          <p className="text-[#b2765a]">Forget Password?</p>
          <p className="text-green-600 mt-1">Already have account? <span className="underline cursor-pointer">Sign UP</span></p>
        </div>
      </div>

      {/* Waves at the bottom */}
      <div className="absolute bottom-0 w-full">
        <svg viewBox="0 0 1440 320">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,160L48,144C96,128,192,96,288,101.3C384,107,480,149,576,181.3C672,213,768,235,864,213.3C960,192,1056,128,1152,128C1248,128,1344,192,1392,224L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
      <p onClick={() => navigate('/dashboard')}>AdminHome</p>
    </div>
  );
};

export default Login;
