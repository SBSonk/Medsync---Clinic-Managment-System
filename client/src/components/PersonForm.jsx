import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/FormLayout.css";
import { useAuth } from "../AuthProvider";

function formatDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

const PersonForm = () => {
  const auth = useAuth();
  const { register, handleSubmit, setValue, watch } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const personData = {
        first_name: data.first_name,
        last_name: data.last_name,
        gender: data.gender,
        date_of_birth: formatDate(data.date_of_birth),
        contact_no: data.contact_no,
        address: data.address,
      };

      console.log(personData);
      // Update person data
      await axios.post("http://127.0.0.1:8080/api/create-person", personData, {
        headers: {
          Authorization: "Bearer " + auth.access_token,
        },
      });

      alert("User created successfully!");
      navigate("/admin/people");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <MainLayout title="Create User">
      <div className="mainContent">
        <div className="formContainer">
          <form onSubmit={handleSubmit(onSubmit)}>
            <label>First Name:</label>
            <input
              type="text"
              {...register("first_name", { required: true, maxLength: 50 })}
            />

            <label>Last Name:</label>
            <input
              type="text"
              {...register("last_name", { required: true, maxLength: 50 })}
            />

            <label>Gender:</label>
            <select {...register("gender", { required: true })}>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="NON_BINARY">Non-Binary</option>
              <option value="OTHER">Other</option>
            </select>

            <label>Date of Birth:</label>
            <DatePicker
              selected={watch("date_of_birth")}
              onChange={(date) => setValue("date_of_birth", date)}
              dateFormat="dd-MM-yyyy"
              showMonthDropdown
              showYearDropdown
            />

            <label>Contact Number:</label>
            <input
              type="text"
              {...register("contact_no", { required: true, maxLength: 31 })}
            />

            <label>Address:</label>
            <input
              type="text"
              {...register("address", { required: true, maxLength: 255 })}
            />

            <button type="submit">Add Person</button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default PersonForm;
