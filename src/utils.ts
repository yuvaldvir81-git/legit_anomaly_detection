export function isDateTimeBetweenHours(
  dateTime: Date,
  startHour: number,
  startMinute: number,
  endHour: number,
  endMinute: number
): boolean {
  // Convert the check time to minutes since midnight
  const timeToCheckInMinutes = dateTime.getHours() * 60 + dateTime.getMinutes();

  // Convert the start and end times to minutes since midnight
  const startTimeInMinutes = startHour * 60 + startMinute;
  const endTimeInMinutes = endHour * 60 + endMinute;

  // Handle cases where the range crosses midnight (e.g., 10 PM to 6 AM)
  if (startTimeInMinutes > endTimeInMinutes) {
    // Check if the time is after the start time OR before the end time
    return (
      timeToCheckInMinutes >= startTimeInMinutes ||
      timeToCheckInMinutes < endTimeInMinutes
    );
  } else {
    // Handle cases where the range is on the same day (e.g., 9 AM to 5 PM)
    return (
      timeToCheckInMinutes >= startTimeInMinutes &&
      timeToCheckInMinutes < endTimeInMinutes
    );
  }
}