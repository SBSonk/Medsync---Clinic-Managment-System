import React, { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Temporary success message (replace with API call)
    alert("Password reset successful! (Placeholder)");
    window.location.href = "/login"; // Redirect to login after reset
  };

  return (
    <AuthLayout title="Reset Password">
      <form onSubmit={handleSubmit}>
        <label>New password</label>
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
          required
        />

        <label>Confirm new password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          required
        />

        <div className="errorContainer">
          {error && <p className="errorMessage">{error}</p>}
        </div>

        <button type="submit">Reset Password</button>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
