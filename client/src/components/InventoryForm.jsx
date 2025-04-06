import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/FormLayout.css";
import { useAuth } from "../AuthProvider";

// Utility function to format dates as dd-MM-yyyy
function formatDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

const InventoryForm = () => {
  const auth = useAuth();
  const { id } = useParams(); // Get the inventory ID from the URL
  const { register, handleSubmit, setValue, watch } = useForm();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(!id); // Determines if we are creating or editing
  const [isEditing, setIsEditing] = useState(!!id); // True if `id` is present

  useEffect(() => {
    if (isCreating) {
      console.log("Creating new inventory item");
    } else if (isEditing) {
      // Fetch inventory item details for editing
      const fetchInventoryItem = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8080/api/get-inventory-info/${id}`,
            {
              headers: {
                Authorization: "Bearer " + auth.access_token,
              },
            }
          );
          const itemData = response.data;

          // Pre-fill form with the retrieved item data
          setValue("batch_id", itemData.batch_id || "");
          setValue("name", itemData.name || "");
          setValue("type", itemData.type || "");
          setValue("quantity", itemData.quantity || "");
          setValue(
            "expiration_date",
            itemData.expiration_date ? new Date(itemData.expiration_date) : null
          ); // Convert to Date object if available
          setValue("supplier", itemData.supplier || "");
          setValue("supplier_contact", itemData.supplier_contact || "");
        } catch (error) {
          console.error("Error fetching item details:", error);
        }
      };

      fetchInventoryItem();
    }
  }, [id, isCreating, isEditing, setValue]);

  const onSubmit = async (data) => {
    try {
      const inventoryData = {
        batch_id: data.batch_id,
        name: data.name,
        type: data.type,
        quantity: data.quantity,
        expiration_date: formatDate(data.expiration_date),
        supplier: data.supplier,
        supplier_contact: data.supplier_contact,
      };

      if (isCreating) {
        // Create new inventory item
        await axios.post(
          "http://localhost:8080/api/create-inventory",
          inventoryData,
          {
            headers: {
              Authorization: "Bearer " + auth.access_token,
            },
          }
        );
        alert("Item created successfully!");
      } else if (isEditing) {
        // Update existing inventory item
        await axios.put(
          `http://localhost:8080/api/update-inventory/${id}`,
          inventoryData,
          {
            headers: {
              Authorization: "Bearer " + auth.access_token,
            },
          }
        );
        alert("Item updated successfully!");
      }

      navigate("/admin/dashboard");
    } catch (error) {
      console.error(
        isCreating ? "Error creating item:" : "Error updating item:",
        error
      );
    }
  };

  return (
    <MainLayout
      title={isCreating ? "Create Inventory Item" : "Edit Inventory Item"}
    >
      <div className="mainContent">
        <div className="formContainer">
          <form onSubmit={handleSubmit(onSubmit)}>
            <label>Batch ID:</label>
            <input
              type="number"
              {...register("batch_id", { required: true, maxLength: 50 })}
              disabled={!isEditing && !isCreating}
            />

            <label>Name:</label>
            <input
              type="text"
              {...register("name", { required: true, maxLength: 50 })}
              disabled={!isEditing && !isCreating}
            />

            <label>Type:</label>
            <input
              type="text"
              {...register("type", { required: true, maxLength: 50 })}
              disabled={!isEditing && !isCreating}
            />

            <label>Quantity:</label>
            <input
              type="number"
              {...register("quantity", { required: true })}
              disabled={!isEditing && !isCreating}
            />

            <label>Expiration Date:</label>
            <DatePicker
              selected={watch("expiration_date")}
              onChange={(date) => setValue("expiration_date", date)}
              dateFormat="dd-MM-yyyy"
              showMonthDropdown
              showYearDropdown
              disabled={!isEditing && !isCreating}
            />

            <label>Supplier:</label>
            <input
              type="text"
              {...register("supplier", { required: true, maxLength: 255 })}
              disabled={!isEditing && !isCreating}
            />

            <label>Supplier Contact:</label>
            <input
              type="text"
              {...register("supplier_contact", {
                required: true,
                maxLength: 255,
              })}
              disabled={!isEditing && !isCreating}
            />

            {isCreating ? (
              <button type="submit">Create Patient</button>
            ) : (
              <>
                <button type="button" onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? "Cancel" : "Edit"}
                </button>

                {isEditing && <button type="submit">Save Changes</button>}
              </>
            )}
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default InventoryForm;
