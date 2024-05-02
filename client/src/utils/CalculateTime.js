export const calculateTime = (inputDateStr, options = {}) => {
  const { timeFormat = "12-hour", locale = "en-US" } = options;

  // Check if inputDateStr is a valid date string
  const inputDate = new Date(inputDateStr);
  if (isNaN(inputDate.getTime())) {
    throw new Error("Invalid date string provided");
  }

  const currentDate = new Date();
  const timeDifference = Math.floor((currentDate - inputDate) / 1000); // Time difference in seconds

  // Time Since
  if (timeDifference < 60) {
    return "Just now";
  } else if (timeDifference < 3600) {
    const minutes = Math.floor(timeDifference / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (timeDifference < 86400) {
    const hours = Math.floor(timeDifference / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }

  // Set up date formats
  const timeOptions = timeFormat === "12-hour" ? { hour: "numeric", minute: "numeric", hour12: true } : { hour: "numeric", minute: "numeric" };
  const dateFormat = { day: "2-digit", month: "2-digit", year: "numeric" };

  // Localization
  const timeLocale = { ...timeOptions, locale };
  const dateLocale = { ...dateFormat, locale };

  // Today
  if (
    inputDate.getDate() === currentDate.getDate() &&
    inputDate.getMonth() === currentDate.getMonth() &&
    inputDate.getFullYear() === currentDate.getFullYear()
  ) {
    return inputDate.toLocaleTimeString(locale, timeLocale);
  }
  
  // Yesterday
  const yesterday = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - 1);
  if (
    inputDate.getDate() === yesterday.getDate() &&
    inputDate.getMonth() === yesterday.getMonth() &&
    inputDate.getFullYear() === yesterday.getFullYear()
  ) {
    return "Yesterday";
  }

  // More than 1 day ago
  if (timeDifference >= 86400 && timeDifference <= 604800) { // Within a week
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return daysOfWeek[inputDate.getDay()];
  }

  // More than a week ago
  return inputDate.toLocaleDateString(locale, dateFormat);
};
