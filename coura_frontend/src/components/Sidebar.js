import React from "react";
import "./css/Sidebar.css";
import SidebarOptions from "./SidebarOptions";

function Sidebar({ category, setCategory }) {
  return (
    <div className="sidebar">
      <SidebarOptions category={category} setCategory={setCategory} />
      <button
        onClick={() => {
          setCategory("none");
        }}
        style={{
          padding: "5px",
          color: "gray",
          fontSize: "14px",
          marginTop: "5px",
          width: "100%",
        }}
      >
        Clear Filter
      </button>
    </div>
  );
}

export default Sidebar;
