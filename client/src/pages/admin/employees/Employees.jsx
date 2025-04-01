import React, { useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import "../../../styles/AdminLayout.css"; // Ensure styles are properly applied

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
      name: "Sarah Wilson",
      occupation: "Lab Technician",
      department: "Pathology",
    },
    {
      id: 7,
      name: "Sarah Wilson",
      occupation: "Lab Technician",
      department: "Pathology",
    },
    {
      id: 8,
      name: "Sarah Wilson",
      occupation: "Lab Technician",
      department: "Pathology",
    },
    {
      id: 9,
      name: "Sarah Wilson",
      occupation: "Lab Technician",
      department: "Pathology",
    },
    {
      id: 10,
      name: "Sarah Wilson",
      occupation: "Lab Technician",
      department: "Pathology",
    },
  ];

  const [employees, setEmployees] = useState(mockEmployees);

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

  const columns = [
    { name: "ID", selector: (row) => row.id, width: "15%", center: true },
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
      width: "20%",
      center: true,
    },
  ];

  const customStyles = {
    headRow: { style: { fontSize: "16px", fontWeight: "bold" } },
    rows: { style: { fontSize: "14px" } },
    tableWrapper: {
      style: {
        maxHeight: "450px",
        overflowY: "auto",
      },
    },
  };

  return (
    <AdminLayout title="Employees">
      <div className="adminBox">
        <div className="adminContent">
          <div className="table-container">
            <DataTable
              columns={columns}
              data={employees}
              customStyles={customStyles}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Employees;
