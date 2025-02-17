import React, { useState, useEffect } from "react";
import {
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaWeight,
  FaNotesMedical,
} from "react-icons/fa";
import { FaHeartPulse } from "react-icons/fa6";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/InformationProfile.css";

const InformationProfile = () => {
  const [namaUser, setNamaUser] = useState("Loading...");
  const userEmail = localStorage.getItem("userEmail");
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") || "/Img/Profile.jpg"
  );

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      localStorage.setItem("profileImage", imageUrl); // Simpan ke localStorage
    }
  };

  const fetchData = (endpoint, setterFunction) => {
    if (!userEmail) return;
    fetch(`http://localhost:8081/${endpoint}?email=${userEmail}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setterFunction(data[0][endpoint]);
        } else {
          setterFunction("Data tidak tersedia");
        }
      })
      .catch((error) => {
        console.error(`Error fetching ${endpoint}:`, error);
        setterFunction("Error");
      });
  };

  useEffect(() => {
    fetchData("nama_user", setNamaUser);
  }, [userEmail]);

  return (
    <div className="container-fluid profile-container text-white py-4 position-relative">
      <div className="row justify-content-center align-items-center">
        {/* Kolom Kiri - Profil */}
        <div className="col-12 col-md-5 text-center profile-box">
          {/* Foto Profil bisa diganti */}
          <label htmlFor="imageUpload" style={{ cursor: "pointer" }}>
            <img
              src={profileImage}
              alt="Profile"
              className="rounded-circle border border-light img-fluid shadow-lg"
              style={{ width: "120px", height: "120px", objectFit: "cover" }}
            />
          </label>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />

          {/* Nama User */}
          <h3 className="fw-bold text-light mt-3">
            <FaNotesMedical className="me-2 text-warning" />
            <span>{namaUser}</span>
            <FaNotesMedical className="ms-2 text-warning" />
          </h3>
          <p className="text-light opacity-75">Data Kesehatan</p>

          {/* Ikon Media Sosial */}
          <div className="mt-3 d-flex justify-content-center gap-3">
            <a href="#" className="social-icon bg-danger">
              <FaInstagram size={24} />
            </a>
            <a href="#" className="social-icon bg-primary">
              <FaTwitter size={24} />
            </a>
            <a href="#" className="social-icon bg-info">
              <FaLinkedin size={24} />
            </a>
          </div>
        </div>

        {/* Kolom Kanan - Data Kesehatan */}
        <div className="col-12 col-md-7 text-start mt-4 mt-md-0">
          <h5 className="fw-bold text-light fs-2">Ringkasan Kesehatan</h5>
          <div className="health-info">
            <p className="fs-3">
              <FaWeight className="me-2 text-info" />
              <strong> BMI:</strong> 22.5 (Normal)
            </p>
            <p className="fs-3">
              <FaHeartPulse className="me-2 text-danger" />
              <strong> Detak Jantung:</strong> 75 bpm
            </p>
          </div>

          <h5 className="fw-bold text-light mt-3 fs-3 border-bottom">
            Saran Kesehatan
          </h5>
          <p className="text-white-50">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem
            velit molestias eligendi reiciendis non beatae officiis incidunt
            officia!
          </p>
        </div>
      </div>

      {/* Tombol Logout */}
      <button
        className="btn btn-danger position-absolute bottom-0 end-0 me-4 ms-4 mb-3 mt-10"
        onClick={() => {
          alert("Anda telah logout!");
          window.location.href = "/";
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default InformationProfile;
