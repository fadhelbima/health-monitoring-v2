import React, { useState, useEffect } from "react";
import { ref, onValue, get } from "firebase/database";
import { db, auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { FaNotesMedical, FaRunning, FaBed, FaBurn } from "react-icons/fa";
import { FaHeartPulse } from "react-icons/fa6";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/InformationProfile.css";
import { fetchSaranKesehatan } from "../components/groq";

const InformationProfile = () => {
  const [namaUser, setNamaUser] = useState("Loading...");
  const [heartRate, setHeartRate] = useState(null);
  const [durasiTidur, setDurasiTidur] = useState(null);
  const [langkah, setLangkah] = useState(null);
  const [kaloriTerbakar, setKaloriTerbakar] = useState(null);
  const [saranKesehatan, setSaranKesehatan] = useState(
    "Sedang memuat saran..."
  );
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const getFormattedDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        navigate("/FirebaseLogin");
      }
    });
    return () => unsubscribeAuth();
  }, [navigate]);

  useEffect(() => {
    if (!userId) return;
    const today = getFormattedDate();

    // Ambil nama user sekali saja (tidak perlu listener real-time)
    const namaUserRef = ref(db, `users/${userId}/fullName`);
    get(namaUserRef)
      .then((snapshot) => {
        setNamaUser(snapshot.exists() ? snapshot.val() : "Data tidak tersedia");
      })
      .catch(() => setNamaUser("Error"));

    // Ambil data kesehatan dari Firebase Database
    const sleepRef = ref(
      db,
      `users/${userId}/health_data/sleep/${today}/sleep_session_0/duration/seconds`
    );
    const heartRateRef = ref(
      db,
      `users/${userId}/health_data/heart_rate/${today}`
    );
    const stepsRef = ref(
      db,
      `users/${userId}/health_data/steps/${today}/steps_data/value`
    );
    const caloriesRef = ref(
      db,
      `users/${userId}/health_data/calories/${today}/calories_data/value`
    );

    const unsubscribeSleep = onValue(sleepRef, (snapshot) => {
      if (snapshot.exists()) {
        setDurasiTidur((snapshot.val() / 3600).toFixed(1));
      } else {
        setDurasiTidur(null);
      }
    });

    const unsubscribeHeartRate = onValue(heartRateRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const latestEntry = Object.values(data).pop(); // Mengambil nilai terakhir
        setHeartRate(latestEntry?.avg || "No Data");
      } else {
        setHeartRate("No Data");
      }
    });

    const unsubscribeSteps = onValue(stepsRef, (snapshot) => {
      setLangkah(snapshot.exists() ? snapshot.val() : null);
    });

    const unsubscribeCalories = onValue(caloriesRef, (snapshot) => {
      if (snapshot.exists()) {
        const value = parseFloat(snapshot.val()); // Pastikan nilai berupa angka
        setKaloriTerbakar(value.toFixed(2)); // Bulatkan ke 2 angka belakang koma
      } else {
        setKaloriTerbakar(null);
      }
    });

    return () => {
      unsubscribeSleep();
      unsubscribeHeartRate();
      unsubscribeSteps();
      unsubscribeCalories();
    };
  }, [userId]);

  useEffect(() => {
    if (
      heartRate !== null &&
      durasiTidur !== null &&
      langkah !== null &&
      kaloriTerbakar !== null
    ) {
      fetchSaranKesehatan(heartRate, durasiTidur, langkah, kaloriTerbakar)
        .then((hasil) => {
          setSaranKesehatan(
            typeof hasil === "string"
              ? hasil
              : hasil.saran || JSON.stringify(hasil)
          );
        })
        .catch(() =>
          setSaranKesehatan("Tidak dapat mengambil saran kesehatan.")
        );
    }
  }, [heartRate, durasiTidur, langkah, kaloriTerbakar]);

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => navigate("/"))
      .catch((error) => console.error("Error logging out:", error));
  };

  const formatValue = (value, unit) =>
    value !== null ? `${value} ${unit}` : `- ${unit}`;

  return (
    <div className="container-fluid profile-container text-white py-4 position-relative">
      <div className="row justify-content-center align-items-center">
        <div className="col-12 col-md-5 text-center profile-box">
          <h3 className="fw-bold text-light mt-3">
            <FaNotesMedical className="me-2 text-warning" />
            <span>{namaUser}</span>
            <FaNotesMedical className="ms-2 text-warning" />
          </h3>
          <p className="text-light opacity-75">Data Kesehatan</p>
        </div>
        <div className="col-12 col-md-7 text-start mt-4 mt-md-0">
          <h5 className="fw-bold text-light fs-2">Ringkasan Kesehatan</h5>
          <div className="health-info">
            <p className="fs-3">
              <FaHeartPulse className="me-2 text-danger" />
              <strong> Detak Jantung:</strong> {formatValue(heartRate, "bpm")}
            </p>
            <p className="fs-3">
              <FaBed className="me-2 text-primary" />
              <strong> Durasi Tidur:</strong> {formatValue(durasiTidur, "jam")}
            </p>
            <p className="fs-3">
              <FaRunning className="me-2 text-warning" />
              <strong> Langkah:</strong> {formatValue(langkah, "langkah")}
            </p>
            <p className="fs-3">
              <FaBurn className="me-2 text-success" />
              <strong> Kalori Terbakar:</strong>
              {formatValue(kaloriTerbakar, "kal")}
            </p>
            <p className="fs-3">
              <i className="text-decoration-underline d-block">
                Saran Kesehatan:
              </i>
              <span className="text-shadow">
                <i>"{saranKesehatan}"</i>
              </span>
            </p>
          </div>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="btn btn-danger position-absolute"
        style={{ bottom: "20px", right: "20px" }}
      >
        Logout
      </button>
    </div>
  );
};

export default InformationProfile;
