import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import "../styles/FormLayout.css";

const UserForm = () => {
  const { id } = useParams(); // Get the user ID from the URL for edit functionality
  const { register, handleSubmit, setValue, watch } = useForm();
  const navigate = useNavigate();
  const [people, setPeople] = useState([]); // List of people for dropdown
  const [selectedPersonID, setSelectedPersonID] = useState(""); // Selected person ID
  const [isCreating, setIsCreating] = useState(!id); // Determines if we are creating or editing
  const [isEditing, setIsEditing] = useState(!!id); // Determines if we are creating or editing

  useEffect(() => {
    // Fetch people for the dropdown
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

    fetchPeople();

    if (!id) {
      console.log("Creating a new user");
      return;
    }

    // Fetch user data for editing if ID is present
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/user/${id}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
          }
        );
        const userData = response.data;

        // Pre-fill the form fields with existing user data
        setValue("username", userData.username || "");
        setValue("email", userData.email || "");
        setValue("password", "********"); // Placeholder for password
        setValue("role", userData.role || "");
        setValue("security_question", userData.security_question || "");
        setValue("security_answer", userData.security_answer || "");
        setSelectedPersonID(userData.person_id || "");
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUser();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      const userData = {
        username: data.username,
        email: data.email,
        password: data.password,
        role: data.role,
        security_question: data.security_question,
        security_answer: data.security_answer,
        person_id: selectedPersonID
      };

      console.log(userData);

      console.log(userData);

      if (isCreating) {
        // Create a new user
        await axios.post("http://localhost:8080/register", userData, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        });
        alert("User created successfully!");
      } else {
        // Update an existing user
        await axios.put(`http://localhost:8080/api/user/${id}`, userData, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        });
        alert("User updated successfully!");
      }

      navigate("/admin/users");
    } catch (error) {
      console.error(
        isCreating ? "Error creating user:" : "Error updating user:",
        error
      );
    }
  };

  return (
    <MainLayout title={isCreating ? "Create User" : "Edit User"}>
      <div className="mainContent">
        <div className="formContainer">
          <form onSubmit={handleSubmit(onSubmit)}>
            <label>Username:</label>
            <input
              type="text"
              {...register("username", { required: true, maxLength: 255 })}
              disabled={!isEditing && !isCreating}
            />

            <label>Password:</label>
            <input
              type="password"
              {...register("password", { required: true, maxLength: 50 })}
              disabled={!isEditing && !isCreating}
            />

            <label>Email:</label>
            <input
              type="email"
              {...register("email", { required: true, maxLength: 255 })}
              disabled={!isEditing && !isCreating}
            />

            <label>Person ID:</label>
            <select
              value={selectedPersonID}
              onChange={(e) => setSelectedPersonID(e.target.value)}
              disabled={!isEditing && !isCreating}
            >
              <option value="">-- Select Person --</option>
              {people.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.first_name} {person.last_name}
                  disabled={!isEditing && !isCreating}
                </option>
              ))}
            </select>

            <label>Role:</label>
            <select
              {...register("role", { required: true })}
              disabled={!isEditing && !isCreating}
            >
              <option value="">-- Select Role --</option>
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>

            <label>Security Question:</label>
            <input
              type="text"
              {...register("security_question", {
                required: true,
                maxLength: 255,
              })}
              disabled={!isEditing && !isCreating}
            />

            <label>Answer:</label>
            <input
              type="text"
              {...register("security_answer", {
                required: true,
                maxLength: 50,
              })}
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

export default UserForm;
