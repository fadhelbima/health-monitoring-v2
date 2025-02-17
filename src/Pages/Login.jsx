import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaRunning } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden"; // Mencegah scrolling
    return () => {
      document.body.style.overflow = "auto"; // Mengembalikan scrolling setelah keluar dari halaman
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email dan password diperlukan");
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data);
        localStorage.setItem("userEmail", email); // Simpan email ke localStorage
        localStorage.setItem("userName", data.nama_user || "User"); // Simpan nama user dari server
        alert("Login berhasil!");
        navigate("/home");
      } else {
        setError(data.error || "Terjadi kesalahan, coba lagi!");
      }
    } catch (error) {
      setError("Gagal terhubung ke server");
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
      {" "}
      <div className="overlay"></div>
      <div
        className="card p-5 shadow-lg bg-white"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        <h2 className="text-center fw-bold mb-3">Welcome Back!</h2>
        <p className="text-center text-muted mb-4">Login untuk melanjutkan</p>
        {error && <p className="text-danger text-center">{error}</p>}
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
