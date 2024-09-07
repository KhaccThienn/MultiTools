"use client";

import React, { useState } from "react";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "@/themes/theme";
import { GlobalStyles } from "@/themes/globalStyles";
import HomePage from "@/pages/homePage";

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
