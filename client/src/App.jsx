import { useState, useEffect, useContext } from "react";
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
import { useAuth } from "./AuthProvider";

function App() {
  const auth = useAuth();
  const [isLoggedIn, SetLoggedIn] = useState(false);
  const [isAdmin, SetIsAdmin] = useState(false);
  const [loading, SetLoading] = useState(true); // Add loading state to wait for auth data

  useEffect(() => {
    if (auth.userID != null) {
      SetLoggedIn(true);
      SetIsAdmin(auth.role === "admin");
    } else {
      SetLoggedIn(false);
      SetIsAdmin(false);
    }
    SetLoading(false); // Set loading to false once the auth data is loaded
  }, [auth]);

  if (loading) {
    return <div>Loading...</div>; // Optional: Show loading state while auth data is fetched
  }

  return (
    <Router>
      <Routes>
        {isLoggedIn ? (
          <Route
            path="/"
            element={<Navigate to={"/" + auth.role + "/dashboard"} replace />}
          />
        ) : (
          <Route path="/" element={<Navigate to="/login" replace />} />
        )}

        {isAdmin ? (
          <>
            {" "}
            {/* ADMIN ROUTES */}
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/people" element={<People />} />
            <Route path="/admin/patients" element={<Patients />} />
            <Route path="/admin/employees" element={<Employees />} />
            <Route path="/admin/appointments" element={<Appointments />} />
            <Route path="/admin/inventory" element={<Inventory />} />
            <Route path="/create/patient" element={<PatientForm />} />
            <Route path="/create/person" element={<PersonForm />} />
            <Route path="/create/user" element={<UserForm />} />
            <Route path="/create/employee" element={<EmployeeForm />} />
            <Route path="/create/inventory" element={<InventoryForm />} />
            <Route path="/create/appointment" element={<AppointmentForm />} />
            <Route path="/edit-user/:id" element={<UserForm />} />
            <Route path="/edit-person/:id" element={<PersonForm />} />
            <Route
              path="/edit-employee/:person_id"
              element={<EmployeeForm />}
            />
            <Route path="/edit-patient/:patient_id" element={<PatientForm />} />
            <Route path="/edit-appointment/:id" element={<AppointmentForm />} />
            <Route
              path="/edit-inventory-item/:id"
              element={<InventoryForm />}
            />
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

        {/* Public Routes */}
        {!isLoggedIn && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
          </>
        )}

        <Route path="/logout" element={<Navigate to="/login" replace />} />
        {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
