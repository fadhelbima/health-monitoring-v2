import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function HeartRateChart({ heartRateData }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      // Get container width for responsive font sizing
      const containerWidth = chartRef.current.parentElement.offsetWidth;
      const isMobile = containerWidth < 768;

      chartInstance.current = new Chart(ctx, {
        type: "scatter",
        data: {
          datasets: [
            {
              label: "Detak Jantung (bpm)",
              data: heartRateData,
              backgroundColor: function (context) {
                const value = context.raw?.y;
                if (!value) return "rgb(3, 24, 94)";

                if (value < 50 || value > 100) {
                  return "rgb(220, 53, 69)"; // Red for anomalies
                }
                return "rgb(3, 24, 94)"; // Default blue
              },
              pointRadius: isMobile ? 5 : 10,
              pointHoverRadius: isMobile ? 7 : 12,
              borderColor: function (context) {
                const value = context.raw?.y;
                if (!value) return "rgb(3, 24, 94)";

                if (value < 50 || value > 100) {
                  return "rgb(220, 53, 69)"; // Red for anomalies
                }
                return "rgb(3, 24, 94)"; // Default blue
              },
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: false,
              grid: { display: true },
              position: "top",
              min: 0,
              ticks: {
                font: {
                  size: isMobile ? 10 : 14,
                },
              },
            },
            x: {
              grid: { display: false },
              type: "category",
              labels: heartRateData.map((data) => {
                // For mobile, show shorter date format
                if (isMobile) {
                  const parts = data.x.split("-");
                  return parts[2] + "/" + parts[1];
                }
                return data.x;
              }),
              position: "bottom",
              ticks: {
                font: {
                  size: isMobile ? 10 : 14,
                },
              },
            },
          },
          plugins: {
            legend: {
              labels: {
                font: {
                  size: isMobile ? 14 : 24,
                  family: "sans-serif",
                },
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const value = context.raw.y;
                  let label = `Detak Jantung: ${value} bpm`;

                  if (value < 50) {
                    label += " (Rendah)";
                  } else if (value > 100) {
                    label += " (Tinggi)";
                  } else {
                    label += " (Normal)";
                  }

                  return label;
                },
              },
            },
          },
        },
      });
    }

    // Add window resize listener for chart responsiveness
    const handleResize = () => {
      if (chartRef.current) {
        chartInstance.current.destroy();
        // Force re-render by creating a new chart instance
        const ctx = chartRef.current.getContext("2d");
        const containerWidth = chartRef.current.parentElement.offsetWidth;
        const isMobile = containerWidth < 768;

        chartInstance.current = new Chart(ctx, {
          type: "scatter",
          data: {
            datasets: [
              {
                label: "Detak Jantung (bpm)",
                data: heartRateData,
                backgroundColor: function (context) {
                  const value = context.raw?.y;
                  if (!value) return "rgb(3, 24, 94)";

                  if (value < 50 || value > 100) {
                    return "rgb(220, 53, 69)"; // Red for anomalies
                  }
                  return "rgb(3, 24, 94)"; // Default blue
                },
                pointRadius: isMobile ? 5 : 10,
                pointHoverRadius: isMobile ? 7 : 12,
                borderColor: function (context) {
                  const value = context.raw?.y;
                  if (!value) return "rgb(3, 24, 94)";

                  if (value < 50 || value > 100) {
                    return "rgb(220, 53, 69)"; // Red for anomalies
                  }
                  return "rgb(3, 24, 94)"; // Default blue
                },
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: false,
                grid: { display: true },
                position: "top",
                min: 0,
                ticks: {
                  font: {
                    size: isMobile ? 10 : 14,
                  },
                },
              },
              x: {
                grid: { display: false },
                type: "category",
                labels: heartRateData.map((data) => {
                  // For mobile, show shorter date format
                  if (isMobile) {
                    const parts = data.x.split("-");
                    return parts[2] + "/" + parts[1];
                  }
                  return data.x;
                }),
                position: "bottom",
                ticks: {
                  font: {
                    size: isMobile ? 10 : 14,
                  },
                },
              },
            },
            plugins: {
              legend: {
                labels: {
                  font: {
                    size: isMobile ? 14 : 24,
                    family: "sans-serif",
                  },
                },
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const value = context.raw.y;
                    let label = `Detak Jantung: ${value} bpm`;

                    if (value < 50) {
                      label += " (Rendah)";
                    } else if (value > 100) {
                      label += " (Tinggi)";
                    } else {
                      label += " (Normal)";
                    }

                    return label;
                  },
                },
              },
            },
          },
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [heartRateData]);

  return (
    <div className="shadow rounded p-2 p-md-4" style={{ height: "300px" }}>
      <canvas ref={chartRef} style={{ width: "100%", height: "100%" }}></canvas>
      {heartRateData.some((item) => item.y > 0) && (
        <div className="small text-muted mt-1 text-center">
          <span className="d-inline-block me-3">
            <span className="badge bg-primary me-1">●</span> Normal (50-100 bpm)
          </span>
          <span className="d-inline-block">
            <span className="badge bg-danger me-1">●</span> Anomali (&lt;50 atau
            &gt;100 bpm)
          </span>
        </div>
      )}
    </div>
  );
}

export default HeartRateChart;
