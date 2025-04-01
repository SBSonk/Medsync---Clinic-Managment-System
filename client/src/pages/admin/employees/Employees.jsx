import React, { useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import "../../../styles/AdminLayout.css"; // Ensure your styles are properly applied

const Employees = () => {
  const navigate = useNavigate();

  const mockEmployees = [
    { id: 1, name: "John Doe", occupation: "Doctor", department: "Cardiology" },
    {
      id: 2,
      name: "Jane Smith",
      occupation: "Nurse",
      department: "Pediatrics",
    },
    {
      id: 3,
      name: "Alex Johnson",
      occupation: "Technician",
      department: "Radiology",
    },
    {
      id: 4,
      name: "Emily Davis",
      occupation: "Surgeon",
      department: "Orthopedics",
    },
    {
      id: 5,
      name: "Michael Brown",
      occupation: "Pharmacist",
      department: "Pharmacy",
    },
    {
      id: 6,
      name: "Michael Brown",
      occupation: "Pharmacist",
      department: "Pharmacy",
    },
    {
      id: 7,
      name: "Michael Brown",
      occupation: "Pharmacist",
      department: "Pharmacy",
    },
    {
      id: 5,
      name: "Michael Brown",
      occupation: "Pharmacist",
      department: "Pharmacy",
    },
    {
      id: 5,
      name: "Michael Brown",
      occupation: "Pharmacist",
      department: "Pharmacy",
    },
    {
      id: 5,
      name: "Michael Brown",
      occupation: "Pharmacist",
      department: "Pharmacy",
    },
  ];

  const [employees, setEmployees] = useState(mockEmployees);

  const columns = [
    { name: "ID", selector: (row) => row.id, width: "10%", center: true },
    { name: "Name", selector: (row) => row.name, width: "20%" },
    { name: "Occupation", selector: (row) => row.occupation, width: "20%" },
    { name: "Department", selector: (row) => row.department, width: "20%" },
    {
      name: "Actions",
      cell: (row) => (
        <div className="action-buttons">
          <button className="view-btn" onClick={() => handleView(row)}>
            <iconify-icon icon="mdi:eye"></iconify-icon>
          </button>
          <button className="edit-btn" onClick={() => handleEdit(row)}>
            <iconify-icon icon="mdi:pencil"></iconify-icon>
          </button>
          <button className="delete-btn" onClick={() => handleDelete(row)}>
            <iconify-icon icon="mdi:trash-can"></iconify-icon>
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "20%", // Reduce width to avoid excessive space
      center: true, // Align actions to center
    },
  ];

  const handleView = (row) => {
    alert(`Viewing details for ${row.name}`);
  };

  const handleEdit = (row) => {
    alert(`Editing ${row.name}`);
  };

  const handleDelete = (row) => {
    if (window.confirm(`Are you sure you want to delete ${row.name}?`)) {
      setEmployees((prevEmployees) =>
        prevEmployees.filter((emp) => emp.id !== row.id)
      );
    }
  };

  return (
    <AdminLayout title="Employees">
      <div className="adminBox">
        <div className="adminContent">
          <div className="top-actions"></div>
          <div className="table-container">
            <DataTable
              columns={columns}
              data={employees}
              fixedHeader
              fixedHeaderScrollHeight="450px"
              customStyles={{
                headRow: { style: { fontSize: "16px", fontWeight: "bold" } },
                rows: { style: { fontSize: "14px" } },
              }}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Employees;
