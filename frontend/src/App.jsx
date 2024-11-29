// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import toast, { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@material-tailwind/react";
import { Tabss } from "./components/Tabss";
function App() {
  return (
    <>
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Tabss/>} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
      <Toaster position="bottom-right" reverseOrder={false} />
    </ThemeProvider>
    </>
  );
}

export default App;
