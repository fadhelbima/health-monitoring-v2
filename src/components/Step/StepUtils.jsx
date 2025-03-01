import { ref, onValue } from "firebase/database";
import { db } from "./../../firebase-config";

/**
 * Fetch steps data from Firebase for the current user
 * @param {string} userId - The user ID
 * @param {function} setStepsData - State setter function for steps data
 * @returns {function} Unsubscribe function for Firebase listener
 */
export const fetchStepsData = (userId, setStepsData) => {
  // Get the current date and day of the week
  const today = new Date();
  const dayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1; // Convert Sunday (0) to 6 (Saturday)
  const currentDate = today.toISOString().split("T")[0];

  // Reference to today's steps data in Firebase
  const stepsRef = ref(
    db,
    `users/${userId}/health_data/steps/${currentDate}/steps_data/value`
  );

  // Listen for changes to the steps data
  const unsubscribe = onValue(stepsRef, (snapshot) => {
    const dailySteps = snapshot.exists() ? snapshot.val() : 0;

    setStepsData((prevData) => {
      // Create a new array for daily data
      const updatedHarian = [...prevData.harian];
      // Update only the current day's data
      updatedHarian[dayIndex] = dailySteps;

      return {
        ...prevData,
        harian: updatedHarian,
      };
    });
  });

  // Fetch historical data for the past 7 days
  fetchPastWeekData(userId, today, setStepsData);

  return unsubscribe;
};

/**
 * Fetch steps data for the past week
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
