import React from "react";
import { useNavigate } from "react-router-dom";

const NotificationButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/notifications")}
      style={{
        padding: "8px 12px",
        backgroundColor: "#2196F3",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer"
      }}
    >
      Notifications
    </button>
  );
};

export default NotificationButton;
