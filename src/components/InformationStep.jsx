import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { auth } from "../firebase-config";
import { fetchStepsData, calculateAverage } from "./Step/StepUtils";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const StepCounter = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("harian");
  const [stepsData, setStepsData] = useState({
    harian: [0, 0, 0, 0, 0, 0, 0],
    mingguan: [0, 0, 0, 0],
    bulanan: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    tahunan: [0],
  });
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setIsLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!userId) return;

    setIsLoading(true);
    // Fetch steps data when userId is available
    const unsubscribe = fetchStepsData(userId, (data) => {
      setStepsData(data);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  // Define periods with proper translations and formatting
  const periods = [
    { id: "harian", label: "Harian", icon: "calendar-day" },
    { id: "mingguan", label: "Mingguan", icon: "calendar-week" },
    { id: "bulanan", label: "Bulanan", icon: "calendar-month" },
    { id: "tahunan", label: "Tahunan", icon: "calendar" },
  ];

  const datasets = {
    harian: {
      labels: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"],
      datasets: [
        {
          label: "Langkah Harian",
          data: stepsData.harian,
          backgroundColor: "rgba(79, 70, 229, 0.7)",
          borderColor: "#4F46E5",
          borderWidth: 1,
          borderRadius: 6,
          hoverBackgroundColor: "rgba(79, 70, 229, 0.9)",
        },
      ],
    },
    mingguan: {
      labels: ["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4"],
      datasets: [
        {
          label: "Langkah Mingguan",
          data: stepsData.mingguan,
          backgroundColor: "rgba(79, 70, 229, 0.7)",
          borderColor: "#4F46E5",
          borderWidth: 1,
          borderRadius: 6,
          hoverBackgroundColor: "rgba(79, 70, 229, 0.9)",
        },
      ],
    },
    bulanan: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Agu",
        "Sep",
        "Okt",
        "Nov",
        "Des",
      ],
      datasets: [
        {
          label: "Langkah Bulanan",
          data: stepsData.bulanan,
          backgroundColor: "rgba(79, 70, 229, 0.7)",
          borderColor: "#4F46E5",
          borderWidth: 1,
          borderRadius: 6,
          hoverBackgroundColor: "rgba(79, 70, 229, 0.9)",
        },
      ],
    },
    tahunan: {
      labels: ["Tahun Ini"],
      datasets: [
        {
          label: "Langkah Tahunan",
          data: stepsData.tahunan,
          backgroundColor: "rgba(79, 70, 229, 0.7)",
          borderColor: "#4F46E5",
          borderWidth: 1,
          borderRadius: 6,
          hoverBackgroundColor: "rgba(79, 70, 229, 0.9)",
        },
      ],
    },
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            size: 12,
          },
        },
        title: {
          display: true,
          text: "Jumlah Langkah",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
      x: {
        grid: { display: false },
        ticks: {
          font: {
            size: 12,
            weight: "bold",
          },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          font: { size: 14, weight: "bold", family: "Poppins, sans-serif" },
          boxWidth: 15,
          usePointStyle: true,
          pointStyle: "rect",
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
            return `${context.parsed.y.toLocaleString()} langkah`;
          },
        },
      },
    },
  };

  const averageSteps = calculateAverage(stepsData[selectedPeriod]);

  // Calculate daily target (assuming 10,000 steps is the daily goal)
  const dailyTarget = 10000;
  const progressPercentage = Math.min(100, (averageSteps / dailyTarget) * 100);

  // Get progress status and color
  const getProgressStatus = (percentage) => {
    if (percentage >= 100) return { text: "Target Tercapai", color: "#10B981" };
    if (percentage >= 75) return { text: "Hampir Tercapai", color: "#6366F1" };
    if (percentage >= 50) return { text: "Sedang", color: "#F59E0B" };
    if (percentage >= 25)
      return { text: "Perlu Ditingkatkan", color: "#F97316" };
    return { text: "Kurang Aktif", color: "#EF4444" };
  };

  const progressStatus = getProgressStatus(progressPercentage);

  return (
    <div className="container py-4">
      <div className="row g-4">
        {/* Chart Section */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0 fw-bold">Statistik Langkah</h5>
              <div className="btn-group" role="group">
                {periods.map((period) => (
                  <button
                    key={period.id}
                    type="button"
                    className={`btn ${
                      selectedPeriod === period.id
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => setSelectedPeriod(period.id)}
                  >
                    <i className={`bi bi-${period.icon} me-1`}></i>{" "}
                    {period.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="card-body">
              <div style={{ height: "350px", position: "relative" }}>
                {isLoading ? (
                  <div className="d-flex justify-content-center align-items-center h-100">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <Bar data={datasets[selectedPeriod]} options={options} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Steps Summary */}
        <div className="col-lg-4">
          <div className="row g-4">
            {/* Average Steps Card */}
            <div className="col-12">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <h5 className="card-title fw-bold mb-3">
                    Rata-rata Langkah{" "}
                    {selectedPeriod.charAt(0).toUpperCase() +
                      selectedPeriod.slice(1)}
                  </h5>
                  <div className="text-center my-4">
                    <div
                      className="display-4 fw-bold"
                      style={{ color: progressStatus.color }}
                    >
                      {averageSteps.toLocaleString()}
                    </div>
                    <p className="text-muted mb-0">langkah</p>
                  </div>

                  <div className="mt-4">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Progress Terhadap Target (10,000 langkah)</span>
                      <span className="fw-bold">
                        {progressPercentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="progress" style={{ height: "10px" }}>
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${progressPercentage}%`,
                          backgroundColor: progressStatus.color,
                        }}
                        aria-valuenow={progressPercentage}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                    <p
                      className="text-center mt-2"
                      style={{ color: progressStatus.color }}
                    >
                      <i className="bi bi-info-circle me-1"></i>
                      Status:{" "}
                      <span className="fw-bold">{progressStatus.text}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Tips Card */}
            <div className="col-12">
              <div className="card shadow-sm border-0 bg-light">
                <div className="card-body">
                  <h5 className="card-title fw-bold mb-3">
                    <i className="bi bi-lightbulb-fill me-2 text-warning"></i>
                    Tips Aktivitas
                  </h5>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item bg-light border-0 ps-0 pb-2">
                      <i className="bi bi-check-circle-fill me-2 text-success"></i>
                      Targetkan 10,000 langkah per hari untuk kesehatan optimal
                    </li>
                    <li className="list-group-item bg-light border-0 ps-0 pb-2">
                      <i className="bi bi-check-circle-fill me-2 text-success"></i>
                      Gunakan tangga daripada lift untuk aktivitas tambahan
                    </li>
                    <li className="list-group-item bg-light border-0 ps-0 pb-2">
                      <i className="bi bi-check-circle-fill me-2 text-success"></i>
                      Jalan kaki 30 menit setiap hari dapat meningkatkan
                      kesehatan jantung
                    </li>
                    <li className="list-group-item bg-light border-0 ps-0">
                      <i className="bi bi-check-circle-fill me-2 text-success"></i>
                      Tetapkan alarm untuk berdiri dan bergerak setiap 1 jam
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepCounter;
