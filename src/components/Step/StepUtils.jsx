import { ref, onValue, set } from "firebase/database";
import { db } from "./../../firebase-config";

/**
 * Fetch steps data from Firebase for the current user
 * @param {string} userId - The user ID
 * @param {function} callback - Callback function for steps data
 * @returns {function} Unsubscribe function for Firebase listener
 */
export const fetchStepsData = (userId, callback) => {
  // Initialize data structure
  const data = {
    harian: [0, 0, 0, 0, 0, 0, 0],
    mingguan: [0, 0, 0, 0],
    bulanan: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    tahunan: [0],
  };

  // Get the current date
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentWeek = getWeekOfMonth(today);

  // Reference to the steps data in Firebase
  const stepsDataRef = ref(db, `users/${userId}/health_data/steps`);

  const unsubscribe = onValue(stepsDataRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback(data);
      return;
    }

    const stepsData = snapshot.val();

    // Process daily data
    const dailyData = [0, 0, 0, 0, 0, 0, 0];
    const weeklyData = [0, 0, 0, 0];
    const monthlyData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const yearlyData = [0];

    // Temporary storage for weekly calculation
    const weekCounts = [0, 0, 0, 0];
    const weekSums = [0, 0, 0, 0];

    // Temporary storage for monthly calculation
    const monthCounts = Array(12).fill(0);
    const monthSums = Array(12).fill(0);

    // Yearly counter
    let yearCount = 0;
    let yearSum = 0;

    // Process each date entry
    Object.keys(stepsData).forEach((dateString) => {
      const date = new Date(dateString);

      // Skip invalid dates
      if (isNaN(date.getTime())) return;

      const dayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1; // Convert to 0-6 where 0 is Monday
      const month = date.getMonth();
      const year = date.getFullYear();
      const weekOfMonth = getWeekOfMonth(date);

      // Get steps value
      const stepsValue = stepsData[dateString]?.steps_data?.value || 0;

      // Update daily data (for the current week)
      if (isCurrentWeek(date, today)) {
        dailyData[dayOfWeek] = stepsValue;
      }

      // Update weekly data (for the current month)
      if (
        year === currentYear &&
        month === currentMonth &&
        weekOfMonth >= 0 &&
        weekOfMonth < 4
      ) {
        weekSums[weekOfMonth] += stepsValue;
        weekCounts[weekOfMonth]++;
      }

      // Update monthly data (for the current year)
      if (year === currentYear) {
        monthSums[month] += stepsValue;
        monthCounts[month]++;
      }

      // Update yearly data
      if (year === currentYear) {
        yearSum += stepsValue;
        yearCount++;
      }
    });

    // Calculate averages for weekly data
    for (let i = 0; i < 4; i++) {
      weeklyData[i] =
        weekCounts[i] > 0 ? Math.round(weekSums[i] / weekCounts[i]) : 0;
    }

    // Calculate averages for monthly data
    for (let i = 0; i < 12; i++) {
      monthlyData[i] =
        monthCounts[i] > 0 ? Math.round(monthSums[i] / monthCounts[i]) : 0;
    }

    // Calculate average for yearly data
    yearlyData[0] = yearCount > 0 ? Math.round(yearSum / yearCount) : 0;

    // Update the data structure
    data.harian = dailyData;
    data.mingguan = weeklyData;
    data.bulanan = monthlyData;
    data.tahunan = yearlyData;

    // Store aggregated data in Firebase for future use
    storeAggregatedData(userId, data);

    // Send data back through the callback
    callback(data);
  });

  return unsubscribe;
};

/**
 * Store aggregated data in Firebase
 * @param {string} userId - The user ID
 * @param {object} data - The aggregated data
 */
const storeAggregatedData = (userId, data) => {
  const aggregatedRef = ref(db, `users/${userId}/health_data/steps_aggregated`);
  set(aggregatedRef, {
    weekly: data.mingguan,
    monthly: data.bulanan,
    yearly: data.tahunan,
    last_updated: new Date().toISOString(),
  });
};

/**
 * Check if a date is in the current week
 * @param {Date} date - The date to check
 * @param {Date} currentDate - The current date
 * @returns {boolean} Whether the date is in the current week
 */
const isCurrentWeek = (date, currentDate) => {
  // Clone the current date
  const startOfWeek = new Date(currentDate);

  // Go to the beginning of the week (Monday)
  const day = startOfWeek.getDay() || 7; // Make Sunday 7 instead of 0
  if (day !== 1) {
    startOfWeek.setHours(-24 * (day - 1));
  }
  startOfWeek.setHours(0, 0, 0, 0);

  // Get the end of the week (Sunday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  // Check if the date is within the current week
  return date >= startOfWeek && date <= endOfWeek;
};

/**
 * Get the week of the month (0-based, 0-3)
 * @param {Date} date - The date
 * @returns {number} The week of the month (0-3)
 */
const getWeekOfMonth = (date) => {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const pastDaysOfMonth = date.getDate() - 1;

  return Math.floor((firstDayOfMonth.getDay() + pastDaysOfMonth) / 7);
};

/**
 * Fetch past week data (for daily view)
 * @param {string} userId - The user ID
 * @param {Date} today - Current date
 * @param {function} setStepsData - State setter function for steps data
 */
const fetchPastWeekData = async (userId, today, setStepsData) => {
  for (let i = 1; i <= 6; i++) {
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - i);
    const pastDateString = pastDate.toISOString().split("T")[0];
    const pastDayIndex = pastDate.getDay() === 0 ? 6 : pastDate.getDay() - 1;

    const pastStepsRef = ref(
      db,
      `users/${userId}/health_data/steps/${pastDateString}/steps_data/value`
    );

    // Use a one-time listener for historical data
    onValue(
      pastStepsRef,
      (snapshot) => {
        const pastSteps = snapshot.exists() ? snapshot.val() : 0;

        setStepsData((prevData) => {
          const updatedHarian = [...prevData.harian];
          updatedHarian[pastDayIndex] = pastSteps;

          return {
            ...prevData,
            harian: updatedHarian,
          };
        });
      },
      { onlyOnce: true }
    );
  }
};

/**
 * Calculate average steps from an array of step counts
 * @param {Array} data - Array of step counts
 * @returns {number} Average steps (rounded to nearest integer)
 */
export const calculateAverage = (data) => {
  if (!data || data.length === 0) return 0;
  const sum = data.reduce((acc, val) => acc + val, 0);
  return Math.round(sum / data.length);
};
