import React, { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import DataTable from "react-data-table-component";
import axios from "axios";
import "../../styles/DashboardLayout.css";
import patientIcon from "../../assets/hugeicons_patient.png";
import doctorIcon from "../../assets/hugeicons_doctor-03.png";
import appointmentIcon from "../../assets/la_calendar.png";
import inventoryIcon from "../../assets/ph_package.png";

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/patients", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        });

        setPatients(response.data);
      } catch (error) {
        console.error("Error fetching Patients:", error);
      }
    };

    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/employees",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
          }
        );

        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching Employees:", error);
      }
    };

    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/appointments",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
          }
        );

        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching Appointments:", error);
      }
    };

    const fetchInventory = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/inventory",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
          }
        );

        setInventory(response.data);
      } catch (error) {
        console.error("Error fetching Inventory:", error);
      }
    };

    fetchPatients();
    fetchEmployees();
    fetchAppointments();
    fetchInventory();
  }, []);

  const recentAppointmentsTable = [
    { name: "ID", selector: (row) => row.id, width: "10%", center: true },
    { name: "Type", selector: (row) => row.type, width: "15%", center: true },
    {
      name: "Patient ID",
      selector: (row) => row.patient_id,
      width: "15%",
      center: true,
    },
    {
      name: "Doctor ID",
      selector: (row) => row.doctor_id,
      width: "15%",
      center: true,
    },
    {
      name: "Date/Time",
      selector: (row) => row.date_time,
      width: "15%",
      center: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      width: "15%",
      center: true,
    },
    { name: "Note", selector: (row) => row.note, width: "15%", center: true },
  ];

  const lowStockInventoryTable = [
    { name: "ID", selector: (row) => row.id, width: "15%", center: true },
    { name: "Name", selector: (row) => row.name, center: true },
    { name: "Type", selector: (row) => row.type, center: true },
    {
      name: "Quantity",
      selector: (row) => row.quantity,
      width: "10%",
      center: true,
    },
  ];

  const expiringInventoryTable = [
    { name: "ID", selector: (row) => row.id, width: "10%", center: true },
    { name: "Name", selector: (row) => row.name, center: true },
    { name: "Type", selector: (row) => row.type, center: true },
    {
      name: "Quantity",
      selector: (row) => row.quantity,
      width: "10%",
      center: true,
    },
    {
      name: "Expiration Date",
      selector: (row) => row.expiration_date,
      center: true,
    },
  ];

  const availableEmployeesTable = [{
      name: "Person ID",
      selector: (row) => row.person_id,
      width: "15%",
      center: true,
    },
    {
      name: "Occupation",
      selector: (row) => row.occupation,
      width: "15%",
      center: true,
    },
    {
      name: "Department",
      selector: (row) => row.department,
      width: "15%",
      center: true,
    },
    {
      name: "Schedule",
      selector: (row) => row.schedule,
      width: "15%",
      center: true,
    },
  ];

  const todaysAppointmentsTable = [
    { name: "ID", selector: (row) => row.id, width: "10%", center: true },
    { name: "Type", selector: (row) => row.type, width: "15%", center: true },
    {
      name: "Patient ID",
      selector: (row) => row.patient_id,
      width: "15%",
      center: true,
    },
    {
      name: "Doctor ID",
      selector: (row) => row.doctor_id,
      width: "15%",
      center: true,
    },
    {
      name: "Date/Time",
      selector: (row) => row.date_time,
      width: "15%",
      center: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      width: "15%",
      center: true,
    },
    { name: "Note", selector: (row) => row.note, width: "15%", center: true },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className="mainContent">
        <div className="topRow">
          <div className="totalPatients">
            <img src={patientIcon} className="icon" />
            <div className="text">
              <h1>{patients.length}</h1>
              <p>Total Patients</p>
            </div>
          </div>
          <div className="totalEmployees">
            <img src={doctorIcon} className="icon" />
            <div className="text">
              <h1>{employees.length}</h1>
              <p>Total Employees</p>
            </div>
          </div>
          <div className="totalAppointments">
            <img src={appointmentIcon} className="icon" />
            <div className="text">
              <h1>{appointments.length}</h1>
              <p>Total Appointments</p>
            </div>
          </div>
          <div className="totalInventory">
            <img src={inventoryIcon} className="icon" />
            <div className="text">
              <h1>{inventory.length}</h1>
              <p>Total Inventory Items</p>
            </div>
          </div>
        </div>
        <div className="middleRow">
          <div className="recentAppointments">
            <DataTable columns={recentAppointmentsTable} data={appointments} />
          </div>
          <div className="lowStockInventory">
            <DataTable columns={lowStockInventoryTable} data={inventory} />
          </div>
          <div className="expiringInventory">
            <DataTable columns={expiringInventoryTable} data={inventory} />
          </div>
        </div>
        <div className="bottomRow">
          <div className="availableEmployees">
            <DataTable columns={availableEmployeesTable} data={employees} />
          </div>
          <div className="todaysAppointments">
            <DataTable columns={todaysAppointmentsTable} data={appointments} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
