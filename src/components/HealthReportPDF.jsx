import React, { useState, useEffect } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { ref, onValue, off } from "firebase/database";
import { db } from "../firebase-config";

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

const HealthReportPDF = ({ userId }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    if (!userId) return;

    // Get the current date in YYYY-MM-DD format
    const getCurrentDate = () => {
      const date = new Date();
      return date.toISOString().split("T")[0];
    };

    const currentDate = getCurrentDate();

    const userRef = ref(db, `users/${userId}/name`);

    const caloriesRef = ref(
      db,
      `users/${userId}/health_data/nutrition/${currentDate}/nutrition_data/totalCalories`
    );

    const sleepRef = ref(
      db,
      `users/${userId}/health_data/sleep/${currentDate}/sleep_session_0/duration/seconds`
    );

    const stepsRef = ref(
      db,
      `users/${userId}/health_data/steps/${currentDate}/steps_data/value`
    );

    const handleUserData = (snapshot) => {
      setData((prev) => ({
        ...prev,
        nama: snapshot.exists() ? snapshot.val() : "Tidak ada data",
      }));
    };

    const handleCaloriesData = (snapshot) => {
      setData((prev) => ({
        ...prev,
        kalori_terbakar: snapshot.exists() ? snapshot.val() : "Tidak ada data",
      }));
    };

    const handleSleepData = (snapshot) => {
      setData((prev) => ({
        ...prev,
        durasi_tidur: snapshot.exists()
          ? (snapshot.val() / 3600).toFixed(1)
          : "Tidak ada data",
      }));
    };

    const handleStepsData = (snapshot) => {
      setData((prev) => ({
        ...prev,
        langkah: snapshot.exists() ? snapshot.val() : "Tidak ada data",
      }));
    };

    // Set up listeners
    onValue(userRef, handleUserData);
    onValue(caloriesRef, handleCaloriesData);
    onValue(sleepRef, handleSleepData);
    onValue(stepsRef, handleStepsData);

    // Cleanup function to remove listeners when component unmounts
    return () => {
      off(userRef);
      off(caloriesRef);
      off(sleepRef);
      off(stepsRef);
    };
  }, [userId]);

  const calculateGrade = () => {
    const sleep = parseFloat(data.durasi_tidur) || 0;
    const steps = parseInt(data.langkah) || 0;

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
            Nama:{" "}
            <Text style={styles.highlight}>
              {data.nama || "Tidak tersedia"}
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
              <Text style={styles.statValue}>{data.durasi_tidur || "-"}</Text>
              <Text style={styles.statUnit}>jam</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>LANGKAH HARI INI</Text>
              <Text style={styles.statValue}>{data.langkah || "-"}</Text>
              <Text style={styles.statUnit}>langkah</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>KALORI TERBAKAR</Text>
              <Text style={styles.statValue}>
                {data.kalori_terbakar || "-"}
              </Text>
              <Text style={styles.statUnit}>kkal</Text>
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
