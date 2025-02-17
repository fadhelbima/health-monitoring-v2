import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function InformationSleep() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: [
            "Senin",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
          ],
          datasets: [
            {
              label: "Data Kualitas Tidur",
              data: [65, 59, 80, 81, 56, 55, 40],
              borderColor: "rgb(3, 24, 94)",
              borderWidth: 6,
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                display: false,
              },
            },
            x: {
              grid: {
                display: false,
              },
            },
          },
          plugins: {
            legend: {
              labels: {
                font: {
                  size: 25,
                  family: "sans-serif",
                },
              },
            },
          },
        },
      });
    }
  }, []);

  return (
    <div className="row gap-5 px-7 py-4">
      <div className="col">
        <canvas ref={chartRef} className="shadow py-4 px-4"></canvas>
      </div>
      <div className="col d-grid gap-2">
        <div className="row">
          <div
            className="col fs-1 shadow rounded-4 px-4 py-4 me-3 ms-3 mt-5"
            style={{ height: "20rem" }}
          >
            <h5 className="fs-2 text-center mb-4">
              Parameter Kualitas Tidur (per hari)
            </h5>
            <div className="container">
              <div className="row">
                <div className="col">
                  <ul className="list-unstyled fs-3">
                    <li className="mb-2">Durasi Tidur</li>
                    <li className="mb-2">Latensi Tidur</li>
                    <li className="mb-2">Efisiensi Tidur</li>
                  </ul>
                </div>
                <div className="col">
                  <ul className="list-unstyled fs-3">
                    <li className="mb-2">....</li>
                    <li className="mb-2">....</li>
                    <li className="mb-2">....</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="custom-card mt-5">
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

export default InformationSleep;
