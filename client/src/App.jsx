import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
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
import Edit from "./pages/users/Edit";
import PatientForm from "./components/PatientForm";
import MainLayout from "./layouts/MainLayout";

import Add from "./pages/users/Add";

function App() {
  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:8080/api/users");
    console.log(response.data.users);
    setArray(response.data.users);
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to='/login' replace />} />
        <Route path="/edit" element={<PatientForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />

        {/* Admin Routes */}
        <Route path="/admin/account" element={<Account />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/patients" element={<Patients />} />
        <Route path="/admin/employees" element={<Employees />} />
        <Route path="/admin/add" element={<Add />} />
        <Route path="/admin/appointments" element={<Appointments />} />
        <Route path="/admin/inventory" element={<Inventory />} />
        <Route path="/admin/reports" element={<Reports />} />

        {/* Employee Routes */}
        <Route path="/employee/account" element={<Account />} />
        <Route path="/employee/patients" element={<Patients />} />
        <Route path="/employee/patients/edit" element={<Edit />} />
      </Routes>
    </Router>
  );
}

export default App;
