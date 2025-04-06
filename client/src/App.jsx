import { useState, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import "./styles/AuthLayout.css";
import Employees from "./pages/users/Employees";
import Dashboard from "./pages/users/Dashboard";
import Patients from "./pages/users/Patients";
import Appointments from "./pages/users/Appointments";
import Inventory from "./pages/users/Inventory";
import PatientForm from "./components/PatientForm";

import Users from "./pages/users/Users";
import People from "./pages/users/People";
import PersonForm from "./components/PersonForm";
import UserForm from "./components/UserForm";
import InventoryForm from "./components/InventoryForm";
import EmployeeForm from "./components/EmployeeForm";
import AppointmentForm from "./components/AppointmentForm";

function App() {
  const [isLoggedIn, SetLoggedIn] = useState([]);
  const [isAdmin, SetIsAdmin] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("role");

    SetLoggedIn(!!token); // convert to boolean
    SetIsAdmin(role === "admin");
  }, []);

  return (
    <Router>
      <Routes>
        {isLoggedIn ? (
          isAdmin ? (
            <Route
              path="/"
              element={<Navigate to="/admin/dashboard" replace />}
            />
          ) : (
            <Route
              path="/"
              element={<Navigate to="/employee/dashboard" replace />}
            />
          )
        ) : (
          <Route path="/" element={<Navigate to="/login" replace />} />
        )}

        {isAdmin ? (
          <>
            {" "}
            {/* ADMIN ROUTES */}
            <Route path="/create/patient" element={<PatientForm />} />
            <Route path="/create/person" element={<PersonForm />} />
            <Route path="/create/user" element={<UserForm />} />
            <Route path="/create/employee" element={<EmployeeForm />} />
            <Route path="/create/inventory" element={<InventoryForm />} />
            <Route path="/create/appointment" element={<AppointmentForm />} />
            <Route path="/edit-user/:id" element={<UserForm />} />
            <Route path="/update-user/:id" element={<UserForm />} />
            <Route
              path="/edit-employee/:person_id"
              element={<EmployeeForm />}
            />
            <Route
              path="/edit-patient/:patient_id/:person_id"
              element={<PatientForm />}
            />
            <Route 
              path="/edit-appointment/:id" 
              element={<AppointmentForm />} 
            />
            <Route
              path="/edit-inventory-item/:id"
              element={<InventoryForm />}
            />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/people" element={<People />} />
            <Route path="/admin/patients" element={<Patients />} />
            <Route path="/admin/employees" element={<Employees />} />
            <Route path="/admin/appointments" element={<Appointments />} />
            <Route path="/admin/inventory" element={<Inventory />} />
          </>
        ) : (
          <>
            {" "}
            {/* PATIENT ROUTES */}
            <Route path="/employee/patients" element={<Patients />} />
            <Route path="/employee/dashboard" element={<Dashboard />} />
            <Route path="/employee/appointments" element={<Appointments />} />
            <Route path="/employee/inventory" element={<Inventory />} />
          </>
        )}

        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Navigate to="/login" replace />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
