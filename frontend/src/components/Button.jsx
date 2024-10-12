import React from "react";
import "../css/app.css";

export default function Button({ label, onClick }) {
    return (
        <button 
            onClick={onClick} 
            style={{
                padding: "1em 2em", 
                fontSize: "1.3em", 
                backgroundColor: "#FA8072", 
                color: "#333", 
                border: "none", 
                borderRadius: "1em", 
                cursor: "pointer",
                fontWeight: "bold",
                boxShadow: "8px 8px 16px rgba(0, 0, 0, 0.2)",
            }}
        >
            {label}
        </button>
    );
}
