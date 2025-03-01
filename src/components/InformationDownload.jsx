import React, { useState, useEffect } from "react";
import { pdf } from "@react-pdf/renderer";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/App.css";
import ModernHealthReportPDF from "./OpsiDownloadPDF";
import { downloadCSV } from "./opsiDownloadCSV";
import { ref, onValue } from "firebase/database";
import { db, auth } from "../firebase-config";
import { Calendar, Download, FileText, FileSpreadsheet } from "lucide-react";

function InformationDownload() {
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [fileType, setFileType] = useState("PDF");
  const [isLoading, setIsLoading] = useState(false);

  // Health data states
  const [heartRate, setHeartRate] = useState("No Data");
  const [sleepDuration, setSleepDuration] = useState("No Data");
  const [step, setStep] = useState("No Data");
  const [calories, setCalories] = useState(null);
  const [dataAvailable, setDataAvailable] = useState(false);

  // Theme colors
  const colors = {
    primary: "#2a1090",
    primaryDark: "#150267",
    primaryLight: "#5e4dca",
    accent: "#f8f9fa",
    success: "#28a745",
  };

  // Effect to fetch data when date selections change
  useEffect(() => {
    // Return early if any date component is not selected
    if (!selectedDate || !selectedMonth || !selectedYear) return;

    const userId = auth.currentUser?.uid;
    if (!userId) return;

    setIsLoading(true);

    // Format date for Firebase path (e.g., "2025-02-27")
    const monthNumber = getMonthNumber(selectedMonth);
    const formattedDate = `${selectedYear}-${monthNumber
      .toString()
      .padStart(2, "0")}-${selectedDate.toString().padStart(2, "0")}`;

    // Create Firebase references
    const heartRateRef = ref(
      db,
      `users/${userId}/health_data/heart_rate/${formattedDate}`
    );
    const sleepDurationRef = ref(
      db,
      `users/${userId}/health_data/sleep/${formattedDate}/sleep_session_0/duration/seconds`
    );
    const stepRef = ref(
      db,
      `users/${userId}/health_data/steps/${formattedDate}/steps_data/value`
    );
    const caloriesRef = ref(
      db,
      `users/${userId}/health_data/calories/${formattedDate}/calories_data/value`
    );

    // Set up listeners
    const unsubscribeHeartRate = onValue(heartRateRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const times = Object.keys(data).sort().reverse();
        setHeartRate(times.length > 0 ? data[times[0]].avg : "No Data");
        checkDataAvailability();
      } else {
        setHeartRate("No Data");
        checkDataAvailability();
      }
    });

    const unsubscribeSleepDuration = onValue(sleepDurationRef, (snapshot) => {
      setSleepDuration(
        snapshot.exists() ? (snapshot.val() / 3600).toFixed(1) : "No Data"
      );
      checkDataAvailability();
    });

    const unsubscribeStep = onValue(stepRef, (snapshot) => {
      setStep(snapshot.exists() ? snapshot.val() : "No Data");
      checkDataAvailability();
    });

    const unsubscribeCalories = onValue(caloriesRef, (snapshot) => {
      if (snapshot.exists()) {
        const value = parseFloat(snapshot.val());
        setCalories(value.toFixed(2));
      } else {
        setCalories(null);
      }
      checkDataAvailability();
      setIsLoading(false);
    });

    // Clean up listeners when component unmounts or selection changes
    return () => {
      unsubscribeHeartRate();
      unsubscribeSleepDuration();
      unsubscribeStep();
      unsubscribeCalories();
    };
  }, [selectedDate, selectedMonth, selectedYear]);

  // Check if any data is available
  const checkDataAvailability = () => {
    const hasData =
      heartRate !== "No Data" ||
      sleepDuration !== "No Data" ||
      step !== "No Data" ||
      calories !== null;

    setDataAvailable(hasData);
  };

  // Helper function to convert month name to number
  const getMonthNumber = (monthName) => {
    const months = {
      Januari: 1,
      Februari: 2,
      Maret: 3,
      April: 4,
      Mei: 5,
      Juni: 6,
      Juli: 7,
      Agustus: 8,
      September: 9,
      Oktober: 10,
      November: 11,
      Desember: 12,
    };
    return months[monthName] || 1;
  };

  const downloadPDF = async () => {
    setIsLoading(true);
    try {
      const blob = await pdf(
        <ModernHealthReportPDF
          selectedDay={selectedDay}
          selectedMonth={selectedMonth}
          selectedDate={selectedDate}
          selectedYear={selectedYear}
          heartRate={heartRate}
          sleepDuration={sleepDuration}
          step={step}
          calories={calories}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `Laporan_Kesehatan_${selectedDay}_${selectedDate}_${selectedMonth}_${selectedYear}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Terjadi kesalahan saat membuat PDF. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (event) => {
    event.preventDefault();
    if (fileType === "PDF") {
      downloadPDF();
    } else {
      downloadCSV(
        selectedDay,
        selectedMonth,
        selectedDate,
        selectedYear,
        heartRate,
        sleepDuration,
        step,
        calories
      );
    }
  };

  // Generate year options (current year and 5 years back)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i);

  return (
    <div className="container-fluid p-0">
      <div
        className="text-white text-center py-5 mb-5 w-100 rounded-bottom-4"
        style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        }}
      >
        <h1 className="display-4 fw-bold mb-2">Pusat Unduh Dokumen</h1>
        <p className="lead">
          Dapatkan Laporan Kesehatan Anda Dalam Format Yang Diinginkan
        </p>
      </div>

      <div className="container mb-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="card-header bg-white border-0 pt-4 pb-0">
                <h3
                  className="text-center fw-bold"
                  style={{ color: colors.primary }}
                >
                  <Calendar className="me-2" size={24} />
                  Opsi Unduhan
                </h3>
                <p className="text-center text-muted small">
                  Pilih tanggal dan format file yang Anda inginkan
                </p>
              </div>

              <div className="card-body p-4">
                <form onSubmit={handleDownload}>
                  <div className="mb-4">
                    <label className="form-label fw-medium">Tipe File</label>
                    <div className="d-flex gap-3">
                      {[
                        { type: "PDF", icon: <FileText size={18} /> },
                        { type: "CSV", icon: <FileSpreadsheet size={18} /> },
                      ].map(({ type, icon }) => (
                        <button
                          key={type}
                          type="button"
                          className={`btn ${
                            fileType === type
                              ? "btn-primary"
                              : "btn-outline-primary"
                          } d-flex align-items-center justify-content-center px-4 py-2 flex-grow-1`}
                          onClick={() => setFileType(type)}
                          style={{
                            backgroundColor:
                              fileType === type ? colors.primary : "white",
                            borderColor: colors.primary,
                            transition: "all 0.3s ease",
                          }}
                        >
                          <span className="me-2">{icon}</span>
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-medium">Tahun</label>
                      <select
                        className="form-select form-select-lg shadow-sm"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        required
                        style={{ borderColor: "#dee2e6", borderRadius: "10px" }}
                      >
                        <option value="">Pilih Tahun</option>
                        {yearOptions.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-medium">Bulan</label>
                      <select
                        className="form-select form-select-lg shadow-sm"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        required
                        style={{ borderColor: "#dee2e6", borderRadius: "10px" }}
                      >
                        <option value="">Pilih Bulan</option>
                        {[
                          "Januari",
                          "Februari",
                          "Maret",
                          "April",
                          "Mei",
                          "Juni",
                          "Juli",
                          "Agustus",
                          "September",
                          "Oktober",
                          "November",
                          "Desember",
                        ].map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-medium">Tanggal</label>
                      <select
                        className="form-select form-select-lg shadow-sm"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        required
                        style={{ borderColor: "#dee2e6", borderRadius: "10px" }}
                      >
                        <option value="">Pilih Tanggal</option>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map(
                          (date) => (
                            <option key={date} value={date}>
                              {date}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-medium">Hari</label>
                      <select
                        className="form-select form-select-lg shadow-sm"
                        value={selectedDay}
                        onChange={(e) => setSelectedDay(e.target.value)}
                        required
                        style={{ borderColor: "#dee2e6", borderRadius: "10px" }}
                      >
                        <option value="">Pilih Hari</option>
                        {[
                          "Senin",
                          "Selasa",
                          "Rabu",
                          "Kamis",
                          "Jumat",
                          "Sabtu",
                          "Minggu",
                        ].map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {isLoading && (
                    <div className="d-flex justify-content-center my-4">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  )}

                  {selectedYear &&
                    selectedMonth &&
                    selectedDate &&
                    selectedDay &&
                    !isLoading && (
                      <div className="alert alert-info mt-3" role="alert">
                        <div className="d-flex">
                          <div className="me-3">
                            <i className="bi bi-info-circle-fill fs-4"></i>
                          </div>
                          <div>
                            <h6 className="alert-heading">Informasi Data</h6>
                            <p className="mb-0 small">
                              {dataAvailable
                                ? "Data kesehatan tersedia untuk tanggal yang dipilih."
                                : "Data Kesehatan yang Dipilih Tidak Lengkap."}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                  <div className="d-grid gap-2 mt-4">
                    <button
                      type="submit"
                      className="btn btn-lg py-3"
                      disabled={isLoading || !dataAvailable}
                      style={{
                        background: `linear-gradient(to right, ${colors.primary}, ${colors.primaryDark})`,
                        color: "white",
                        borderRadius: "12px",
                        fontWeight: "600",
                        boxShadow: "0 4px 15px rgba(42, 16, 144, 0.3)",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {isLoading ? (
                        <span>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Sedang Memproses...
                        </span>
                      ) : (
                        <span className="d-flex align-items-center justify-content-center">
                          <Download size={20} className="me-2" />
                          Unduh {fileType}
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="text-center mt-3 text-muted small">
              <p>
                Semua data kesehatan Anda akan diunduh dalam format {fileType}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InformationDownload;
