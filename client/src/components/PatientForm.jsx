import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/FormLayout.css";

const PatientForm = () => {
  const { id: patient_id } = useParams(); // Use useParams to get the 'id' from the URL
  const { register, handleSubmit, setValue, watch } = useForm();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchPatientAndPerson = async () => {
      try {
        // Fetch patient info first
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
          // Now use person_id from patient info to fetch person details
          const personRes = await axios.get(
            `http://localhost:8080/api/get-person-info/${patientData.person_id}`,
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("access_token"),
              },
            }
          );
          const personData = personRes.data;

          // Fetch emergency contact info
          // const emergencyContactRes = await axios.get(
          //   `http://localhost:8080/api/get-emergency-contact/${patient_id}`,
          //   {
          //     headers: {
          //       Authorization: "Bearer " + localStorage.getItem("access_token"),
          //     },
          //   }
          // );
          
          // emergencyContactData.then
          // const emergencyContactData = emergencyContactRes.data;

          // Populate form fields with the retrieved data
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

          // if (emergencyContactData ) {
          //   setValue("emergencyContact", emergencyContactData.person_id || "");
          //   setValue("emergencyRelation", emergencyContactData.relation || "");
          // }
        }
      } catch (error) {
        console.error("Error fetching patient details:", error);
      }
    };

    fetchPatientAndPerson();
  }, [patient_id, setValue]);

  const onSubmit = async (data) => {
    try {
      const patientData = {
        id: patient_id,
        height: data.height,
        weight: data.weight,
        blood_type: data.bloodType,
        allergies: data.allergies,
        medical_history: data.medicalHistory,
        family_history: data.familyHistory,
        emergency_contact_id: data.emergencyContact,
      };

      const personData = {
        id: patient_id,
        first_name: data.firstName,
        last_name: data.lastName,
        gender: data.gender,
        date_of_birth: data.dateOfBirth,
        contact_no: data.contactNo,
        address: data.address,
      };

      // Update patient data
      await axios.put("http://localhost:8080/api/update-patient", patientData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      });

      // Update person data
      await axios.put("http://localhost:8080/api/update-person", personData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      });

      // If emergency contact has changed, update it
      // if (data.emergencyContact) {
      //   await axios.put(
      //     `http://localhost:8080/api/update-emergency-contact/${patient_id}`,
      //     {
      //       person_id: data.emergencyContact,
      //       relation: data.emergencyRelation,
      //     },
      //     {
      //       headers: {
      //         Authorization: "Bearer " + localStorage.getItem("access_token"),
      //       },
      //     }
      //   );
      // }

      alert("Patient updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating patient:", error);
    }
  };

  return (
    <MainLayout title="Edit Patient">
      <div className="mainBox">
        <div className="mainContent">
          <div className="formContainer">
            <form onSubmit={handleSubmit(onSubmit)}>
              <label>First Name:</label>
              <input
                type="text"
                {...register("firstName")}
                disabled={!isEditing}
              />

              <label>Last Name:</label>
              <input
                type="text"
                {...register("lastName")}
                disabled={!isEditing}
              />

              <label>Gender:</label>
              <select {...register("gender")} disabled={!isEditing}>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="NON-BINARY">Non-Binary</option>
                <option value="OTHER">Other</option>
              </select>

              <label>Date of Birth:</label>
              <DatePicker
                selected={watch("dateOfBirth")}
                onChange={(date) => setValue("dateOfBirth", date)}
                dateFormat="MM-dd-yyyy"
                disabled={!isEditing}
              />

              <label>Contact Number:</label>
              <input
                type="text"
                {...register("contactNo")}
                disabled={!isEditing}
              />

              <label>Address:</label>
              <input
                type="text"
                {...register("address")}
                disabled={!isEditing}
              />

              <label>Height:</label>
              <input
                type="text"
                {...register("height")}
                disabled={!isEditing}
              />

              <label>Weight:</label>
              <input
                type="text"
                {...register("weight")}
                disabled={!isEditing}
              />

              <label>Blood Type:</label>
              <input
                type="text"
                {...register("bloodType")}
                disabled={!isEditing}
              />

              <label>Allergies:</label>
              <input
                type="text"
                {...register("allergies")}
                disabled={!isEditing}
              />

              <label>Medical History:</label>
              <input
                type="text"
                {...register("medicalHistory")}
                disabled={!isEditing}
              />

              <label>Family History:</label>
              <input
                type="text"
                {...register("familyHistory")}
                disabled={!isEditing}
              />

              <label>Emergency Contact:</label>
              <input
                type="text"
                {...register("emergencyContact")}
                disabled={!isEditing}
              />

              <label>Relation:</label>
              <input
                type="text"
                {...register("emergencyRelation")}
                disabled={!isEditing}
              />
              <button type="button" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? "Cancel" : "Edit"}
              </button>

              {isEditing && <button type="submit">Save Changes</button>}
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PatientForm;
