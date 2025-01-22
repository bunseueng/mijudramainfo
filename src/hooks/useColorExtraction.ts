import { getTextColor } from '@/app/actions/getTextColor';
import { useState, useCallback } from 'react';

export const useColorExtraction = (tv: any, imgRef: any, getDrama: any) => {
  const [dominantColor, setDominantColor] = useState<string | null>(null);
  const [textColor, setTextColor] = useState("#FFFFFF");

  const getColorFromImage = async (imageUrl: string) => {
    const response = await fetch("/api/extracting", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl }),
    });

    if (!response.ok) {
      console.error("Failed to get color");
      return null;
    }

    const data = await response.json();
    return data.averageColor;
  };

  const extractColor = useCallback(async () => {
    if (imgRef.current) {
      const colorString = await getColorFromImage(
        getDrama?.cover ||
        `https://image.tmdb.org/t/p/${tv?.backdrop_path ? "w300" : "w92"}/${
          tv.backdrop_path || tv?.poster_path
        }`
      );

      if (colorString) {
        const regex = /rgb\((\d+), (\d+), (\d+)\)/;
        const match = colorString.match(regex);

        if (match) {
          const [_, r, g, b] = match.map(Number);
          const rgbaColor = `rgba(${r}, ${g}, ${b}, 1)`;
          const gradientBackground = `linear-gradient(to right, ${rgbaColor}, rgba(${r}, ${g}, ${b}, 0.84) 50%, rgba(${r}, ${g}, ${b}, 0.84) 100%)`;
          
          setDominantColor(gradientBackground);
          setTextColor(getTextColor(r, g, b));
        }
      }
    }
  }, [imgRef, getDrama, tv.backdrop_path, tv?.poster_path]);

  return { dominantColor, textColor, extractColor };
};