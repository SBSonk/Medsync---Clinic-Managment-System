import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";

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
    <AuthLayout title="LOGIN">
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          type="text"
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

      <Link className="forgot-password" to={"/forgotpassword"}>
        Forgot password?
      </Link>
    </AuthLayout>
  );
};

export default Login;
