import React from "react";
import "../styles/AuthLayout.css";
import medsync from "../assets/medsync.svg";

const AuthLayout = ({ title, children }) => {
  return (
    <div className="authContainer">
      <div className="authBox">
        {/* Left Side: Form */}
        <div className="authForm">{children}</div>

        {/* Right Side: Branding */}
        <div className="authBranding">
          <img src={medsync} className="logo" alt="medsync logo" />
          <hr />
          <p>{title}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
