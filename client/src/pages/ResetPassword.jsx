import React, { useState } from "react";
import AuthLayout from "../layouts/AuthLayout";

const ResetPassword = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Temporary mock authentication logic
    if (username === "admin" && password === "password123") {
      alert("ResetPassword successful! (Placeholder)");
      window.location.href = "/dashboard";
    } else {
      setError("Invalid credentials (Mock Data)");
    }
  };

  return (
    <AuthLayout title="ResetPassword">
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
    </AuthLayout>
  );
};

export default ResetPassword;
