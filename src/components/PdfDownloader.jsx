import React, { useState, useEffect } from "react";
import { FaFilePdf } from "react-icons/fa";
import { pdf } from "@react-pdf/renderer";
import HealthReportPDF from "./HealthReportPDF";

function FloatingPdf() {
  const [nama, setNama] = useState("User");
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!userEmail) return;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/nama_user?email=${userEmail}`
        );
        const data = await response.json();

        if (data.length > 0) {
          setNama(data[0].nama_user || "User");
        }
      } catch (error) {
        console.error("Error fetching nama_user:", error);
        setNama("User");
      }
    };

    fetchData();
  }, [userEmail]); // Hanya dipanggil saat userEmail berubah

  const generatePdf = async () => {
    const blob = await pdf(<HealthReportPDF />).toBlob();
    const url = URL.createObjectURL(blob);

    // Buat elemen <a> untuk mengunduh file
    const link = document.createElement("a");
    link.href = url;
    link.download = `Laporan_Kesehatan_${nama}.pdf`; // Nama file diperbaiki
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button className="btn btn-primary floating-button" onClick={generatePdf}>
      <FaFilePdf size={24} className="text-white" />
    </button>
  );
}

export default FloatingPdf;
