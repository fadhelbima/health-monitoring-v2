import React from "react";
import { FaFilePdf } from "react-icons/fa";
import { pdf } from "@react-pdf/renderer";
import HealthReportPDF from "./HealthReportPDF";

function FloatingPdf({ userId }) {
  const generatePdf = async () => {
    const blob = await pdf(<HealthReportPDF userId={userId} />).toBlob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "Laporan_Kesehatan.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Membersihkan URL blob setelah digunakan
  };

  return (
    <button className="btn btn-primary floating-button" onClick={generatePdf}>
      <FaFilePdf size={24} className="text-white" />
    </button>
  );
}

export default FloatingPdf;
