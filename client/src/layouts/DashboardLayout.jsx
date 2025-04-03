import React from "react";
import Sidebar from "../components/Sidebar";
import "../styles/DashboardLayout.css"; // Add styles

const DashboardLayout = ({ title, children }) => {
  return (
    <div className="mainContainer">
      <Sidebar />
      <div className="mainHeader">
        <p className="mainTitle">{title}</p>
      </div>
      <div className="mainBox">
        <div className="mainContent">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
