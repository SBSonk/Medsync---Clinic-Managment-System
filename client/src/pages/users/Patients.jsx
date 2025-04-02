import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import DataTable from "react-data-table-component";
import axios from "axios";
import "../../styles/MainLayout.css";

const Patients = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/people", {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0MzU5OTA2MiwianRpIjoiMjYzOGY3YWMtODU4Zi00YzA3LWFiYjktMTk2ZjAzNDIzYzBlIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjEiLCJuYmYiOjE3NDM1OTkwNjIsImNzcmYiOiJhOGQ5NjRjMi1jMWE3LTQxNzMtOWQ3NC01NTVlZjBiMTE2OTgifQ.I5PjbXpj5DyWZZkk2jEHJgrePsaKkIuvgVPo98CivJg`,
          },
        });
        setPatients(response.data);
      } catch (error) {
        console.error("Error fetching Patients:", error);
      }
    };

    fetchPatients();
  }, []);

  const columns = [
    { name: "ID", selector: (row) => row.id, width: "10%", center: true },
    { name: "First Name", selector: (row) => row.first_name, width: "15%" },
    { name: "Last Name", selector: (row) => row.last_name, width: "15%" },
    {
      name: "Gender",
      selector: (row) => row.gender,
      width: "10%",
      center: true,
    },
    {
      name: "Date of Birth",
      selector: (row) => row.date_of_birth,
      width: "15%",
    },
    { name: "Contact No", selector: (row) => row.contact_no, width: "15%" },
    { name: "Address", selector: (row) => row.address, width: "20%" },
    {
      name: "Actions",
      cell: (row) => (
        <div className="action-buttons">
          <button
            className="view-btn"
            onClick={() => alert(`Viewing ${row.name}`)}
          >
            <iconify-icon icon="mdi:eye"></iconify-icon>
          </button>
          <button
            className="edit-btn"
            onClick={() => alert(`Editing ${row.name}`)}
          >
            <iconify-icon icon="mdi:pencil"></iconify-icon>
          </button>
          <button
            className="delete-btn"
            onClick={() => alert(`Deleting ${row.name}`)}
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
    <MainLayout title="Patients">
      <div className="mainBox">
        <div className="mainContent">
          <div className="table-container">
            <DataTable
              columns={columns}
              data={patients}
              customStyles={customStyles}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Patients;
