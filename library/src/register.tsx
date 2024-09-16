import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  global?: string;
}

const Register: React.FC = () => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();  // Use navigate hook for redirection

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
    setIsSubmitting(true);

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
    const username = data.firstName;
    const password = data.password;

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

        setSuccessMessage('Registration successful!');
        try {
          const response = await fetch("http://localhost:3500/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ username, password }),
          });
          console.log(username, password);
          if (!response.ok) {
            console.log(response);
            throw new Error("Login failed");
          }

          const data = await response.json();
          document.cookie = `accessToken=${data.accessToken}; path=/; secure; samesite=strict`;
          console.log(document.cookie);

        } catch (error) {
          console.error("There was an error!", error);
          // setMessage("Login failed.");
        }
        navigate('/success');  // Redirect to success page
      } catch (error) {
        console.error('Error sending data to server:', error);
        setErrors({ global: 'An error occurred. Please try again later.' });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(formErrors);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-library-background bg-cover bg-center">
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-lg border border-gray-200">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">Create Your Library Account</h2>
        {errors.global && <p className="text-red-600 text-center mb-4">{errors.global}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your first name"
            />
            {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your last name"
            />
            {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              id="phoneNumber"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your phone number"
            />
            {errors.phoneNumber && <p className="text-red-600 text-sm mt-1">{errors.phoneNumber}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 "
            disabled={isSubmitting}
            style={{ marginTop: '30px' }}

          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
