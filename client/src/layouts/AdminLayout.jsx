import React from "react";
import AdminSidebar from "../components/AdminSidebar";
import SearchBar from "../components/SearchBar";
import "../styles/AdminLayout.css"; // Add styles

const AdminLayout = ({ title, children }) => {
  return (
    <div className="adminContainer">
      <AdminSidebar />
      <div className="adminHeader">
        <p className="adminTitle">{title}</p>
        <br />
        <SearchBar />
      </div>
      <br />
      <div className="adminBox">
        <div className="adminContent">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
