import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoon,
  faPersonWalking,
  faFire,
  faHeartPulse,
} from "@fortawesome/free-solid-svg-icons";

// heartRate.js

function DashboardCards() {
  const [detakJantung, setDetakJantung] = useState(null);
  const [durasiTidur, setDurasiTidur] = useState(null);
  const [langkah, setLangkah] = useState(null);
  const [kaloriTerbakar, setKaloriTerbakar] = useState(null);
  const [useFirebase, setUseFirebase] = useState(true);
  const userEmail = localStorage.getItem("userEmail");

  const fetchData = (endpoint, setterFunction) => {
    if (!userEmail) return;

    fetch(`http://localhost:8081/${endpoint}?email=${userEmail}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setterFunction(data[0][endpoint]);
        } else {
          setterFunction("Tidak ada data");
        }
      })
      .catch((error) => {
        console.error(`Error fetching data ${endpoint}:`, error);
        setterFunction("Error");
      });
  };

  useEffect(() => {
    fetchData("detak_jantung", setDetakJantung);
    fetchData("durasi_tidur", setDurasiTidur);
    fetchData("langkah", setLangkah);
    fetchData("kalori_terbakar", setKaloriTerbakar);
  }, [userEmail, useFirebase]);

  return (
    <div className="row g-4 row-cols-1 row-cols-md-2 row-cols-lg-4">
      <div className="col">
        <div className="dashboard-card card h-100">
          <div className="card-body">
            <div className="card-icon-wrapper sleep-icon-wrapper">
              <FontAwesomeIcon icon={faMoon} className="card-icon" />
            </div>
            <div className="metric-value">
              {durasiTidur !== null ? `${durasiTidur}` : "Loading..."}
            </div>
            <div className="metric-label fs-4">Durasi Tidur</div>
            <p className="card-text">
              Kualitas tidur Anda lebih baik dari minggu lalu
            </p>
            <a href="/Sleep" className="btn btn-primary">
              Lihat Detail
            </a>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="dashboard-card card h-100">
          <div className="card-body">
            <div className="card-icon-wrapper steps-icon-wrapper">
              <FontAwesomeIcon icon={faPersonWalking} className="card-icon" />
            </div>
            <div className="metric-value">
              {langkah !== null ? `${langkah} Langkah` : "Loading..."}
            </div>
            <div className="metric-label fs-4">Langkah Hari Ini</div>
            <p className="card-text">82% dari target harian Anda tercapai</p>
            <a href="/Step" className="btn btn-primary">
              Lihat Detail
            </a>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="dashboard-card card h-100">
          <div className="card-body">
            <div className="card-icon-wrapper calories-icon-wrapper">
              <FontAwesomeIcon icon={faFire} className="card-icon" />
            </div>
            <div className="metric-value">
              {kaloriTerbakar !== null
                ? `${kaloriTerbakar} kkal`
                : "Loading..."}
            </div>
            <div className="metric-label fs-4">Kalori Terbakar</div>
            <p className="card-text">324 kalori lebih tinggi dari kemarin</p>
            <a href="/Calories" className="btn btn-primary">
              Lihat Detail
            </a>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="dashboard-card card h-100">
          <div className="card-body">
            <div className="card-icon-wrapper heart-icon-wrapper">
              <FontAwesomeIcon icon={faHeartPulse} className="card-icon" />
            </div>
            <div className="metric-value">
              {detakJantung !== null ? `${detakJantung} BPM` : "Loading..."}
            </div>
            <div className="metric-label fs-4">Detak Jantung</div>
            <p className="card-text">Detak jantung Anda dalam rentang normal</p>
            <a href="/Jantung" className="btn btn-primary">
              Lihat Detail
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCards;
