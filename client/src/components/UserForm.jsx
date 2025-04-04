import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/FormLayout.css";
import { Dropdown } from "primereact/Dropdown";

const dropdown_test = {
  color: "black",
};

const UserForm = () => {
  const { register, handleSubmit, setValue, watch } = useForm();
  const navigate = useNavigate();
  const [selectedPersonID, setSelectedPersonID] = useState([]);
  const [people, setPeople] = useState([]);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/people", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        });
        setPeople(response.data);
      } catch (error) {
        console.error("Error fetching People:", error);
      }
    };

    fetchPeople();
  }, []);

  const onSubmit = async (data) => {
    try {
      const userData = {
        email: data.email,
        username: data.username,
        password: data.password,
        role: data.role,
        security_question: data.security_question,
        security_answer: data.security_answer,
        person_id: selectedPersonID.id,
      };

      // Update person data
      await axios.post("http://localhost:8080/register", userData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      });

      alert("User created successfully!");
      navigate("/admin/users");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <MainLayout title="Create User">
      <div className="mainBox">
        <div className="mainContent">
          <div className="formContainer">
            <form onSubmit={handleSubmit(onSubmit)}>
              <label>Username:</label>
              <input
                type="text"
                {...register("username", { required: true, maxLength: 255 })}
              />

              <label>Password:</label>
              <input
                type="password"
                {...register("password", { required: true, maxLength: 50 })}
              />

              <label>Email:</label>
              <input
                type="email"
                {...register("email", { required: true, maxLength: 255 })}
              />

              <label>Person ID:</label>
              <select onChange={(e) => setSelectedPersonID(e.target.value)}>
                <option value="">-- Select Person --</option>
                {people.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.first_name} {person.last_name}
                  </option>
                ))}
              </select>

              <label>Role:</label>
              <select {...register("role", { required: true })}>
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
              />

              <label>Answer:</label>
              <input
                type="text"
                {...register("security_answer", {
                  required: true,
                  maxLength: 50,
                })}
              />

              <button type="submit">Create User</button>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserForm;
