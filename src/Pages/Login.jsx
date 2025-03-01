import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaRunning } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("⚠️ Email dan password diperlukan!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login berhasil:", data);

        localStorage.setItem("userEmail", email);
        localStorage.setItem("userName", data.nama_user || "User");

        toast.success("✅ Login berhasil! Selamat datang 🎉", {
          className: "bg-success text-white fs-5 p-3 shadow-lg",
          style: {
            width: "450px",
            height: "80px",
            fontFamily: "cursive",
          },
        });

        setTimeout(() => {
          navigate("/Database");
        }, 2000);
      } else {
        toast.error("Email dan password Salah! 😥", {
          className: "bg-danger text-white fs-5 p-3 shadow-lg",
          style: {
            width: "450px",
            height: "80px",
            fontFamily: "cursive",
          },
        });
      }
    } catch (error) {
      toast.error("🚨 Gagal terhubung ke server!", {
        className: "bg-warning text-white fs-5 p-3 shadow-lg",
        style: {
          width: "450px",
          height: "80px",
          fontFamily: "cursive",
        },
      });
    }
  };

  return (
    <div
      className="d-flex vh-100 justify-content-center align-items-center px-3"
      style={{
        backgroundImage: "url('/Img/WalpaperHealth.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="overlay"></div>
      <div
        className="card p-5 shadow-lg bg-white"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        <h2 className="text-center fw-bold mb-3">Welcome Back!</h2>
        {/* <label htmlFor="" className="mb-2">
          Opsi Database
        </label> */}
        {/* <select name="" id="" className="form-select mb-3">
          <option value="">Admin (mysql/phpmyadmin)</option>
          <option value="">User (Firebase)</option>
        </select> */}
        <p className="text-center text-muted mb-4">Login untuk melanjutkan</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Masuk
          </button>
        </form>
        <div className="text-center my-3">atau</div>
        <div className="d-flex flex-column flex-sm-row gap-2">
          <button className="btn btn-danger w-100">
            <FaRunning className="me-2" /> Samsung Health
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
