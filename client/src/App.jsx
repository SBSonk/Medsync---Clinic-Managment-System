import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import "./styles/AuthLayout.css";
import Employees from "./pages/users/Employees";
import Account from "./pages/users/Account";
import Patients from "./pages/users/Patients";
import Appointments from "./pages/users/Appointments";
import Reports from "./pages/users/Reports";
import Inventory from "./pages/users/Inventory";

import Add from './pages/users/Add'

function App() {
  const fetchAPI = async () => {
    const response = await axios.get("http://127.0.0.1:8080/api/users");
    console.log(response.data.users);
    setArray(response.data.users);
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/account" element={<Account />} />
        <Route path="/admin/patients" element={<Patients />} />
        <Route path="/admin/employees" element={<Employees />} />
        <Route path="/admin/add" element={<Add />} />
        <Route path="/admin/appointments" element={<Appointments />} />
        <Route path="/admin/inventory" element={<Inventory />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/employee/patients" element={<Patients />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
