import React, { useState } from "react";
import Select from "react-select";
import axios from "axios";
import "../styles/SearchBar.css";

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState("");

  const searchOptions = [
    { value: "id", label: "ID" },
    { value: "name", label: "Name" },
    { value: "occupation", label: "Occupation" },
    { value: "department", label: "Department" },
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await axios.get("http://localhost:5000/search", {
        params: {
          query: searchQuery,
          searchBy: searchBy,
        },
      });
      onSearch(response.data);
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="search-bar-container">
      {/* Search Input Container */}
      <div className="search-input-container">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search..."
          className="search-input"
        />
        <iconify-icon
          icon="mdi:magnify"
          className="search-icon"
          onClick={handleSearch}
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
