import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBook, FaGoogle } from 'react-icons/fa';

const LibraryHome: React.FC = () => {
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
    <div className="bg-library-background flex items-center justify-center min-h-screen bg-cover bg-center">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="text-center mb-6">
          <FaBook className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Library Management System</h2>
          <p className="text-lg text-gray-600">Sign in to access your library account</p>
        </div>

        <div className="space-y-4">
          {/* Login with Google Button */}
          <button
            onClick={handleLogin}
            className="w-full bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg flex items-center justify-center shadow-sm hover:bg-gray-100 transition duration-200"
          >
            <FaGoogle className="w-5 h-5 mr-2 text-blue-500" />
            Continue with Google
          </button>
          
          <div className="text-center text-gray-500">or</div>

          {/* Register Button */}
          <button
            onClick={handleRegister}
            className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center shadow-sm hover:bg-blue-700 transition duration-200"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default LibraryHome;
