export const formatDuration = (runtime: number | string | null | undefined) => {
  if (!runtime || isNaN(Number(runtime))) return "N/A"; // Handle invalid or missing input
  const durationInMinutes = Number(runtime); // Ensure it's a number
  const hours = Math.floor(durationInMinutes / 60); // Get hours
  const minutes = durationInMinutes % 60; // Get remaining minutes
  return `${hours}h ${minutes}mn`; // Format the output
};
