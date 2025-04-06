import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/FormLayout.css";
import { Dropdown } from "primereact/Dropdown";
import { useAuth } from "../AuthProvider";
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
  const auth = useAuth();
  const { id } = useParams();
  const { register, handleSubmit, setValue, watch, reset } = useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedPatientID, setSelectedPatientID] = useState(null);
  const [selectedFacultyID, setSelectedFacultyID] = useState(null);
  const [patients, setPatients] = useState([]);
  const [people, setPeople] = useState([]);
  const [employees, setEmployees] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    setIsCreating(!id); // Set mode based on the existence of ID

    const fetchPatients = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/patients", {
          headers: {
            Authorization: "Bearer " + auth.access_token,
          },
        });
        setPatients(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching Patients:", error);
      }
    };

    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/employees",
          {
            headers: {
              Authorization: "Bearer " + auth.access_token,
            },
          }
        );
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching Employees:", error);
      }
    };

    const fetchPeople = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/people", {
          headers: {
            Authorization: "Bearer " + auth.access_token,
          },
        });
        setPeople(response.data);
      } catch (error) {
        console.error("Error fetching People:", error);
      }
    };

    const fetchAppointmentDetails = async () => {
      if (isCreating) return; // Skip fetching if creating a new appointment

      try {
        const response = await axios.get(
          `http://localhost:8080/api/get-appointment/${id}`,
          {
            headers: {
              Authorization: "Bearer " + auth.access_token,
            },
          }
        );
        const appointmentData = response.data;

        // Apply `formatDateTime` to combine and format the date and time
        const formattedDateTime = formatDateTime(
          new Date(appointmentData.date_time.split("T")[0]),
          appointmentData.date_time.split("T")[1].slice(0, 5)
        );

        // Pre-fill form fields with formatted data
        reset({
          type: appointmentData.type || "",
          patient_id: appointmentData.patient_id || "",
          doctor_id: appointmentData.doctor_id || "",
          date_time: formattedDateTime, // Combined and formatted date and time
          status: appointmentData.status || "",
          note: appointmentData.note || "",
        });
      } catch (error) {
        console.error("Error fetching appointment details:", error);
      }
    };

    fetchPeople();
    fetchPatients();
    fetchEmployees();
    fetchAppointmentDetails();
  }, [id, reset, auth.access_token]);

  const onSubmit = async (data) => {
    try {
      if (isCreating) {
        const newAppointment = {
          type: data.type,
          patient_id: selectedPatientID,
          doctor_id: selectedFacultyID,
          date_time: formatDateTime(data.date, data.time),
          status: data.status,
          note: data.note,
        };

        console.log(newAppointment);
        // Update person data
        await axios.post(
          "http://localhost:8080/api/create-appointment",
          newAppointment,
          {
            headers: {
              Authorization: "Bearer " + auth.access_token,
            },
          }
        );

        alert("Appointment created successfully!");
        navigate("/admin/appointments");
      } else if (isEditing) {
        const appointmentData = {
          type: data.type,
          patient_id: selectedPatientID,
          doctor_id: selectedFacultyID,
          date_time: formatDateTime(data.date, data.time),
          status: data.status,
          note: data.note,
        };

        await axios.put(
          "http://localhost:8080/api/update-appointment",
          appointmentData,
          {
            headers: { Authorization: "Bearer " + auth.access_token },
          }
        );

        alert("Appointment updated successfully!");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
    }
  };

  return (
    <MainLayout title={isCreating ? "Create Appointment" : "Edit Appointment"}>
      <div className="formContainer">
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Type:</label>
          <input
            type="text"
            {...register("type", { required: true, maxLength: 30 })}
          />

          <label>Select Patient</label>
          <select
            value={selectedPatientID || ""} // Ensure the value reflects the state
            onChange={(e) => setSelectedPatientID(e.target.value)} // Update state on change
          >
            <option value="">-- Select Patient --</option>
            {patients.map((patient) => {
              const person = people.find((p) => p.id === patient.person_id);
              return (
                <option key={patient.id} value={patient.id}>
                  {person
                    ? `${person.first_name} ${person.last_name}`
                    : "Unknown"}{" "}
                  {/* // Display name or fallback */}
                </option>
              );
            })}
          </select>

          <label>Select Faculty</label>
          <select
            value={selectedFacultyID || ""} // Ensure the value reflects the state
            onChange={(e) => setSelectedFacultyID(e.target.value)} // Update state on change
          >
            <option value="">-- Select Faculty --</option>
            {employees.map((facultyMember) => {
              const person = people.find(
                (p) => p.id === facultyMember.person_id
              ); // Find corresponding person
              return (
                <option key={facultyMember.person_id} value={facultyMember.person_id}>
                  {person
                    ? `${person.first_name} ${person.last_name} | ${facultyMember.occupation}`
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
            showMonthDropdown
            showYearDropdown
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
    </MainLayout>
  );
};

export default AppointmentForm;
