import React from "react";
import { useNavigate } from "react-router-dom";

const ProfileButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/profile")}
      style={{
        padding: "8px 12px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        marginRight: "10px"
      }}
    >
      Profile
    </button>
  );
};

export default ProfileButton;
