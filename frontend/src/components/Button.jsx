import React from "react";
import "../css/app.css";

export default function Button({ label, onClick }) {
    return (
        <button 
            onClick={onClick} 
            style={{
                padding: "10px 30px", 
                fontSize: "18px", 
                backgroundColor: "#FA8072", 
                color: "#333", 
                border: "none", 
                borderRadius: "10px", 
                cursor: "pointer",
                margin: "60px 0",
                fontSize: "20px",
                fontWeight: "bold"
            }}
        >
            {label}
        </button>
    );
}
