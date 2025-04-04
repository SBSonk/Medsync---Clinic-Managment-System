import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import DataTable from "react-data-table-component";
import axios from "axios";
import "../../styles/MainLayout.css";
import { Link, Navigate, useNavigate } from "react-router-dom";
import SearchBar from "../../components/SearchBar";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState(employees);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleCreateItem = (e) => {
    navigate('/create/employee')
  };


  const handleSearchInputChange = (text) => {
    setSearchQuery(text);
    const filtered = text === "" ? employees : employees.filter(
      (employees) =>
        employees.occupation.toLowerCase().includes(text.toLowerCase())
      // TODO
      );
      setFilteredEmployees(filtered);
  };
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/employees", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token")
          },
        });
        setEmployees(response.data);
        setFilteredEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  const handleEdit = (id) => {
    navigate(`/edit/${id}`); // Navigate to EditPage with employee ID
  };

  const columns = [
    { name: "Person ID", selector: (row) => row.person_id, width: "15%" },
    { name: "Occupation", selector: (row) => row.occupation, width: "20%" },
    { name: "Department", selector: (row) => row.department, width: "20%" },
    {
      name: "Shift",
      selector: (row) => row.shift ? row.shift.shift_name : "N/A", // Assuming `shift_name` is an attribute of the related `EmployeeShift` model
      width: "15%",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="action-buttons">
          <button
            className="view-btn"
            onClick={() => alert(`Viewing ${row.id}`)}
          >
            <iconify-icon icon="mdi:eye"></iconify-icon>
          </button>
          <button
            className="edit-btn"
            onClick={() => alert(`Editing ${row.id}`)}
          >
            <iconify-icon icon="mdi:pencil"></iconify-icon>
          </button>
          <button
            className="delete-btn"
            onClick={() => alert(`Deleting ${row.id}`)}
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

  if (localStorage.getItem("role") != "admin") {
    alert("You don't have permission to access page: Employees");
    return Navigate("/dashboard");
  }

  return (
    <MainLayout title="Employees">
      <SearchBar onChange={(e) => handleSearchInputChange(e.target.value)} value={searchQuery}></SearchBar>
      <button onClick={handleCreateItem}>Add new employee</button>
      <div className="mainBox">
        <div className="mainContent">
          <div className="table-container">
            <DataTable
              columns={columns}
              data={filteredEmployees}
              customStyles={customStyles}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Employees;
