import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthLayout from "../../layouts/AuthLayout";
import { useAuth } from "../../AuthProvider";
const Login = () => {
  const auth = useAuth();

  const [enteredUsername, setUsername] = useState("");
  const [enteredPassword, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.role === "admin") navigate("/admin/dashboard");
    if (auth.role === "employee") navigate("/admin/dashboard");
  }, [auth.role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:8080/login", {
        username: enteredUsername,
        password: enteredPassword,
      });

      const { user_id, access_token, role } = response.data;

      auth.SetUserID(user_id);
      auth.SetAccessToken(access_token);
      auth.SetRole(role);
    } catch (err) {
      console.log(err);
      setError("Invalid username or password");
    }
  };

  return (
    <AuthLayout title="LOGIN">
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          type="text"
          value={enteredUsername}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={enteredPassword}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          required
        />

        <div className="errorContainer">
          {error && <p className="errorMessage">{error}</p>}
        </div>

        <button type="submit" onClick={handleSubmit}>
          Log In
        </button>
      </form>

      <a href="/forgotpassword" className="forgotPassword">
        Forgot password?
      </a>
    </AuthLayout>
  );
};

export default Login;
