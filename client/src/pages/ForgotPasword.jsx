import React, { useState } from "react";
import AuthLayout from "../layouts/AuthLayout";

const ForgotPassword = () => {
  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Password reset link sent to " + username);
  };

  return (
    <AuthLayout title="Forgot Password">
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          required
        />

        <a href="/forgot-password" className="forgot-password">
          Cancel
        </a>
        <button type="submit">Reset Password</button>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
