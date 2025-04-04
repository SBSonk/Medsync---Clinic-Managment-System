import React, { useState } from "react";
import Select from "react-select";
import axios from "axios";
import "../styles/SearchBar.css";

const SearchBar = ({ onChange, value }) => {
  const [searchBy, setSearchBy] = useState("");

  const searchOptions = [
    { value: "id", label: "ID" },
    { value: "name", label: "Name" },
    { value: "occupation", label: "Occupation" },
    { value: "department", label: "Department" },
  ];

  return (
    <div className="search-bar-container">
      {/* Search Input Container */}
      <div className="search-input-container">
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="Search..."
          className="search-input"
        />
        <iconify-icon
          icon="mdi:magnify"
          className="search-icon"
        ></iconify-icon>
      </div>

      {/* Select Dropdown Container */}
      <div className="search-select-container">
        <Select
          options={searchOptions}
          value={searchOptions.find((option) => option.value === searchBy)}
          onChange={(selectedOption) => setSearchBy(selectedOption.value)}
          className="search-select"
        />
      </div>
    </div>
  );
};

export default SearchBar;
