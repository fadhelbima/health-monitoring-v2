import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import "../styles/App.css";

import Sidebar from "../components/Sidebar";
import WelcomeBanner from "../components/WelcomeBanner";
import InformationDownload from "../components/InformationDownload";
import FloatingPdf from "../components/PdfDownloader";

function PDF() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="d-flex" id="wrapper">
      {/* Sidebar */}
      <Sidebar />
      {/* Page Content */}
      <div id="page-content-wrapper">
        <div className="container-fluid px-4 py-5">
          {/* Welcome Banner */}
          <WelcomeBanner />
          {/* Dashboard Cards */}
          {/* Information Section */}
          <InformationDownload />
        </div>
      </div>
      <FloatingPdf />
    </div>
  );
}

export default PDF;
