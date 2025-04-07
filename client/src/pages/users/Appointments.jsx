import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import DataTable from "react-data-table-component";
import axios from "axios";
import "../../styles/MainLayout.css";
import { Link, Navigate, useNavigate } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import { useAuth } from "../../AuthProvider";

const exportToPDF = (columns, data) => {
  const doc = new jsPDF();

  const cleanedColumns = columns.filter((col) => col.name !== "Actions");
  const tableColumn = cleanedColumns.map((col) => col.name);
  const tableRows = data.map((row) =>
    columns.map((col) =>
      typeof col.selector === "function" ? col.selector(row) : row[col.selector]
    )
  );

  const now = new Date();
  const dateStr = now.toLocaleString();
  const fileNameDate = now.toISOString().split("T")[0]; // YYYY-MM-DD

  const title = `Appointments Report - ${dateStr}`;
  doc.text(title, 14, 15);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 25,
  });

  doc.save(`Appointments Report - ${fileNameDate}.pdf`);
};

function formatDateTime(dateStr) {
  const date = new Date(dateStr);
  const options = {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleString("en-US", options);
}

const Appointments = () => {
  const auth = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [people, setPeople] = useState([]);
  const [patients, setPatients] = useState([]);
  const [filteredAppointments, setFilteredAppointments] =
    useState(appointments);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState([]);

  const getFullNameFromFaculty = (faculty_id) => {
    const faculty = people.find((p) => p.id === faculty_id);
    return faculty ? `${faculty.first_name} ${faculty.last_name}` : "Unknown";
  };

  const getFullNameFromPatient = (patient_id) => {
    const patient = patients.find((p) => p.id === patient_id); // ← RIGHT one!
    return patient ? `${patient.full_name}` : "Unknown";
  };

  const handleReport = () => {
    exportToPDF(columns, filteredAppointments);
  };

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
    navigate(`/edit-appointment/${id}`);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(`Are you sure you want to delete appointment ID: ${id}?`)
    ) {
      try {
        console.log("Deleting appointment ID:", id);
        await axios.delete(
          `http://localhost:8080/api/delete-appointment/${id}`,
          {
            headers: {
              Authorization: "Bearer " + auth.access_token,
            },
          }
        );
        alert("Appointment deleted successfully!");
        const updatedAppointments = appointments.filter(
          (appointment) => appointment.id !== id
        );
        setAppointments(updatedAppointments);
        setFilteredAppointments(updatedAppointments);
      } catch (error) {
        console.error("Error deleting appointment:", error);
        alert("Failed to delete appointment...");
      }
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/appointments",
          {
            headers: {
              Authorization: "Bearer " + auth.access_token,
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

    setIsAdmin(auth.role === "admin");

    const fetchPeople = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/people", {
          headers: {
            Authorization: "Bearer " + auth.access_token,
          },
        });
        setPeople(response.data);
      } catch (error) {
        console.error("Error fetching People:", error);
      }
    };

    const fetchPatients = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/patients", {
          headers: { Authorization: "Bearer " + auth.access_token },
        });

        const patientsWithDetails = await Promise.all(
          response.data.map(async (patient) => {
            try {
              const personRes = await axios.get(
                `http://localhost:8080/api/get-person-info/${patient.person_id}`,
                { headers: { Authorization: "Bearer " + auth.access_token } }
              );
              const person = personRes.data;

              return {
                ...patient,
                full_name: `${person.first_name} ${person.last_name}`,
              };
            } catch (error) {
              console.error(
                `Error fetching person info for Patient ID ${patient.id}:`,
                error
              );
              return {
                ...patient,
                full_name: "N/A",
              };
            }
          })
        );

        setPatients(patientsWithDetails);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
    fetchPeople();
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
      name: "Patient Name/ID",
      selector: (row) =>
        getFullNameFromPatient(row.patient_id) + "/" + row.patient_id,
      width: "20%",
      center: true,
      sortable: true,
    },
    {
      name: "Doctor Name/ID",
      selector: (row) =>
        getFullNameFromFaculty(row.doctor_id) + "/" + row.doctor_id,
      width: "15%",
      center: true,
      sortable: true,
    },
    {
      name: "Date/Time",
      selector: (row) => formatDateTime(row.date_time),
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
    isAdmin && {
      name: "Actions",
      cell: (row) => (
        <div className="action-buttons">
          <button className="edit-btn" onClick={() => handleEdit(row.id)}>
            <iconify-icon icon="mdi:pencil"></iconify-icon>
          </button>
          <button className="delete-btn" onClick={() => handleDelete(row.id)}>
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
      <div className="searchBar">
        <SearchBar
          onChange={(e) => handleSearchInputChange(e.target.value)}
          value={searchQuery}
        ></SearchBar>
        <div className="table-buttons">
          {isAdmin && (
            <button className="table-button" onClick={handleCreateAppointment}>
              Book Appointment
            </button>
          )}
          <button className="table-button" onClick={handleReport}>
            Print table report
          </button>
        </div>
      </div>
      <div className="mainContent">
        <div className="table-container">
          <DataTable
            columns={columns}
            data={filteredAppointments}
            customStyles={customStyles}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Appointments;
