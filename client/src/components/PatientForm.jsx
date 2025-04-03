import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import "../styles/FormLayout.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

const PatientForm = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState({});
  const [people, setPeople] = useState([]);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/patients/${id}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
          }
        );
        setPatient(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching patient:", error);
      }
    };

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

    fetchPatient();
    fetchPeople();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // First, update the patient
      await axios.put("http://localhost:8080/api/update-patient", formData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      });

      // Now, update the person's data (you may need to adjust formData to include the necessary fields for the person)
      const personData = {
        id: formData.emergency_contact_person_id,
        first_name: formData.first_name,
        last_name: formData.last_name,
        gender: formData.gender,
        date_of_birth: formData.date_of_birth,
        contact_no: formData.contact_no,
        address: formData.address,
      };

      await axios.put("http://localhost:8080/api/update-person", personData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      });

      alert("Patient updated successfully");
    } catch (error) {
      console.error("Error updating patient:", error);
    }
  };

  return (
    <MainLayout title="Edit Patient">
      <div className="mainBox">
        <div className="mainContent">
          <div className="formContainer">
            <form onSubmit={handleSubmit}>
              <label>First Name:</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name || ""}
                onChange={handleChange}
                required
              />
              <label>Last Name:</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name || ""}
                onChange={handleChange}
                required
              />
              <br />
              <label>Gender:</label>
              <input
                type="text"
                name="height"
                value={formData.height || ""}
                onChange={handleChange}
                required
              />
              <br />
              <label>Date of Birth:</label>
              <input
                type="text"
                name="height"
                value={formData.height || ""}
                onChange={handleChange}
                required
              />
              <br />
              <label>Contact Number:</label>
              <input
                type="text"
                name="height"
                value={formData.height || ""}
                onChange={handleChange}
                required
              />
              <br />
              <label>Address:</label>
              <input
                type="text"
                name="height"
                value={formData.height || ""}
                onChange={handleChange}
                required
              />
              <br />
              <label>Height:</label>
              <input
                type="text"
                name="height"
                value={formData.height || ""}
                onChange={handleChange}
                required
              />
              <br />
              <label>Weight:</label>
              <input
                type="text"
                name="weight"
                value={formData.weight || ""}
                onChange={handleChange}
                required
              />
              <br />
              <label>Blood Type:</label>
              <input
                type="text"
                name="blood_type"
                value={formData.blood_type || ""}
                onChange={handleChange}
              />
              <br />
              <label>Allergies:</label>
              <input
                type="text"
                name="allergies"
                value={formData.allergies || ""}
                onChange={handleChange}
              />
              <br />
              <label>Medical History:</label>
              <input
                type="text"
                name="medical_history"
                value={formData.medical_history || ""}
                onChange={handleChange}
              />
              <br />
              <label>Family History:</label>
              <input
                type="text"
                name="family_history"
                value={formData.family_history || ""}
                onChange={handleChange}
              />
              <br />
              <label>Emergency Contact:</label>
              <select
                name="emergency_contact_person_id"
                value={formData.emergency_contact_person_id || ""}
                onChange={handleChange}
              >
                <option value="">Select Contact</option>
                {people.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.first_name} {person.last_name}
                  </option>
                ))}
              </select>
              <br />
              <label>Relation:</label>
              <input
                type="text"
                name="emergency_contact_relation"
                value={formData.emergency_contact_relation || ""}
                onChange={handleChange}
              />
              <br />
              <button type="submit">Save Changes</button>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PatientForm;
