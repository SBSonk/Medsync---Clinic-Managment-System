import React from "react";
import { NavLink, useLocation } from "react-router-dom"; // Import useLocation
import Sidebar from "./Sidebar";

function AdminSidebar() {
  const location = useLocation(); // Get the current location (URL)

  // Function to check if the link should be active based on the current route
  const isActive = (path) => location.pathname === path;

  return (
    <Sidebar>
      <div className="sidebarLinks">
        <NavLink
          to="/admin/account"
          className={isActive("/admin/account") ? "activeLink" : ""}
        >
          <iconify-icon icon="qlementine-icons:user-16"></iconify-icon>
          ADMIN
        </NavLink>
        <NavLink
          to="/admin/dashboard"
          className={isActive("/admin/dashboard") ? "activeLink" : ""}
        >
          <iconify-icon icon="clarity:dashboard-line"></iconify-icon>
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/employees"
          className={isActive("/admin/employees") ? "activeLink" : ""}
        >
          <iconify-icon icon="hugeicons:doctor-03"></iconify-icon>
          Employees
        </NavLink>
        <NavLink
          to="/admin/patients"
          className={isActive("/admin/patients") ? "activeLink" : ""}
        >
          <iconify-icon icon="hugeicons:patient"></iconify-icon>
          Patients
        </NavLink>
        <NavLink
          to="/admin/appointments"
          className={isActive("/admin/appointments") ? "activeLink" : ""}
        >
          <iconify-icon icon="la:calendar"></iconify-icon>
          Appointments
        </NavLink>
        <NavLink
          to="/admin/inventory"
          className={isActive("/admin/inventory") ? "activeLink" : ""}
        >
          <iconify-icon icon="ph:package"></iconify-icon>
          Inventory
        </NavLink>
        <NavLink
          to="/admin/reports"
          className={isActive("/admin/reports") ? "activeLink" : ""}
        >
          <iconify-icon icon="carbon:report"></iconify-icon>
          Reports
        </NavLink>
      </div>
    </Sidebar>
  );
}

export default AdminSidebar;
