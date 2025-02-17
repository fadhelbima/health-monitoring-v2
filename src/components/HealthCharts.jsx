// components/HealthCharts.js
import React, { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";

const HealthCharts = ({ user, onImagesReady }) => {
  const chartRefs = {
    sleep: useRef(null),
    steps: useRef(null),
    calories: useRef(null),
    heartRate: useRef(null),
  };

  const [chartImages, setChartImages] = useState({});

  useEffect(() => {
    const createChart = (ref, type, data, options, key) => {
      if (!ref.current) return; // 🔥 Cegah error jika ref belum tersedia

      const ctx = ref.current.getContext("2d");
      if (!ctx) return; // 🔥 Pastikan getContext tidak null

      const chart = new Chart(ctx, { type, data, options });

      setTimeout(() => {
        setChartImages((prev) => ({
          ...prev,
          [key]: chart.toBase64Image(),
        }));
        chart.destroy();
      }, 500);
    };

    createChart(
      chartRefs.sleep,
      "line",
      {
        labels: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
        datasets: [
          {
            label: "Tidur (Jam)",
            data: user?.tidur || [6, 7, 5, 8, 6, 7, 9],
            borderColor: "blue",
            fill: false,
          },
        ],
      },
      {},
      "sleep"
    );

    createChart(
      chartRefs.steps,
      "bar",
      {
        labels: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
        datasets: [
          {
            label: "Langkah",
            data: user?.langkah || [5000, 7000, 6000, 8000, 7500, 9000, 10000],
            backgroundColor: "green",
          },
        ],
      },
      {},
      "steps"
    );

    createChart(
      chartRefs.calories,
      "doughnut",
      {
        labels: ["Terbakar", "Sisa"],
        datasets: [
          {
            data: [user?.kalori || 2000, 2500],
            backgroundColor: ["red", "gray"],
          },
        ],
      },
      {},
      "calories"
    );

    createChart(
      chartRefs.heartRate,
      "scatter",
      {
        datasets: [
          {
            label: "Detak Jantung",
            data: user?.detakJantung || [
              { x: 1, y: 70 },
              { x: 2, y: 75 },
              { x: 3, y: 72 },
            ],
            backgroundColor: "purple",
          },
        ],
      },
      {},
      "heartRate"
    );
  }, [user]);

  useEffect(() => {
    if (Object.keys(chartImages).length === 4) {
      onImagesReady(chartImages);
    }
  }, [chartImages, onImagesReady]);

  return (
    <div style={{ display: "none" }}>
      <canvas ref={chartRefs.sleep} />
      <canvas ref={chartRefs.steps} />
      <canvas ref={chartRefs.calories} />
      <canvas ref={chartRefs.heartRate} />
    </div>
  );
};

export default HealthCharts;
