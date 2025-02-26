export function safelyFormatDate(dateString: string | undefined): string {
  // If no date is provided, return current date
  if (!dateString) {
    return new Date().toISOString();
  }

  try {
    // Try to create a date object
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date: ${dateString}. Using current date instead.`);
      return new Date().toISOString();
    }

    // Check if the date is too far in the past or future (e.g., beyond reasonable bounds)
    const now = new Date();
    const minDate = new Date(1900, 0, 1); // January 1, 1900
    const maxDate = new Date(now.getFullYear() + 10, 11, 31); // December 31, 10 years from now

    if (date < minDate || date > maxDate) {
      console.warn(`Date out of reasonable range: ${dateString}. Using current date instead.`);
      return new Date().toISOString();
    }

    // If all checks pass, return the formatted date
    return date.toISOString();
  } catch (error) {
    // If any error occurs during date processing, return current date
    console.error(`Error processing date: ${dateString}`, error);
    return new Date().toISOString();
  }
}