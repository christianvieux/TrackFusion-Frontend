export const formatDuration = (seconds) => {
    // Handle null, undefined, or invalid durations
    if (seconds == null || isNaN(seconds)) {
      return "00:00"; // Return a fallback duration if the input is invalid
    }
  
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
  
    const formattedHours = hours > 0 ? `${hours}:` : ''; // Only show hours if > 0
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
  
    return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
  };