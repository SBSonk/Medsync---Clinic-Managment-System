import React from "react";
import "../styles/AuthLayout.css";
import medsync from "../assets/medsync.svg";

const AuthLayout = ({ title, children }) => {
  return (
    <div className="auth-container">
      <div className="auth-box">
        {/* Left Side: Form */}
        <div className="auth-form">{children}</div>

        {/* Right Side: Branding */}
        <div className="auth-branding">
          <img src={medsync} className="logo" alt="medsync logo" />
          <hr />
          <p>{title}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
