import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/App.css";

function InformationDownload() {
  // State for form inputs
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [opsiKesehatan, setOpsiKesehatan] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [fileType, setFileType] = useState("PDF");

  // Options for selection
  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
  const months = [
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
  ];
  const Kesehatan = [
    "Kualitas Tidur",
    "Langkah",
    "Kalori",
    "Detak Jantung",
    "Unduh Semua",
  ];
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);

  // Handle form submission
  const handleDownload = (e) => {
    e.preventDefault();
    // In a real application, this would trigger the actual download
    alert(
      `Mengunduh ${opsiKesehatan} ke file ${fileType} untuk ${selectedDay}, ${selectedDate} ${selectedMonth}`
    );
  };

  return (
    <div className="container-fluid p-0 justify-content-center align-items-center">
      {/* Header */}
      <div
        className="bg-primary text-white text-center py-4 mb-4 w-100 rounded-4"
        style={{ backgroundColor: "#2a1090 !important" }}
      >
        <h1>Pusat Unduh Dokumen</h1>
        <p className="lead">Pilih Opsi Tanggal untuk Mengunduh File</p>
      </div>

      <div className="container mb-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow">
              <div className="card-body p-4">
                <h3 className="mb-4 text-center" style={{ color: "#2a1090" }}>
                  Opsi Unduhan
                </h3>

                <form onSubmit={handleDownload}>
                  {/* File Type Selection */}
                  <div className="mb-4">
                    <label className="form-label">Tipe File</label>
                    <div className="d-flex gap-3">
                      <button
                        type="button"
                        className={`btn ${
                          fileType === "PDF"
                            ? "btn-primary"
                            : "btn-outline-primary"
                        }`}
                        onClick={() => setFileType("PDF")}
                        style={{
                          backgroundColor: fileType === "PDF" ? "#2a1090" : "",
                          borderColor: "#2a1090",
                        }}
                      >
                        PDF
                      </button>
                      <button
                        type="button"
                        className={`btn ${
                          fileType === "CSV"
                            ? "btn-primary"
                            : "btn-outline-primary"
                        }`}
                        onClick={() => setFileType("CSV")}
                        style={{
                          backgroundColor: fileType === "CSV" ? "#2a1090" : "",
                          borderColor: "#2a1090",
                        }}
                      >
                        CSV
                      </button>
                    </div>
                  </div>

                  {/* Day Selection */}
                  <div className="mb-3">
                    <label className="form-label">Hari</label>
                    <select
                      className="form-select"
                      value={selectedDay}
                      onChange={(e) => setSelectedDay(e.target.value)}
                      required
                      style={{ borderColor: "#2a1090" }}
                    >
                      <option value="">Pilih Hari</option>
                      {days.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Month Selection */}
                  <div className="mb-3">
                    <label className="form-label">Bulan</label>
                    <select
                      className="form-select"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      required
                      style={{ borderColor: "#2a1090" }}
                    >
                      <option value="">Pilih Bulan</option>
                      {months.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Opsi Dokumen Kesehatan</label>
                    <select
                      className="form-select"
                      value={opsiKesehatan}
                      onChange={(e) => setOpsiKesehatan(e.target.value)}
                      required
                      style={{ borderColor: "#2a1090" }}
                    >
                      <option value="">Pilih Data Kesehatan</option>
                      {Kesehatan.map((Kesehatan) => (
                        <option key={Kesehatan} value={Kesehatan}>
                          {Kesehatan}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date Selection */}
                  <div className="mb-4">
                    <label className="form-label">Tanggal</label>
                    <select
                      className="form-select"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      required
                      style={{ borderColor: "#2a1090" }}
                    >
                      <option value="">Pilih Tanggal</option>
                      {dates.map((date) => (
                        <option key={date} value={date}>
                          {date}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Submit Button */}
                  <div className="d-grid gap-2 mt-4">
                    <button
                      type="submit"
                      className="btn btn-lg"
                      style={{ backgroundColor: "#150267", color: "white" }}
                    >
                      Unduh {fileType}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
    </div>
  );
}

export default InformationDownload;
