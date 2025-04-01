import React, { useState } from "react";
import Select from "react-select";
import axios from "axios";
import "../styles/SearchBar.css";

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState("name");

  // Options for the "Search By" dropdown
  const searchOptions = [
    { value: "id", label: "ID" },
    { value: "name", label: "Name" },
    { value: "occupation", label: "Occupation" },
    { value: "Department", label: "Department" },
    // Add more options as needed
  ];

  const handleSearch = async () => {
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

  return (
    <div className="search-container">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search..."
        className="search-input"
      />
      <button onClick={handleSearch} className="search-button">
        Search
      </button>
      <Select
        options={searchOptions}
        value={searchOptions.find((option) => option.value === searchBy)}
        onChange={(selectedOption) => setSearchBy(selectedOption.value)}
        className="search-select"
      />
    </div>
  );
};

export default SearchBar;
