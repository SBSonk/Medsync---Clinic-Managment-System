import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/FormLayout.css";

function formatDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

const InventoryForm = () => {
  const { register, handleSubmit, setValue, watch } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const inventoryData = {
        batch_id: data.batch_id,
        name: data.name,
        type: data.type,
        quantity: data.quantity,
        expiration_date: formatDate(data.expiration_date),
        supplier: data.supplier,
        supplier_contact: data.supplier_contact
      };

      console.log(inventoryData);

      await axios.post("http://127.0.0.1:8080/api/create-inventory", inventoryData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      });


      alert("Item created successfully!");
      navigate('/admin/dashboard')
    } catch (error) {
      console.error("Error creating item:", error);
    }
  };

  return (
    <MainLayout title="Create Inventory Item">
      <div className="mainBox">
        <div className="mainContent">
          <div className="formContainer">
            <form onSubmit={handleSubmit(onSubmit)}>
              <label>Batch ID:</label>
              <input
                type="number"
                {...register("batch_id", { required: true, maxLength: 50 })}

              />

              <label>Name:</label>
              <input
                type="text"
                {...register("name", { required: true, maxLength: 50 })}

              />

              <label>Type:</label>
              <input
                type="text"
                {...register("type", { required: true, maxLength: 50 })}

              />

              <label>Quantity:</label>
              <input
                type="number"
                {...register("quantity", { required: true })}

              />

              <label>Expiration Date:</label>
              <DatePicker
                selected={watch("expiration_date")}
                onChange={(date) => setValue("expiration_date", date)}
                dateFormat="dd-MM-yyyy"

              />

              <label>Supplier:</label>
              <input
                type="text"
                {...register("supplier", { required: true, maxLength: 255 })}

              />

              <label>Supplier Contact:</label>
              <input
                type="text"
                {...register("supplier_contact", { required: true, maxLength: 255 })}

              />

              <button type="submit">Add Item</button>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default InventoryForm;
