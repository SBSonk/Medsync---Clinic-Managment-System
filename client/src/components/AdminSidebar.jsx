import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";

function AdminSidebar() {
  return (
    <Sidebar>
      <div className="sidebarLinks">
        <Link to="/admin/account">
          <iconify-icon icon="qlementine-icons:user-16"></iconify-icon>
          ADMIN
        </Link>
        <Link to="/admin/dashboard">
          <iconify-icon icon="clarity:dashboard-line"></iconify-icon>
          Dashboard
        </Link>
        <Link to="/admin/employees">
          <iconify-icon icon="hugeicons:doctor-03"></iconify-icon>
          Employees
        </Link>
        <Link to="/admin/patients">
          <iconify-icon icon="hugeicons:patient"></iconify-icon>
          Patients
        </Link>
        <Link to="/admin/appointments">
          <iconify-icon icon="la:calendar"></iconify-icon>
          Appointments
        </Link>
        <Link to="/admin/inventory">
          <iconify-icon icon="ph:package"></iconify-icon>
          Inventory
        </Link>
        <Link to="/admin/reports">
          <iconify-icon icon="carbon:report"></iconify-icon>
          Reports
        </Link>
      </div>
    </Sidebar>
  );
}

export default AdminSidebar;
