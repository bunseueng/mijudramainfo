declare module 'colorthief' {
    export default class ColorThief {
      constructor();
      getColor(image: HTMLImageElement, quality?: number): [number, number, number];
      getPalette(image: HTMLImageElement, colorCount?: number, quality?: number): Array<[number, number, number]>;
    }
  }
  