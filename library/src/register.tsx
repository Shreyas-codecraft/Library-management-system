import React, { useState, FormEvent } from 'react';

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
}

const Register: React.FC = () => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string>('');

  const validateForm = (formData: FormData): FormErrors => {
    const newErrors: FormErrors = {};

    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    const password = formData.get('password') as string;

    if (!firstName) {
      newErrors.firstName = 'First name is required';
    }

    if (!lastName) {
      newErrors.lastName = 'Last name is required';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 10 digits';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    return newErrors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phoneNumber: formData.get('phoneNumber') as string,
      password: formData.get('password') as string,
      refreshToken: null,
      role: 'user',
      accessToken: null,
      user_id: ''
    };
  
    const formErrors = validateForm(formData);
    if (Object.keys(formErrors).length === 0) {
      try {
        const response = await fetch('http://localhost:3500/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Error ${response.status}: ${errorData.message || response.statusText}`);
        }
  
        const responseData = await response.json();
        setSuccessMessage('Registration successful!');
      } catch (error) {
        console.error('Error sending data to server:', error);
      }
    } else {
      setErrors(formErrors);
    }
  };
  

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-gray-50 shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">Register</h2>
      {successMessage && <p className="text-green-600 text-center mb-4">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="firstName" className="block text-gray-700 text-sm font-medium">First Name:</label>
          <input
            type="text"
            name="firstName"
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your first name"
          />
          {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="lastName" className="block text-gray-700 text-sm font-medium">Last Name:</label>
          <input
            type="text"
            name="lastName"
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your last name"
          />
          {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-medium">Email:</label>
          <input
            type="email"
            name="email"
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-medium">Phone Number:</label>
          <input
            type="text"
            name="phoneNumber"
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your phone number"
          />
          {errors.phoneNumber && <p className="text-red-600 text-sm mt-1">{errors.phoneNumber}</p>}
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 text-sm font-medium">Password:</label>
          <input
            type="password"
            name="password"
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
          />
          {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
