import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import DataTable from "react-data-table-component";
import axios from "axios";
import "../../styles/MainLayout.css";
import { Link, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

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

  const title = `Patients Report - ${dateStr}`;
  doc.text(title, 14, 15);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 25,
  });

  doc.save(`Patients Report - ${fileNameDate}.pdf`);
};

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState(patients);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdmin, setIsAdmin] = useState([]);
  const navigate = useNavigate();

  const handleReport = () => {
    exportToPDF(columns, filteredPatients);
  };

  const handleSearchInputChange = (text) => {
    setSearchQuery(text);
    const filtered =
      text === ""
        ? patients
        : patients.filter((patient) => {
            const fullName =
              `${patient.person.first_name} ${patient.person.last_name}`.toLowerCase();
            return (
              fullName.includes(text.toLowerCase()) ||
              (patient.allergies || "")
                .toLowerCase()
                .includes(text.toLowerCase()) ||
              (patient.blood_type || "")
                .toLowerCase()
                .includes(text.toLowerCase()) ||
              (patient.family_history || "")
                .toLowerCase()
                .includes(text.toLowerCase())
            );
          });
    setFilteredPatients(filtered);
  };

  const handleEdit = (patient_id, person_id) => {
    navigate(`/edit-patient/${patient_id}/${person_id}`);
  };

  const handleCreatePatient = (e) => {
    navigate("/create/patient");
  };

  const handleDelete = async (patient_id) => {
    if (
      window.confirm(
        `Are you sure you want to delete Patient ID: ${patient_id}?`
      )
    ) {
      try {
        console.log("Deleting patient ID:", patient_id);
        await axios.delete(
          `http://localhost:8080/api/delete-patient/${patient_id}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
          }
        );
        alert("Patient deleted successfully!");
        setPatients(patients.filter((patient) => patient.id !== patient_id)); // Update the UI
      } catch (error) {
        console.error("Error deleting patient:", error);
        alert("Failed to delete patient...");
      }
    }
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        // Fetch all patients
        const response = await axios.get("http://localhost:8080/api/patients", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        });

        // For each patient, fetch their person details
        const patientsWithPersonDetails = await Promise.all(
          response.data.map(async (patient) => {
            const personRes = await axios.get(
              `http://localhost:8080/api/get-person-info/${patient.person_id}`,
              {
                headers: {
                  Authorization:
                    "Bearer " + localStorage.getItem("access_token"),
                },
              }
            );
            const person = personRes.data;
            return {
              ...patient,
              person,
              full_name: `${person.first_name} ${person.last_name}`,
            };
          })
        );

        setPatients(patientsWithPersonDetails);
        setFilteredPatients(patientsWithPersonDetails);
        setIsAdmin(localStorage.getItem("role") === "admin");
      } catch (error) {
        console.error("Error fetching Patients:", error);
      }
    };

    fetchPatients();
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
      name: "Person ID",
      selector: (row) => row.person_id,
      width: "10%",
      center: true,
      sortable: true,
    },
    {
      name: "Full Name",
      selector: (row) => row.full_name || "N/A",
      width: "15%",
      center: true,
      sortable: true,
    },
    {
      name: "Height & Weight",
      selector: (row) => row.height + "cm : " + row.weight + "lbs",
      width: "15%",
      center: true,
      sortable: true,
    },
    {
      name: "Blood Type",
      selector: (row) => row.blood_type,
      width: "10%",
      center: true,
      sortable: true,
    },
    {
      name: "Allergies",
      selector: (row) => row.allergies || "N/A",
      width: "10%",
      center: true,
      sortable: true,
    },
    {
      name: "Medical History",
      selector: (row) => row.medical_history || "N/A",
      width: "30%",
      center: true,
      sortable: true,
    },
    {
      name: "Family History",
      selector: (row) => row.family_history || "N/A",
      width: "15%",
      center: true,
      sortable: true,
    },
    {
      name: "Next Appointment ID",
      selector: (row) => row.next_appointment_id || "N/A",
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
        borderBottom: "1px solid #ddd",
      },
    },
    tableWrapper: {
      style: { maxHeight: "450px", overflowY: "auto", overflowX: "auto" },
    },
  };

  return (
    <MainLayout title="Patients">
      <div className="searchBar">
        <SearchBar
          onChange={(e) => handleSearchInputChange(e.target.value)}
          value={searchQuery}
        ></SearchBar>
        <button onClick={handleCreatePatient}>Add new patient</button>
        <button onClick={handleReport}>Print table report</button>
      </div>
      <div className="mainContent">
        <div className="table-container">
          <DataTable
            columns={columns}
            data={filteredPatients}
            customStyles={customStyles}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Patients;
