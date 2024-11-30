// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";
import { Toaster } from "react-hot-toast";
import { Tabss } from "./components/Tabss";
import Home2 from "./components/Home2";
import { Profile } from "./components/Profile";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { Nav } from "./components/Navbar";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
      <Toaster position="bottom-right" reverseOrder={false} />
    </ThemeProvider>
  );
}

function AppContent() {
  const location = useLocation(); // Get the current location

  return (
    <>
      {/* Conditionally render Header and Sidebar based on the current route */}
      {location.pathname !== "/" && (
        <>
          <Nav/>
          <Sidebar />
          <Header />
        </>
      )}

      <Routes>
        <Route path="/" element={<Tabss />} />
        <Route path="/home" element={<Home2 />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;
