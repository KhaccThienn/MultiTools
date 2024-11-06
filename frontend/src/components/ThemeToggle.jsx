/* components/ThemeToggle.jsx */
"use client";
import { React, useContext } from "react";
import ThemeContext from "@/constants/themes/ThemeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  console.log('ThemeToggle toggleTheme:', typeof toggleTheme);
  return (
    <div className="theme-toggle" onClick={toggleTheme}>
      <div className={`toggle-switch ${theme === "dark" ? "dark" : ""}`}>
        <div
          className={`theme-icon-container ${
            theme === "dark" ? "slide-right" : "slide-left"
          }`}
        >
          <FontAwesomeIcon icon={faSun} className="toggle-icon sun" />
          <FontAwesomeIcon icon={faMoon} className="toggle-icon moon" />
        </div>
      </div>
    </div>
  );
}
