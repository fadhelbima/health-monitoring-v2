import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaUser,
  FaBed,
  FaWalking,
  FaFire,
  FaHeart,
  FaUserCircle,
  FaChevronLeft,
  FaChevronRight,
  FaBars,
  FaFileDownload,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeItem, setActiveItem] = useState("");

  // Check if the screen is mobile-sized
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Set active item based on current path
    const path = location.pathname;
    setActiveItem(path);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, [location]);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  // Navigation links data
  const navLinks = [
    { path: "/Home", icon: <FaHome size={30} />, text: "Beranda" },
    { path: "/Profile", icon: <FaUser size={30} />, text: "Profil" },
    { path: "/Sleep", icon: <FaBed size={30} />, text: "Kualitas Tidur" },
    { path: "/step", icon: <FaWalking size={30} />, text: "Langkah" },
    { path: "/Calories", icon: <FaFire size={30} />, text: "Kalori" },
    { path: "/Jantung", icon: <FaHeart size={30} />, text: "Detak Jantung" },
    { path: "/Download", icon: <FaFileDownload size={30} />, text: "Download" },
  ];

  const handleNavClick = (path) => {
    setActiveItem(path);
  };

  // This is the enhanced desktop sidebar
  const desktopSidebar = (
    <div
      id="sidebar-wrapper"
      className={`sidebar ${isExpanded ? "expanded" : ""} d-none d-md-block`}
      style={{
        background: "linear-gradient(135deg, #150267, #0011ff)",
        transition: "all 0.3s ease",
        width: isExpanded ? "280px" : "80px",
        minHeight: "100vh",
        position: "fixed",
        zIndex: 1030,
        boxShadow: "3px 0 10px rgba(0,0,0,0.2)",
        overflowX: "hidden",
      }}
    >
      <div className="sidebar-heading d-flex justify-content-between align-items-center py-4 px-3">
        <div
          className={`text-white fw-bold ${isExpanded ? "" : "d-none"}`}
          style={{
            fontSize: "1.5rem",
            opacity: isExpanded ? 1 : 0,
            transition: "opacity 0.3s ease",
            marginLeft: "10px",
          }}
        >
          Dashboard
        </div>
        <button
          className="btn p-1 ms-auto"
          id="toggle-btn"
          onClick={toggleSidebar}
          style={{
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s ease",
          }}
        >
          {isExpanded ? (
            <FaChevronLeft size={20} color="white" />
          ) : (
            <FaChevronRight size={20} color="white" />
          )}
        </button>
      </div>
      <div className="list-group list-group-flush pt-2">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`nav-link fs-2 ${
              activeItem === link.path ? "active" : ""
            }`}
            onClick={() => handleNavClick(link.path)}
            style={{
              color: "white",
              padding: "15px 15px",
              display: "flex",
              alignItems: "center",
              position: "relative",
              transition: "all 0.2s ease",
              background:
                activeItem === link.path
                  ? "rgba(255,255,255,0.15)"
                  : "transparent",
              borderLeft:
                activeItem === link.path
                  ? "4px solid #8b5cf6"
                  : "4px solid transparent",
            }}
            onMouseEnter={(e) => {
              if (activeItem !== link.path) {
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              }
            }}
            onMouseLeave={(e) => {
              if (activeItem !== link.path) {
                e.currentTarget.style.background = "transparent";
              }
            }}
          >
            <div
              className="icon-container me-3"
              style={{ minWidth: "40px", textAlign: "center" }}
            >
              {React.cloneElement(link.icon, {
                color: activeItem === link.path ? "#8b5cf6" : "white",
                style: {
                  transition: "transform 0.2s ease, color 0.2s ease",
                  transform:
                    activeItem === link.path ? "scale(1.2)" : "scale(1)",
                },
              })}
            </div>
            <span
              className={`nav-text ${isExpanded ? "" : "d-none"}`}
              style={{
                transition: "opacity 0.3s ease",
                opacity: isExpanded ? 1 : 0,
                fontSize: "1.5rem",
                fontWeight: activeItem === link.path ? "600" : "400",
              }}
            >
              {link.text}
            </span>
            {activeItem === link.path && (
              <div
                className="active-indicator"
                style={{
                  position: "absolute",
                  right: "10px",
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#8b5cf6",
                  opacity: isExpanded ? 1 : 0,
                }}
              />
            )}
          </Link>
        ))}
      </div>
      <div
        id="buttonProfile"
        className="profile-section py-3 px-3"
        style={{
          position: "absolute",
          bottom: "0",
          width: "100%",
          background: "rgba(0,0,0,0.1)",
          borderTop: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Link
          to="/profile"
          className="nav-link d-flex align-items-center"
          style={{
            color: "white",
            transition: "background 0.2s ease",
            padding: "10px",
            borderRadius: "5px",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <FaUserCircle size={32} className="text-white" />
          <div
            className={`ms-3 d-flex flex-column ${isExpanded ? "" : "d-none"}`}
            style={{
              transition: "opacity 0.3s ease",
              opacity: isExpanded ? 1 : 0,
            }}
          >
            <span className="fw-bold fs-4">User Name</span>
            <small className="text-white-50 fs-6">View Profile</small>
          </div>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* The enhanced desktop sidebar */}
      {desktopSidebar}

      {/* Mobile-only hamburger button */}
      {isMobile && (
        <button
          className="navbar-toggler position-fixed top-0 start-0 m-3 border-0 d-md-none"
          type="button"
          onClick={toggleMobileMenu}
          style={{ zIndex: 1031 }}
        >
          <FaBars size={24} />
        </button>
      )}

      {/* Mobile Offcanvas Sidebar - only shown on mobile */}
      {isMobile && (
        <div
          className={`offcanvas offcanvas-start d-md-none ${
            showMobileMenu ? "show" : ""
          }`}
          tabIndex="-1"
          id="mobileSidebar"
          style={{
            visibility: showMobileMenu ? "visible" : "hidden",
            width: "250px",
            background: "linear-gradient(135deg, #2a1090, #150267)",
          }}
        >
          <div className="offcanvas-header d-flex justify-content-between align-items-center py-4 px-3">
            <div className="text-white">Dashboard</div>
            <button
              type="button"
              className="btn-close text-reset bg-white"
              onClick={toggleMobileMenu}
              aria-label="Close"
            ></button>
          </div>
          <div
            className="offcanvas-body p-0"
            style={{ background: "linear-gradient(135deg, #2a1090, #150267)" }}
          >
            <div className="list-group list-group-flush">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link ${
                    activeItem === link.path ? "active" : ""
                  }`}
                  onClick={() => {
                    handleNavClick(link.path);
                    toggleMobileMenu();
                  }}
                  style={{
                    color: "white",
                    padding: "15px 20px",
                    display: "flex",
                    alignItems: "center",
                    transition: "all 0.2s ease",
                    background:
                      activeItem === link.path
                        ? "rgba(255,255,255,0.15)"
                        : "transparent",
                    borderLeft:
                      activeItem === link.path
                        ? "4px solid #8b5cf6"
                        : "4px solid transparent",
                  }}
                >
                  <div className="icon-container me-3">
                    {React.cloneElement(link.icon, {
                      color: activeItem === link.path ? "#8b5cf6" : "white",
                      style: {
                        transition: "transform 0.2s ease, color 0.2s ease",
                        transform:
                          activeItem === link.path ? "scale(1.2)" : "scale(1)",
                      },
                    })}
                  </div>
                  <span
                    className="nav-text"
                    style={{
                      fontSize: "1rem",
                      fontWeight: activeItem === link.path ? "600" : "400",
                    }}
                  >
                    {link.text}
                  </span>
                </Link>
              ))}
            </div>
            <div
              className="profile-section py-3 px-3"
              style={{
                position: "absolute",
                bottom: "0",
                width: "100%",
                background: "rgba(0,0,0,0.1)",
                borderTop: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <Link
                to="/profile"
                className="nav-link d-flex align-items-center"
                style={{
                  color: "white",
                  transition: "background 0.2s ease",
                  padding: "10px",
                  borderRadius: "5px",
                }}
              >
                <FaUserCircle size={32} className="text-white" />
                <div className="ms-3 d-flex flex-column">
                  <span className="fw-bold fs-6">User Name</span>
                  <small className="text-white-50">View Profile</small>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for mobile when sidebar is open */}
      {isMobile && showMobileMenu && (
        <div
          className="offcanvas-backdrop show d-md-none"
          onClick={toggleMobileMenu}
        ></div>
      )}
    </>
  );
}

export default Sidebar;
