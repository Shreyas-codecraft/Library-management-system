import React, { useState } from "react";
import "./Login.css";

interface LoginProps {
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
}

const Login = ({ setAccessToken }: LoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3500/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      setAccessToken(data.accessToken);
      setMessage("Login successful!");
    } catch (error) {
      console.error("There was an error!", error);
      setMessage("Login failed.");
    }
  };

  // const loginAsGoogle = async () => {
  //   const response = await fetch("http://localhost:3500/redirect/", {
  //     method: "get",
  //   }); // Redirect to Google OAuth URL
  //   if (response.ok) {
  //     const url = await response.json();
  //     window.location.href = url.redirect;
  //   }
  // };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <div className="input-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
        
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Login;
