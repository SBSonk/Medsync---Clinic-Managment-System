import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/FormLayout.css";
import { useAuth } from "../AuthProvider";

function formatDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

const PersonForm = () => {
  const auth = useAuth();
  const { id } = useParams(); // Get person ID from URL
  const { register, handleSubmit, setValue, watch } = useForm(); // React Hook Form
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(!id); // Create mode if no ID
  const [isEditing, setIsEditing] = useState(!!id); // Edit mode if ID exists

  useEffect(() => {
    if (!id) {
      // If creating a new person, no need to fetch data
      console.log("Creating a new person");
      return;
    }

    // Fetch person data for editing
    const fetchPerson = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/get-person-info/${id}`,
          {
            headers: {
              Authorization: "Bearer " + auth.access_token,
            },
          }
        );
        const personData = response.data;

        // Pre-fill the form fields with existing person data
        setValue("first_name", personData.first_name || "");
        setValue("last_name", personData.last_name || "");
        setValue("gender", personData.gender || "");
        setValue(
          "date_of_birth",
          personData.date_of_birth ? new Date(personData.date_of_birth) : null
        );
        setValue("contact_no", personData.contact_no || "");
        setValue("address", personData.address || "");
      } catch (error) {
        console.error("Error fetching person details:", error);
      }
    };

    fetchPerson();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      const personData = {
        id: id,
        first_name: data.first_name,
        last_name: data.last_name,
        gender: data.gender,
        date_of_birth: formatDate(data.date_of_birth),
        contact_no: data.contact_no,
        address: data.address,
      };

      if (isCreating) {
        // Create new person
        await axios.post(
          "http://localhost:8080/api/create-person",
          personData,
          {
            headers: {
              Authorization: "Bearer " + auth.access_token,
            },
          }
        );
        alert("Person created successfully!");
      } else {
        // Update existing person
        await axios.put("http://localhost:8080/api/update-person", personData, {
          headers: {
            Authorization: "Bearer " + auth.access_token,
          },
        });
        alert("Person updated successfully!");
      }
      navigate("/admin/people"); // Redirect after submission
    } catch (error) {
      console.error(
        isCreating ? "Error creating person:" : "Error updating person:",
        error
      );
    }
  };

  return (
    <MainLayout title={isCreating ? "Create Person" : "Edit Person"}>
      <div className="formContainer">
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>First Name:</label>
          <input
            type="text"
            {...register("first_name", { required: true, maxLength: 50 })}
            disabled={!isEditing && !isCreating}
          />

          <label>Last Name:</label>
          <input
            type="text"
            {...register("last_name", { required: true, maxLength: 50 })}
            disabled={!isEditing && !isCreating}
          />

          <label>Gender:</label>
          <select
            {...register("gender", { required: true })}
            disabled={!isEditing && !isCreating}
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="NON_BINARY">Non-Binary</option>
            <option value="OTHER">Other</option>
          </select>

          <label>Date of Birth:</label>
          <DatePicker
            selected={watch("date_of_birth")}
            onChange={(date) => setValue("date_of_birth", date)}
            dateFormat="dd-MM-yyyy"
            showMonthDropdown
            showYearDropdown
            disabled={!isEditing && !isCreating}
          />

          <label>Contact Number:</label>
          <input
            type="text"
            {...register("contact_no", { required: true, maxLength: 31 })}
            disabled={!isEditing && !isCreating}
          />

          <label>Address:</label>
          <input
            type="text"
            {...register("address", { required: true, maxLength: 255 })}
            disabled={!isEditing && !isCreating}
          />

          {isCreating ? (
            <button type="submit">Create Person</button>
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

export default PersonForm;
