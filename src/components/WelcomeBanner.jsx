import React, { useEffect, useRef, useState } from "react";
import TypeIt from "typeit-react";

function WelcomeBanner({ userEmail }) {
  const dateRef = useRef(null);
  const namaRef = useRef(null); // Ref untuk manipulasi innerHTML
  const [namaUser, setNamaUser] = useState("User");

  const fetchData = async (endpoint, setterFunction) => {
    if (!userEmail) return;
    try {
      const response = await fetch(
        `http://localhost:8081/${endpoint}?email=${userEmail}`
      );
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0 && data[0].nama_user) {
        console.log("✅ Nama User ditemukan:", data[0].nama_user);
        setterFunction(data[0].nama_user);
      } else {
        console.warn("⚠ Data kosong atau tidak sesuai format:", data);
        setterFunction("User");
      }
    } catch (error) {
      console.error(`❌ Error fetching ${endpoint}:`, error);
      setterFunction("Error");
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchData("nama_user", setNamaUser);
    }

    function updateDate() {
      const options = {
        weekday: "long",
        year: "numeric",
        day: "numeric",
        month: "long",
      };
      const today = new Date().toLocaleDateString("id-ID", options);
      if (dateRef.current) {
        dateRef.current.innerText = today;
      }
    }
    updateDate();
  }, [userEmail]);

  // Memastikan namaUser diperbarui di innerHTML
  useEffect(() => {
    if (namaRef.current) {
      namaRef.current.innerHTML = namaUser;
    }
  }, [namaUser]);

  return (
    <div className="welcome-banner text-white mb-4 d-flex flex-column text-lg-start p-3 p-lg-5">
      <div>
        <h1 className="display-4 display-lg-1">
          <TypeIt options={{ speed: 50, waitUntilVisible: true }}>
            Selamat Datang, <span ref={namaRef}></span>!
          </TypeIt>
        </h1>
        <p className="lead mb-0 display-6 display-lg-4 text-center">
          Stay{" "}
          <TypeIt
            options={{
              strings: ["Healthy💕"],
              speed: 70,
              loop: true,
              waitUntilVisible: true,
              nextStringDelay: 500,
            }}
          />
        </p>
      </div>
      <div className="date-container mt-3">
        <p id="current-date" className="mb-0 fs-5 fs-lg-4" ref={dateRef}></p>
        <i className="bx bx-user account-icon d-none d-lg-inline"></i>
      </div>
    </div>
  );
}

export default WelcomeBanner;
