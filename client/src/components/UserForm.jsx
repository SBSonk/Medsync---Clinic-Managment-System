import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import "../styles/FormLayout.css";

const UserForm = () => {
  const { id } = useParams(); // Get user ID from URL
  const { register, handleSubmit, setValue } = useForm(); // React Hook Form
  const [isCreating, setIsCreating] = useState(!id); // Create mode if no ID
  const [isEditing, setIsEditing] = useState(!!id); // Edit mode if ID exists

  useEffect(() => {
    if (!id) {
      // If creating a new user, no need to fetch data
      console.log("Creating a new user");
      return;
    }

    // Fetch user data for editing
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/get-user-info/${id}`,
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
        setValue("password", "********"); // Use a placeholder for security
        setValue("role", userData.role || "");
        setValue("security_question", userData.security_question || "");
        setValue("security_answer", "");
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUser();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      const userData = {
        id: id,
        username: data.username,
        email: data.email,
        password: data.password,
        role: data.role,
        security_question: data.security_question,
        security_answer: data.security_answer,
      };

      if (isCreating) {
        // Create new user
        await axios.post("http://localhost:8080/register", userData, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        });
        alert("User created successfully!");
      } else {
        // Update existing user
        await axios.put(`http://localhost:8080/api/update-user`, userData, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        });
        alert("User updated successfully!");
      }
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

            <label>Security Answer:</label>
            <input
              type="text"
              {...register("security_answer", {
                required: isCreating,
                maxLength: 255,
              })}
              placeholder={
                isEditing ? "Enter new security answer to update" : ""
              }
              disabled={!isEditing && !isCreating}
            />

            {isCreating ? (
              <button type="submit">Create User</button>
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
