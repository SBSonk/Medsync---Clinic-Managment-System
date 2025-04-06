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
  const [hours, minutes] = time.split(":").map(Number);

  // Ensure date is a valid JavaScript Date object
  const formattedDate = new Date(date);
  formattedDate.setHours(hours);
  formattedDate.setMinutes(minutes);

  return formattedDate.toISOString(); // Convert to ISO format
}

const AppointmentForm = () => {
  const auth = useAuth();
  const { id } = useParams();
  const { register, handleSubmit, setValue, watch, reset } = useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedPatientID, setSelectedPatientID] = useState("");
  const [selectedFacultyID, setSelectedFacultyID] = useState("");
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
      if (isCreating) return;

      try {
        const response = await axios.get(
          `http://localhost:8080/api/get-appointment/${id}`,
          {
            headers: { Authorization: `Bearer ${auth.access_token}` },
          }
        );

        const appointmentData = response.data;
        const [date, time] = appointmentData.date_time.split("T");
        const formattedTime = time.slice(0, 5); // Get HH:mm

        reset({
          type: appointmentData.type || "",
          patient_id: appointmentData.patient_id || "",
          doctor_id: appointmentData.doctor_id || "",
          date: date, // Save `YYYY-MM-DD`
          time: formattedTime, // Save `HH:mm`
          status: appointmentData.status || "",
          note: appointmentData.note || "",
        });

        setSelectedPatientID(appointmentData.patient_id || "");
        setSelectedFacultyID(appointmentData.doctor_id || "");
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
            disabled={!isCreating && !isEditing}
            onChange={(e) => {
              setSelectedPatientID(e.target.value);
              setValue("patient_id", e.target.value);
            }} // Update state on change
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
            disabled={!isCreating && !isEditing}
            onChange={(e) => setSelectedFacultyID(e.target.value)} // Update state on change
          >
            <option value="">-- Select Faculty --</option>
            {employees.map((facultyMember) => {
              const person = people.find(
                (p) => p.id === facultyMember.person_id
              ); // Find corresponding person
              return (
                <option key={facultyMember.id} value={facultyMember.id}>
                  {person
                    ? `${person.first_name} ${person.last_name}`
                    : "Unknown"}{" "}
                  {" | " + facultyMember.occupation}
                </option>
              );
            })}
          </select>

          <label>Date:</label>
          <DatePicker
            selected={watch("date") ? new Date(watch("date")) : "null"} // Ensure valid Date object
            onChange={(date) =>
              setValue("date", date.toISOString().split("T")[0])
            } // Save in `YYYY-MM-DD`
            dateFormat="yyyy-MM-dd" // Use a compatible format
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

          {isCreating ? (
            <button type="submit">Add Employee</button>
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
