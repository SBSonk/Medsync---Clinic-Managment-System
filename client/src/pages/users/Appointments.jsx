import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import DataTable from "react-data-table-component";
import axios from "axios";
import "../../styles/MainLayout.css";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/appointments", {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0MzU5OTA2MiwianRpIjoiMjYzOGY3YWMtODU4Zi00YzA3LWFiYjktMTk2ZjAzNDIzYzBlIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjEiLCJuYmYiOjE3NDM1OTkwNjIsImNzcmYiOiJhOGQ5NjRjMi1jMWE3LTQxNzMtOWQ3NC01NTVlZjBiMTE2OTgifQ.I5PjbXpj5DyWZZkk2jEHJgrePsaKkIuvgVPo98CivJg`,
          },
        });
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching Appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  const columns = [
    { name: "ID", selector: (row) => row.id, width: "10%", center: true, sortable: true },
    { name: "Type", selector: (row) => row.type, width: "15%", center: true, sortable: true },
    { name: "Patient ID", selector: (row) => row.patient_id, width: "15%", center: true, sortable: true },
    { name: "Doctor ID", selector: (row) => row.doctor_id, width: "15%", center: true, sortable: true },
    { 
      name: "Date and Time", 
      selector: (row) => {
        const dateTime = new Date(row.date_time);
        return `${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}`;
      },
      width: "20%", 
      center: true, 
      sortable: true 
    },
    { name: "Status", selector: (row) => row.status, width: "10%", center: true, sortable: true },
    { name: "Note", selector: (row) => row.note, width: "20%", center: true, sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <div className="action-buttons">
          <button
            className="view-btn"
            onClick={() => alert(`Viewing appointment ${row.id}`)}
          >
            <iconify-icon icon="mdi:eye"></iconify-icon>
          </button>
          <button
            className="edit-btn"
            onClick={() => alert(`Editing appointment ${row.id}`)}
          >
            <iconify-icon icon="mdi:pencil"></iconify-icon>
          </button>
          <button
            className="delete-btn"
            onClick={() => alert(`Deleting appointment ${row.id}`)}
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
    <MainLayout title="Appointments">
      <div className="mainBox">
        <div className="mainContent">
          <div className="table-container">
            <DataTable
              columns={columns}
              data={appointments}
              customStyles={customStyles}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Appointments;
