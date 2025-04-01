import React from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import SearchBar from "../../../components/SearchBar";

const Employees = () => {
  return (
    <AdminLayout>
      {/* Main Content */}
      <h1 className="admin-title">Employees</h1>
      <SearchBar />
      <div className="admin-content">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Occupation</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>John Doe</td>
              <td>Doctor</td>
              <td>Cardiology</td>
            </tr>
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default Employees;
