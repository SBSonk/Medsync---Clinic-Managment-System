import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import DataTable from "react-data-table-component";
import axios from "axios";
import "../../styles/MainLayout.css";
import { Link } from "react-router-dom";

const Patients = () => {
  const [patients, setPatients] = useState([]);

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
      name: "First Name",
      selector: (row) => row.person.first_name,
      width: "10%",
      sortable: true,
      center: true,
    },
    {
      name: "Last Name",
      selector: (row) => row.person.last_name,
      width: "10%",
      sortable: true,
      center: true,
    },
    {
      name: "Gender",
      selector: (row) => row.person.gender,
      width: "10%",
      center: true,
      sortable: true,
    },
    {
      name: "Date of Birth",
      selector: (row) => row.person.date_of_birth,
      width: "10%",
      sortable: true,
      center: true,
    },
    {
      name: "Contact No",
      selector: (row) => row.person.contact_no,
      width: "10%",
      sortable: true,
      center: true,
    },
    {
      name: "Address",
      selector: (row) => row.person.address,
      width: "30%",
      sortable: true,
      center: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="action-buttons">
          <button
            className="view-btn"
            onClick={() =>
              alert(`Viewing ${row.person.first_name} ${row.person.last_name}`)
            }
          >
            <iconify-icon icon="mdi:eye"></iconify-icon>
          </button>
          <Link to={`/edit/${row.id}`}>
            <button className="edit-btn">
              <iconify-icon icon="mdi:pencil"></iconify-icon>
            </button>
          </Link>
          <button
            className="delete-btn"
            onClick={() =>
              alert(`Deleting ${row.person.first_name} ${row.person.last_name}`)
            }
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
