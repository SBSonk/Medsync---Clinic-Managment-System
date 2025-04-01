import React from "react";
import AdminSidebar from "../components/AdminSidebar";
import SearchBar from "../components/SearchBar";
import "../styles/AdminLayout.css"; // Add styles

const AdminLayout = ({ title, children }) => {
  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div>
        <h1 className="admin-title">{title}</h1>
        <br />
        <SearchBar />
        <br />
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
