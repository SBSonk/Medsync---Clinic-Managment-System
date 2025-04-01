import React from "react";
import "../styles/Sidebar.css";
import medsync from "../assets/medsync.svg";

function Sidebar({ children }) {
  return (
    <div className="sidebar">
      <div className="sidebarHeader">
        <img src={medsync} className="sidebarLogo" alt="medsync logo" />
      </div>
      <br />
      {/* User Role and Navigation */}
      <div className="sidebarMenu">{children}</div>
    </div>
  );
}

export default Sidebar;
