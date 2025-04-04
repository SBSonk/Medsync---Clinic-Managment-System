import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/FormLayout.css";

const EmployeeForm = () => {
  const { register, handleSubmit, setValue, watch } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const employeeData = {
        person_id: data.person_id,
        occupation: data.occupation,
        department: data.department,
        schedule: data.schedule,
      };

      console.log(employeeData);
      // Update person data
      await axios.post(
        "http://localhost:8080/api/create-employee",
        employeeData,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        }
      );

      alert("Employee created successfully!");
      navigate("/admin/employees");
    } catch (error) {
      console.error("Error creating employee:", error);
    }
  };

  return (
    <MainLayout title="Create Employee">
      <div className="mainBox">
        <div className="mainContent">
          <div className="formContainer">
            <form onSubmit={handleSubmit(onSubmit)}>
              <label>Person ID:</label>
              <input
                type="text"
                {...register("person_id", { required: true, maxLength: 50 })}
              />

              <label>Occupation:</label>
              <input
                type="text"
                {...register("occupation", { required: true, maxLength: 50 })}
              />

              <label>Department:</label>
              <input
                type="text"
                {...register("department", { required: true, maxLength: 50 })}
              />

              <label>Schedule:</label>
              <input
                type="text"
                {...register("schedule", { required: true, maxLength: 31 })}
              />

              <button type="submit">Add Employee</button>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EmployeeForm;
