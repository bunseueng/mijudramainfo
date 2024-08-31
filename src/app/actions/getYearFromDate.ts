
export const getYearFromDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.getFullYear();
};