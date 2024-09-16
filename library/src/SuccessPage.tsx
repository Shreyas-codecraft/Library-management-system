import React from 'react';
import { Link } from 'react-router-dom';

const SuccessPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg text-center">
        <svg
          className="h-16 w-16 text-green-500 mx-auto mb-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M10 2.5a7.5 7.5 0 11-6.36 11.964L2.5 19h4.535a7.502 7.502 0 019.712-6.464A7.5 7.5 0 0110 2.5z" clipRule="evenodd" />
        </svg>
        <h2 className="text-2xl font-semibold text-gray-800">Registration Successful!</h2>
        <p className="text-gray-600 mt-2">Thank you for registering. You can now <Link to="/list" className="text-blue-500 hover:underline">log in</Link> to your account.</p>
        <div className="mt-6">
          <Link to="/" className="text-blue-500 hover:underline">Go to Homepage</Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
