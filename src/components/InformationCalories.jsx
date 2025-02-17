import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

const InformationCalories = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // State untuk input dan output BMI
  const [berat, setBerat] = useState("");
  const [tinggi, setTinggi] = useState("");
  const [umur, setUmur] = useState("");
  const [bmi, setBMI] = useState(null);
  const [kategori, setKategori] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");

  // Fungsi menghitung BMI
  function hitungBMI() {
    if (!berat || !tinggi) {
      alert("Masukkan berat dan tinggi badan terlebih dahulu!");
      return;
    }

    let tinggiMeter = tinggi / 100;
    let hasilBMI = berat / (tinggiMeter * tinggiMeter);
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
  }

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      let dataSet = [];
      if (jenisKelamin === "Laki-laki") {
        if (umur < 30 && berat < 60 && tinggi < 170) {
          dataSet = [450, 40, 70, 30, 80];
        } else if (umur >= 30 && umur < 50 && berat >= 60 && tinggi >= 166) {
          dataSet = [420, 38, 68, 28, 75];
        }
      } else {
        if (umur < 30 && berat < 60 && tinggi < 170) {
          dataSet = [400, 35, 60, 25, 70];
        } else if (umur >= 30 && umur < 50 && berat >= 60 && tinggi >= 166) {
          dataSet = [380, 34, 58, 24, 65];
        }
      }

      if (dataSet.length > 0) {
        chartInstance.current = new Chart(ctx, {
          type: "pie",
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
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 3,
            layout: {
              padding: { left: 20, right: 20, top: 30, bottom: 10 },
            },
            plugins: {
              legend: {
                position: "bottom",
                labels: { font: { size: 25, family: "sans-serif" } },
              },
              title: {
                display: true,
                text: "Distribusi Kalori",
                font: { size: 30 },
              },
            },
          },
        });
      }
    }
  }, [berat, tinggi, umur, jenisKelamin]);

  return (
    <div className="row gap-5 px-7 py-4">
      <div
        className="col d-flex justify-content-center align-items-center"
        style={{ width: "500px", height: "500px" }}
      >
        <canvas
          ref={chartRef}
          className="shadow py-4 px-4"
          style={{ width: "100%", height: "100%" }}
        ></canvas>
      </div>
      <div className="col d-grid gap-2" style={{ height: "100px" }}>
        <div className="row">
          <div className="col fs-1 shadow rounded-4 px-4 py-4 ms-3 me-3 mb-3">
            <h5 className="fs-2">Data Input BMI User</h5>
            <h6 className="fs-4">*khusus user umur 20 tahun ke atas</h6>
            <div className="container">
              <div className="row">
                <div className="col fs-3">
                  <ul className="fs-2 list-unstyled">
                    <li className="mb-4">Berat Badan</li>
                    <li className="mb-3">Tinggi Badan</li>
                    <li className="mb-3">Umur</li>
                    <li className="mb-3 mt-5">Jenis Kelamin</li>
                  </ul>
                </div>
                <div className="col">
                  <ul className="fs-2 list-unstyled">
                    <input
                      type="number"
                      name="beratBadan"
                      id="beratBadan"
                      max={500}
                      min={10}
                      className="mb-3"
                      value={berat}
                      onChange={(e) => setBerat(e.target.value)}
                    />
                    <span> Kg</span>
                    <input
                      type="number"
                      name="tinggiBadan"
                      id="tinggiBadan"
                      max={500}
                      min={10}
                      className="mb-3"
                      value={tinggi}
                      onChange={(e) => setTinggi(e.target.value)}
                    />
                    <span> cm</span>
                    <input
                      type="number"
                      name="umur"
                      id="umur"
                      max={120}
                      min={1}
                      className="mb-3"
                      value={umur}
                      onChange={(e) => setUmur(e.target.value)}
                    />
                    <span> Tahun</span>
                  </ul>
                  <div className="fs-3 col mt-0">
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
                      <label className="form-check-label" htmlFor="laki-laki">
                        Laki - Laki
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
                      <label className="form-check-label" htmlFor="perempuan">
                        Perempuan
                      </label>
                    </div>
                  </div>
                </div>
                <button
                  className="btn btn-primary fs-2 mb-3 buttonBMI"
                  onClick={hitungBMI}
                >
                  Hitung
                </button>
                <div>
                  <span>
                    Nilai BMI Anda : <span className="nilaiBMI">{bmi}</span>
                  </span>
                  {bmi && (
                    <p className="fs-3">
                      Kategori: <strong>{kategori}</strong>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="custom-card">
              <h5 className="card-title fs-2">Kalori yang Terbakar</h5>
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
                <div className="percentage">1,025</div>
              </div>
              <p className="description">
                Anda telah membakar <span>1,205</span> kalori, setara dengan
                sekitar 1,5 jam berlari atau 2,5 jam bersepeda santai. Ini
                adalah pencapaian luar biasa yang menunjukkan aktivitas fisik
                yang intens dan membakar energi dalam jumlah signifikan! Tetap
                terhidrasi dan pastikan tubuh mendapatkan asupan nutrisi yang
                cukup untuk pemulihan. 💪🔥
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformationCalories;
