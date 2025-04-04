import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/FormLayout.css";

function formatDateTime(date, time) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  const [hours, minutes] = time.split(':').map(Number); // Split and convert to numbers

  return `${day}-${month}-${year}-${hours}-${minutes}`;
}


const AppointmentForm = () => {
  const { register, handleSubmit, setValue, watch } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const appointmentData = {
        type: data.type,
        patient_id: data.patient_id,
        doctor_id: data.doctor_id,
        date_time: formatDateTime(data.date, data.time),
        status: data.status,
        note: data.note
      };

      console.log(appointmentData);
      // Update person data
      await axios.post("http://127.0.0.1:8080/api/create-appointment", appointmentData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      });

      alert("Appointment created successfully!");
      navigate('/admin/appointments')
    } catch (error) {
      console.error("Error creating appointment:", error);
    }
  };

  return (
    <MainLayout title="Create Appointment">
      <div className="mainBox">
        <div className="mainContent">
          <div className="formContainer">
            <form onSubmit={handleSubmit(onSubmit)}>
              <label>Type:</label>
              <input
                type="text"
                {...register("type", { required: true, maxLength: 30 })}

              />

              <label>Patient ID:</label>
              <input
                type="number"
                {...register("patient_id", { required: true, maxLength: 50 })}

              />

              <label>Doctor ID:</label>
              <input
                type="number"
                {...register("doctor_id", { required: true, maxLength: 50 })}

              />

              <label>Date:</label>
              <DatePicker
                selected={watch("date")}
                onChange={(date) => setValue("date", date)}
                dateFormat="dd-MM-yyyy"
              />

              <label>Time:</label>
              <input
                type="time"
                {...register("time", {
                  required: true
                })}
              />

              <label>Status:</label>
              <input
                type="text"
                {...register("status", { required: true, maxLength: 31 })}

              />

              <label>Note:</label>
              <input
                type="text"
                {...register("note", { required: true, maxLength: 255 })}

              />

              <button type="submit">Add Appointment</button>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AppointmentForm;
