import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import DataTable from "react-data-table-component";
import axios from "axios";
import "../../styles/MainLayout.css";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/inventory", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token")
          },
        });
        setInventory(response.data);
      } catch (error) {
        console.error("Error fetching Inventory:", error);
      }
    };

    fetchInventory();
  }, []);

  const columns = [
    { name: "ID", selector: (row) => row.id, width: "10%", center: true, sortable: true },
    { name: "Batch ID", selector: (row) => row.batch_id, width: "15%", center: true, sortable: true },
    { name: "Name", selector: (row) => row.name, width: "20%", center: true, sortable: true },
    { name: "Type", selector: (row) => row.type, width: "15%", center: true, sortable: true },
    { name: "Quantity", selector: (row) => row.quantity, width: "10%", center: true, sortable: true },
    {
      name: "Expiration Date",
      selector: (row) => row.expiration_date,
      width: "15%", center: true, sortable: true
    },
    { name: "Supplier", selector: (row) => row.supplier, width: "15%", center: true, sortable: true },
    { name: "Supplier Contact", selector: (row) => row.supplier_contact, width: "15%", center: true, sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <div className="action-buttons">
          <button
            className="view-btn"
            onClick={() => alert(`Viewing ${row.name}`)}
          >
            <iconify-icon icon="mdi:eye"></iconify-icon>
          </button>
          <button
            className="edit-btn"
            onClick={() => alert(`Editing ${row.name}`)}
          >
            <iconify-icon icon="mdi:pencil"></iconify-icon>
          </button>
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
    <MainLayout title="Inventory">
      <div className="mainBox">
        <div className="mainContent">
          <div className="table-container">
            <DataTable
              columns={columns}
              data={inventory}
              customStyles={customStyles}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Inventory;
