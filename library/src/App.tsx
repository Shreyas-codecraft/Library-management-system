import { useState } from "react";
// import "./App.css"; 
import Login from "./login";
import FetchBooks from "./list";
const App = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const updateAccessToken = async () => {
    try {
      const response = await fetch("http://localhost:3500/refresh", {
        method: "GET",
        credentials: "include", // Ensures cookies are sent with the request
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data = await response.json();
      setAccessToken(data.accessToken);
      setMessage("Token refreshed successfully!");
    } catch (error) {
      console.error("Failed to refresh token", error);
      setMessage("Failed to refresh token.");
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Library Management System</h1>
      {!accessToken ? (
        <Login setAccessToken={setAccessToken} />
      ) : (
        <div className="content-container">
          <FetchBooks accessToken={accessToken} />
          <button className="refresh-button" onClick={updateAccessToken}>
            Refresh
          </button>
        </div>
      )}
      {message && <p className="message">{message}</p>}
    </div>
  );
};

// export default App;

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Register from "./register";
import LoginAuth from "./loginAuth";
import SuccessPage from "./SuccessPage";

// import FetchBooks from "./list";
// import Login from "./login";

function App1() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginAuth />} />
        <Route path="/register" element={<Register />} />
        <Route path="/list" element={<FetchBooks />} />
        <Route path="/success" element={<SuccessPage />} />

      </Routes>
    </Router>
  );
}

export default App1;