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
import Account from "./pages/users/Account";
import Dashboard from "./pages/users/Dashboard";
import Patients from "./pages/users/Patients";
import Appointments from "./pages/users/Appointments";
import Reports from "./pages/users/Reports";
import Inventory from "./pages/users/Inventory";
import PatientForm from "./components/PatientForm";

import Users from "./pages/users/Users";
import People from "./pages/users/People";
import PersonForm from "./components/PersonForm";
import UserForm from "./components/UserForm";
import InventoryForm from "./components/InventoryForm";
import EmployeeForm from "./components/EmployeeForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/create/patient" element={<PatientForm />} />
        <Route path="/create/person" element={<PersonForm />} />
        <Route path="/create/user" element={<UserForm />} />
        <Route path="/create/employee" element={<EmployeeForm />} />
        <Route path="/create/inventory" element={<InventoryForm />} />
        <Route path="/edit/:patient_id/:person_id" element={<PatientForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />

        {/* Admin Routes */}
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/account" element={<Account />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/people" element={<People />} />
        <Route path="/admin/patients" element={<Patients />} />
        <Route path="/admin/employees" element={<Employees />} />
        <Route path="/admin/appointments" element={<Appointments />} />
        <Route path="/admin/inventory" element={<Inventory />} />
        <Route path="/admin/reports" element={<Reports />} />

        {/* Employee Routes */}
        <Route path="/employee/account" element={<Account />} />
        <Route path="/employee/patients" element={<Patients />} />
      </Routes>
    </Router>
  );
}

export default App;
