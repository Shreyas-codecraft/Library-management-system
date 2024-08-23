import React from 'react';
import { Link } from 'react-router-dom';

const RegisterAuth: React.FC = () => {
  return (
    <div className="flex flex-col items-center space-y-4 mt-10">
      <a
        href="http://localhost:3500/redirect/"
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
      >
        Login with Google
      </a>
      <Link
        to="/register"
        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200"
      >
        Register
      </Link>
    </div>
  );
};



export default RegisterAuth;
