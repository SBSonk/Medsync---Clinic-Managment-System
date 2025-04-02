import React, { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Allows navigation programmatically

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    alert("Password reset link sent to " + email);

    // Redirect user to reset password page after successful message
    navigate("/resetpassword");
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

        {error && <p className="errorMessage">{error}</p>}

        <div>
          <a href="/login" className="cancel">
            Cancel
          </a>
          <button type="submit">Reset Password</button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
