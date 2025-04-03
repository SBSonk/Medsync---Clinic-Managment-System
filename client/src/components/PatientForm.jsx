import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import "../styles/FormLayout.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const PatientForm = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState({});
  const [people, setPeople] = useState([]);
  const [formData, setFormData] = useState({});
  const { control, handleSubmit, register, setValue } = useForm();

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
        // Set initial form values
        setValue("first_name", response.data.first_name);
        setValue("last_name", response.data.last_name);
        setValue("gender", response.data.gender);
        setValue("date_of_birth", new Date(response.data.date_of_birth));
        setValue("contact_no", response.data.contact_no);
        setValue("address", response.data.address);
        setValue("height", response.data.height);
        setValue("weight", response.data.weight);
        setValue("blood_type", response.data.blood_type);
        setValue("allergies", response.data.allergies);
        setValue("medical_history", response.data.medical_history);
        setValue("family_history", response.data.family_history);
        setValue(
          "emergency_contact_person_id",
          response.data.emergency_contact_person_id
        );
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
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      // First, update the patient
      await axios.put("http://localhost:8080/api/update-patient", data, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      });

      // Now, update the person's data
      const personData = {
        id: data.emergency_contact_person_id,
        first_name: data.first_name,
        last_name: data.last_name,
        gender: data.gender,
        date_of_birth: data.date_of_birth,
        contact_no: data.contact_no,
        address: data.address,
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <label>First Name:</label>
              <input
                type="text"
                {...register("first_name", { required: true })}
              />
              <label>Last Name:</label>
              <input
                type="text"
                {...register("last_name", { required: true })}
              />
              <br />

              <label>Gender:</label>
              <div>
                <label>
                  <input
                    type="radio"
                    value="MALE"
                    {...register("gender", { required: true })}
                  />
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    value="FEMALE"
                    {...register("gender", { required: true })}
                  />
                  Female
                </label>
                <label>
                  <input
                    type="radio"
                    value="NON-BINARY"
                    {...register("gender", { required: true })}
                  />
                  Non-Binary
                </label>
                <label>
                  <input
                    type="radio"
                    value="OTHER"
                    {...register("gender", { required: true })}
                  />
                  Other
                </label>
              </div>

              <label>Date of Birth:</label>
              <Controller
                name="date_of_birth"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    selected={field.value}
                    onChange={(date) => setValue("date_of_birth", date)}
                    dateFormat="MM-dd-yyyy"
                    className="date-picker"
                    required
                  />
                )}
              />
              <br />

              <label>Contact Number:</label>
              <input
                type="text"
                {...register("contact_no", { required: true })}
              />
              <br />
              <label>Address:</label>
              <input type="text" {...register("address", { required: true })} />
              <label>Height:</label>
              <input type="text" {...register("height", { required: true })} />
              <label>Weight:</label>
              <input type="text" {...register("weight", { required: true })} />
              <label>Blood Type:</label>
              <input type="text" {...register("blood_type")} />
              <label>Allergies:</label>
              <input type="text" {...register("allergies")} />
              <label>Medical History:</label>
              <input type="text" {...register("medical_history")} />
              <label>Family History:</label>
              <input type="text" {...register("family_history")} />
              <label>Emergency Contact:</label>
              <select {...register("emergency_contact_person_id")}>
                <option value="">Select Contact</option>
                {people.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.first_name} {person.last_name}
                  </option>
                ))}
              </select>
              <label>Relation:</label>
              <input type="text" {...register("emergency_contact_relation")} />
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
