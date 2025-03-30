import React, { useState } from "react";
import AuthLayout from "../layouts/AuthLayout";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Password reset link sent to " + Email);
  };

  return (
    <AuthLayout title="Forgot Password">
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          required
        />

        <a href="/forgot-password" className="forgot-password">
          Cancel
        </a>
        <Link to="/resetpassword">
          <button type="submit">Reset Password</button>
        </Link>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
