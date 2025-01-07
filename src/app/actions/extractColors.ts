'use server'

import ColorThief from 'colorthief';

export async function extractColors(imageUrl: string) {
  try {
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const colorThief = new ColorThief();
    const image = new Image();
    
    return new Promise((resolve) => {
      image.onload = () => {
        const palette = colorThief.getPalette(image, 3);
        resolve({
          primary: palette[0],
          secondary: palette[1],
          tertiary: palette[2],
        });
      };
      
      const base64Image = buffer.toString('base64');
      image.src = `data:image/jpeg;base64,${base64Image}`;
    });
  } catch (error) {
    console.error('Error extracting colors:', error);
    return null;
  }
}
