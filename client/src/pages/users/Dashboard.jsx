import React, { useState, useEffect, useContext } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import DataTable from "react-data-table-component";
import axios from "axios";
import "../../styles/DashboardLayout.css";
import patientIcon from "../../assets/hugeicons_patient.svg";
import doctorIcon from "../../assets/hugeicons_doctor-03.svg";
import appointmentIcon from "../../assets/la_calendar.svg";
import inventoryIcon from "../../assets/ph_package.svg";
import { useAuth } from "../../AuthProvider";

const customStyles = {
  rdt_Table: {
    style: {
      height: "100%", // override the row height
    },
  },
};

function getUpcomingAppointments(data) {
  const now = new Date();

  return data
    .map((item) => ({
      ...item,
      dateObj: new Date(item.date_time),
    }))
    .filter((item) => item.dateObj >= now)
    .sort((a, b) => a.dateObj - b.dateObj)
    .slice(0, 5);
}

function formatDateTime(dateStr) {
  const date = new Date(dateStr);
  const options = {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  };
  return date.toLocaleString("en-US", options);
}

const Dashboard = () => {
  const auth = useAuth();
  const lowStockThreshhold = 25;

  const [username, setUserName] = useState([]);
  const [patients, setPatients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [mostRecentAppointments, setMostRecentAppointments] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [lowStockInventory, setLowStockInventory] = useState([]);
  const [expiringInventory, setExpiringInventory] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/patients", {
          headers: {
            Authorization: "Bearer " + auth.access_token,
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
              Authorization: "Bearer " + auth.access_token,
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
              Authorization: "Bearer " + auth.access_token,
            },
          }
        );

        const appointments = response.data;

        setAppointments(appointments);


        const sortedAppointments = getUpcomingAppointments(appointments)

        setMostRecentAppointments(sortedAppointments);
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
              Authorization: "Bearer " + auth.access_token,
            },
          }
        );

        setInventory(response.data);
        setLowStockInventory(
          response.data
            .filter((i) => i.quantity <= lowStockThreshhold)
            .sort((a, b) => a.quantity - b.quantity)
        );
        setExpiringInventory(
          response.data
            .filter((i) => {
              const diffInMs = new Date(i.expiration_date) - new Date();
              const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
              return diffInDays >= 0 && diffInDays <= 14;
            })
            .sort(
              (a, b) =>
                new Date(a.expiration_date) - new Date(b.expiration_date)
            )
        );
      } catch (error) {
        console.error("Error fetching Inventory:", error);
      }
    };

    const fetchUsername = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/get-user-info/" + auth.userID,
          {
            headers: {
              Authorization: "Bearer " + auth.access_token,
            },
          }
        );

        setUserName(response.data["username"]);
      } catch (error) {
        setUserName("err");
        console.error("Error username Inventory:", error);
      }
    };

    fetchUsername();
    fetchPatients();
    fetchEmployees();
    fetchAppointments();
    fetchInventory();
  }, []);

  const recentAppointmentsTable = [
    {
      name: "Patient ID",
      selector: (row) => row.patient_id,
      width: "10%",
      center: true,
    },
    {
      name: "Type",
      selector: (row) => row.type,
      width: "15%",
      center: true,
    },
    {
      name: "Type",
      selector: (row) => row.type,
      width: "15%",
      center: true
    },
    {
      name: "Doctor",
      selector: (row) => row.doctor_id,
      width: "25%",
      center: true,
    },
    {
      name: "Date/Time",
      selector: (row) => formatDateTime(row.date_time),
      width: "15%",
      center: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      width: "15%",
      center: true,
    },
    {
      name: "Note",
      selector: (row) => row.note,
      width: "15%",
      center: true,
    },
  ];

  const lowStockInventoryTable = [
    { name: "ID", selector: (row) => row.id, width: "15%", center: true },
    { name: "Name", selector: (row) => row.name, center: true },
    { name: "Type", selector: (row) => row.type, center: true },
    {
      name: "Quantity",
      selector: (row) => row.quantity,
      width: "20%",
      center: true,
    },
  ];

  const expiringInventoryTable = [
    {
      name: "ID",
      selector: (row) => row.id,
      width: "10%",
      center: true,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      center: true,
    },
    {
      name: "Type",
      selector: (row) => row.type,
      center: true,
    },
    {
      name: "Quantity",
      selector: (row) => row.quantity,
      width: "15%",
      center: true,
    },
    {
      name: "Expiration Date",
      selector: (row) => row.expiration_date,
      center: true,
    },
  ];

  return (
    <DashboardLayout title={"Hello, " + username}>
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

        <div className="dashboard-tables dashboard-row">
          <label>Upcoming Appointments</label>
        </div>

        <div className="dashboard-tables dashboard-row">
          <div className="recentAppointments">
            <div>
              <DataTable
                columns={recentAppointmentsTable}
                data={mostRecentAppointments}
                customStyles={customStyles}
              />
            </div>
          </div>
        </div>

        <div className="dashboard-tables dashboard-row">
          <div className="dashboard-label">
            <label>Low Stock Inventory</label>
          </div>
          <div className="dashboard-label">
            <label>Expiring Inventory</label>
          </div>
        </div>

        <div className="dashboard-tables dashboard-row">
          <div className="lowStockInventory">
            <DataTable
              columns={lowStockInventoryTable}
              data={lowStockInventory}
              customStyles={customStyles}
            />
          </div>
          <div className="expiringInventory">
            <DataTable
              columns={expiringInventoryTable}
              data={expiringInventory}
              customStyles={customStyles}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
