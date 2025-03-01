import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase-config";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSortUp, FaSortDown, FaSort } from "react-icons/fa"; // Tambahkan import untuk icon sort

const Databaseadmin = () => {
  const [users, setUsers] = useState([]);
  const [originalUsers, setOriginalUsers] = useState([]); // Menyimpan data asli
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });
  const navigate = useNavigate();

  const getCurrentDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const usersRef = ref(db, "users");
      onValue(usersRef, (snapshot) => {
        if (snapshot.exists()) {
          const usersData = Object.entries(snapshot.val()).map(([id, data]) => {
            const currentDate = getCurrentDate();

            // Ambil data detak jantung terbaru
            const heartRateData = data.health_data?.heart_rate?.[currentDate];
            let latestHeartRate = "-";

            if (heartRateData) {
              const times = Object.keys(heartRateData).sort().reverse(); // Urutkan waktu terbaru ke depan
              if (times.length > 0) {
                latestHeartRate = heartRateData[times[0]].avg || "-"; // Ambil nilai terbaru
              }
            }

            return {
              id,
              name: data.fullName || "Tidak Ada Nama",
              health_data: {
                durasi_tidur:
                  data.health_data?.sleep?.[currentDate]?.sleep_session_0
                    ?.duration?.seconds / 3600 || "-",
                langkah:
                  data.health_data?.steps?.[currentDate]?.steps_data?.value ||
                  "-",
                detak_jantung: latestHeartRate,
                kalori:
                  data.health_data?.calories?.[currentDate]?.calories_data
                    ?.value !== undefined
                    ? parseFloat(
                        data.health_data?.calories?.[currentDate]?.calories_data
                          ?.value
                      ).toFixed(2)
                    : "-",
              },
            };
          });
          setUsers(usersData);
          setOriginalUsers(usersData); // Simpan data asli
        }
      });
    };

    fetchUsers();
  }, []);

  // Fungsi untuk melakukan pengurutan
  const sortData = (key) => {
    let direction = "ascending";

    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    } else if (
      sortConfig.key === key &&
      sortConfig.direction === "descending"
    ) {
      // Reset sorting
      setSortConfig({ key: null, direction: null });
      setUsers([...originalUsers]);
      return;
    }

    let sortedUsers = [...users];

    sortedUsers.sort((a, b) => {
      // Untuk nama
      if (key === "name") {
        if (a.name < b.name) return direction === "ascending" ? -1 : 1;
        if (a.name > b.name) return direction === "ascending" ? 1 : -1;
        return 0;
      }

      // Untuk data kesehatan
      const valueA = a.health_data[key];
      const valueB = b.health_data[key];

      // Jika nilainya "-", taruh di bagian bawah
      if (valueA === "-" && valueB === "-") return 0;
      if (valueA === "-") return 1;
      if (valueB === "-") return -1;

      // Konversi string ke angka untuk perbandingan
      const numA = parseFloat(valueA);
      const numB = parseFloat(valueB);

      if (numA < numB) return direction === "ascending" ? -1 : 1;
      if (numA > numB) return direction === "ascending" ? 1 : -1;
      return 0;
    });

    setUsers(sortedUsers);
    setSortConfig({ key, direction });
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Helper function untuk menampilkan icon sort
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FaSort className="ms-2" />;
    }

    return sortConfig.direction === "ascending" ? (
      <FaSortUp className="ms-2 text-primary" />
    ) : (
      <FaSortDown className="ms-2 text-primary" />
    );
  };

  // Helper function untuk menentukan kelas badge berdasarkan nilai
  const getBadgeClass = (value, type) => {
    if (value === "-") return "bg-secondary";

    switch (type) {
      case "sleep":
        return parseFloat(value) >= 7
          ? "bg-success"
          : parseFloat(value) >= 6
          ? "bg-warning"
          : "bg-danger";
      case "steps":
        return parseInt(value) >= 10000
          ? "bg-success"
          : parseInt(value) >= 5000
          ? "bg-warning"
          : "bg-danger";
      case "heartRate":
        return parseInt(value) >= 60 && parseInt(value) <= 100
          ? "bg-success"
          : "bg-warning";
      case "calories":
        return parseInt(value) >= 300
          ? "bg-success"
          : parseInt(value) >= 200
          ? "bg-warning"
          : "bg-danger";
      default:
        return "bg-primary";
    }
  };

  return (
    <div
      className="container-fluid p-4"
      style={{ background: "linear-gradient(to right, #f8f9fa, #e9ecef)" }}
    >
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-lg border-0">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h2 className="card-title fw-bold" style={{ color: "#3d5af1" }}>
                  <i className="bi bi-speedometer2 me-2"></i> Health Dashboard
                </h2>
                <p className="text-muted mb-0">
                  Monitoring kesehatan pengguna secara real-time
                </p>
              </div>
              <button
                className="btn btn-danger d-flex align-items-center"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-2"></i> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card shadow-lg border-0 mb-4">
            <div className="card-header bg-white border-0 py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0" style={{ color: "#3d5af1" }}>
                  <i className="bi bi-table me-2"></i> Data Kesehatan Pengguna
                </h5>
                <div className="d-flex align-items-center">
                  <span className="badge bg-info rounded-pill me-3">
                    <i className="bi bi-info-circle me-1"></i> Klik pada header
                    tabel untuk mengurutkan data
                  </span>
                  <span className="badge bg-primary rounded-pill">
                    {users.length} Pengguna
                  </span>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead style={{ background: "rgba(61, 90, 241, 0.1)" }}>
                    <tr>
                      <th
                        className="px-4 py-3 user-select-none"
                        scope="col"
                        onClick={() => sortData("name")}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="d-flex align-items-center">
                          <i className="bi bi-person me-2"></i> Nama
                          {getSortIcon("name")}
                        </div>
                      </th>
                      <th
                        className="px-4 py-3 user-select-none"
                        scope="col"
                        onClick={() => sortData("durasi_tidur")}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="d-flex align-items-center">
                          <i className="bi bi-moon me-2"></i> Durasi Tidur
                          {getSortIcon("durasi_tidur")}
                        </div>
                      </th>
                      <th
                        className="px-4 py-3 user-select-none"
                        scope="col"
                        onClick={() => sortData("langkah")}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="d-flex align-items-center">
                          <i className="bi bi-shop me-2"></i> Langkah
                          {getSortIcon("langkah")}
                        </div>
                      </th>
                      <th
                        className="px-4 py-3 user-select-none"
                        scope="col"
                        onClick={() => sortData("detak_jantung")}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="d-flex align-items-center">
                          <i className="bi bi-heart-pulse me-2"></i> Detak
                          Jantung
                          {getSortIcon("detak_jantung")}
                        </div>
                      </th>
                      <th
                        className="px-4 py-3 user-select-none"
                        scope="col"
                        onClick={() => sortData("kalori")}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="d-flex align-items-center">
                          <i className="bi bi-fire me-2"></i> Kalori Terbakar
                          {getSortIcon("kalori")}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-bottom">
                        <td className="px-4 py-3 fw-bold">{user.name}</td>
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center">
                            <div
                              className="d-inline-block me-2 rounded-circle"
                              style={{
                                width: "10px",
                                height: "10px",
                                backgroundColor:
                                  user.health_data.durasi_tidur !== "-"
                                    ? parseFloat(
                                        user.health_data.durasi_tidur
                                      ) >= 7
                                      ? "#198754"
                                      : parseFloat(
                                          user.health_data.durasi_tidur
                                        ) >= 6
                                      ? "#ffc107"
                                      : "#dc3545"
                                    : "#6c757d",
                              }}
                            ></div>
                            <span>
                              {user.health_data.durasi_tidur !== "-"
                                ? `${parseFloat(
                                    user.health_data.durasi_tidur
                                  ).toFixed(1)} jam`
                                : "-"}
                            </span>
                            <span
                              className={`badge ms-2 ${getBadgeClass(
                                user.health_data.durasi_tidur,
                                "sleep"
                              )}`}
                            >
                              {user.health_data.durasi_tidur !== "-" &&
                              parseFloat(user.health_data.durasi_tidur) >= 7
                                ? "Bagus"
                                : user.health_data.durasi_tidur !== "-" &&
                                  parseFloat(user.health_data.durasi_tidur) >= 6
                                ? "Cukup"
                                : user.health_data.durasi_tidur !== "-"
                                ? "Kurang"
                                : "Tidak Ada"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center">
                            <div
                              className="d-inline-block me-2 rounded-circle"
                              style={{
                                width: "10px",
                                height: "10px",
                                backgroundColor:
                                  user.health_data.langkah !== "-"
                                    ? parseInt(user.health_data.langkah) >=
                                      10000
                                      ? "#198754"
                                      : parseInt(user.health_data.langkah) >=
                                        5000
                                      ? "#ffc107"
                                      : "#dc3545"
                                    : "#6c757d",
                              }}
                            ></div>
                            <span>
                              {user.health_data.langkah !== "-"
                                ? `${user.health_data.langkah} langkah`
                                : "-"}
                            </span>
                            <span
                              className={`badge ms-2 ${getBadgeClass(
                                user.health_data.langkah,
                                "steps"
                              )}`}
                            >
                              {user.health_data.langkah !== "-" &&
                              parseInt(user.health_data.langkah) >= 10000
                                ? "Aktif"
                                : user.health_data.langkah !== "-" &&
                                  parseInt(user.health_data.langkah) >= 5000
                                ? "Moderat"
                                : user.health_data.langkah !== "-"
                                ? "Pasif"
                                : "Tidak Ada"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center">
                            <div
                              className="d-inline-block me-2 rounded-circle"
                              style={{
                                width: "10px",
                                height: "10px",
                                backgroundColor:
                                  user.health_data.detak_jantung !== "-"
                                    ? parseInt(
                                        user.health_data.detak_jantung
                                      ) >= 60 &&
                                      parseInt(
                                        user.health_data.detak_jantung
                                      ) <= 100
                                      ? "#198754"
                                      : "#ffc107"
                                    : "#6c757d",
                              }}
                            ></div>
                            <span>
                              {user.health_data.detak_jantung !== "-"
                                ? `${user.health_data.detak_jantung} BPM`
                                : "-"}
                            </span>
                            <span
                              className={`badge ms-2 ${getBadgeClass(
                                user.health_data.detak_jantung,
                                "heartRate"
                              )}`}
                            >
                              {user.health_data.detak_jantung !== "-" &&
                              parseInt(user.health_data.detak_jantung) >= 60 &&
                              parseInt(user.health_data.detak_jantung) <= 100
                                ? "Normal"
                                : user.health_data.detak_jantung !== "-"
                                ? "Perhatian"
                                : "Tidak Ada"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center">
                            <div
                              className="d-inline-block me-2 rounded-circle"
                              style={{
                                width: "10px",
                                height: "10px",
                                backgroundColor:
                                  user.health_data.kalori !== "-"
                                    ? parseInt(user.health_data.kalori) >= 300
                                      ? "#198754"
                                      : parseInt(user.health_data.kalori) >= 200
                                      ? "#ffc107"
                                      : "#dc3545"
                                    : "#6c757d",
                              }}
                            ></div>
                            <span>
                              {user.health_data.kalori !== "-"
                                ? `${user.health_data.kalori} kal`
                                : "-"}
                            </span>
                            <span
                              className={`badge ms-2 ${getBadgeClass(
                                user.health_data.kalori,
                                "calories"
                              )}`}
                            >
                              {user.health_data.kalori !== "-" &&
                              parseInt(user.health_data.kalori) >= 300
                                ? "Tinggi"
                                : user.health_data.kalori !== "-" &&
                                  parseInt(user.health_data.kalori) >= 200
                                ? "Sedang"
                                : user.health_data.kalori !== "-"
                                ? "Rendah"
                                : "Tidak Ada"}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-muted mt-4">
        <p>© 2025 PT. Naraya Telematika | Desain oleh @FadhelBimaNabaalah</p>
      </div>
    </div>
  );
};

export default Databaseadmin;
