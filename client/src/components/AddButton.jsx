import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AddButton = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract the last segment of the current path (e.g., "employees" or "patients")
  const pathSegments = location.pathname.split("/");
  const currentPage = pathSegments[pathSegments.length - 1];

  // Construct the "add" page URL
  const addPagePath = `${location.pathname}/add`;

  const handleClick = () => {
    navigate(addPagePath);
  };

  return (
    <button onClick={handleClick} className="add-button">
      <iconify-icon icon="material-symbols:add-circle"></iconify-icon>
      <span>
        Add {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}
      </span>
    </button>
  );
};

export default AddButton;
