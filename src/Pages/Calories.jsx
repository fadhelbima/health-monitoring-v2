import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import "../styles/App.css";
import DashboardCards from "../components/DashboardCards";
import Sidebar from "../components/Sidebar";
import WelcomeBanner from "../components/WelcomeBanner";
import InformationCalories from "../components/InformationCalories";
import FloatingPdf from "../components/PdfDownloader";
function Calories() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="d-flex" id="wrapper">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div id="page-content-wrapper" className="container-fluid px-4 py-5">
        <WelcomeBanner />
        <DashboardCards />
        <InformationCalories />
      </div>
      <FloatingPdf />
    </div>
  );
}

export default Calories;
