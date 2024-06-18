
// Function to convert total value to fit within the range of 0 to 5
export const convertToFiveStars = (value: number, totalValue: number) => {
    return (value / totalValue) * 5;
  };