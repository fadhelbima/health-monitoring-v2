import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { FaHeartPulse } from "react-icons/fa6";
import { motion } from "motion/react";
import loadingGif from "../assets/loading.gif";

function InformationHeart() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [heartRateMeasured, setHeartRateMeasured] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [bpm, setBpm] = useState(null);
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

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      chartInstance.current = new Chart(ctx, {
        type: "scatter",
        data: {
          datasets: [
            {
              label: "Detak Jantung (bpm)",
              data: heartRateData,
              backgroundColor: "rgb(3, 24, 94)",
              pointRadius: 10,
              pointHoverRadius: 12,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: false,
              grid: { display: true },
              position: "top",
              min: 0,
            },
            x: {
              grid: { display: false },
              type: "category",
              labels: heartRateData.map((data) => data.x),
              position: "bottom",
            },
          },
          plugins: {
            legend: {
              labels: {
                font: {
                  size: 30,
                  family: "sans-serif",
                },
              },
            },
          },
        },
      });
    }
  }, [heartRateData]);

  const handleHeartRateTest = () => {
    setIsLoading(true);
    setHeartRateMeasured(false);
    setShowResult(false);
    setBpm(null);

    setTimeout(() => {
      setIsLoading(false);
      setHeartRateMeasured(true);
      const randomBpm = Math.floor(Math.random() * (90 - 60 + 1)) + 60; // Random bpm between 60-90
      setBpm(randomBpm);
      setHeartRateData((prevData) => {
        const newData = [
          ...prevData,
          { x: new Date().toISOString().split("T")[0], y: randomBpm },
        ];
        return newData.length > 10 ? newData.slice(1) : newData; // Geser data jika lebih dari 10
      });
      setTimeout(() => {
        setShowResult(true);
        setTimeout(() => {
          setHeartRateMeasured(false);
          setShowResult(false);
          setBpm(null);
        }, 5000);
      }, 5000);
    }, 5000);
  };

  return (
    <div className="row gap-5 px-7 py-4">
      <div className="col">
        <canvas ref={chartRef} className="shadow py-4 px-4"></canvas>
      </div>
      <div className="col d-grid gap-2">
        <div className="row justify-content-center">
          <div
            className="col fs-1 shadow rounded-4 px-4 py-4 me-3 ms-3 mb-3 text-center d-flex flex-column align-items-center"
            style={{ height: "40vh" }}
          >
            <h5 className="fs-2">Test Detak Jantung</h5>
            {isLoading ? (
              <img
                src={loadingGif}
                alt="Loading"
                width={300}
                height={300}
                style={{ animation: "spin 5s linear infinite" }}
              />
            ) : heartRateMeasured && showResult ? (
              <p className="fs-4 text-success">
                Detak Jantung Terhitung! ({bpm} bpm)
              </p>
            ) : (
              <motion.button
                className="btn btn-danger rounded-circle d-flex align-items-center justify-content-center shadow-lg mt-3"
                style={{ width: "120px", height: "120px", fontSize: "36px" }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                onClick={handleHeartRateTest}
              >
                <FaHeartPulse />
              </motion.button>
            )}
            <p className="fs-5 mt-3">Tekan Tombol Jantung untuk memulai </p>
          </div>
          <div className="col">
            <div className="custom-card">
              <h5 className="card-title fs-2">Kualitas Tidur Anda</h5>
              <div className="progress-circle">
                <svg width="150" height="150">
                  <circle
                    className="background"
                    cx="75"
                    cy="75"
                    r="65"
                  ></circle>
                  <circle
                    className="progress"
                    cx="75"
                    cy="75"
                    r="65"
                    strokeDasharray="408"
                    strokeDashoffset="102"
                  ></circle>
                </svg>
                <div className="percentage">75%</div>
              </div>
              <p className="description">
                Hasil Kualitas Tidur Anda Adalah : 75%. Cobalah tidur dan bangun
                di jam yang sama setiap hari, hindari layar sebelum tidur,
                ciptakan suasana kamar yang nyaman, dan kurangi konsumsi kafein
                di malam hari.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InformationHeart;
