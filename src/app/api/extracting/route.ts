import fetch from 'node-fetch';
import { createCanvas, loadImage } from 'canvas';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { imageUrl } = await req.json();

  if (!imageUrl) {
    return NextResponse.json({message: "Image url is required"}, {status: 400})
  }

  try {
    // Fetch the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }
    const buffer = await response.buffer();

    // Load the image into a canvas
    const image = await loadImage(buffer);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(image, 0, 0);
    
    // Extract color data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Calculate the average color
    let r = 0, g = 0, b = 0, count = 0;
    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }
    r = Math.floor(r / count);
    g = Math.floor(g / count);
    b = Math.floor(b / count);

    return NextResponse.json({averageColor: `rgb(${r}, ${g}, ${b})`}, {status: 200})
  } catch (error) {
    console.error(error);
    return NextResponse.json({message: "Failed to extract color"}, {status: 500})
  }
}
