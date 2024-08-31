import { getLuminance } from "./getLuminance";

export const getTextColor = (r: number, g: number, b: number) => {
    const luminance = getLuminance(r, g, b);
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
};