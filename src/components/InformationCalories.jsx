import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { auth, db } from "../firebase-config";
import { onValue, ref } from "firebase/database";

const InformationCalories = () => {
  // Refs
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Input states
  const [berat, setBerat] = useState("");
  const [tinggi, setTinggi] = useState("");
  const [umur, setUmur] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");

  // Output states
  const [bmi, setBMI] = useState(null);
  const [kategori, setKategori] = useState("");
  const [kalori, setKalori] = useState("");
  const [kaloriTarget, setKaloriTarget] = useState(2000);

  // User state
  const [userId, setUserId] = useState("");
  const [showBmiResults, setShowBmiResults] = useState(false);

  // Get current date in YYYY-MM-DD format
  const hariIni = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  // Calculate BMI
  const hitungBMI = () => {
    if (!berat || !tinggi) {
      alert("Masukkan berat dan tinggi badan terlebih dahulu!");
      return;
    }

    const tinggiMeter = tinggi / 100;
    const hasilBMI = berat / (tinggiMeter * tinggiMeter);
    let kategoriBMI = "";

    if (umur < 20) {
      kategoriBMI = "Gunakan BMI-for-Age";
    } else {
      if (hasilBMI < 18.5) kategoriBMI = "Kurang Berat Badan";
      else if (hasilBMI < 24.9) kategoriBMI = "Normal";
      else if (hasilBMI < 29.9) kategoriBMI = "Kelebihan Berat Badan";
      else if (hasilBMI < 34.9) kategoriBMI = "Obesitas Kelas 1";
      else if (hasilBMI < 39.9) kategoriBMI = "Obesitas Kelas 2";
      else kategoriBMI = "Obesitas Kelas 3 (Morbid)";
    }

    setBMI(hasilBMI.toFixed(2));
    setKategori(kategoriBMI);
    setShowBmiResults(true);
  };

  // Get BMI category color
  const getBmiCategoryColor = () => {
    if (!kategori) return "#6c757d";

    switch (kategori) {
      case "Normal":
        return "#28a745";
      case "Kurang Berat Badan":
        return "#ffc107";
      case "Kelebihan Berat Badan":
        return "#fd7e14";
      case "Obesitas Kelas 1":
      case "Obesitas Kelas 2":
      case "Obesitas Kelas 3 (Morbid)":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  // Format number with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    if (!kalori) return 0;
    const numericKalori = parseFloat(kalori.replace(/,/g, ""));
    return Math.min((numericKalori / kaloriTarget) * 100, 100);
  };

  // Calculate stroke dashoffset based on percentage
  const calculateDashoffset = () => {
    const circumference = 2 * Math.PI * 65;
    return circumference - (circumference * calculateProgress()) / 100;
  };

  // Get progress color based on percentage
  const getProgressColor = () => {
    const progress = calculateProgress();
    if (progress > 80) return "#28a745"; // Green
    if (progress > 50) return "#17a2b8"; // Blue
    return "#ffc107"; // Yellow
  };

  // Get feedback message based on progress
  const getFeedbackMessage = () => {
    const progress = calculateProgress();
    if (progress > 80) return "💪 Luar biasa! Hampir mencapai target!";
    if (progress > 50)
      return "👍 Tetap semangat, Anda sedang dalam jalur yang tepat!";
    return "🔥 Ayo tingkatkan aktivitas fisik Anda!";
  };

  // Get activity description based on calories
  const getActivityDescription = () => {
    const numericKalori = kalori ? parseFloat(kalori.replace(/,/g, "")) : 0;
    return numericKalori > 1000
      ? "1,5 jam berlari atau 2,5 jam bersepeda santai"
      : "40 menit jalan cepat atau 30 menit berenang";
  };

  // Get achievement message based on calories
  const getAchievementMessage = () => {
    const numericKalori = kalori ? parseFloat(kalori.replace(/,/g, "")) : 0;
    return numericKalori > 1000
      ? " Ini adalah pencapaian luar biasa yang menunjukkan aktivitas fisik yang intens!"
      : " Teruslah bergerak untuk mencapai target harian Anda!";
  };

  // Get dataset based on gender and age
  const getDatasetByDemographic = (gender, age) => {
    if (gender === "Laki-laki") {
      if (age <= 5) return [200, 15, 20, 10, 25];
      if (age <= 10) return [250, 20, 30, 12, 30];
      if (age <= 15) return [300, 25, 45, 15, 50];
      if (age <= 19) return [350, 30, 55, 20, 65];
      if (age <= 29) return [400, 35, 65, 25, 75];
      if (age <= 39) return [380, 34, 63, 24, 73];
      if (age <= 49) return [370, 33, 60, 23, 70];
      if (age <= 59) return [350, 32, 58, 22, 68];
      if (age <= 69) return [320, 30, 55, 20, 65];
      return [300, 28, 50, 18, 60]; // Usia 70 ke atas
    } else if (gender === "Perempuan") {
      if (age <= 5) return [180, 14, 18, 9, 22];
      if (age <= 10) return [220, 18, 28, 11, 28];
      if (age <= 15) return [270, 23, 40, 14, 45];
      if (age <= 19) return [320, 28, 50, 18, 60];
      if (age <= 29) return [350, 30, 55, 20, 65];
      if (age <= 39) return [330, 29, 53, 19, 63];
      if (age <= 49) return [320, 28, 50, 18, 60];
      if (age <= 59) return [300, 27, 48, 17, 58];
      if (age <= 69) return [280, 26, 45, 16, 55];
      return [260, 24, 40, 15, 50]; // Usia 70 ke atas
    }
    return [];
  };

  // Initialize chart
  const initializeChart = () => {
    if (!umur || !jenisKelamin || !chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    const dataSet = getDatasetByDemographic(jenisKelamin, parseInt(umur));

    if (dataSet.length > 0) {
      chartInstance.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: [
            "Karbohidrat (g)",
            "Serat (g)",
            "Protein (g)",
            "Air (dL)",
            "Lemak (g)",
          ],
          datasets: [
            {
              label: "Distribusi Kalori",
              data: dataSet,
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
              ],
              borderWidth: 0,
              hoverOffset: 10,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "65%",
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                font: { size: 14, family: "'Poppins', sans-serif" },
                padding: 20,
                usePointStyle: true,
                pointStyle: "circle",
              },
            },
            title: {
              display: true,
              text: "Distribusi Nutrisi Harian",
              font: {
                size: 20,
                weight: "bold",
                family: "'Poppins', sans-serif",
              },
              padding: {
                bottom: 20,
              },
            },
          },
          animation: {
            animateScale: true,
            animateRotate: true,
          },
        },
      });
    }
  };

  // Effect for user authentication
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setUserId(user ? user.uid : "");
    });
    return () => unsubscribeAuth();
  }, []);

  // Effect for fetching calorie data
  useEffect(() => {
    if (!userId) return;

    const currentDate = hariIni();
    const caloriesRef = ref(
      db,
      `users/${userId}/health_data/calories/${currentDate}/calories_data/value`
    );
    const targetRef = ref(db, `users/${userId}/health_data/calories/target`);

    const unsubscribeCalories = onValue(caloriesRef, (snapshot) => {
      if (snapshot.exists()) {
        const value = parseFloat(snapshot.val());
        setKalori(value.toFixed(2));
      } else {
        setKalori("1025"); // Default value
      }
    });

    const unsubscribeTarget = onValue(targetRef, (snapshot) => {
      if (snapshot.exists()) {
        setKaloriTarget(parseFloat(snapshot.val()));
      }
    });

    return () => {
      unsubscribeCalories();
      unsubscribeTarget();
    };
  }, [userId]);

  // Effect for chart initialization
  useEffect(() => {
    initializeChart();
  }, [umur, jenisKelamin]);

  return (
    <div
      className="container-fluid py-5 px-4"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="row">
        <div className="col-12 mb-4">
          <h2 className="fw-bold text-primary mb-4">Dashboard Kesehatan</h2>
        </div>
      </div>

      <div className="row g-4">
        {/* Chart Section */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <div style={{ height: "380px", position: "relative" }}>
                <canvas
                  ref={chartRef}
                  style={{ width: "100%", height: "100%" }}
                ></canvas>
              </div>
              <p className="text-center text-muted mt-3 mb-0">
                Distribusi nutrisi berdasarkan {jenisKelamin || "jenis kelamin"}{" "}
                dan usia {umur || "Anda"}
              </p>
            </div>
          </div>
        </div>

        {/* Input and Progress Sections */}
        <div className="col-lg-6">
          <div className="row g-4">
            {/* BMI Calculator */}
            <div className="col-12">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  <h4 className="fw-bold mb-3">Kalkulator BMI</h4>
                  <p className="text-muted small mb-4">
                    *Akurat untuk usia 20 tahun ke atas
                  </p>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <input
                          type="number"
                          className="form-control rounded-3"
                          id="beratBadan"
                          placeholder="Berat Badan"
                          max={500}
                          min={10}
                          value={berat}
                          onChange={(e) => setBerat(e.target.value)}
                        />
                        <label htmlFor="beratBadan">Berat Badan (kg)</label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <input
                          type="number"
                          className="form-control rounded-3"
                          id="tinggiBadan"
                          placeholder="Tinggi Badan"
                          max={500}
                          min={10}
                          value={tinggi}
                          onChange={(e) => setTinggi(e.target.value)}
                        />
                        <label htmlFor="tinggiBadan">Tinggi Badan (cm)</label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <input
                          type="number"
                          className="form-control rounded-3"
                          id="umur"
                          placeholder="Umur"
                          max={120}
                          min={1}
                          value={umur}
                          onChange={(e) => setUmur(e.target.value)}
                        />
                        <label htmlFor="umur">Umur (tahun)</label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="d-block mb-2 text-muted">
                          Jenis Kelamin
                        </label>
                        <div className="d-flex gap-4">
                          <div className="form-check">
                            <input
                              type="radio"
                              name="gender"
                              className="form-check-input"
                              id="laki-laki"
                              value="Laki-laki"
                              checked={jenisKelamin === "Laki-laki"}
                              onChange={(e) => setJenisKelamin(e.target.value)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="laki-laki"
                            >
                              Laki-laki
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              type="radio"
                              name="gender"
                              className="form-check-input"
                              id="perempuan"
                              value="Perempuan"
                              checked={jenisKelamin === "Perempuan"}
                              onChange={(e) => setJenisKelamin(e.target.value)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="perempuan"
                            >
                              Perempuan
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="d-grid">
                    <button
                      className="btn btn-primary py-3 rounded-3 fw-bold"
                      onClick={hitungBMI}
                    >
                      Hitung BMI
                    </button>
                  </div>

                  {showBmiResults && bmi && (
                    <div className="mt-4 p-3 bg-light rounded-3">
                      <div className="row align-items-center">
                        <div className="col-md-4 text-center">
                          <div
                            className="d-inline-block position-relative"
                            style={{ width: "120px", height: "120px" }}
                          >
                            <svg width="120" height="120" viewBox="0 0 120 120">
                              <circle
                                cx="60"
                                cy="60"
                                r="50"
                                fill="none"
                                stroke="#f0f0f0"
                                strokeWidth="10"
                              ></circle>
                              <circle
                                cx="60"
                                cy="60"
                                r="50"
                                fill="none"
                                stroke={getBmiCategoryColor()}
                                strokeWidth="10"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 50}`}
                                strokeDashoffset={`${2 * Math.PI * 50 * 0.25}`}
                                transform="rotate(-90 60 60)"
                              ></circle>
                            </svg>
                            <div className="position-absolute top-50 start-50 translate-middle text-center">
                              <div className="fs-2 fw-bold">{bmi}</div>
                              <div className="small">BMI</div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-8">
                          <h5 className="mb-2">Hasil BMI Anda</h5>
                          <p className="mb-2">
                            Kategori:{" "}
                            <span
                              className="fw-bold"
                              style={{ color: getBmiCategoryColor() }}
                            >
                              {kategori}
                            </span>
                          </p>
                          <p className="small text-muted mb-0">
                            BMI antara 18.5 dan 24.9 dianggap normal untuk
                            sebagian besar orang dewasa.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Calorie Progress */}
            <div className="col-12">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  <h4 className="fw-bold mb-4">Kalori yang Terbakar</h4>

                  <div className="row align-items-center">
                    <div className="col-md-5 text-center">
                      <div
                        className="position-relative mx-auto"
                        style={{ width: "180px", height: "180px" }}
                      >
                        <svg width="180" height="180" viewBox="0 0 180 180">
                          {/* Background circle */}
                          <circle
                            cx="90"
                            cy="90"
                            r="65"
                            fill="none"
                            stroke="#f0f0f0"
                            strokeWidth="15"
                          ></circle>

                          {/* Progress circle */}
                          <circle
                            cx="90"
                            cy="90"
                            r="65"
                            fill="none"
                            stroke={getProgressColor()}
                            strokeWidth="15"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 65}`}
                            strokeDashoffset={calculateDashoffset()}
                            transform="rotate(-90 90 90)"
                            style={{
                              transition: "stroke-dashoffset 1s ease-in-out",
                            }}
                          ></circle>
                        </svg>

                        <div className="position-absolute top-50 start-50 translate-middle text-center">
                          <div className="fs-3 fw-bold">
                            {kalori ? formatNumber(kalori) : "0"}
                          </div>
                          <div className="small text-muted">
                            dari {formatNumber(kaloriTarget)} kal
                          </div>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between mt-2">
                        <div className="small text-muted">0</div>
                        <div className="small text-muted fw-bold">
                          {formatNumber(kaloriTarget)} kal
                        </div>
                      </div>
                    </div>

                    <div className="col-md-7">
                      <div className="card bg-light border-0 rounded-4 p-3 h-100">
                        <h6>Analisis Aktivitas</h6>
                        <p className="mb-2 small">
                          Anda telah membakar{" "}
                          <span className="fw-bold">
                            {kalori ? formatNumber(kalori) : "0"} kalori
                          </span>
                          , setara dengan:
                        </p>
                        <div className="d-flex align-items-center mb-2">
                          <div
                            className="rounded-circle me-2 flex-shrink-0"
                            style={{
                              width: "10px",
                              height: "10px",
                              backgroundColor: getProgressColor(),
                            }}
                          ></div>
                          <span className="small">
                            {getActivityDescription()}
                          </span>
                        </div>
                        <p className="small mb-0">{getAchievementMessage()}</p>
                        <div
                          className="alert alert-light border-start border-4 mt-3 mb-0 py-2 px-3"
                          style={{
                            borderColor: getProgressColor() + "!important",
                          }}
                        >
                          <small
                            className="fw-bold"
                            style={{ color: getProgressColor() }}
                          >
                            {getFeedbackMessage()}
                          </small>
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
    </div>
  );
};

export default InformationCalories;
