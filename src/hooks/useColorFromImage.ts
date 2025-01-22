import { useCallback } from "react";
import ColorThief from "colorthief";

export function useColorFromImage() {
  const getColorFromImage = useCallback((imageUrl: string) => {
    return new Promise<[number, number, number]>((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = imageUrl;
      img.onload = () => {
        const colorThief = new ColorThief();
        const color = colorThief.getColor(img);
        resolve(color);
      };
    });
  }, []);

  return getColorFromImage;
}

