/**
 * Lighten a color to a "100" shade (like Tailwind's -100).
 * Accepts hex, rgb, or named colors.
 * Returns a hex string.
 */
export default function toLight100(color: string, whiteRatio = 0.9): string {
  // Convert to RGB
  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) return color;
  ctx.fillStyle = color;
  const hex = ctx.fillStyle;
  const rgb = hexToRgb(hex);

  // Blend with white (default: 90% white, 10% color)
  const r = Math.round(rgb.r * (1 - whiteRatio) + 255 * whiteRatio);
  const g = Math.round(rgb.g * (1 - whiteRatio) + 255 * whiteRatio);
  const b = Math.round(rgb.b * (1 - whiteRatio) + 255 * whiteRatio);
  return rgbToHex(r, g, b);
}

function hexToRgb(hex: string) {
  let c = hex.substring(1);
  if (c.length === 3)
    c = c
      .split('')
      .map((x) => x + x)
      .join('');
  const num = parseInt(c, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
}
