"use client";

import React, { useState } from "react";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "@/constants/themes/theme";
import { GlobalStyles } from "@/constants/themes/globalStyles";
import HomePage from "@/pages/HomePage";

export default function App() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };
  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <>
        <GlobalStyles />
        <HomePage />
      </>
    </ThemeProvider>
  );
}
