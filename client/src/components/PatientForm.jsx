import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import "../styles/FormLayout.css";
import { useAuth } from "../AuthProvider";

const PatientForm = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const { patient_id } = useParams(); // Only use patient_id in the URL
  const { register, handleSubmit, setValue, watch } = useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedPersonID, setSelectedPersonID] = useState(null);
  const [people, setPeople] = useState([]);

  // Fetch data for the form
  useEffect(() => {
    setIsCreating(!patient_id); // If no patient_id, we are in create mode

    const fetchPeople = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/people", {
          headers: { Authorization: "Bearer " + auth.access_token },
        });
        setPeople(response.data);
      } catch (error) {
        console.error("Error fetching people:", error);
      }
    };

    fetchPeople(); // Load available people

    if (!patient_id) {
      console.log("Creating new patient"); // Skip fetching details if creating
      return;
    }

    const fetchPatientDetails = async () => {
      try {
        // Fetch patient details using patient_id
        const patientRes = await axios.get(
          `http://localhost:8080/api/get-patient-info/${patient_id}`,
          {
            headers: { Authorization: "Bearer " + auth.access_token },
          }
        );
        const patientData = patientRes.data;

        // Fetch person details linked to the patient
        const personRes = await axios.get(
          `http://localhost:8080/api/get-person-info/${patientData.person_id}`,
          {
            headers: { Authorization: "Bearer " + auth.access_token },
          }
        );
        const personData = personRes.data;

        // Fetch emergency contact details
        const emergencyContactRes = await axios.get(
          `http://localhost:8080/api/get-emergency-contact/${patient_id}`,
          {
            headers: { Authorization: "Bearer " + auth.access_token },
          }
        );
        const emergencyContactData = emergencyContactRes.data;

        // Populate form fields with data
        setSelectedPersonID(patientData.person_id); // Auto-select the person
        setValue("contactNo", personData.contact_no || "");
        setValue("address", personData.address || "");
        setValue("height", patientData.height || "");
        setValue("weight", patientData.weight || "");
        setValue("bloodType", patientData.blood_type || "");
        setValue("allergies", patientData.allergies || "");
        setValue("medicalHistory", patientData.medical_history || "");
        setValue("familyHistory", patientData.family_history || "");
        setValue("emergencyContact", emergencyContactData?.person_id || "");
        setValue("emergencyRelation", emergencyContactData?.relation || "");

        setIsEditing(true); // Set to edit mode
      } catch (error) {
        console.error("Error fetching patient details:", error);
      }
    };

    fetchPatientDetails();
  }, [patient_id, setValue]);

  // Submit form
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
            headers: { Authorization: "Bearer " + auth.access_token },
          }
        );

        alert("Patient created successfully!");
        navigate("/admin/patients");
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

        // Update patient data
        await axios.put(
          "http://localhost:8080/api/update-patient",
          patientData,
          {
            headers: { Authorization: "Bearer " + auth.access_token },
          }
        );

        alert("Patient updated successfully!");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error saving patient:", error);
    }
  };

  return (
    <MainLayout title={isCreating ? "Create Patient" : "Edit Patient"}>
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

export default PatientForm;
