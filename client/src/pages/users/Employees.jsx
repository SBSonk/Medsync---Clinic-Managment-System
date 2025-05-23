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

  const title = `Employees Report - ${dateStr}`;
  doc.text(title, 14, 15);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 25,
  });

  doc.save(`Employees Report - ${fileNameDate}.pdf`);
};

const Employees = () => {
  const auth = useAuth();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState(employees);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleReport = () => {
    exportToPDF(columns, filteredEmployees);
  };

  const handleCreateItem = (e) => {
    navigate("/create/employee");
  };

  const handleEdit = (person_id) => {
    navigate(`/edit-employee/${person_id}`);
  };

  const handleDelete = async (person_id) => {
    // Confirm deletion with the user
    const confirmDelete = window.confirm(
      `Are you sure you want to delete Employee ID: "${person_id}"?`
    );
    if (!confirmDelete) return; // Exit if deletion is canceled

    try {
      console.log("Deleting employee ID:", person_id);
      // Make the DELETE request to the backend
      await axios.delete(
        `http://localhost:8080/api/delete-employee/${person_id}`,
        {
          headers: {
            Authorization: "Bearer " + auth.access_token,
          },
        }
      );

      alert("Employee deleted successfully!");

      // Update local state to reflect the deleted employee
      const updatedEmployees = employees.filter(
        (employee) => employee.person_id !== person_id
      );
      setEmployees(updatedEmployees);
      setFilteredEmployees(updatedEmployees);
    } catch (error) {
      // Handle and display error
      console.error("Error deleting employee:", error);
      alert("Failed to delete employee...");
    }
  };

  const handleSearchInputChange = (text) => {
    setSearchQuery(text);
    const filtered =
      text === ""
        ? employees
        : employees.filter(
            (employees) =>
              employees.occupation.toLowerCase().includes(text.toLowerCase()),
            employees.department.toLowerCase().includes(text.toLowerCase())
            // TODO
          );
    setFilteredEmployees(filtered);
  };
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        // Fetch all employees
        const response = await axios.get(
          "http://localhost:8080/api/employees",
          {
            headers: {
              Authorization: "Bearer " + auth.access_token,
            },
          }
        );

        // Fetch person details for each employee
        const employeesWithPersonDetails = await Promise.all(
          response.data.map(async (employee) => {
            const personRes = await axios.get(
              `http://localhost:8080/api/get-person-info/${employee.person_id}`,
              {
                headers: {
                  Authorization: "Bearer " + auth.access_token,
                },
              }
            );
            const person = personRes.data;
            return {
              ...employee,
              person,
              full_name: `${person.first_name} ${person.last_name}`,
            };
          })
        );

        setEmployees(employeesWithPersonDetails);
        setFilteredEmployees(employeesWithPersonDetails);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  const columns = [
    {
      name: "Person ID",
      selector: (row) => row.person_id,
      width: "15%",
      center: true,
      sortable: true,
    },
    {
      name: "Full Name",
      selector: (row) => row.full_name || "N/A",
      center: true,
      sortable: true,
    },
    {
      name: "Occupation",
      selector: (row) => row.occupation,
      center: true,
      sortable: true,
    },
    {
      name: "Department",
      selector: (row) => row.department,
      center: true,
      sortable: true,
    },
    {
      name: "Schedule",
      selector: (row) => row.schedule,
      width: "20%",
      center: true,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="action-buttons">
          <button
            className="edit-btn"
            onClick={() => handleEdit(row.person_id)}
          >
            <iconify-icon icon="mdi:pencil"></iconify-icon>
          </button>
          <button
            className="delete-btn"
            onClick={() => handleDelete(row.person_id)}
          >
            <iconify-icon icon="mdi:trash-can"></iconify-icon>
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "15%",
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

  if (auth.role != "admin") {
    alert("You don't have permission to access page: Employees");
    return Navigate("/dashboard");
  }

  return (
    <MainLayout title="Employees">
      <div className="searchBar">
        <SearchBar
          onChange={(e) => handleSearchInputChange(e.target.value)}
          value={searchQuery}
        ></SearchBar>
        <div className="table-buttons">
          <button className="table-button" onClick={handleCreateItem}>
            Add employee
          </button>
          <button className="table-button" onClick={handleReport}>
            Print table report
          </button>
        </div>
      </div>
      <div className="mainContent">
        <div className="table-container">
          <DataTable
            columns={columns}
            data={filteredEmployees}
            customStyles={customStyles}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Employees;
