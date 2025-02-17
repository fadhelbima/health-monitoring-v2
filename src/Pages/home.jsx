import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import "../styles/App.css";
import Sidebar from "../components/Sidebar";
import WelcomeBanner from "../components/WelcomeBanner";
import DashboardCards from "../components/DashboardCards";
import FloatingPdf from "../components/PdfDownloader";
import CarouselComponent from "../components/CarouselInfo";
function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const userEmail = localStorage.getItem("userEmail");
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="d-flex" id="wrapper">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div id="page-content-wrapper" className="container-fluid px-4 py-5">
        <CarouselComponent />
        <WelcomeBanner userEmail={userEmail} />
        <DashboardCards />
      </div>
      <FloatingPdf />
    </div>
  );
}

export default Home;
