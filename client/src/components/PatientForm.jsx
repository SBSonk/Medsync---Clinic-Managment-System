import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "../styles/FormLayout.css";
import { useAuth } from "../AuthProvider";

function extractDate(dateTime) {
  // Extract date portion "YYYY-MM-DD"
  return dateTime.split("-")[0]; // "2025-04-06"
}

const PatientForm = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const { patient_id } = useParams(); // Only use patient_id in the URL
  const { register, handleSubmit, setValue, watch, reset } = useForm();
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
        console.log(personData);

        reset({
          firstName: personData.first_name || "",
          lastName: personData.last_name || "",
          gender: personData.gender || "",
          dateOfBirth: personData.date_of_birth
            ? new Date(extractDate(personData.date_of_birth))
            : null,
          contactNo: personData.contact_no || "",
          address: personData.address || "",
          height: patientData.height || "",
          weight: patientData.weight || "",
          bloodType: patientData.blood_type || "",
          allergies: patientData.allergies || "",
          medicalHistory: patientData.medical_history || "",
          familyHistory: patientData.family_history || "",
          emergencyContact: patientData.emergency_contact_person_id || "",
          emergencyRelation:
            patientData.emergency_contact_person_relation || "",
        });

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
          emergency_contact_person_id: Number(data.emergencyContact),
          emergency_contact_relation: data.emergencyRelation,
          person_id: selectedPersonID, // Link selected person ID
        };

        console.log(newPatient);

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
      <div className="formContainer">
        <form onSubmit={handleSubmit(onSubmit)}>
          {" "}
          {/* Single form wrapping both columns */}
          <div className="columnsContainer">
            {/* Person Details Column */}
            <div className="column">
              {isCreating && ( // Render dropdown only if isCreating is true
                <>
                  <label>Select Person:</label>
                  <select
                    value={selectedPersonID || ""}
                    disabled={!isCreating}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      setSelectedPersonID(selectedId);

                      // Find the selected person from the people list
                      const selectedPerson = people.find(
                        (person) => person.id === parseInt(selectedId)
                      );

                      if (selectedPerson) {
                        // Automatically populate fields based on selected person
                        reset({
                          firstName: selectedPerson.first_name || "",
                          lastName: selectedPerson.last_name || "",
                          gender: selectedPerson.gender || "",
                          dateOfBirth: selectedPerson.date_of_birth
                            ? new Date(selectedPerson.date_of_birth)
                            : "00-00-00",
                          contactNo: selectedPerson.contact_no || "",
                          address: selectedPerson.address || "",
                          height: "0", // Clear patient-specific fields
                          weight: "0",
                          bloodType: "",
                          allergies: "",
                          medicalHistory: "",
                          familyHistory: "",
                          emergencyContact: "",
                          emergencyRelation: "",
                        });
                      }
                    }}
                  >
                    <option value="">-- Select Person --</option>
                    {people.map((person) => (
                      <option key={person.id} value={person.id}>
                        {person.first_name} {person.last_name}
                      </option>
                    ))}
                  </select>
                </>
              )}

              {/* These fields will be auto-filled or stay empty */}
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
                showMonthDropdown
                showYearDropdown
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
            </div>

            {/* Patient Details Column */}
            <div className="column">
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
              <select
                {...register("bloodType", { required: true })}
                disabled={!isEditing && !isCreating}
              >
                <option value="">-- Select Blood Type --</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>

              <label>Allergies:</label>
              <input
                type="text"
                {...register("allergies")}
                disabled={!isEditing && !isCreating}
              />

              <label>Medical History:</label>
              <textarea
                {...register("medicalHistory")}
                disabled={!isEditing && !isCreating}
              />

              <label>Family History:</label>
              <textarea
                {...register("familyHistory")}
                disabled={!isEditing && !isCreating}
              />

              <label>Emergency Contact:</label>
              <select
                {...register("emergencyContact", { required: true })}
                defaultValue={watch("emergencyContact") || ""}
                disabled={!isEditing && !isCreating}
              >
                <option value="">-- Select Emergency Contact --</option>
                {people.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.first_name} {person.last_name} (ID: {person.id})
                  </option>
                ))}
              </select>

              <label>Relation:</label>
              <select
                {...register("emergencyRelation", { required: true })}
                disabled={!isEditing && !isCreating}
              >
                <option value="">-- Select Relationship --</option>
                <option value="Spouse">Spouse</option>
                <option value="Parent">Parent</option>
                <option value="Sibling">Sibling</option>
                <option value="Child">Child</option>
                <option value="Friend">Friend</option>
                <option value="Guardian">Guardian</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
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
          {/* Single button for submission */}
        </form>
      </div>
    </MainLayout>
  );
};

export default PatientForm;
