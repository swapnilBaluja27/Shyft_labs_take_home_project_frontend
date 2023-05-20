import "./App.css";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Import all components
import SideMenu from "./components/Side-Menu/SideMenu";
import Home from "./components/Home";
import Students from "./components/Students/Students";
import Courses from "./components/Courses/Courses";
import Results from "./components/Results/Results";

const theme = createTheme();

theme.typography.h3 = {
  fontSize: "1.2rem",
  "@media (min-width:600px)": {
    fontSize: "1.5rem",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "2rem",
  },
};

function App() {
  return (
    <div className="App">
      <div className="main-container">
        <Box sx={{ display: "flex" }}>
          <SideMenu />
          <Box
            component="main"
            sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
            className="content"
          >
            <ThemeProvider theme={theme}>
              <Typography variant="h3" className="heading">
                Student Management Portal
              </Typography>
            </ThemeProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/students" element={<Students />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/results" element={<Results />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>
        </Box>
      </div>
    </div>
  );
}

export default App;
