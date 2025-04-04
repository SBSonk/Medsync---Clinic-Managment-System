import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import DataTable from "react-data-table-component";
import axios from "axios";
import "../../styles/MainLayout.css";
import { Link, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

const Patients = () => {
  const [patients, setPatients] = useState([]);

  const navigate = useNavigate();

  const handleEdit = (patient_id, person_id) => {
    navigate(`/edit/${patient_id}/${person_id}`);
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
            return { ...patient, person: personRes.data };
          })
        );

        setPatients(patientsWithPersonDetails);
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
      width: "5%",
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
      name: "Height",
      selector: (row) => row.height,
      width: "10%",
      center: true,
      sortable: true,
    },
    {
      name: "Weight",
      selector: (row) => row.weight,
      width: "10%",
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
      width: "15%",
      center: true,
      sortable: true,
    },
    {
      name: "Medical History",
      selector: (row) => row.medical_history || "N/A",
      width: "15%",
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
      width: "10%",
      center: true,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="action-buttons">
          <button
            className="view-btn"
            onClick={() => alert(`Viewing Patient ID: ${row.id}`)}
          >
            <iconify-icon icon="mdi:eye"></iconify-icon>
          </button>
          <button onClick={() => handleEdit(row.id, row.person_id)} className="edit-btn">
            <iconify-icon icon="mdi:pencil"></iconify-icon>
          </button>
          <button
            className="delete-btn"
            onClick={() => alert(`Deleting Patient ID: ${row.id}`)}
          >
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
