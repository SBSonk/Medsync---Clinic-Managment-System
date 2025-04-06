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

const EmployeeForm = () => {
  const auth = useAuth();
  const { person_id } = useParams();
  const { register, handleSubmit, setValue, watch } = useForm();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedPersonID, setSelectedPersonID] = useState(null);
  const [people, setPeople] = useState([]);

  useEffect(() => {
    setIsCreating(!person_id);

    const fetchPeople = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/people", {
          headers: {
            Authorization: "Bearer " + auth.access_token,
          },
        });
        setPeople(response.data);
      } catch (error) {
        console.error("Error fetching people:", error);
      }
    };

    fetchPeople(); // Load available people

    if (!person_id) {
      console.log("creating");
      return;
    }

    const fetchEmployeeAndPerson = async () => {
      try {
        const employeeRes = await axios.get(
          `http://localhost:8080/api/get-employee-info/${person_id}`,
          {
            headers: {
              Authorization: "Bearer " + auth.access_token,
            },
          }
        );
        const employeeData = employeeRes.data;

        if (employeeData && employeeData.person_id) {
          const personRes = await axios.get(
            `http://localhost:8080/api/get-person-info/${person_id}`,
            {
              headers: {
                Authorization: "Bearer " + auth.access_token,
              },
            }
          );
          const personData = personRes.data;

          // Form value setting
          setValue("firstName", personData.first_name || "");
          setValue("lastName", personData.last_name || "");
          setValue("gender", personData.gender || "");
          setValue("contactNo", personData.contact_no || "");
          setValue("address", personData.address || "");

          setValue("occupation", employeeData.occupation || "");
          setValue("department", employeeData.department || "");
          setValue("shift", employeeData.schedule || "");

          console.log(employeeData);
        }
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    fetchEmployeeAndPerson();

    if (person_id) {
      setSelectedPersonID(person_id);
    }
  }, [person_id, setValue]);

  const onSubmit = async (data) => {
    try {
      if (isCreating) {
        if (!selectedPersonID) {
          alert("Please select a person before creating an employee.");
          return;
        }

        const newEmployee = {
          person_id: selectedPersonID, // Link selected person ID
          occupation: data.occupation,
          department: data.department,
          schedule: data.schedule,
        };

        await axios.post(
          "http://localhost:8080/api/create-employee",
          newEmployee,
          {
            headers: {
              Authorization: "Bearer " + auth.access_token,
            },
          }
        );

        alert("Employee created successfully!");
        navigate("/admin/employees");
      } else if (isEditing) {
        const employeeData = {
          person_id: person_id, // Keep the same ID
          occupation: data.occupation,
          department: data.department,
          schedule: data.schedule,
        };

        const personData = {
          id: person_id,
        };

        console.log(employeeData);

        // Update employee data
        await axios.put(
          "http://localhost:8080/api/update-employee",
          employeeData,
          {
            headers: {
              Authorization: "Bearer " + auth.access_token,
            },
          }
        );

        // Update person data
        await axios.put("http://localhost:8080/api/update-person", personData, {
          headers: {
            Authorization: "Bearer " + auth.access_token,
          },
        });

        alert("Employee updated successfully!");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  return (
    <MainLayout title={isCreating ? "Create Employee" : "Edit Employee"}>
      <div className="formContainer">
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Select Person</label>
          <select
            value={selectedPersonID || ""}
            onChange={(e) => setSelectedPersonID(e.target.value)}
            disabled={!isCreating}
          >
            <option value="">-- Select Person --</option>
            {people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.first_name} {person.last_name}
              </option>
            ))}
          </select>

          <label>Occupation:</label>
          <input
            type="text"
            {...register("occupation", {
              required: true,
              maxLength: 50,
            })}
            disabled={!isEditing && !isCreating}
          />

          <label>Department:</label>
          <input
            type="text"
            {...register("department", {
              required: true,
              maxLength: 50,
            })}
            disabled={!isEditing && !isCreating}
          />

          <label>Schedule:</label>
          <input
            type="text"
            {...register("shift", { required: true, maxLength: 31 })}
            disabled={!isEditing && !isCreating}
          />

          {isCreating ? (
            <button type="submit">Create Employee</button>
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

export default EmployeeForm;
