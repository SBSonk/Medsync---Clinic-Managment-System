import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";
import medsync from "../assets/medsync.svg";
import axios from "axios";
import { useAuth } from "../AuthProvider";

function Sidebar() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location (URL)

  // Function to check if the link should be active based on the current route
  const isActive = (path) =>
    location.pathname === path || location.pathname.includes(path);

  const dynamicDashboardLink = () =>
    auth.role === "admin" ? "/admin/dashboard" : "/employee/dashboard";

  const handleLogout = async (e) => {
    console.log("t");
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:8080/logout",
        {},
        {
          headers: {
            Authorization: "Bearer " + auth.access_token,
          },
        }
      );

      auth.logout();
      alert("Logged out successfully.");
      navigate("/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebarHeader">
        <NavLink to={dynamicDashboardLink()}>
          <img src={medsync} className="sidebarLogo" alt="medsync logo" />
        </NavLink>
      </div>
      {/* User Role and Navigation */}
      <div className="sidebarMenu">
        <div className="sidebarLinks">
          {auth.role === "admin" && (
            <>
              <NavLink to="">
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
                to="/admin/users"
                className={
                  isActive("/admin/users") ||
                  isActive("/create/user") ||
                  isActive("/edit-user")
                    ? "activeLink"
                    : ""
                }
              >
                <iconify-icon icon="mdi:account-cog-outline"></iconify-icon>
                Users
              </NavLink>
              <NavLink
                to="/admin/people"
                className={
                  isActive("/admin/people") ||
                  isActive("/create/person") ||
                  isActive("/edit-person")
                    ? "activeLink"
                    : ""
                }
              >
                <iconify-icon icon="ion:people-outline"></iconify-icon>
                People
              </NavLink>

              <NavLink
                to="/admin/employees"
                className={
                  isActive("/admin/employees") ||
                  isActive("/create/employee") ||
                  isActive("/edit-employee")
                    ? "activeLink"
                    : ""
                }
              >
                <iconify-icon icon="hugeicons:doctor-03"></iconify-icon>
                Employees
              </NavLink>
              <NavLink
                to="/admin/patients"
                className={
                  isActive("/admin/patients") ||
                  isActive("/create/patient") ||
                  isActive("/edit-patient")
                    ? "activeLink"
                    : ""
                }
              >
                <iconify-icon icon="hugeicons:patient"></iconify-icon>
                Patients
              </NavLink>
              <NavLink
                to="/admin/appointments"
                className={
                  isActive("/admin/appointments") ||
                  isActive("/create/appointment") ||
                  isActive("/edit-appointment")
                    ? "activeLink"
                    : ""
                }
              >
                <iconify-icon icon="la:calendar"></iconify-icon>
                Appointments
              </NavLink>
              <NavLink
                to="/admin/inventory"
                className={
                  isActive("/admin/inventory") ||
                  isActive("/create/inventory") ||
                  isActive("/edit-inventory-item")
                    ? "activeLink"
                    : ""
                }
              >
                <iconify-icon icon="ph:package"></iconify-icon>
                Inventory
              </NavLink>
              <NavLink to="#" onClick={handleLogout}>
                <iconify-icon icon="material-symbols:logout"></iconify-icon>
                Logout
              </NavLink>
            </>
          )}

          {auth.role === "employee" && (
            <>
              <NavLink to="">
                <iconify-icon icon="qlementine-icons:user-16"></iconify-icon>
                EMPLOYEE
              </NavLink>
              <NavLink to="/employee/dashboard">
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
              <NavLink to="#" onClick={handleLogout}>
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
