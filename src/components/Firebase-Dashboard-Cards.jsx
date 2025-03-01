import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db, auth } from "../firebase-config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoon,
  faPersonWalking,
  faFire,
  faHeartPulse,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";

const HealthData = () => {
  // State for health metrics
  const [healthMetrics, setHealthMetrics] = useState({
    heartRate: null,
    sleepDuration: null,
    steps: null,
    calories: null,
  });
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  // Health card data configuration
  const healthCards = [
    {
      id: "sleep",
      title: "Durasi Tidur",
      icon: faMoon,
      iconWrapperClass: "sleep-icon-wrapper",
      color: "#7E57C2",
      value:
        healthMetrics.sleepDuration !== "No Data" &&
        healthMetrics.sleepDuration !== null
          ? `${healthMetrics.sleepDuration} Jam`
          : "Loading...",
      description: "Kualitas tidur Anda lebih baik dari minggu lalu",
      detailLink: "/Sleep",
    },
    {
      id: "steps",
      title: "Langkah Hari Ini",
      icon: faPersonWalking,
      iconWrapperClass: "steps-icon-wrapper",
      color: "#4CAF50",
      value:
        healthMetrics.steps && healthMetrics.steps !== "No Data"
          ? `${healthMetrics.steps} Langkah`
          : "Loading...",
      description: "82% dari target harian Anda tercapai",
      detailLink: "/Step",
    },
    {
      id: "calories",
      title: "Kalori Terbakar",
      icon: faFire,
      iconWrapperClass: "calories-icon-wrapper",
      color: "#FF5722",
      value:
        healthMetrics.calories && healthMetrics.calories !== "No Data"
          ? `${healthMetrics.calories} kal`
          : "Loading...",
      description: "324 kalori lebih tinggi dari kemarin",
      detailLink: "/Calories",
    },
    {
      id: "heartRate",
      title: "Detak Jantung",
      icon: faHeartPulse,
      iconWrapperClass: "heart-icon-wrapper",
      color: "#E91E63",
      value:
        healthMetrics.heartRate && healthMetrics.heartRate !== "No Data"
          ? `${healthMetrics.heartRate} BPM`
          : "Loading...",
      description: "Detak jantung Anda dalam rentang normal",
      detailLink: "/Jantung",
    },
  ];

  // Effect for user authentication
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Effect for fetching health data
  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    const currentDate = getCurrentDate();

    // Firebase data paths
    const paths = {
      heartRate: `users/${userId}/health_data/heart_rate/${currentDate}`,
      sleepDuration: `users/${userId}/health_data/sleep/${currentDate}/sleep_session_0/duration/seconds`,
      steps: `users/${userId}/health_data/steps/${currentDate}/steps_data/value`,
      calories: `users/${userId}/health_data/calories/${currentDate}/calories_data/value`,
    };

    // Create references to Firebase paths
    const refs = {
      heartRate: ref(db, paths.heartRate),
      sleepDuration: ref(db, paths.sleepDuration),
      steps: ref(db, paths.steps),
      calories: ref(db, paths.calories),
    };

    // Handler for heart rate data
    const handleHeartRateData = (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const times = Object.keys(data).sort().reverse();
        setHealthMetrics((prev) => ({
          ...prev,
          heartRate: times.length > 0 ? data[times[0]].avg : "No Data",
        }));
      } else {
        setHealthMetrics((prev) => ({ ...prev, heartRate: "No Data" }));
      }
      setLoading(false);
    };

    // Handler for sleep duration data
    const handleSleepDurationData = (snapshot) => {
      setHealthMetrics((prev) => ({
        ...prev,
        sleepDuration: snapshot.exists()
          ? (snapshot.val() / 3600).toFixed(1)
          : "No Data",
      }));
      setLoading(false);
    };

    // Handler for steps data
    const handleStepsData = (snapshot) => {
      setHealthMetrics((prev) => ({
        ...prev,
        steps: snapshot.exists() ? snapshot.val() : "No Data",
      }));
      setLoading(false);
    };

    // Handler for calories data
    const handleCaloriesData = (snapshot) => {
      if (snapshot.exists()) {
        const value = parseFloat(snapshot.val());
        setHealthMetrics((prev) => ({ ...prev, calories: value.toFixed(2) }));
      } else {
        setHealthMetrics((prev) => ({ ...prev, calories: "No Data" }));
      }
      setLoading(false);
    };

    // Set up listeners for Firebase paths
    const unsubscribeHeartRate = onValue(refs.heartRate, handleHeartRateData);
    const unsubscribeSleepDuration = onValue(
      refs.sleepDuration,
      handleSleepDurationData
    );
    const unsubscribeSteps = onValue(refs.steps, handleStepsData);
    const unsubscribeCalories = onValue(refs.calories, handleCaloriesData);

    // Clean up listeners on unmount
    return () => {
      unsubscribeHeartRate();
      unsubscribeSleepDuration();
      unsubscribeSteps();
      unsubscribeCalories();
    };
  }, [userId]);

  // Update health cards with current data
  const updatedHealthCards = healthCards.map((card) => {
    let value;

    switch (card.id) {
      case "sleep":
        value =
          healthMetrics.sleepDuration &&
          healthMetrics.sleepDuration !== "No Data"
            ? `${healthMetrics.sleepDuration} Jam`
            : "No Data";
        break;
      case "steps":
        value =
          healthMetrics.steps && healthMetrics.steps !== "No Data"
            ? `${healthMetrics.steps} Langkah`
            : "No Data";
        break;
      case "calories":
        value =
          healthMetrics.calories && healthMetrics.calories !== "No Data"
            ? `${healthMetrics.calories} kal`
            : "No Data";
        break;
      case "heartRate":
        value =
          healthMetrics.heartRate && healthMetrics.heartRate !== "No Data"
            ? `${healthMetrics.heartRate} BPM`
            : "No Data";
        break;
      default:
        value = "No Data";
    }

    return { ...card, value };
  });

  // Render health card component
  const HealthCard = ({
    title,
    icon,
    iconWrapperClass,
    value,
    description,
    detailLink,
    color,
  }) => (
    <div className="col">
      <div className="dashboard-card card h-100 shadow-sm rounded-lg hover-effect">
        <div className="card-body d-flex flex-column">
          <div className="d-flex justify-content-between mb-3">
            <div
              className={`card-icon-wrapper rounded-circle d-flex align-items-center justify-content-center`}
              style={{
                backgroundColor: `${color}22`,
                width: "50px",
                height: "50px",
              }}
            >
              <FontAwesomeIcon
                icon={icon}
                className="card-icon"
                style={{ color: color, fontSize: "1.5rem" }}
              />
            </div>
            <a
              href={detailLink}
              className="text-decoration-none d-flex align-items-center"
              style={{ color: color }}
            >
              <FontAwesomeIcon icon={faChartLine} className="me-1" />
              <span className="small">Detail</span>
            </a>
          </div>

          <div className="metric-value fs-1 fw-bold">
            {loading ? "..." : value}
          </div>
          <div className="metric-label fs-5 fw-medium text-dark">{title}</div>

          <p className="card-text text-secondary mt-2 mb-0 small">
            {description}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid px-4 py-3">
      <div className="row g-4 row-cols-1 row-cols-md-2 row-cols-lg-4">
        {updatedHealthCards.map((card) => (
          <HealthCard
            key={card.id}
            title={card.title}
            icon={card.icon}
            iconWrapperClass={card.iconWrapperClass}
            value={card.value}
            description={card.description}
            detailLink={card.detailLink}
            color={card.color}
          />
        ))}
      </div>

      {/* Tambahkan CSS untuk komponen */}
      <style jsx="true">{`
        .dashboard-card {
          transition: all 0.3s ease;
          border: none;
          border-radius: 12px;
        }

        .hover-effect:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
        }

        .metric-value {
          color: #333;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 0.25rem;
        }

        @media (max-width: 768px) {
          .metric-value {
            font-size: 1.75rem !important;
          }

          .metric-label {
            font-size: 1.1rem !important;
          }

          .card-body {
            padding: 1rem;
          }
        }

        @media (max-width: 576px) {
          .container-fluid {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default HealthData;
