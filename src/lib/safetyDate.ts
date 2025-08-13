export function safelyFormatDate(dateString: string | undefined): string {
  const now = new Date();

  if (!dateString) {
    return now.toISOString();
  }

  const date = new Date(dateString);

  // Check for invalid date
  if (isNaN(date.getTime())) {
    console.warn(`Invalid date: ${dateString}. Using current date instead.`);
    return now.toISOString();
  }

  // Check for suspiciously old dates (before 2000-01-01)
  const minValidDate = new Date("2000-01-01T00:00:00Z");
  if (date < minValidDate) {
    console.warn(`Suspiciously old date: ${dateString}. Using current date instead.`);
    return now.toISOString();
  }

  return date.toISOString();
}
