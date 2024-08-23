import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';

const LoginAuth: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3500/redirect/", { method: "GET" });
      if (response.ok) {
        const url = await response.json();
        window.location.href = url.redirect;
      }
    } catch (error) {
      console.error("Failed to fetch redirect URL:", error);
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
      <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-xl overflow-hidden">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Welcome Back!
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Please sign in to continue
        </p>

        <div className="space-y-4">
          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-red-400 to-red-600 text-white py-3 px-4 rounded-lg flex items-center justify-center hover:opacity-90 transition duration-200 transform hover:scale-105"
          >
            <FaGoogle className="w-6 h-6 mr-2" />
            Login with Google
          </button>
          <div className="text-center text-gray-500">or</div>
          <button
            onClick={handleRegister}
            className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white py-3 px-4 rounded-lg hover:opacity-90 transition duration-200 transform hover:scale-105"
          >
            Create an Account
          </button>
        </div>

      
      </div>
    </div>
  );
};

export default LoginAuth;
