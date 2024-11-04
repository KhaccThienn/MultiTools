// "use client";

// import React, { useState } from "react";
// import { ThemeProvider } from "styled-components";
// import { lightTheme, darkTheme } from "@/constants/themes/theme";
// import { GlobalStyles } from "@/constants/themes/globalStyles";
// import HomePage from "@/pages/HomePage";
// import ThemeToggle from '../components/ThemeToggle';

// export default function App() {
//   const [theme, setTheme] = useState("light");

//   const toggleTheme = () => {
//     theme === "light" ? setTheme("dark") : setTheme("light");
//   };
//   return (
//     <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
//       <>
//         <GlobalStyles />
//         <HomePage />
//       </>
//     </ThemeProvider>
//   );
// }


/* app/page.jsx */
// "use client";

// import React, { useState, useEffect } from "react";
// import { ThemeProvider } from "styled-components";
// import { lightTheme, darkTheme } from "@/constants/themes/theme";
// import { GlobalStyles } from "@/constants/themes/globalStyles";
// import HomePage from "@/pages/HomePage";
// import ThemeToggle from '../components/ThemeToggle';

// export default function App() {
//   const [theme, setTheme] = useState("light");

//   useEffect(() => {
//     const storedTheme = localStorage.getItem("theme") || "light";
//     setTheme(storedTheme);
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("theme", theme);
//   }, [theme]);

//   const toggleTheme = () => {
//     setTheme(theme === "light" ? "dark" : "light");
//   };

//   return (
//     <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
//       <>
//         <GlobalStyles />
//         <HomePage toggleTheme={toggleTheme} theme={theme} />
//       </>
//     </ThemeProvider>
//   );
// }



/* app/page.jsx */
"use client";

import React from "react";
import HomePage from "@/pages/HomePage";

export default function App() {
  return <HomePage />;
}
