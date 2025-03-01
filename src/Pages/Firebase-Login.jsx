import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { auth, db } from "../firebase-config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { ref, set, get } from "firebase/database";

const FirebaseLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password || !name) {
      toast.error("⚠️ Semua data harus diisi!", { theme: "colored" });
      return;
    }
    try {
      const today = getTodayDate();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      await set(ref(db, `users/${uid}`), {
        uid,
        name,
        email,
        created_at: Date.now(),
        health_data: {
          nutrition: {
            [today]: { nutrition_data: { meal_Data: 0, totalCalories: 0 } },
          },
          sleep: {
            [today]: { sleep_session_0: { duration: { seconds: 0 } } },
          },
          steps: {
            [today]: { steps_data: { value: 0 } },
          },
        },
      });

      toast.success("✅ Registrasi berhasil! Silakan login 🎉", {
        theme: "colored",
      });
      setIsRegister(false);
    } catch (error) {
      toast.error("❌ Gagal registrasi. Email mungkin sudah digunakan!", {
        theme: "colored",
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("⚠️ Email dan Password diperlukan!", { theme: "colored" });
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("✅ Login berhasil! Selamat datang 🎉", {
        theme: "colored",
      });
      setTimeout(() => navigate("/home"), 2000);
    } catch (error) {
      toast.error("❌ Gagal login. Periksa email dan password!", {
        theme: "colored",
      });
    }
  };

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);

      const today = getTodayDate(); // ✅ Perbaikan bug

      if (!snapshot.exists()) {
        // Jika pengguna baru, simpan datanya di database
        await set(userRef, {
          uid: user.uid,
          fullName: user.displayName || "Pengguna Google",
          email: user.email,
          created_at: Date.now(),
          health_data: {
            nutrition: {
              [today]: { nutrition_data: { meal_Data: 0, totalCalories: 0 } },
            },
            sleep: {
              [today]: { sleep_session_0: { duration: { seconds: 0 } } },
            },
            steps: {
              [today]: { steps_data: { value: 0 } },
            },
          },
        });
        toast.success("✅ Pendaftaran berhasil dengan Google! 🎉", {
          theme: "colored",
        });
      } else {
        toast.success("✅ Login berhasil dengan Google! 🎉", {
          theme: "colored",
        });
      }

      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userName", user.displayName || "User");

      setTimeout(() => navigate("/home"), 2000);
    } catch (error) {
      toast.error("❌ Gagal menggunakan akun Google!", { theme: "colored" });
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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        theme="colored"
      />
      <div className="overlay"></div>
      <div
        className="card p-5 shadow-lg bg-white"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        <h2 className="text-center fw-bold mb-3">
          {isRegister ? "Buat Akun Baru" : "Welcome Back!"}
        </h2>
        <p className="text-center text-muted mb-4">
          {isRegister
            ? "Silakan isi data untuk registrasi"
            : "Login untuk melanjutkan"}
        </p>
        <form onSubmit={isRegister ? handleRegister : handleLogin}>
          {isRegister && (
            <div className="mb-3">
              <label className="form-label">Nama</label>
              <input
                type="text"
                className="form-control"
                placeholder="Masukkan nama lengkap"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
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
            {isRegister ? "Daftar" : "Masuk"}
          </button>
        </form>
        <button
          className="btn btn-danger w-100 mt-2"
          onClick={handleGoogleAuth}
        >
          🔴 {isRegister ? "Daftar" : "Login"} dengan Google
        </button>
        <p className="text-center mt-3">
          {isRegister ? "Sudah punya akun? " : "Belum punya akun? "}
          <span
            className="text-primary"
            style={{ cursor: "pointer" }}
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Login" : "Daftar"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default FirebaseLogin;
