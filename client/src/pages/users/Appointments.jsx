import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import DataTable from "react-data-table-component";
import axios from "axios";
import "../../styles/MainLayout.css";
import { Link, Navigate, useNavigate } from "react-router-dom";
import SearchBar from "../../components/SearchBar";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] =
    useState(appointments);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearchInputChange = (text) => {
    setSearchQuery(text);
    const filtered =
      text === ""
        ? appointments
        : appointments.filter(
            (appointments) =>
              appointments.type.toLowerCase().includes(text.toLowerCase()) ||
              appointments.status.toLowerCase().includes(text.toLowerCase())
          );
    setFilteredAppointments(filtered);
  };

  const handleCreateAppointment = (e) => {
    navigate("/create/appointment");
  };

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/appointments",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
          }
        );
        setAppointments(response.data);
        setFilteredAppointments(response.data);
      } catch (error) {
        console.error("Error fetching Appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      width: "10%",
      center: true,
      sortable: true,
    },
    {
      name: "Type",
      selector: (row) => row.type,
      width: "15%",
      center: true,
      sortable: true,
    },
    {
      name: "Patient ID",
      selector: (row) => row.patient_id,
      width: "15%",
      center: true,
      sortable: true,
    },
    {
      name: "Doctor ID",
      selector: (row) => row.doctor_id,
      width: "15%",
      center: true,
      sortable: true,
    },
    {
      name: "Date and Time",
      selector: (row) => {
        const dateTime = new Date(row.date_time);
        return `${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}`;
      },
      width: "20%",
      center: true,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      width: "10%",
      center: true,
      sortable: true,
    },
    {
      name: "Note",
      selector: (row) => row.note,
      width: "20%",
      center: true,
      sortable: true,
    },
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
      <SearchBar
        onChange={(e) => handleSearchInputChange(e.target.value)}
        value={searchQuery}
      ></SearchBar>
      <button onClick={handleCreateAppointment}>Add new appointment</button>
      <div className="mainBox">
        <div className="mainContent">
          <div className="table-container">
            <DataTable
              columns={columns}
              data={filteredAppointments}
              customStyles={customStyles}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Appointments;
