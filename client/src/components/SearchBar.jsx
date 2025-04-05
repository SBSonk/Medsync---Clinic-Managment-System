import React, { useState } from "react";
import Select from "react-select";
import axios from "axios";
import "../styles/SearchBar.css";

const SearchBar = ({ onChange, value }) => {
  const [searchBy, setSearchBy] = useState("");
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
        <iconify-icon icon="mdi:magnify" className="search-icon"></iconify-icon>
      </div>
    </div>
  );
};

export default SearchBar;
