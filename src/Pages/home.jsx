import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import "../styles/App.css";
import Sidebar from "../components/Sidebar";
import WelcomeBanner from "../components/WelcomeBanner";
import CarouselComponent from "../components/CarouselInfo";
import HealthData from "../components/Firebase-Dashboard-Cards";
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
        {/* <h1>Admin : </h1>
        <DashboardCards /> */}
        <HealthData />
      </div>
      {/* <FloatingPdf /> */}
    </div>
  );
}

export default Home;
