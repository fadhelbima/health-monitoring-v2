import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import "../styles/App.css";
import Sidebar from "../components/Sidebar";
import InformationProfile from "../components/InformationProfile";

function Profile() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="d-flex" id="wrapper">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div id="page-content-wrapper" className="container-fluid px-4 py-5">
        <InformationProfile />
      </div>
    </div>
  );
}

export default Profile;
