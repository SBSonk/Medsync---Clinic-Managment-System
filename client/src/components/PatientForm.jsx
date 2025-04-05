import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { Dropdown } from "primereact/Dropdown";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/FormLayout.css";

function formatDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

const PatientForm = () => {
  const { patient_id, person_id } = useParams(); // Use useParams to get the 'id' from the URL
  const { register, handleSubmit, setValue, watch } = useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedPersonID, setSelectedPersonID] = useState(null);
  const [people, setPeople] = useState([]);

  useEffect(() => {
    setIsCreating(!patient_id && !person_id);

    const fetchPeople = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/people", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        });
        setPeople(response.data);
      } catch (error) {
        console.error("Error fetching people:", error);
      }
    };

    fetchPeople(); // Load available people

    if (!patient_id && !person_id) {
      console.log("creating");
      return;
    }

    const fetchPatientAndPerson = async () => {
      try {
        const patientRes = await axios.get(
          `http://localhost:8080/api/get-patient-info/${patient_id}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
          }
        );
        const patientData = patientRes.data;

        if (patientData && patientData.person_id) {
          const personRes = await axios.get(
            `http://localhost:8080/api/get-person-info/${person_id}`,
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token"),
              },
            }
          );
          const personData = personRes.data;

          const emergencyContactRes = await axios.get(
            `http://localhost:8080/api/get-emergency-contact/${patient_id}`,
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token"),
              },
            }
          );
          const emergencyContactData = emergencyContactRes.data;

          // Form value setting
          setValue("firstName", personData.first_name || "");
          setValue("lastName", personData.last_name || "");
          setValue("gender", personData.gender || "");
          setValue(
            "dateOfBirth",
            personData.date_of_birth ? new Date(personData.date_of_birth) : null
          );
          setValue("contactNo", personData.contact_no || "");
          setValue("address", personData.address || "");
          setValue("height", patientData.height || "");
          setValue("weight", patientData.weight || "");
          setValue("bloodType", patientData.blood_type || "");
          setValue("allergies", patientData.allergies || "");
          setValue("medicalHistory", patientData.medical_history || "");
          setValue("familyHistory", patientData.family_history || "");

          if (emergencyContactData) {
            setValue("emergencyContact", emergencyContactData.person_id || "");
            setValue("emergencyRelation", emergencyContactData.relation || "");
          }
        }
      } catch (error) {
        console.error("Error fetching patient details:", error);
      }
    };

    fetchPatientAndPerson();

    if (person_id) {
      setSelectedPersonID(person_id);
    }
  }, [patient_id, person_id, setValue]);

  const onSubmit = async (data) => {
    try {
      if (isCreating) {
        if (!selectedPersonID) {
          alert("Please select a person before creating a patient.");
          return;
        }

        const newPatient = {
          height: data.height,
          weight: data.weight,
          blood_type: data.bloodType,
          allergies: data.allergies,
          medical_history: data.medicalHistory,
          family_history: data.familyHistory,
          emergency_contact_person_id: data.emergencyContact,
          emergency_contact_relation: data.emergencyRelation,
          person_id: selectedPersonID, // Link selected person ID
        };

        await axios.post(
          "http://localhost:8080/api/create-patient",
          newPatient,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
          }
        );

        alert("Patient created successfully!");
      } else if (isEditing) {
        const patientData = {
          id: patient_id,
          height: data.height,
          weight: data.weight,
          blood_type: data.bloodType,
          allergies: data.allergies,
          medical_history: data.medicalHistory,
          family_history: data.familyHistory,
          emergency_contact_person_id: data.emergencyContact,
          emergency_contact_relation: data.emergencyRelation,
        };

        console.log(formatDate(data.dateOfBirth));

        const personData = {
          id: person_id,
          first_name: data.firstName,
          last_name: data.lastName,
          gender: data.gender,
          date_of_birth: formatDate(data.dateOfBirth),
          contact_no: data.contactNo,
          address: data.address,
        };

        console.log(patientData);
        console.log(personData);

        // Update patient data
        await axios.put(
          "http://localhost:8080/api/update-patient",
          patientData,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
          }
        );

        // Update person data
        await axios.put("http://localhost:8080/api/update-person", personData, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        });

        alert("Patient updated successfully!");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating patient:", error);
    }
  };

  return (
    <MainLayout title={isCreating ? "Create Patient" : "Edit Patient"}>
      <div className="mainBox">
        <div className="mainContent">
          <div className="formContainer">
            <form onSubmit={handleSubmit(onSubmit)}>
              <label>Select Person:</label>
              <select
                value={selectedPersonID || ""}
                onChange={(e) => setSelectedPersonID(e.target.value)}
                disabled={!isCreating} // Prevent changing person while editing
              >
                <option value="">-- Select Person --</option>
                {people.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.first_name} {person.last_name}
                  </option>
                ))}
              </select>

              {/* Render First Name to Address only when not editing */}
              {!isEditing && (
                <>
                  <label>First Name:</label>
                  <input
                    type="text"
                    {...register("firstName")}
                    disabled={!isCreating}
                  />

                  <label>Last Name:</label>
                  <input
                    type="text"
                    {...register("lastName")}
                    disabled={!isCreating}
                  />

                  <label>Gender:</label>
                  <select {...register("gender")} disabled={!isCreating}>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="NON_BINARY">Non-Binary</option>
                    <option value="OTHER">Other</option>
                  </select>

                  <label>Date of Birth:</label>
                  <DatePicker
                    selected={watch("dateOfBirth")}
                    onChange={(date) => setValue("dateOfBirth", date)}
                    dateFormat="dd-MM-yyyy"
                    disabled={!isCreating}
                  />

                  <label>Contact Number:</label>
                  <input
                    type="text"
                    {...register("contactNo")}
                    disabled={!isCreating}
                  />

                  <label>Address:</label>
                  <input
                    type="text"
                    {...register("address")}
                    disabled={!isCreating}
                  />
                </>
              )}

              {/* Inputs starting from height remain editable */}
              <label>Height:</label>
              <input
                type="text"
                {...register("height")}
                disabled={!isEditing && !isCreating}
              />

              <label>Weight:</label>
              <input
                type="text"
                {...register("weight")}
                disabled={!isEditing && !isCreating}
              />

              <label>Blood Type:</label>
              <input
                type="text"
                {...register("bloodType")}
                disabled={!isEditing && !isCreating}
              />

              <label>Allergies:</label>
              <input
                type="text"
                {...register("allergies")}
                disabled={!isEditing && !isCreating}
              />

              <label>Medical History:</label>
              <input
                type="text"
                {...register("medicalHistory")}
                disabled={!isEditing && !isCreating}
              />

              <label>Family History:</label>
              <input
                type="text"
                {...register("familyHistory")}
                disabled={!isEditing && !isCreating}
              />

              <label>Emergency Contact:</label>
              <input
                type="text"
                {...register("emergencyContact")}
                disabled={!isEditing && !isCreating}
              />

              <label>Relation:</label>
              <input
                type="text"
                {...register("emergencyRelation")}
                disabled={!isEditing && !isCreating}
              />

              {isCreating ? (
                <button type="submit">Create Patient</button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? "Cancel" : "Edit"}
                  </button>

                  {isEditing && <button type="submit">Save Changes</button>}
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PatientForm;
