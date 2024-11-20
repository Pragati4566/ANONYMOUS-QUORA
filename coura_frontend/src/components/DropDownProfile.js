import React from "react";
import { useNavigate } from "react-router-dom";
import "./css/DropDownProfile.css";

function DropDownProfile() {
  const handleLogout = async (e) => {
    console.log("logout");
    window.localStorage.clear();
    window.location.href = "/";
  };

  const navigate = useNavigate();

  const NavigateToProfile = () => {
    navigate("/profile");
  };
  return (
    <div className="flex flex-col dropDownProfile">
      <ul className="flex flex-col gap-4">
        <li onClick={NavigateToProfile} style={{ fontWeight: "bold" }}>
          {" "}
          Profile{" "}
        </li>
        <li onClick={handleLogout} style={{ fontWeight: "bold" }}>
          Logout
        </li>
      </ul>
    </div>
  );
}

export default DropDownProfile;
