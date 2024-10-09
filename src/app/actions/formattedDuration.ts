export const formatDuration = (runtime: string | any) => {
  if (!runtime) return ""; // Handle case when runtime is not available
  const hours = Math.floor(runtime / 60); // Get hours
  const minutes = runtime % 60; // Get remaining minutes
  return `${hours}h ${minutes}mn`; // Format the output
  };
  