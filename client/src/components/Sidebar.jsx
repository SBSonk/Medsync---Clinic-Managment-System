import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";
import medsync from "../assets/medsync.svg";

function Sidebar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const location = useLocation(); // Get the current location (URL)

  // Function to check if the link should be active based on the current route
  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar">
      <div className="sidebarHeader">
        <img src={medsync} className="sidebarLogo" alt="medsync logo" />
      </div>
      {/* User Role and Navigation */}
      <div className="sidebarMenu">
        <div className="sidebarLinks">
          {role === "admin" && (
            <>
              <NavLink
                to="/admin/account"
                className={isActive("/admin/account") ? "activeLink" : ""}
              >
                <iconify-icon icon="qlementine-icons:user-16"></iconify-icon>
                ADMIN
              </NavLink>
              <NavLink
                to="/admin/users"
                className={isActive("/admin/users") ? "activeLink" : ""}
              >
                <iconify-icon icon="lucide:users"></iconify-icon>
                Users
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
              <NavLink
                to="/"
                className={isActive("/admin") ? "activeLink" : ""}
              >
                <iconify-icon icon="material-symbols:logout"></iconify-icon>
                Logout
              </NavLink>
            </>
          )}

          {role === "employee" && (
            <>
              <NavLink
                to="/employee/account"
                className={isActive("/employee/account") ? "activeLink" : ""}
              >
                <iconify-icon icon="qlementine-icons:user-16"></iconify-icon>
                EMPLOYEE
              </NavLink>
              <NavLink
                to="/employee/dashboard"
                className={isActive("/employee/dashboard") ? "activeLink" : ""}
              >
                <iconify-icon icon="clarity:dashboard-line"></iconify-icon>
                Dashboard
              </NavLink>
              <NavLink
                to="/employee/patients"
                className={isActive("/employee/patients") ? "activeLink" : ""}
              >
                <iconify-icon icon="hugeicons:patient"></iconify-icon>
                Patients
              </NavLink>
              <NavLink
                to="/employee/appointments"
                className={
                  isActive("/employee/appointments") ? "activeLink" : ""
                }
              >
                <iconify-icon icon="la:calendar"></iconify-icon>
                Appointments
              </NavLink>
              <NavLink
                to="/employee/inventory"
                className={isActive("/employee/inventory") ? "activeLink" : ""}
              >
                <iconify-icon icon="ph:package"></iconify-icon>
                Inventory
              </NavLink>
              <NavLink
                to="/employee/reports"
                className={isActive("/employee/reports") ? "activeLink" : ""}
              >
                <iconify-icon icon="carbon:report"></iconify-icon>
                Reports
              </NavLink>
              <NavLink
                to="/logout"
                className={isActive("/employee") ? "activeLink" : ""}
              >
                <iconify-icon icon="material-symbols:logout"></iconify-icon>
                Logout
              </NavLink>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
