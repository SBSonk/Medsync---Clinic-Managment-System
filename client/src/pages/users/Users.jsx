import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import DataTable from "react-data-table-component";
import axios from "axios";
import "../../styles/MainLayout.css";
import { Link, Navigate } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/users", {
          headers: {
            // Authorization: "Bearer " + localStorage.getItem('access_token'),
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0MzU5OTA2MiwianRpIjoiMjYzOGY3YWMtODU4Zi00YzA3LWFiYjktMTk2ZjAzNDIzYzBlIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjEiLCJuYmYiOjE3NDM1OTkwNjIsImNzcmYiOiJhOGQ5NjRjMi1jMWE3LTQxNzMtOWQ3NC01NTVlZjBiMTE2OTgifQ.I5PjbXpj5DyWZZkk2jEHJgrePsaKkIuvgVPo98CivJg`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching Users:", error);
      }
    };

    fetchUsers();
  }, []);

  const columns = [
    { name: "ID", selector: (row) => row.id, width: "10%", center: true, sortable: true },
    { name: "Email", selector: (row) => row.email, width: "25%", center: true, sortable: true },
    { name: "Username", selector: (row) => row.username, width: "20%", center: true, sortable: true },
    { name: "Role", selector: (row) => row.role, width: "20%", center: true, sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <div className="action-buttons">
          <button
            className="view-btn"
            onClick={() => alert(`Viewing ${row.username}`)}
          >
            <iconify-icon icon="mdi:eye"></iconify-icon>
          </button>
          <button
            className="edit-btn"
            onClick={() => alert(`Editing ${row.username}`)}
          >
            <iconify-icon icon="mdi:pencil"></iconify-icon>
          </button>
          <button
            className="delete-btn"
            onClick={() => alert(`Deleting ${row.username}`)}
          >
            <iconify-icon icon="mdi:trash-can"></iconify-icon>
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "25%",
      center: true,
    },
  ];

  const customStyles = {
    headRow: { style: { fontSize: "16px", fontWeight: "bold" } },
    rows: {
      style: {
        fontSize: "14px",
        borderBottom: "1px solid #ddd", // Add border for rows
      },
    },
    tableWrapper: {
      style: { maxHeight: "450px", overflowY: "auto", overflowX: "auto" }, // Ensure horizontal scrolling is enabled
    },
  };

  return (
    <MainLayout title="Users">
      <div className="mainBox">
        <div className="mainContent">
          <div className="table-container">
            <DataTable
              columns={columns}
              data={users}
              customStyles={customStyles}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Users;
