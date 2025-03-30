import React, { useState } from "react";
import "../styles/Login.css";
import medsync from "../assets/medsync.svg";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Temporary mock authentication logic
    if (username === "admin" && password === "password123") {
      alert("Login successful! (Placeholder)");
      window.location.href = "/dashboard";
    } else {
      setError("Invalid credentials (Mock Data)");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Left Section: Form */}
        <div className="login-form">
          <form onSubmit={handleSubmit}>
            <label>Username</label>
            <input
              type="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
            {error && <p className="error-message">{error}</p>}
            <button type="submit">Log In</button>
          </form>
        </div>

        {/* Right Section: Branding & Role Selection */}
        <div className="login-branding">
          <img src={medsync} className="logo" alt="medsync logo" />
          <p>LOGIN</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
