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

function extractDate(dateTime) {
  // Extract date portion "YYYY-MM-DD"
  return dateTime.split("T")[0]; // "2025-04-06"
}

// Function to extract the time part from an ISO string (e.g., "2025-04-06T22:02:00.000Z")
function extractTime(dateTime) {
  // Extract time portion "HH:mm"
  return dateTime.split("T")[1].slice(0, 5); // "22:02"
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

        const formattedDateTime = new Date(
          appointmentData.date_time
        ).toISOString();

        // Pre-fill form fields with formatted data
        setSelectedFacultyID(appointmentData.doctor_id);
        setSelectedPatientID(appointmentData.patient_id);
        reset({
          type: appointmentData.type || "",
          date: new Date(extractDate(formattedDateTime)), // Pass a Date object for DatePicker
          time: extractTime(formattedDateTime), // Combined and formatted date and time
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
          date_time: formatDateTime(data.date, data.time), // Convert the date to a Date object
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
          id: id,
          type: data.type,
          patient_id: selectedPatientID,
          doctor_id: selectedFacultyID,
          date_time: formatDateTime(data.date, data.time), // Convert the date to a Date object
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
            disabled={!isEditing && !isCreating} // Disabled unless editing or creating
          />

          <label>Select Patient</label>
          <select
            value={selectedPatientID || ""}
            onChange={(e) => setSelectedPatientID(e.target.value)}
            disabled={!isEditing && !isCreating} // Disabled unless editing or creating
          >
            <option value="">-- Select Patient --</option>
            {patients.map((patient) => {
              const person = people.find((p) => p.id === patient.person_id);
              return (
                <option key={patient.id} value={patient.id}>
                  {person
                    ? `${person.first_name} ${person.last_name}`
                    : "Unknown"}{" "}
                </option>
              );
            })}
          </select>

          <label>Select Faculty</label>
          <select
            value={selectedFacultyID || ""}
            onChange={(e) => setSelectedFacultyID(e.target.value)}
            disabled={!isEditing && !isCreating} // Disabled unless editing or creating
          >
            <option value="">-- Select Faculty --</option>
            {employees.map((facultyMember) => {
              const person = people.find(
                (p) => p.id === facultyMember.person_id
              );
              return (
                <option
                  key={facultyMember.person_id}
                  value={facultyMember.person_id}
                >
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
            disabled={!isEditing && !isCreating} // Disabled unless editing or creating
          />

          <label>Time:</label>
          <input
            type="time"
            {...register("time", { required: true })}
            disabled={!isEditing && !isCreating} // Disabled unless editing or creating
          />

          <label>Status:</label>
          <input
            type="text"
            {...register("status", { required: true, maxLength: 31 })}
            disabled={!isEditing && !isCreating} // Disabled unless editing or creating
          />

          <label>Note:</label>
          <input
            type="text"
            {...register("note", { required: true, maxLength: 255 })}
            disabled={!isEditing && !isCreating} // Disabled unless editing or creating
          />

          {isCreating ? (
            <button type="submit">Create Appointment</button>
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
    </MainLayout>
  );
};

export default AppointmentForm;
