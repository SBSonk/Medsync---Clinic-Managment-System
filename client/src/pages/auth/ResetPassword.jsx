import React, { useState } from "react";
import ResetPasswordLayout from "../../layouts/ResetPasswordLayout";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const location = useLocation();
  const { id, username, security_question } = location.state || {
    username: "INVALID USER",
    security_question: "INVALID QUESTION",
  };

  const [security_answer, setSecurityAnswer] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    await axios.post("http://127.0.0.1:8080/recovery-set-password", {
      id: id,
      new_password: password,
      security_answer: security_answer,
    });

    // Temporary success message (replace with API call)
    alert("Password reset successful!");
    navigate("/", { replace: true }); // Redirect to login after reset
  };

  return (
    <ResetPasswordLayout title="Reset Password">
      <form onSubmit={handleSubmit}>
        <label>Hello, {username}!</label>

        <label>{security_question}</label>
        <label>Security Answer</label>
        <input
          type="text"
          value={security_answer}
          onChange={(e) => setSecurityAnswer(e.target.value)}
          placeholder="Enter answer"
          required
        />

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
    </ResetPasswordLayout>
  );
};

export default ResetPassword;
