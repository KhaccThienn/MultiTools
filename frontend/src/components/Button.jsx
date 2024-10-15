import React from "react";
import "../css/app.css";

export default function Button({ label, onClick }) {
  return (
    <button
      className="container-button"
      onClick={onClick}
    >
      {label}
    </button>
  );
}
