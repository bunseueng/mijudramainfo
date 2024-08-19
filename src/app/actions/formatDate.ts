export const formatDate = (dateString: string) => {
    if (!dateString) return "TBA"; // Return "TBA" if the date is empty or null
  
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };