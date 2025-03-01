import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import "../styles/App.css";
import HealthData from "../components/Firebase-Dashboard-Cards";
import Sidebar from "../components/Sidebar";
import WelcomeBanner from "../components/WelcomeBanner";
import InformationSleep from "../components/InformationSleep";
import FloatingPdf from "../components/PdfDownloader";
function Sleep() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="d-flex" id="wrapper">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div id="page-content-wrapper" className="container-fluid px-4 py-5">
        <WelcomeBanner />
        <HealthData />
        <InformationSleep />
      </div>
      {/* <FloatingPdf /> */}
    </div>
  );
}

export default Sleep;
