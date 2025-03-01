import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Sleep from "./Pages/Sleep";
import Step from "./Pages/Step";
import Calories from "./Pages/Calories";
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import Jantung from "./Pages/Jantung";
import Login from "./Pages/Login";
import PDF from "./Pages/PDF";
import FirebaseLogin from "./Pages/Firebase-Login";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Databaseadmin from "./Pages/Database";

const ModeSelection = () => {
  const [adminCode, setAdminCode] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    if (adminCode === "admin1234") {
      toast.success("✅ Kode admin benar, masuk sebagai Admin");
      setTimeout(() => navigate("/Database"), 1000);
    } else {
      toast.error("❌ Kode admin salah!");
    }
  };

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center flex-column">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <h2>Pilih Mode</h2>
      <div className="d-flex gap-3 mt-3">
        <button
          className="btn btn-primary"
          onClick={() => navigate("/FirebaseLogin")}
        >
          Masuk sebagai User
        </button>
        <button className="btn btn-danger" onClick={() => setIsAdmin(true)}>
          Masuk sebagai Admin
        </button>
      </div>
      {isAdmin && (
        <div className="mt-3">
          <input
            type="password"
            className="form-control mb-2"
            placeholder="Masukkan kode admin"
            value={adminCode}
            onChange={(e) => setAdminCode(e.target.value)}
          />
          <button className="btn btn-success" onClick={handleAdminLogin}>
            Konfirmasi
          </button>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ModeSelection />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Sleep" element={<Sleep />} />
        <Route path="/Step" element={<Step />} />
        <Route path="/Calories" element={<Calories />} />
        <Route path="/Jantung" element={<Jantung />} />
        <Route path="/Download" element={<PDF />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/FirebaseLogin" element={<FirebaseLogin />} />
        <Route path="/Database" element={<Databaseadmin />} />
      </Routes>
    </Router>
  );
}

export default App;
