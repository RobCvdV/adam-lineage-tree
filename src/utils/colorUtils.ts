// Color utility functions for gradation and interpolation

export interface RGB {
  r: number;
  g: number;
  b: number;
}

// Convert hex color to RGB
export function hexToRgb(hex: string): RGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Convert RGB to hex color
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

// Interpolate between two colors based on a factor (0-1)
export function interpolateColor(startColor: string, endColor: string, factor: number): string {
  const start = hexToRgb(startColor);
  const end = hexToRgb(endColor);

  if (!start || !end) return startColor;

  const r = start.r + (end.r - start.r) * factor;
  const g = start.g + (end.g - start.g) * factor;
  const b = start.b + (end.b - start.b) * factor;

  return rgbToHex(r, g, b);
}

// Create a gradient color based on generation (0 = full highlight, 3 = default)
export function getGenerationColor(highlightColor: string, defaultColor: string, generation: number): string {
  const factor = Math.min(generation / 3, 1);
  return interpolateColor(highlightColor, defaultColor, factor);
}
