import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/FormLayout.css";
import { Dropdown } from "primereact/Dropdown";
const dropdown_test = {
  color: "black",
};

function formatDateTime(date, time) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const [hours, minutes] = time.split(":").map(Number); // Split and convert to numbers

  return `${month}-${day}-${year}-${hours}-${minutes}`;
}

const AppointmentForm = () => {
  const { register, handleSubmit, setValue, watch } = useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedPatientID, setSelectedPatientID] = useState(null);
  const [selectedFacultyID, setSelectedFacultyID] = useState(null);
  const [patients, setPatients] = useState([]);
  const [people, setPeople] = useState([]);
  const [employees, setEmployees] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/patients", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        });
        setPatients(response.data);
      } catch (error) {
        console.error("Error fetching Patients:", error);
      }
    };

    fetchPatients();

    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/employees",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
          }
        );
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching Employees:", error);
      }
    };

    fetchEmployees();

    const fetchPeople = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/people", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        });
        setPeople(response.data);
      } catch (error) {
        console.error("Error fetching People:", error);
      }
    };

    fetchPeople();
  }, []);

  const onSubmit = async (data) => {
    try {
      const appointmentData = {
        type: data.type,
        patient_id: selectedPatientID,
        doctor_id: selectedFacultyID,
        date_time: formatDateTime(data.date, data.time),
        status: data.status,
        note: data.note,
      };

      console.log(appointmentData);
      // Update person data
      await axios.post(
        "http://127.0.0.1:8080/api/create-appointment",
        appointmentData,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        }
      );

      alert("Appointment created successfully!");
      navigate("/admin/appointments");
    } catch (error) {
      console.error("Error creating appointment:", error);
    }
  };

  return (
    <MainLayout title="Create Appointment">
      <div className="mainContent">
        <div className="formContainer">
          <form onSubmit={handleSubmit(onSubmit)}>
            <label>Type:</label>
            <input
              type="text"
              {...register("type", { required: true, maxLength: 30 })}
            />

            <label>Patient ID:</label>
            <select onChange={(e) => setSelectedPatientID(e.target.value)}>
              <option value="">-- Select Patient --</option>
              {patients.map((patient) => {
                const person = people.find((p) => p.id === patient.person_id);
                return (
                  <option key={patient.id} value={patient.id}>
                    {person
                      ? `${person.first_name} ${person.last_name}`
                      : "Unknown"}
                  </option>
                );
              })}
            </select>

            <label>Faculty ID:</label>
            <select onChange={(e) => setSelectedFacultyID(e.target.value)}>
              <option value="">-- Select Faculty --</option>
              {employees.map((facultyMember) => {
                const person = people.find(
                  (p) => p.id === facultyMember.person_id
                );
                return (
                  <option key={facultyMember.id} value={facultyMember.id}>
                    {person
                      ? `${person.first_name} ${person.last_name}`
                      : "Unknown"}
                  </option>
                );
              })}
            </select>

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
                required: true,
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
    </MainLayout>
  );
};

export default AppointmentForm;
