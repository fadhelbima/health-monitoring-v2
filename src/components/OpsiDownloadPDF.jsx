import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Register a custom font (optional)
Font.register({
  family: "Open Sans",
  src: "https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0e.ttf",
});

// Stylesheet
const styles = StyleSheet.create({
  page: { padding: 0, backgroundColor: "#ffffff", fontFamily: "Open Sans" },
  header: {
    height: 120,
    backgroundColor: "#150267",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    padding: 20,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#ffffff",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: { color: "#2980b9", fontSize: 16, fontWeight: "bold" },
  reportTitle: {
    fontSize: 28,
    color: "#ffffff",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  content: { padding: 40, backgroundColor: "#f9f9f9", flexGrow: 1 },
  section: {
    borderRadius: 10,
    backgroundColor: "#ffffff",
    marginBottom: 20,
    padding: 20,
    borderLeftWidth: 5,
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  sectionHeader: {
    fontSize: 18,
    color: "#2c3e50",
    fontWeight: "bold",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
    paddingBottom: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  item: { width: "48%", marginBottom: 10 },
  label: { fontSize: 12, color: "#7f8c8d", marginBottom: 3 },
  value: { fontSize: 16, fontWeight: "bold", color: "#2c3e50" },
  footer: {
    marginTop: "auto",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ecf0f1",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  footerText: { fontSize: 10, color: "#7f8c8d" },
  indicators: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  indicator: {
    alignItems: "center",
    width: "30%",
  },
  circle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  circleText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  indicatorLabel: {
    fontSize: 10,
    color: "#7f8c8d",
    marginTop: 5,
    textAlign: "center",
  },
  indicatorStatus: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2c3e50",
    marginTop: 3,
  },
  healthSummary: {
    marginTop: 15,
  },
  doctorInfo: {
    marginTop: 30,
    alignItems: "center",
  },
  signatureLine: {
    width: 150,
    borderBottomWidth: 1,
    borderBottomColor: "#2c3e50",
    marginBottom: 5,
  },
  watermark: {
    position: "absolute",
    bottom: 300,
    left: 100,
    fontSize: 50,
    color: "rgba(52, 152, 219, 0.05)",
    transform: "rotate(-45deg)",
  },
  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  pageHeaderText: {
    fontSize: 14,
    color: "#2c3e50",
    fontWeight: "bold",
  },
  pageHeaderLine: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
    marginLeft: 10,
  },
});

// Main Component
const ModernHealthReportPDF = ({
  selectedDay,
  selectedMonth,
  selectedDate,
  selectedYear,
  heartRate,
  sleepDuration,
  step,
  calories,
}) => {
  const now = new Date();
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
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

  // Ambil email dari localStorage dengan pengecekan
  const userEmail = localStorage.getItem("userEmail") || "";
  const userName = localStorage.getItem("userName") || "[Nama User]";
  const userGender = localStorage.getItem("userGender") || "[L/P]";

  // Fungsi untuk memformat data
  const formatData = (data) => {
    if (!data || data === "No Data") return "-";
    return data;
  };

  // Format durasi tidur untuk tampilan
  const formatSleepDuration = (duration) => {
    if (!duration || duration === "No Data") return "-";
    return duration;
  };

  // Format kalori untuk tampilan
  const formatCalories = (cal) => {
    if (!cal || cal === "No Data") return "-";
    return cal;
  };

  const formattedDate = `${days[now.getDay()]}, ${now.getDate()} ${
    months[now.getMonth()]
  } ${now.getFullYear()}`;

  return (
    <Document>
      {/* First Page */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            {/* <Image src="/Img/Logo_Naratel.png" style={styles.logo} /> */}
            <Text style={styles.logoText}>NT</Text>
          </View>
          <Text style={styles.reportTitle}>LAPORAN KESEHATAN</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Informasi Waktu */}
          <View style={[styles.section, { borderLeftColor: "#3498db" }]}>
            <Text style={styles.sectionHeader}>Informasi Waktu</Text>
            <View style={styles.row}>
              <View style={styles.item}>
                <Text style={styles.label}>Hari:</Text>
                <Text style={styles.value}>{selectedDay || "-"}</Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.label}>Tanggal:</Text>
                <Text style={styles.value}>{selectedDate || "-"}</Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.label}>Bulan:</Text>
                <Text style={styles.value}>{selectedMonth || "-"}</Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.label}>Tahun:</Text>
                <Text style={styles.value}>
                  {selectedYear || now.getFullYear()}
                </Text>
              </View>
            </View>
          </View>

          {/* Data Pasien */}
          <View style={[styles.section, { borderLeftColor: "#2980b9" }]}>
            <Text style={styles.sectionHeader}>Data User</Text>
            <View style={styles.row}>
              <View style={styles.item}>
                <Text style={styles.label}>Nama:</Text>
                <Text style={styles.value}>{userName}</Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.label}>Jenis Kelamin:</Text>
                <Text style={styles.value}>{userGender}</Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{userEmail || "[Email User]"}</Text>
              </View>
            </View>
          </View>

          {/* Watermark */}
          <Text style={styles.watermark}>PT. Naraya Telematika</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Laporan dibuat pada {formattedDate}. PT Naraya Telematika.
          </Text>
        </View>

        {/* Page Number */}
      </Page>

      {/* Second Page */}
      <Page size="A4" style={styles.page}>
        {/* Small Header */}
        <View style={[styles.header, { height: 80 }]}>
          <View style={[styles.logoContainer, { width: 50, height: 50 }]}>
            <Text style={[styles.logoText, { fontSize: 12 }]}>NT</Text>
          </View>
          <Text style={[styles.reportTitle, { fontSize: 22 }]}>
            LAPORAN KESEHATAN
          </Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Page 2 Header */}
          <View style={styles.pageHeader}>
            <Text style={styles.pageHeaderText}>
              Data Kesehatan User: {userName}
            </Text>
            <View style={styles.pageHeaderLine} />
          </View>

          {/* Data Kesehatan */}
          <View style={[styles.section, { borderLeftColor: "#1abc9c" }]}>
            <Text style={styles.sectionHeader}>
              Hasil Pemeriksaan Kesehatan
            </Text>

            {/* Indicators */}
            <View style={styles.indicators}>
              <View style={styles.indicator}>
                <View style={[styles.circle, { borderColor: "#3498db" }]}>
                  <Text style={styles.circleText}>
                    {formatSleepDuration(sleepDuration)}
                  </Text>
                </View>
                <Text style={styles.indicatorLabel}>Durasi Tidur</Text>
                <Text style={styles.indicatorStatus}>jam</Text>
              </View>

              <View style={styles.indicator}>
                <View style={[styles.circle, { borderColor: "#2ecc71" }]}>
                  <Text style={styles.circleText}>{formatData(step)}</Text>
                </View>
                <Text style={styles.indicatorLabel}>Langkah</Text>
                <Text style={styles.indicatorStatus}>langkah</Text>
              </View>
              <View style={styles.indicator}>
                <View style={[styles.circle, { borderColor: "#e74c3c" }]}>
                  <Text style={styles.circleText}>
                    {formatCalories(calories)}
                  </Text>
                </View>
                <Text style={styles.indicatorLabel}>Kalori Terbakar</Text>
                <Text style={styles.indicatorStatus}>kal</Text>
              </View>
            </View>

            {/* Health Details */}
            <View style={styles.row}>
              <View style={styles.item}>
                <Text style={styles.label}>Berat Badan (kg):</Text>
                <Text style={styles.value}>[Berat Badan]</Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.label}>Tinggi Badan (cm):</Text>
                <Text style={styles.value}>[Tinggi Badan]</Text>
              </View>

              <View style={styles.item}>
                <Text style={styles.label}>Detak Jantung (scan terakhir):</Text>
                <Text style={styles.value}>{formatData(heartRate)} BPM</Text>
              </View>
            </View>
          </View>

          {/* Detailed Health Report */}
          <View style={[styles.section, { borderLeftColor: "#3498db" }]}>
            <Text style={styles.sectionHeader}>
              Hasil Analisis & Rekomendasi
            </Text>
            <View style={styles.healthSummary}>
              <Text style={styles.label}>Ringkasan Kesehatan:</Text>
              <Text style={styles.value}>
                Berdasarkan data yang diperoleh, kondisi kesehatan Anda pada{" "}
                {selectedDay}, {selectedDate} {selectedMonth} {selectedYear}{" "}
                menunjukkan{" "}
                {step === "No Data"
                  ? "tidak ada data langkah yang tercatat"
                  : `Anda telah melakukan ${step} langkah`}
                .{" "}
                {heartRate === "No Data"
                  ? "Tidak ada data detak jantung yang tercatat"
                  : `Detak jantung Anda tercatat ${heartRate} BPM`}
                .{" "}
                {sleepDuration === "No Data"
                  ? "Tidak ada data durasi tidur yang tercatat"
                  : `Durasi tidur Anda tercatat ${sleepDuration} jam`}
                .
              </Text>
            </View>
          </View>

          {/* Watermark */}
          <Text style={styles.watermark}>PT NARATEL</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Laporan dibuat pada {formattedDate}. PT Naraya Telematika.
          </Text>
          <Text style={styles.footerText}>Modern Healthcare Solutions</Text>
        </View>

        {/* Page Number */}
      </Page>
    </Document>
  );
};

export default ModernHealthReportPDF;
