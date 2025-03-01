import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { auth, db } from "../firebase-config";
import { ref, onValue } from "firebase/database";
import {
  calculateSleepQuality,
  getDayIndex,
  getCurrentDate,
} from "./Sleep/SleepUtils";

function InformationSleep() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [sleepDuration, setSleepDuration] = useState(0);
  const [userId, setUserId] = useState(null);
  const [sleepHistory, setSleepHistory] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [isLoading, setIsLoading] = useState(true);

  // Days of week from Sunday to Saturday (Indonesian)
  const daysOfWeek = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jum'at",
    "Sabtu",
  ];

  useEffect(() => {
    const storedHistory = localStorage.getItem("sleepHistory");
    if (storedHistory) {
      setSleepHistory(JSON.parse(storedHistory));
    }

    // Set userId when auth state changes
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setIsLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Fetch sleep duration from Firebase when userId is available
  useEffect(() => {
    if (!userId) return;

    setIsLoading(true);
    const currentDate = getCurrentDate();
    const sleepRef = ref(
      db,
      `users/${userId}/health_data/sleep/${currentDate}/sleep_session_0/duration/seconds`
    );

    const unsubscribeSleepDuration = onValue(sleepRef, (snapshot) => {
      if (snapshot.exists()) {
        const newDuration = snapshot.val();
        const durationInHours = (newDuration / 3600).toFixed(2);

        setSleepDuration(durationInHours);

        setSleepHistory((prevHistory) => {
          // Get today's index
          const todayIndex = getDayIndex();

          // Create a copy of the previous history
          let updatedHistory = [...prevHistory];

          // Update today's sleep duration
          updatedHistory[todayIndex] = durationInHours;

          localStorage.setItem("sleepHistory", JSON.stringify(updatedHistory));
          return updatedHistory;
        });
      }
      setIsLoading(false);
    });

    // Fetch past week's sleep data
    const fetchPastWeekData = async () => {
      for (let i = 1; i <= 6; i++) {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - i);
        const pastDateString = pastDate.toISOString().split("T")[0];
        const pastDayIndex = getDayIndex(pastDate);

        const pastSleepRef = ref(
          db,
          `users/${userId}/health_data/sleep/${pastDateString}/sleep_session_0/duration/seconds`
        );

        // Use a one-time listener for historical data
        onValue(
          pastSleepRef,
          (snapshot) => {
            if (snapshot.exists()) {
              const pastDuration = snapshot.val();
              const pastDurationInHours = (pastDuration / 3600).toFixed(2);

              setSleepHistory((prevHistory) => {
                let updatedHistory = [...prevHistory];
                updatedHistory[pastDayIndex] = pastDurationInHours;
                localStorage.setItem(
                  "sleepHistory",
                  JSON.stringify(updatedHistory)
                );
                return updatedHistory;
              });
            }
          },
          { onlyOnce: true }
        );
      }
    };

    fetchPastWeekData();
    return () => unsubscribeSleepDuration();
  }, [userId]);

  // Update chart when sleep history changes
  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: daysOfWeek,
          datasets: [
            {
              label: "Durasi Tidur (jam)",
              data: sleepHistory,
              borderColor: "#4F46E5", // Indigo color
              borderWidth: 3,
              tension: 0.4,
              fill: true,
              backgroundColor: "rgba(79, 70, 229, 0.1)",
              pointBackgroundColor: "#4F46E5",
              pointRadius: 5,
              pointHoverRadius: 7,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Jam",
                font: {
                  size: 14,
                  weight: "bold",
                },
              },
              grid: {
                color: "rgba(0, 0, 0, 0.05)",
              },
            },
            x: {
              grid: { display: false },
              ticks: {
                font: {
                  weight: "bold",
                },
              },
            },
          },
          plugins: {
            legend: {
              labels: {
                font: {
                  size: 14,
                  weight: "bold",
                  family: "Poppins, sans-serif",
                },
                boxWidth: 15,
                usePointStyle: true,
                pointStyle: "circle",
              },
            },
            tooltip: {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              titleFont: {
                size: 14,
                weight: "bold",
              },
              bodyFont: {
                size: 13,
              },
              padding: 10,
              cornerRadius: 6,
              callbacks: {
                label: function (context) {
                  return `${context.parsed.y} jam`;
                },
              },
            },
          },
        },
      });
    }
  }, [sleepHistory]);

  // Reset chart and sleep history
  const resetChart = () => {
    setSleepHistory([0, 0, 0, 0, 0, 0, 0]);
    setSleepDuration(0);
    localStorage.removeItem("sleepHistory");
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }
  };

  const sleepQuality = calculateSleepQuality(sleepDuration);
  const dashoffset = 408 - (408 * sleepQuality) / 100;

  // Get sleep quality text
  const getSleepQualityText = (quality) => {
    if (quality >= 80) return "Sangat Baik";
    if (quality >= 60) return "Baik";
    if (quality >= 40) return "Cukup";
    if (quality >= 20) return "Kurang";
    return "Sangat Kurang";
  };

  // Get quality color
  const getQualityColor = (quality) => {
    if (quality >= 80) return "#10B981"; // Green
    if (quality >= 60) return "#6366F1"; // Indigo
    if (quality >= 40) return "#F59E0B"; // Amber
    if (quality >= 20) return "#F97316"; // Orange
    return "#EF4444"; // Red
  };

  return (
    <div className="container py-4">
      <div className="row g-4">
        {/* Chart Section */}

        <div className="col-lg-7">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="card-title mb-0 fw-bold">Durasi Tidur Mingguan</h5>
            </div>
            <div className="card-body">
              <div style={{ height: "300px", position: "relative" }}>
                {isLoading ? (
                  <div className="d-flex justify-content-center align-items-center h-100">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <canvas ref={chartRef}></canvas>
                )}
              </div>
              <div className="d-flex justify-content-end mt-3">
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={resetChart}
                >
                  <i className="bi bi-arrow-repeat me-1"></i> Reset Data
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sleep Quality and Parameters */}
        <div className="col-lg-5">
          <div className="row g-4">
            {/* Sleep Quality Card */}
            <div className="col-12">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <h5 className="card-title fw-bold mb-3">
                    Kualitas Tidur Anda
                  </h5>
                  <div className="d-flex align-items-center">
                    <div
                      className="position-relative"
                      style={{ width: "120px", height: "120px" }}
                    >
                      <svg width="120" height="120" viewBox="0 0 150 150">
                        <circle
                          cx="75"
                          cy="75"
                          r="65"
                          fill="none"
                          stroke="#e6e6e6"
                          strokeWidth="12"
                        ></circle>
                        <circle
                          cx="75"
                          cy="75"
                          r="65"
                          fill="none"
                          stroke={getQualityColor(sleepQuality)}
                          strokeWidth="12"
                          strokeDasharray="408"
                          strokeDashoffset={dashoffset}
                          strokeLinecap="round"
                          transform="rotate(-90 75 75)"
                        ></circle>
                      </svg>
                      <div
                        className="position-absolute top-50 start-50 translate-middle text-center fw-bold"
                        style={{
                          fontSize: "1.5rem",
                          color: getQualityColor(sleepQuality),
                        }}
                      >
                        {sleepQuality}%
                      </div>
                    </div>
                    <div className="ms-4">
                      <h6 className="mb-2">Status:</h6>
                      <p
                        className="fs-4 fw-bold mb-1"
                        style={{ color: getQualityColor(sleepQuality) }}
                      >
                        {getSleepQualityText(sleepQuality)}
                      </p>
                      <p className="text-muted small mb-0">
                        Berdasarkan data durasi tidur hari ini
                      </p>
                    </div>
                  </div>
                  <hr />
                  <p className="mb-0">
                    <i className="bi bi-lightbulb-fill me-2 text-warning"></i>
                    Cobalah tidur dan bangun di jam yang sama setiap hari,
                    hindari layar sebelum tidur, ciptakan suasana kamar yang
                    nyaman, dan kurangi konsumsi kafein di malam hari.
                  </p>
                </div>
              </div>
            </div>

            {/* Sleep Parameters Card */}
            <div className="col-12">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-white border-0 py-3">
                  <h5 className="card-title mb-0 fw-bold">
                    Parameter Tidur Hari Ini
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-4">
                      <div className="bg-light rounded p-3 text-center h-100">
                        <div className="d-flex justify-content-center mb-2">
                          <i className="bi bi-clock fs-3 text-primary"></i>
                        </div>
                        <h6 className="fw-bold">Durasi</h6>
                        <p className="fs-5 mb-0 fw-bold">
                          {sleepDuration ? `${sleepDuration} jam` : "0 jam"}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="bg-light rounded p-3 text-center h-100">
                        <div className="d-flex justify-content-center mb-2">
                          <i className="bi bi-hourglass-split fs-3 text-primary"></i>
                        </div>
                        <h6 className="fw-bold">Latensi</h6>
                        <p className="fs-5 mb-0 fw-bold text-muted">--</p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="bg-light rounded p-3 text-center h-100">
                        <div className="d-flex justify-content-center mb-2">
                          <i className="bi bi-activity fs-3 text-primary"></i>
                        </div>
                        <h6 className="fw-bold">Efisiensi</h6>
                        <p className="fs-5 mb-0 fw-bold text-muted">--</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InformationSleep;
