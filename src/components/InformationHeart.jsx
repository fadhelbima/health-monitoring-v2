import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { FaHeartPulse } from "react-icons/fa6";
import { ref, onValue, set } from "firebase/database";
import { db, auth } from "../firebase-config";
import {
  checkHeartRateAnomaly,
  detectSuddenChanges,
  analyzeHeartRatePatterns,
} from "./HeartRate/HeartRateUtils";
import HeartRateChart from "./HeartRate/HeartRateChart";

function InformationHeart() {
  const userId = auth.currentUser ? auth.currentUser.uid : null;
  const [isLoading, setIsLoading] = useState(false);
  const [heartRateMeasured, setHeartRateMeasured] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [bpm, setBpm] = useState(null);
  const [heartRate, setHeartRate] = useState("No Data");
  const [sleepQuality, setSleepQuality] = useState(75);
  const [anomalyDetected, setAnomalyDetected] = useState(false);
  const [anomalyMessage, setAnomalyMessage] = useState("");
  const [heartRateData, setHeartRateData] = useState([
    { x: "2025-02-01", y: 0 },
    { x: "2025-02-02", y: 0 },
    { x: "2025-02-03", y: 0 },
    { x: "2025-02-04", y: 0 },
    { x: "2025-02-05", y: 0 },
    { x: "2025-02-06", y: 0 },
    { x: "2025-02-07", y: 0 },
    { x: "2025-02-08", y: 0 },
    { x: "2025-02-09", y: 0 },
    { x: "2025-02-10", y: 0 },
  ]);

  // Format date for Firebase
  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const currentDate = formatDate(new Date());

  // Fetch data from Firebase when component mounts
  useEffect(() => {
    if (!userId) return;

    // Fetch heart rate data from Firebase
    const heartRateRef = ref(
      db,
      `users/${userId}/health_data/heart_rate/${currentDate}`
    );

    const unsubscribeHeartRate = onValue(heartRateRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const times = Object.keys(data).sort().reverse();
        const latestRate = times.length > 0 ? data[times[0]].avg : "No Data";
        setHeartRate(latestRate);

        // Check for anomalies in the latest reading
        if (typeof latestRate === "number") {
          const { isAnomaly, message } = checkHeartRateAnomaly(latestRate);
          setAnomalyDetected(isAnomaly);
          setAnomalyMessage(message);
        }
      } else {
        setHeartRate("No Data");
      }
    });

    // Fetch historical heart rate data for graph
    const historicalDataRef = ref(db, `users/${userId}/health_data/heart_rate`);

    const unsubscribeHistorical = onValue(historicalDataRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const dates = Object.keys(data).sort().slice(-10); // Last 10 days

        const chartData = dates.map((date) => {
          const dayData = data[date];
          const times = Object.keys(dayData || {});
          let avgValue = 0;

          if (times.length > 0) {
            // Calculate average for that day
            const sum = times.reduce(
              (acc, time) => acc + (dayData[time].avg || 0),
              0
            );
            avgValue = Math.round(sum / times.length);
          }

          return { x: date, y: avgValue };
        });

        // Update chart data only if there is data
        if (chartData.some((item) => item.y > 0)) {
          setHeartRateData(chartData);

          // Check for anomalies in the data patterns
          const { isAnomaly, message } = analyzeHeartRatePatterns(chartData);
          if (isAnomaly) {
            setAnomalyDetected(true);
            setAnomalyMessage(message);
          }
        }
      }
    });

    // Fetch sleep quality data
    const sleepQualityRef = ref(
      db,
      `users/${userId}/health_data/sleep_quality/${currentDate}`
    );

    const unsubscribeSleep = onValue(sleepQualityRef, (snapshot) => {
      if (snapshot.exists()) {
        setSleepQuality(snapshot.val().percentage || 75);
      }
    });

    return () => {
      unsubscribeHeartRate();
      unsubscribeHistorical();
      unsubscribeSleep();
    };
  }, [userId, currentDate]);

  const handleHeartRateTest = () => {
    if (!userId) {
      alert("Silakan login terlebih dahulu");
      return;
    }

    setIsLoading(true);
    setHeartRateMeasured(false);
    setShowResult(false);
    setBpm(null);
    setAnomalyDetected(false);
    setAnomalyMessage("");

    setTimeout(() => {
      setIsLoading(false);
      setHeartRateMeasured(true);

      // Get previous reading for comparison
      const latestReading =
        heartRateData.find((item) => item.x === currentDate)?.y || 0;

      // For demo purposes, generate random heart rate
      // In a real app, this would come from an actual sensor
      let randomBpm;

      // 15% chance of generating an anomaly for testing purposes
      const generateAnomaly = Math.random() < 0.15;

      if (generateAnomaly) {
        // Generate either very low or very high value
        const isLow = Math.random() < 0.5;
        randomBpm = isLow
          ? Math.floor(Math.random() * 15) + 35 // 35-50 (low)
          : Math.floor(Math.random() * 40) + 110; // 110-150 (high)
      } else {
        // Normal range
        randomBpm = Math.floor(Math.random() * (90 - 60 + 1)) + 60; // 60-90 (normal)
      }

      setBpm(randomBpm);

      // Check for anomalies
      const { isAnomaly, message, type } = checkHeartRateAnomaly(randomBpm);
      setAnomalyDetected(isAnomaly);
      setAnomalyMessage(message);

      // Also check for sudden changes
      const { isAnomaly: isSuddenChange, message: suddenChangeMessage } =
        detectSuddenChanges(randomBpm, latestReading);
      if (isSuddenChange) {
        setAnomalyDetected(true);
        setAnomalyMessage(suddenChangeMessage);
      }

      // Save to Firebase
      const currentTime = new Date().toISOString();
      const heartRateRef = ref(
        db,
        `users/${userId}/health_data/heart_rate/${currentDate}/${currentTime.replace(
          /\.|:/g,
          "_"
        )}`
      );

      set(heartRateRef, {
        timestamp: currentTime,
        avg: randomBpm,
        min: randomBpm - 5,
        max: randomBpm + 5,
        isAnomaly: isAnomaly,
        anomalyType: type,
      })
        .then(() => {
          console.log("Data detak jantung berhasil disimpan");
        })
        .catch((error) => {
          console.error("Error menyimpan data:", error);
        });

      // Update chart data
      setHeartRateData((prevData) => {
        // Check if there's already data for today
        const existingIndex = prevData.findIndex(
          (item) => item.x === currentDate
        );
        const newData = [...prevData];

        if (existingIndex !== -1) {
          // Update existing data
          newData[existingIndex] = { ...newData[existingIndex], y: randomBpm };
        } else {
          // Add new data and remove oldest if there are already 10 items
          newData.push({ x: currentDate, y: randomBpm });
          if (newData.length > 10) {
            newData.shift();
          }
        }

        return newData;
      });

      setTimeout(() => {
        setShowResult(true);
        setTimeout(() => {
          setHeartRateMeasured(false);
          setShowResult(false);
          setBpm(null);
        }, 5000);
      }, 2000);
    }, 3000);
  };

  // Calculate stroke-dashoffset for sleep quality circle
  const calculateOffset = (percentage) => {
    const circumference = 2 * Math.PI * 65;
    return circumference - (circumference * percentage) / 100;
  };

  return (
    <div className="container-fluid px-2 px-md-5 py-3 py-md-4">
      <div className="row g-4">
        {/* Chart Section - Full width on mobile, half on desktop */}
        <div className="col-12 col-lg-6">
          <HeartRateChart heartRateData={heartRateData} />
        </div>

        {/* Controls Section - Full width on mobile, half on desktop */}
        <div className="col-12 col-lg-6">
          <div className="row g-3">
            {/* Heart Rate Test Card */}
            <div className="col-12 col-md-6 col-lg-12">
              <div
                className="shadow rounded-4 p-3 text-center d-flex flex-column align-items-center justify-content-center"
                style={{ minHeight: "200px" }}
              >
                <h5 className="fs-4 fs-md-3 fs-lg-2 mb-3">
                  Test Detak Jantung
                </h5>
                {isLoading ? (
                  <div
                    className="spinner-border text-danger"
                    style={{ width: "4rem", height: "4rem" }}
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : heartRateMeasured && showResult ? (
                  <div className="text-center">
                    <p
                      className={`fs-5 fs-md-4 text-${
                        bpm >= 50 && bpm <= 100 ? "success" : "danger"
                      }`}
                    >
                      Detak Jantung Terhitung! ({bpm} bpm)
                    </p>
                    {anomalyDetected && (
                      <div
                        className={`alert alert-${
                          bpm < 40 || bpm > 140 ? "danger" : "warning"
                        } mt-2 p-2 small`}
                      >
                        <i className="bi bi-exclamation-triangle-fill me-1"></i>
                        {anomalyMessage}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    className="btn btn-danger rounded-circle d-flex align-items-center justify-content-center shadow-lg"
                    style={{
                      width: "80px",
                      height: "80px",
                      fontSize: "28px",
                      animation: "pulse 1.5s infinite",
                    }}
                    onClick={handleHeartRateTest}
                    disabled={!userId}
                  >
                    <FaHeartPulse />
                  </button>
                )}
                <p className="fs-6 fs-md-5 mt-3">
                  {userId
                    ? "Tekan Tombol Jantung untuk memulai"
                    : "Login untuk menggunakan fitur ini"}
                </p>
                {heartRate !== "No Data" && (
                  <div
                    className={`mt-2 p-2 rounded ${
                      anomalyDetected ? "bg-warning bg-opacity-10" : "bg-light"
                    }`}
                  >
                    <p className="m-0">
                      Detak jantung terakhir: <strong>{heartRate} bpm</strong>
                      {anomalyDetected && (
                        <span className="ms-1 badge bg-warning text-dark">
                          Anomali
                        </span>
                      )}
                    </p>
                    {anomalyDetected && (
                      <p className="m-0 small text-danger mt-1">
                        {anomalyMessage}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Sleep Quality Card */}
            <div className="col-12 col-md-6 col-lg-12">
              <div
                className="shadow rounded-4 p-3"
                style={{ minHeight: "200px" }}
              >
                <h5 className="fs-4 fs-md-3 fs-lg-2 mb-2 text-center">
                  Kualitas Tidur Anda
                </h5>
                <div className="d-flex flex-column flex-md-row align-items-center justify-content-around">
                  <div
                    className="position-relative mb-3 mb-md-0"
                    style={{ width: "120px", height: "120px" }}
                  >
                    <svg width="120" height="120" viewBox="0 0 150 150">
                      <circle
                        className="text-light"
                        cx="75"
                        cy="75"
                        r="65"
                        stroke="#eeeeee"
                        strokeWidth="10"
                        fill="none"
                      ></circle>
                      <circle
                        className="text-primary"
                        cx="75"
                        cy="75"
                        r="65"
                        stroke={
                          sleepQuality >= 70
                            ? "#198754"
                            : sleepQuality >= 50
                            ? "#ffc107"
                            : "#dc3545"
                        }
                        strokeWidth="10"
                        strokeDasharray="408"
                        strokeDashoffset={calculateOffset(sleepQuality)}
                        fill="none"
                        transform="rotate(-90 75 75)"
                      ></circle>
                    </svg>
                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center fw-bold fs-4">
                      {sleepQuality}%
                    </div>
                  </div>
                  <div className="text-center text-md-start flex-grow-1 px-2">
                    <p className="fs-6 m-0">
                      Hasil Kualitas Tidur Anda Adalah:{" "}
                      <strong>{sleepQuality}%</strong>.
                      {sleepQuality >= 70 ? (
                        <span className="d-none d-md-inline">
                          {" "}
                          Kualitas tidur Anda sangat baik! Pertahankan pola
                          tidur Anda saat ini.
                        </span>
                      ) : sleepQuality >= 50 ? (
                        <span className="d-none d-md-inline">
                          {" "}
                          Cobalah tidur dan bangun di jam yang sama setiap hari,
                          hindari layar sebelum tidur.
                        </span>
                      ) : (
                        <span className="d-none d-md-inline">
                          {" "}
                          Kualitas tidur Anda kurang baik. Perhatikan pola
                          tidur, hindari kafein dan layar di malam hari.
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom styles for animations and responsiveness */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        @media (max-width: 767px) {
          .fs-md-3 {
            font-size: 1.5rem !important;
          }
          .fs-md-4 {
            font-size: 1.25rem !important;
          }
          .fs-md-5 {
            font-size: 1rem !important;
          }
        }

        @media (min-width: 768px) {
          .fs-md-3 {
            font-size: 1.75rem !important;
          }
          .fs-md-4 {
            font-size: 1.5rem !important;
          }
          .fs-md-5 {
            font-size: 1.25rem !important;
          }
        }
      `}</style>
    </div>
  );
}

export default InformationHeart;
