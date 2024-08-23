export const formatDuration = (duration: string | any) => {
    const match = duration?.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = (match && match[1] || "").slice(0, -1);
    const minutes = (match && match[2] || "").slice(0, -1);
    const seconds = (match && match[3] || "").slice(0, -1);
    
    return `${hours ? hours + ":" : ""}${minutes ? minutes.padStart(2, "0") : "00"}:${seconds ? seconds.padStart(2, "0") : "00"}`;
  };
  