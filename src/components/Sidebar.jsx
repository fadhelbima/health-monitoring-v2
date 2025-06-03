import { text } from "@fortawesome/fontawesome-svg-core";
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
  FaUserAstronaut,
  FaUserEdit,
  FaUserTag,
  FaUserLock,
  FaUserSlash,
  FaUserSecret,
  FaUserClock,
  FaUsb,
  FaDiagnoses,
  FaUserShield,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeItem, setActiveItem] = useState("");

  // Navigation links data
  const navLinks = [
    { path: "/Home", icon: <FaHome size={24} />, text: "Beranda" },
    { path: "/Profile", icon: <FaUser size={24} />, text: "Profil" },
    { path: "/Sleep", icon: <FaBed size={24} />, text: "Kualitas Tidur" },
    { path: "/step", icon: <FaWalking size={24} />, text: "Langkah" },
    { path: "/Calories", icon: <FaFire size={24} />, text: "Kalori" },
    { path: "/Jantung", icon: <FaHeart size={24} />, text: "Detak Jantung" },
    { path: "/Download", icon: <FaFileDownload size={24} />, text: "Download" },
  ];

  // Check if the screen is mobile-sized
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Set active item based on current path
    const currentPath = location.pathname;
    setActiveItem(currentPath === "/" ? "/Home" : currentPath);

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, [location]);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const handleNavClick = (path) => {
    setActiveItem(path);
    if (isMobile) {
      setShowMobileMenu(false);
    }
  };

  // Styles
  const styles = {
    sidebar: {
      background:
        "linear-gradient(135deg, #b347b3 30%, #3a4cd5 70%, #ffbe4d 100%)",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      width: isExpanded ? "280px" : "80px",
      minHeight: "100vh",
      position: "fixed",
      zIndex: 1030,
      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      overflowX: "hidden",
      borderRadius: "0 16px 16px 0",
    },
    sidebarHeading: {
      fontSize: "1.25rem",
      fontWeight: 700,
      opacity: isExpanded ? 1 : 0,
      transform: isExpanded ? "translateX(0)" : "translateX(-20px)",
      transition: "opacity 0.3s ease, transform 0.3s ease",
      marginLeft: "12px",
      letterSpacing: "0.5px",
    },
    toggleButton: {
      background: "rgba(255,255,255,0.15)",
      borderRadius: "50%",
      width: "36px",
      height: "36px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease",
      border: "none",
      backdropFilter: "blur(5px)",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    },
    navLink: (isActive) => ({
      color: "white",
      padding: "14px 18px",
      display: "flex",
      alignItems: "center",
      position: "relative",
      transition: "all 0.2s ease",
      background: isActive
        ? "linear-gradient(to right, rgba(129, 140, 248, 0.2), rgba(129, 140, 248, 0))"
        : "transparent",
      borderLeft: isActive ? "4px solid #818cf8" : "4px solid transparent",
      marginBottom: "4px",
      borderRadius: "0 8px 8px 0",
    }),
    navIcon: (isActive) => ({
      transition:
        "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s ease",
      transform: isActive ? "scale(1.1)" : "scale(1)",
      filter: isActive
        ? "drop-shadow(0 0 3px rgba(255, 255, 255, 0.5))"
        : "none",
    }),
    navText: (isActive) => ({
      transition: "opacity 0.3s ease, transform 0.3s ease",
      opacity: isExpanded ? 1 : 0,
      transform: isExpanded ? "translateX(0)" : "translateX(-10px)",
      fontSize: "1rem",
      fontWeight: isActive ? "600" : "400",
      letterSpacing: "0.3px",
    }),
    activeIndicator: {
      position: "absolute",
      right: "16px",
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      background: "#818cf8",
      boxShadow: "0 0 10px rgba(129, 140, 248, 0.8)",
      opacity: isExpanded ? 1 : 0,
      transition: "opacity 0.3s ease",
    },
    profileSection: {
      position: "absolute",
      bottom: "0",
      width: "100%",
      background: "rgba(0,0,0,0.15)",
      backdropFilter: "blur(10px)",
      borderTop: "1px solid rgba(255,255,255,0.1)",
    },
    profileLink: {
      color: "white",
      transition: "background 0.2s ease",
      padding: "16px",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
    },
    profileInfo: {
      transition: "opacity 0.3s ease, transform 0.3s ease",
      opacity: isExpanded ? 1 : 0,
      transform: isExpanded ? "translateX(0)" : "translateX(-10px)",
    },
    mobileNavbar: {
      zIndex: 1031,
    },
    mobileToggle: {
      background: "linear-gradient(135deg, #3a4cd5 0%, #b347b3 70%)",
      color: "white",
      border: "none",
      borderRadius: "50%",
      width: "44px",
      height: "44px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    },
    mobileOffcanvas: {
      visibility: showMobileMenu ? "visible" : "hidden",
      width: "280px",
      background:
        "linear-gradient(135deg, #3a4cd5 0%, #b347b3 70%, #ffbe4d 100%)",
      borderRadius: "0 16px 16px 0",
      boxShadow: "0 0 24px rgba(0,0,0,0.2)",
      transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      transform: showMobileMenu ? "translateX(0)" : "translateX(-100%)",
    },
  };

  // Profile section component
  const ProfileSection = ({ isMobile }) => (
    <div className="profile-section py-3 px-3" style={styles.profileSection}>
      <Link
        to="/profile"
        className="nav-link d-flex align-items-center"
        style={styles.profileLink}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <div className="position-relative">
          <FaUserCircle
            size={38}
            className="text-white"
            style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}
          />
          <div
            className="position-absolute"
            style={{
              width: "12px",
              height: "12px",
              background: "#4ade80",
              borderRadius: "50%",
              bottom: "2px",
              right: "2px",
              border: "2px solid rgba(58, 76, 213, 0.8)",
            }}
          ></div>
        </div>
        <div
          className={`ms-3 d-flex flex-column ${
            !isMobile && !isExpanded ? "d-none" : ""
          }`}
          style={!isMobile ? styles.profileInfo : {}}
        >
          <span className="fw-bold text-white" style={{ fontSize: "1rem" }}>
            User Name
          </span>
          <small className="text-white-50" style={{ fontSize: "0.8rem" }}>
            View Profile
          </small>
        </div>
      </Link>
    </div>
  );

  // Navigation link component
  const NavItem = ({ link, isActive, isMobile, onClick }) => (
    <Link
      to={link.path}
      className={`nav-link ${isActive ? "active" : ""}`}
      onClick={() => onClick(link.path)}
      style={styles.navLink(isActive)}
      onMouseEnter={(e) =>
        !isActive &&
        (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
      }
      onMouseLeave={(e) =>
        !isActive && (e.currentTarget.style.background = "transparent")
      }
    >
      <div
        className="icon-container me-3 d-flex justify-content-center align-items-center"
        style={{ minWidth: "40px", position: "relative" }}
      >
        {React.cloneElement(link.icon, {
          color: isActive ? "#818cf8" : "white",
          style: styles.navIcon(isActive),
        })}
        {isActive && (
          <div
            className="position-absolute"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: "rgba(129, 140, 248, 0.15)",
              filter: "blur(8px)",
              zIndex: -1,
            }}
          ></div>
        )}
      </div>
      <span
        className={`nav-text ${!isMobile && !isExpanded ? "d-none" : ""}`}
        style={styles.navText(isActive)}
      >
        {link.text}
      </span>
      {isActive && (
        <div className="active-indicator" style={styles.activeIndicator} />
      )}
    </Link>
  );

  // Navigation group with section title
  const renderNavLinks = () => {
    const mainLinks = navLinks.slice(0, 2); // Beranda & Profil
    const healthLinks = navLinks.slice(2, 6); // Tidur, Langkah, Kalori, Jantung
    const utilityLinks = navLinks.slice(6); // Download

    return (
      <>
        {/* Main Links */}
        <div className="nav-section mb-3">
          {isExpanded && (
            <div
              className="px-4 py-2 text-white-50"
              style={{ fontSize: "0.8rem", letterSpacing: "1px", opacity: 0.7 }}
            >
              MENU UTAMA
            </div>
          )}
          {mainLinks.map((link) => (
            <NavItem
              key={link.path}
              link={link}
              isActive={activeItem === link.path}
              isMobile={isMobile}
              onClick={handleNavClick}
            />
          ))}
        </div>

        {/* Health Links */}
        <div className="nav-section mb-3">
          {isExpanded && (
            <div
              className="px-4 py-2 text-white-50"
              style={{ fontSize: "0.8rem", letterSpacing: "1px", opacity: 0.7 }}
            >
              KESEHATAN
            </div>
          )}
          {healthLinks.map((link) => (
            <NavItem
              key={link.path}
              link={link}
              isActive={activeItem === link.path}
              isMobile={isMobile}
              onClick={handleNavClick}
            />
          ))}
        </div>

        {/* Utility Links */}
        <div className="nav-section mb-3">
          {isExpanded && (
            <div
              className="px-4 py-2 text-white-50"
              style={{ fontSize: "0.8rem", letterSpacing: "1px", opacity: 0.7 }}
            >
              UTILITAS
            </div>
          )}
          {utilityLinks.map((link) => (
            <NavItem
              key={link.path}
              link={link}
              isActive={activeItem === link.path}
              isMobile={isMobile}
              onClick={handleNavClick}
            />
          ))}
        </div>
      </>
    );
  };

  // Render Desktop Sidebar
  const renderDesktopSidebar = () => (
    <div
      id="sidebar-wrapper"
      className={`sidebar ${isExpanded ? "expanded" : ""} d-none d-md-block`}
      style={styles.sidebar}
    >
      <div className="sidebar-heading d-flex justify-content-between align-items-center py-4 px-3">
        <div
          className={`text-white fw-bold ${isExpanded ? "" : "d-none"}`}
          style={styles.sidebarHeading}
        >
          Dashboard
        </div>
        <button
          className="btn p-0 ms-auto"
          id="toggle-btn"
          onClick={toggleSidebar}
          style={styles.toggleButton}
          aria-label="Toggle sidebar"
        >
          {isExpanded ? (
            <FaChevronLeft size={18} color="white" />
          ) : (
            <FaChevronRight size={18} color="white" />
          )}
        </button>
      </div>

      <div className="list-group list-group-flush pt-2 px-2">
        {renderNavLinks()}
      </div>
      <ProfileSection isMobile={false} />
    </div>
  );

  // Render Mobile Sidebar
  const renderMobileSidebar = () => (
    <>
      <button
        className="navbar-toggler position-fixed top-0 start-0 m-3 border-0 d-md-none"
        type="button"
        onClick={toggleMobileMenu}
        style={{ ...styles.mobileNavbar, ...styles.mobileToggle }}
        aria-label="Open menu"
      >
        <FaBars size={20} />
      </button>

      <div
        className={`offcanvas offcanvas-start d-md-none`}
        tabIndex="-1"
        id="mobileSidebar"
        style={styles.mobileOffcanvas}
      >
        <div className="offcanvas-header d-flex justify-content-between align-items-center py-4 px-3">
          <div
            className="text-white fw-bold"
            style={{ fontSize: "1.25rem", letterSpacing: "0.5px" }}
          >
            Dashboard
          </div>
          <button
            type="button"
            className="btn p-1"
            onClick={toggleMobileMenu}
            aria-label="Close"
            style={{
              background: "rgba(255,255,255,0.15)",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FaChevronLeft size={18} color="white" />
          </button>
        </div>
        <div
          className="offcanvas-body p-2"
          style={{
            background:
              "linear-gradient(135deg, #3a4cd5 0%, #b347b3 46%, #ffbe4d 100%)",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="list-group list-group-flush flex-grow-1">
            {renderNavLinks()}
          </div>
          <ProfileSection isMobile={true} />
        </div>
      </div>

      {showMobileMenu && (
        <div
          className="offcanvas-backdrop show d-md-none"
          onClick={toggleMobileMenu}
          style={{ backdropFilter: "blur(3px)" }}
        ></div>
      )}
    </>
  );

  return (
    <>
      {renderDesktopSidebar()}
      {isMobile && renderMobileSidebar()}
    </>
  );
}

export default Sidebar;
