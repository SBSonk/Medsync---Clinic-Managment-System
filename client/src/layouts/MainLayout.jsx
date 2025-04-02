import React from "react";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import "../styles/MainLayout.css"; // Add styles

const MainLayout = ({ title, children }) => {
  return (
    <div className="mainContainer">
      <Sidebar />
      <div className="mainHeader">
        <p className="mainTitle">{title}</p>
        <br />
        <SearchBar />
      </div>
      <div className="mainBox">
        <div className="mainContent">{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
