import React, { useState } from "react";
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

  const datasets = {
    harian: {
      labels: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"],
      datasets: [
        {
          label: "Data Langkah",
          data: [65, 59, 80, 81, 56, 55, 40],
          borderColor: "rgb(3, 24, 94)",
          borderWidth: 6,
          tension: 0.4,
        },
      ],
    },
    mingguan: {
      labels: ["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4"],
      datasets: [
        {
          label: "Data Langkah",
          data: [65, 59, 80, 81],
          borderColor: "rgb(3, 24, 94)",
          borderWidth: 6,
          tension: 0.4,
        },
      ],
    },
    bulanan: {
      labels: [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
      ],
      datasets: [
        {
          label: "Data Langkah",
          data: [65, 59, 80, 81, 87, 56, 44, 78, 77, 90, 56, 70],
          borderColor: "rgb(3, 24, 94)",
          borderWidth: 6,
          tension: 0.4,
        },
      ],
    },
    tahunan: {
      labels: ["Tahun 1", "Tahun 2", "Tahun 3", "Tahun 4", "Tahun 5"],
      datasets: [
        {
          label: "Data Langkah",
          data: [60, 40, 70, 85, 55],
          borderColor: "rgb(3, 24, 94)",
          borderWidth: 6,
          tension: 0.4,
        },
      ],
    },
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        grid: { display: false },
      },
      x: { grid: { display: false } },
    },
    plugins: {
      legend: {
        labels: { font: { size: 25, family: "sans-serif" } },
      },
    },
  };

  return (
    <div className="grid gap-5 row px-7 py-4">
      <div className="col">
        <Bar
          data={datasets[selectedPeriod]}
          options={options}
          className="shadow py-4 px-4"
        />
      </div>
      <div className="col grid gap-2">
        <div className="row">
          <div className="col fs-1 shadow rounded-4 px-4 py-4 me-3 ms-3">
            PERIODE LANGKAH
            <div className="container">
              <div className="row">
                <div className="col fs-3">
                  {["harian", "mingguan", "bulanan", "tahunan"].map(
                    (period) => (
                      <div className="form-check" key={period}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="pilihan"
                          id={period}
                          value={period}
                          checked={selectedPeriod === period}
                          onChange={() => setSelectedPeriod(period)}
                        />
                        <label
                          className="form-check-label fw-bold"
                          htmlFor={period}
                        >
                          {period.charAt(0).toUpperCase() + period.slice(1)}
                        </label>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="custom-card mt-4">
              <h5 className="card-title fs-2">
                Rata - rata Langkah{" "}
                {selectedPeriod.charAt(0).toUpperCase() +
                  selectedPeriod.slice(1)}{" "}
                Anda
              </h5>
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
                    strokeDasharray="0"
                    strokeDashoffset="60"
                  ></circle>
                </svg>
                <div className="percentage">75%</div>
              </div>
              <p className="description">
                Hasil Kualitas Tidur Anda Adalah : 75%. Jaga pola tidur yang
                sehat!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepCounter;
