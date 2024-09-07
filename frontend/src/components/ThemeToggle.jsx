"use client";
import {useEffect, useState} from "react";
import { faMoon } from "@fortawesome/free-solid-svg-icons";
import { faSun } from "@fortawesome/free-solid-svg-icons";


export default function ThemeToggle() {
    const [darkMode, setDarkMode] = useState(false);
    useEffect(() => {
        const theme = localStorage.getItem("theme");
        if (theme === "dark") {
            setDarkMode(true);
        }
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

  return (
    <div
        className="relative w-16 h-8 flex items-center dark: bg-gray-900 bg-teal-500 rounded-full p-1 cursor-pointer"

        onClick={() => setDarkMode(!darkMode)}
    >
        <div className="absolute bg-white  w-6 h-6 rounded-full shadow-md transform transition-transform duration-300" style={darkMode ? {left:"2px"}: {right: "2px"}}>

        </div>
    </div>
  );
}
