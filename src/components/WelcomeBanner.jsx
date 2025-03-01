import React, { useEffect, useState } from "react";
import TypeIt from "typeit-react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase-config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDay, faUser } from "@fortawesome/free-solid-svg-icons";

function WelcomeBanner({ userEmail, userId }) {
  const [namaUser, setNamaUser] = useState("User");
  const [currentDate, setCurrentDate] = useState("");
  const [greetingMessage, setGreetingMessage] = useState("");

  // Fetch data from Firebase
  useEffect(() => {
    if (!userId) return;

    const userRef = ref(db, `users/${userId}/name`);
    const unsubscribe = onValue(
      userRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setNamaUser(snapshot.val());
        } else {
          console.warn("⚠ Data nama tidak ditemukan di Firebase");
          setNamaUser("User");
        }
      },
      (error) => {
        console.error("❌ Error fetching user name from Firebase:", error);
        setNamaUser("User");
      }
    );

    // Cleanup subscription
    return () => unsubscribe();
  }, [userId]);

  // Handle date formatting and greeting
  useEffect(() => {
    function updateDate() {
      const now = new Date();

      // Format current date
      const options = {
        weekday: "long",
        year: "numeric",
        day: "numeric",
        month: "long",
      };
      const today = now.toLocaleDateString("id-ID", options);
      setCurrentDate(today);

      // Set greeting based on time of day
      const hours = now.getHours();
      let greeting = "";

      if (hours >= 5 && hours < 12) {
        greeting = "Selamat Pagi";
      } else if (hours >= 12 && hours < 15) {
        greeting = "Selamat Siang";
      } else if (hours >= 15 && hours < 19) {
        greeting = "Selamat Sore";
      } else {
        greeting = "Selamat Malam";
      }

      setGreetingMessage(greeting);
    }

    updateDate();
    // Update time every minute
    const interval = setInterval(updateDate, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="welcome-banner position-relative rounded-lg shadow-sm mb-4 overflow-hidden">
      {/* Background gradient */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100 overflow-"
        style={{
          background:
            "linear-gradient(135deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)",
          opacity: 0.85,
        }}
      ></div>

      {/* Content container */}
      <div className="position-relative p-4 p-md-5 d-flex flex-column justify-content-between w-100 h-100">
        <div className="row align-items-center">
          {/* Left side - Greeting */}
          <div className="col-12 col-md-8 text-white mb-4 mb-md-0">
            <div className="d-flex align-items-center mb-2">
              <span className="badge bg-white text-primary me-2 py-2 px-3 rounded-pill fw-medium">
                {greetingMessage}
              </span>
              <span className="text-white-50 ms-2 fs-6">
                <FontAwesomeIcon icon={faCalendarDay} className="me-2" />
                {currentDate}
              </span>
            </div>

            <h1 className="welcome-title mb-1 fw-bold">
              <TypeIt options={{ speed: 50, waitUntilVisible: true }}>
                Halo, {namaUser}!
              </TypeIt>
            </h1>

            <p className="lead mb-0 fs-5 mt-2">
              Jaga Kesehatan dengan{" "}
              <span className="health-type fw-bold">
                <TypeIt
                  options={{
                    strings: [
                      "Olahraga Teratur",
                      // "Pola Makan Sehat",
                      // "Tidur Berkualitas",
                      // "Pikiran Positif",
                    ],
                    speed: 70,
                    loop: true,
                    waitUntilVisible: true,
                    nextStringDelay: 1000,
                  }}
                />
              </span>
            </p>
          </div>

          {/* Right side - User avatar/profile icon */}
          <div className="col-12 col-md-4 d-none d-md-flex justify-content-end">
            <div className="user-avatar-container rounded-circle bg-white d-flex align-items-center justify-content-center shadow-sm">
              <FontAwesomeIcon icon={faUser} className="user-avatar-icon" />
              {/* <img src="./public/Img/profile.img" alt="" /> */}
            </div>
          </div>
        </div>
      </div>

      {/* Custom inline styles */}
      <style jsx="true">{`
        .welcome-banner {
          min-height: 200px;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .welcome-title {
          font-size: 2.2rem;
          letter-spacing: -0.5px;
        }

        .user-avatar-container {
          width: 110px;
          height: 110px;
          opacity: 0.9;
        }

        .user-avatar-icon {
          font-size: 3.5rem;
          color: #6b46c1;
        }

        .health-type {
          color: #ffd700;
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 768px) {
          .welcome-title {
            font-size: 1.8rem;
          }

          .welcome-banner {
            min-height: 180px;
          }
        }
      `}</style>
    </div>
  );
}

export default WelcomeBanner;
