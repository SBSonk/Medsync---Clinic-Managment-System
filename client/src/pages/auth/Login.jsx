import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthLayout from "../../layouts/AuthLayout";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:8080/login", {
        username,
        password,
      });

      const { access_token, role } = response.data;

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("role", role);

      console.log(localStorage.getItem("access_token"));
      console.log(localStorage.getItem("role"));

      if (role === "admin") navigate("/admin/patients");
      if (role === "employee") navigate("/employee/patients");
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
