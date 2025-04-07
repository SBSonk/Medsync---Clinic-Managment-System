import React, { useState, useEffect, useSearchParams } from "react";
import MainLayout from "../../layouts/MainLayout";
import DataTable from "react-data-table-component";
import axios from "axios";
import "../../styles/MainLayout.css";
import SearchBar from "../../components/SearchBar";
import { useNavigate } from "react-router-dom";
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

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const options = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  return date.toLocaleString("en-US", options);
}

const Inventory = () => {
  const auth = useAuth();
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState(inventory);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdmin, setIsAdmin] = useState([]);

  const navigate = useNavigate();

  const handleReport = () => {
    exportToPDF(columns, filteredInventory);
  };

  const handleSearchInputChange = (text) => {
    setSearchQuery(text);
    const filtered =
      text === ""
        ? inventory
        : inventory.filter(
            (inventory) =>
              inventory.name.toLowerCase().includes(text.toLowerCase()) ||
              inventory.type.toLowerCase().includes(text.toLowerCase()) ||
              inventory.supplier.toLowerCase().includes(text.toLowerCase()) ||
              inventory.batch_id.includes(text)
          );
    setFilteredInventory(filtered);
  };

  const handleCreateItem = (e) => {
    navigate("/create/inventory");
  };

  const handleEdit = (id) => {
    navigate(`/edit-inventory-item/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete inventory ID: "${id}"?`
    );
    if (!confirmDelete) return;

    try {
      console.log("Deleting inventory item ID:", id);
      await axios.delete(`http://localhost:8080/api/delete-inventory/${id}`, {
        headers: {
          Authorization: "Bearer " + auth.access_token,
        },
      });

      alert(`Item deleted successfully!`);

      // Update state to remove the deleted item
      const updatedInventory = inventory.filter(
        (inventory) => inventory.id !== id
      );
      setInventory(updatedInventory);
      setFilteredInventory(updatedInventory);
    } catch (error) {
      alert("Failed to delete the item.");
    }
  };

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/inventory",
          {
            headers: {
              Authorization: "Bearer " + auth.access_token,
            },
          }
        );
        setInventory(response.data);
        setFilteredInventory(response.data);
      } catch (error) {
        console.error("Error fetching Inventory:", error);
      }
    };

    fetchInventory();
    setIsAdmin(auth.role === "admin");
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
      name: "Batch ID",
      selector: (row) => row.batch_id,
      width: "15%",
      center: true,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      width: "20%",
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
      name: "Quantity",
      selector: (row) => row.quantity,
      width: "10%",
      center: true,
      sortable: true,
    },
    {
      name: "Expiration Date",
      selector: (row) => formatDate(row.expiration_date),
      width: "15%",
      center: true,
      sortable: true,
    },
    {
      name: "Supplier",
      selector: (row) => row.supplier,
      width: "15%",
      center: true,
      sortable: true,
    },
    {
      name: "Supplier Contact",
      selector: (row) => row.supplier_contact,
      width: "15%",
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
    <>
      <MainLayout title="Inventory">
        <div className="searchBar">
          <SearchBar
            onChange={(e) => handleSearchInputChange(e.target.value)}
            value={searchQuery}
          ></SearchBar>
          <div className="table-buttons">
            {isAdmin && (
              <button className="table-button" onClick={handleCreateItem}>
                Add item
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
              data={filteredInventory}
              customStyles={customStyles}
            />
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default Inventory;
