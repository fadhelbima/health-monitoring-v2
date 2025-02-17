import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import "./styles/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sleep from "./Pages/Sleep";
import Step from "./pages/step";
import Calories from "./Pages/Calories";
import Home from "./Pages/home";
import Profile from "./Pages/Profile";
import Jantung from "./Pages/Jantung";
import Login from "./Pages/Login";
import { useEffect } from "react";
import PDF from "./Pages/PDF";
function App() {
  const [data, setData] = useState({});
  useEffect(() => {
    fetch("http://localhost:8081/tb_user");
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Sleep" element={<Sleep />} />
        <Route path="/Step" element={<Step />} />
        <Route path="/Calories" element={<Calories />} />
        <Route path="/Jantung" element={<Jantung />} />
        <Route path="/Download" element={<PDF />} />
      </Routes>
    </Router>
  );
}

export default App;
