import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";
import { Toaster } from "react-hot-toast";

import {Tabss} from "./components/Tabss";
import {Home2} from "./components/Home2";
import {Profile} from "./components/Profile";
import {Sidebar} from "./components/Sidebar";
import {Header} from "./components/Header";
import {Nav} from "./components/Navbar";
import {EditProfile} from "./components/Editprofile";
import { UploadImages } from "./components/UploadImages";
import { Home } from "lucide-react";

function App() {
  return (
    <ThemeProvider>
      <Router future={{ v7_relativeSplatPath: true }}>
        <AppContent />
      </Router>
      <Toaster position="bottom-right" reverseOrder={false} />
    </ThemeProvider>
  );
}

function AppContent() {
  const location = useLocation();

  console.log("Current location:", location.pathname); // Debugging log

  return (
    <>
      {location.pathname !== "/" && (
        <>
          <Nav />
          <Sidebar />
          <Header />
        </>
      )}
      <Routes>
        <Route path="/" element={<Tabss />} />
        <Route path="/home" element={<Home2 />} />
        <Route path="/account" element={<Profile />} />
        <Route path="/create" element={<UploadImages />} />
        <Route path="/account/edit-profile" element={<EditProfile/>} />
      </Routes>
    </>
  );
}

export default App;
