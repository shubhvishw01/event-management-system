import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(""); // Reset error
    if (code.length !== 4) {
      setError("कृपया 4 अंकों का कोड डालें");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/api/login", { code });
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-pink-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-sm flex flex-col items-center">
        {/* Logo */}
        <img src="/logo.png" alt="Logo" className="w-24 mb-2" />

        {/* Event Management System Title */}
        <p className="text-gray-700 font-medium mb-4">
          Event Management System
        </p>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          लॉगिन पेज
        </h2>

        <div className="flex flex-col gap-4 w-full">
          <input
            type="text"
            placeholder="4 अंकों का कोड"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={4}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleLogin}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          > 
            लॉगिन
          </button>

          {error && (
            <p className="text-red-600 text-center text-sm mt-2">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
