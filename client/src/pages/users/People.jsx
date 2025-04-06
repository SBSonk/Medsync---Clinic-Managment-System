import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import DataTable from "react-data-table-component";
import axios from "axios";
import "../../styles/MainLayout.css";
import { Link, Navigate, useNavigate } from "react-router-dom";
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

  const title = `People Report - ${dateStr}`;
  doc.text(title, 14, 15);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 25,
  });

  doc.save(`People Report - ${fileNameDate}.pdf`);
};

const People = () => {
  const navigate = useNavigate();
  const [people, setPeople] = useState([]);
  const [filteredPeople, setFilteredPeople] = useState(people);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchInputChange = (text) => {
    setSearchQuery(text);
    const filtered =
      text === ""
        ? people
        : people.filter(
            (patients) =>
              patients.gender.toLowerCase().includes(text.toLowerCase()) ||
              patients.last_name.toLowerCase().includes(text.toLowerCase()) ||
              patients.first_name.toLowerCase().includes(text.toLowerCase())
          );
    setFilteredPeople(filtered);
  };

  const handleCreatePerson = (e) => {
    navigate("/create/person");
  };

  const handleReport = () => {
    exportToPDF(columns, filteredPeople);
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/people", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        });
        setPeople(response.data);
        setFilteredPeople(response.data);
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
      selector: (row) => row.first_name,
      width: "10%",
      sortable: true,
      center: true,
    },
    {
      name: "Last Name",
      selector: (row) => row.last_name,
      width: "10%",
      sortable: true,
      center: true,
    },
    {
      name: "Gender",
      selector: (row) => row.gender,
      width: "10%",
      center: true,
      sortable: true,
    },
    {
      name: "Date of Birth",
      selector: (row) => row.date_of_birth,
      width: "10%",
      sortable: true,
      center: true,
    },
    {
      name: "Contact No",
      selector: (row) => row.contact_no,
      width: "10%",
      sortable: true,
      center: true,
    },
    {
      name: "Address",
      selector: (row) => row.address,
      width: "30%",
      sortable: true,
      center: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="action-buttons">
          <Link to="/edit/${row.id}">
            <button className="edit-btn">
              <iconify-icon icon="mdi:pencil"></iconify-icon>
            </button>
          </Link>
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
    <MainLayout title="People">
      <div className="searchBar">
        <SearchBar
          onChange={(e) => handleSearchInputChange(e.target.value)}
          value={searchQuery}
        ></SearchBar>
        <button onClick={handleCreatePerson}>Add new person</button>
        <button onClick={handleReport}>Print table report</button>
      </div>
      <div className="mainContent">
        <div className="table-container">
          <DataTable
            columns={columns}
            data={filteredPeople}
            customStyles={customStyles}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default People;
