import React, { useState, useEffect } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, backgroundColor: "#f0f7ff" },
  header: {
    textAlign: "center",
    fontSize: 28,
    marginBottom: 15,
    color: "#3d5af1",
  },
  logo: { width: 120, marginBottom: 15, alignSelf: "center" },
  section: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#3d5af1",
  },
  text: { fontSize: 14, color: "#444", marginBottom: 10 },
  highlight: {
    backgroundColor: "#e6f0ff",
    padding: 4,
    borderRadius: 6,
    fontWeight: "bold",
  },
  footer: { textAlign: "center", fontSize: 10, marginTop: 30, color: "#666" },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statBox: {
    width: "48%",
    backgroundColor: "#f4f8ff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  statLabel: { fontSize: 10, color: "#666" },
  statValue: { fontSize: 18, fontWeight: "bold", color: "#3d5af1" },
  statUnit: { fontSize: 10, color: "#888" },
});

const HealthReportPDF = () => {
  const [detakJantung, setDetakJantung] = useState("Memuat...");
  const [durasiTidur, setDurasiTidur] = useState("Memuat...");
  const [langkah, setLangkah] = useState("Memuat...");
  const [kaloriTerbakar, setKaloriTerbakar] = useState("Memuat...");
  const [nama, setNama] = useState("Memuat...");

  const userEmail = localStorage.getItem("userEmail");

  const fetchData = async (endpoint, setterFunction) => {
    if (!userEmail) return;

    try {
      const response = await fetch(
        `http://localhost:8081/${endpoint}?email=${userEmail}`
      );
      const data = await response.json();

      if (data.length > 0 && data[0][endpoint] !== undefined) {
        setterFunction(data[0][endpoint]);
      } else {
        setterFunction("Tidak ada data");
      }
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      setterFunction("Error");
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchData("detak_jantung", setDetakJantung);
      fetchData("durasi_tidur", setDurasiTidur);
      fetchData("langkah", setLangkah);
      fetchData("kalori_terbakar", setKaloriTerbakar);
      fetchData("nama_user", setNama);
    }
  }, [userEmail]);

  const calculateGrade = () => {
    const sleep = parseFloat(durasiTidur) || 0;
    const steps = parseInt(langkah) || 0;

    if (sleep >= 7 && steps >= 10000) return "A+";
    if (sleep >= 6 && steps >= 8000) return "A";
    if (sleep >= 5 && steps >= 6000) return "B";
    if (sleep >= 4 && steps >= 4000) return "C";
    return "D";
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image src="/Img/Logo_Naratel.png" style={styles.logo} />
        <Text style={styles.header}>Laporan Kesehatan</Text>

        <View style={styles.section}>
          <Text style={styles.title}>Profil Pribadi</Text>
          <Text style={styles.text}>
            Nama: <Text style={styles.highlight}>{nama}</Text>
          </Text>
          <Text style={styles.text}>
            Email:{" "}
            <Text style={styles.highlight}>
              {userEmail || "Tidak tersedia"}
            </Text>
          </Text>
          <Text style={styles.text}>
            Nilai Kesehatan:{" "}
            <Text style={{ ...styles.highlight, backgroundColor: "#B2FF59" }}>
              {calculateGrade()}
            </Text>
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Data Kesehatan</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>DURASI TIDUR</Text>
              <Text style={styles.statValue}>{durasiTidur}</Text>
              <Text style={styles.statUnit}>jam</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>LANGKAH HARI INI</Text>
              <Text style={styles.statValue}>{langkah}</Text>
              <Text style={styles.statUnit}>langkah</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>KALORI TERBAKAR</Text>
              <Text style={styles.statValue}>{kaloriTerbakar}</Text>
              <Text style={styles.statUnit}>kkal</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>DETAK JANTUNG</Text>
              <Text style={styles.statValue}>{detakJantung}</Text>
              <Text style={styles.statUnit}>BPM</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer}>
          Dibuat oleh PT. Naraya Telematika | Desain oleh @FadhelBimaNabaalah |
          Stay healthy, stay awesome! 🚀
        </Text>
      </Page>
    </Document>
  );
};

export default HealthReportPDF;
