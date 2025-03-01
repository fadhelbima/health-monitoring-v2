/**
 * Get the current date in YYYY-MM-DD format
 * @returns {string} Current date in YYYY-MM-DD format
 */
export const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

/**
 * Get the day index for a given date (0 for Monday, 6 for Sunday)
 * @param {Date} date - The date to get index for, defaults to current date
 * @returns {number} Day index (0-6)
 */
export const getDayIndex = (date = new Date()) => {
  const day = date.getDay();
  return day === 0 ? 6 : day - 1;
};

/**
 * Calculate sleep quality based on sleep duration
 * @param {number} sleepDuration - Sleep duration in hours
 * @returns {number} Sleep quality percentage (25, 50, 75, or 100)
 */
export const calculateSleepQuality = (sleepDuration) => {
  // Recommended sleep is 7-9 hours
  if (sleepDuration >= 7 && sleepDuration <= 10) {
    return 100;
  } else if (sleepDuration >= 6 && sleepDuration < 7) {
    return 75;
  } else if (
    (sleepDuration > 9 && sleepDuration <= 10) ||
    (sleepDuration >= 5 && sleepDuration < 6)
  ) {
    return 50;
  } else {
    return 25;
  }
};
