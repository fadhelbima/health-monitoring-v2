/**
 * Utility functions for heart rate analysis
 */

// Define normal ranges (can be adjusted based on medical guidance)
const MIN_NORMAL_HEART_RATE = 50;
const MAX_NORMAL_HEART_RATE = 100;
const VERY_LOW_HEART_RATE = 40;
const VERY_HIGH_HEART_RATE = 140;
const SIGNIFICANT_CHANGE_THRESHOLD = 30; // 30 bpm change

/**
 * Check if heart rate is within normal range
 * @param {number} value - Heart rate measurement in BPM
 * @returns {Object} - Anomaly detection result with status, message and type
 */
export const checkHeartRateAnomaly = (value) => {
  if (value < VERY_LOW_HEART_RATE) {
    return {
      isAnomaly: true,
      message:
        "Detak jantung sangat rendah! Segera periksakan ke dokter jika ini bukan kondisi normal untuk Anda.",
      type: "danger",
    };
  } else if (value < MIN_NORMAL_HEART_RATE) {
    return {
      isAnomaly: true,
      message:
        "Detak jantung rendah. Apakah Anda atlet atau sedang istirahat? Jika tidak, konsultasikan dengan dokter.",
      type: "warning",
    };
  } else if (value > VERY_HIGH_HEART_RATE) {
    return {
      isAnomaly: true,
      message:
        "Detak jantung sangat tinggi! Segera periksakan ke dokter jika ini bukan akibat aktivitas fisik.",
      type: "danger",
    };
  } else if (value > MAX_NORMAL_HEART_RATE) {
    return {
      isAnomaly: true,
      message:
        "Detak jantung tinggi. Apakah Anda sedang berolahraga atau stres? Jika tidak, istirahat sejenak.",
      type: "warning",
    };
  } else {
    return {
      isAnomaly: false,
      message: "",
      type: "success",
    };
  }
};

/**
 * Detect sudden changes in heart rate
 * @param {number} newData - New heart rate measurement
 * @param {number} previousData - Previous heart rate measurement
 * @returns {Object} - Sudden change detection result with status and message
 */
export const detectSuddenChanges = (newData, previousData) => {
  if (previousData > 0 && newData > 0) {
    const change = Math.abs(newData - previousData);
    if (change > SIGNIFICANT_CHANGE_THRESHOLD) {
      return {
        isAnomaly: true,
        message: `Perubahan detak jantung signifikan terdeteksi (${change} bpm). Pastikan pengukuran dilakukan dengan benar.`,
        type: "warning",
      };
    }
  }
  return {
    isAnomaly: false,
    message: "",
    type: "success",
  };
};

/**
 * Analyze patterns in heart rate data over time
 * @param {Array} heartRateData - Array of heart rate measurements with x (date) and y (value) properties
 * @returns {Object} - Pattern analysis result with status and message
 */
export const analyzeHeartRatePatterns = (heartRateData) => {
  // Filter to include only valid readings
  const validReadings = heartRateData.filter((item) => item.y > 0);

  if (validReadings.length < 2) {
    return { isAnomaly: false, message: "" };
  }

  // Calculate average variation
  let totalVariation = 0;
  for (let i = 1; i < validReadings.length; i++) {
    totalVariation += Math.abs(validReadings[i].y - validReadings[i - 1].y);
  }
  const avgVariation = totalVariation / (validReadings.length - 1);

  // Check for unusual patterns
  if (avgVariation > 20) {
    return {
      isAnomaly: true,
      message:
        "Pola detak jantung tidak stabil terdeteksi dalam beberapa hari terakhir. Pertimbangkan untuk berkonsultasi dengan dokter.",
      type: "warning",
    };
  }

  // Check for consistently high or low readings
  const highReadings = validReadings.filter(
    (item) => item.y > MAX_NORMAL_HEART_RATE
  ).length;
  const lowReadings = validReadings.filter(
    (item) => item.y < MIN_NORMAL_HEART_RATE
  ).length;

  if (highReadings >= 3) {
    return {
      isAnomaly: true,
      message:
        "Detak jantung tinggi terdeteksi secara konsisten. Sebaiknya periksakan ke dokter.",
      type: "warning",
    };
  }

  if (lowReadings >= 3) {
    return {
      isAnomaly: true,
      message:
        "Detak jantung rendah terdeteksi secara konsisten. Sebaiknya periksakan ke dokter.",
      type: "warning",
    };
  }

  return { isAnomaly: false, message: "" };
};
