import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import DataTable from "react-data-table-component";
import axios from "axios";
import "../../styles/MainLayout.css";
import { Link, Navigate, useNavigate } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import { useAuth } from "../../AuthProvider";

const Users = () => {
  const auth = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearchInputChange = (text) => {
    setSearchQuery(text);
    const filtered =
      text === ""
        ? users
        : users.filter(
            (users) =>
              users.role.toLowerCase().includes(text.toLowerCase()) ||
              users.email.toLowerCase().includes(text.toLowerCase()) ||
              users.username.toLowerCase().includes(text.toLowerCase())
          );
    setFilteredUsers(filtered);
  };

  const handleCreateUser = (e) => {
    navigate("/create/user");
  };

  const handleEdit = (id) => {
    navigate(`/edit-user/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete user ID: "${id}"?`
    );
    if (!confirmDelete) return;

    try {
      console.log("Deleting user ID:", id);
      await axios.delete(`http://localhost:8080/api/delete-user/${id}`, {
        headers: {
          Authorization: "Bearer " + auth.access_token,
        },
      });

      alert(`User deleted successfully!`);

      // Update state to remove the deleted item
      const updatedUser = user.filter((user) => user.id !== id);
      setUser(updatedUser);
      setFilteredUser(updatedUser);
    } catch (error) {
      alert("Failed to delete user.");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/users", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        });
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.error("Error fetching Users:", error);
      }
    };

    fetchUsers();
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
      name: "Email",
      selector: (row) => row.email,
      width: "25%",
      center: true,
      sortable: true,
    },
    {
      name: "Username",
      selector: (row) => row.username,
      width: "20%",
      center: true,
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => row.role,
      width: "20%",
      center: true,
      sortable: true,
    },
    {
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
    <MainLayout title="Users">
      <div className="searchBar search-bar-users">
        <SearchBar
          onChange={(e) => handleSearchInputChange(e.target.value)}
          value={searchQuery}
        ></SearchBar>
        <div className="table-buttons table-buttons-users">
          <button className="table-button" onClick={handleCreateUser}>
            Add new user
          </button>
        </div>
      </div>
      <div className="mainContent">
        <div className="table-container">
          <DataTable
            columns={columns}
            data={filteredUsers}
            customStyles={customStyles}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Users;
