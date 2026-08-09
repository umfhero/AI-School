/** Small hand authored pixel sprites, drawn as grids of rects on a tiny viewBox so they stay
 * crisp and blocky at any scale. Reused everywhere the same shape is needed, rather than one
 * off icons per spot. See design.md for the theming this belongs to. */

export function PixelArrow({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`pixel-icon pixel-arrow ${className}`.trim()}
      viewBox="0 0 8 8"
      width="11"
      height="11"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
    >
      <rect x="4" y="1" width="1" height="1" />
      <rect x="4" y="2" width="2" height="1" />
      <rect x="0" y="3" width="7" height="1" />
      <rect x="0" y="4" width="7" height="1" />
      <rect x="4" y="5" width="2" height="1" />
      <rect x="4" y="6" width="1" height="1" />
    </svg>
  );
}

export function PixelSpark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`pixel-icon pixel-spark ${className}`.trim()}
      viewBox="0 0 7 7"
      width="16"
      height="16"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
    >
      <rect x="3" y="0" width="1" height="2" />
      <rect x="3" y="5" width="1" height="2" />
      <rect x="0" y="3" width="2" height="1" />
      <rect x="5" y="3" width="2" height="1" />
      <rect x="2" y="2" width="3" height="3" />
    </svg>
  );
}

const badgeGlyphs = [
  ["0011100", "0111110", "1111111", "1111111", "0111110", "0011100", "0001000"],
  ["0111110", "1100011", "1011101", "1010101", "1011101", "1100011", "0111110"],
  ["0011100", "0100010", "1011101", "1111111", "1011101", "0100010", "0100010"],
  ["0100000", "0111010", "1111111", "0111010", "0100000", "0010000", "0000000"],
  ["1000001", "0100010", "0010100", "0001000", "0010100", "0100010", "1000001"],
  ["0001000", "0011100", "0111110", "0111110", "1111111", "0010100", "0100010"],
];

export function PixelTierBadge({ tier, className = "" }: { tier: number; className?: string }) {
  const glyph = badgeGlyphs[tier] ?? badgeGlyphs[0];
  return <svg className={`pixel-icon ${className}`.trim()} viewBox="0 0 7 7" width="28" height="28" fill="currentColor" aria-hidden="true" focusable="false" shapeRendering="crispEdges">{glyph.flatMap((row, y) => [...row].flatMap((pixel, x) => pixel === "1" ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" /> : []))}</svg>;
}

const pixelGlyphs: Record<string, string[]> = {
  p: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  r: ["11110", "10001", "10000", "10000", "10000", "10000", "10000"],
  o: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  e: ["01110", "10001", "11111", "10000", "10000", "10001", "01110"],
  l: ["100", "100", "100", "100", "100", "100", "111"],
  y: ["10001", "10001", "01010", "00100", "00100", "01000", "10000"],
  ".": ["0", "0", "0", "0", "0", "1", "1"],
};

export function PixelWord({ text, className = "" }: { text: string; className?: string }) {
  let cursor = 0;
  const glyphs = [...text].flatMap((character, characterIndex) => {
    const glyph = pixelGlyphs[character] ?? pixelGlyphs["."];
    const start = cursor;
    cursor += glyph[0].length + (characterIndex === text.length - 1 ? 0 : 1);
    return glyph.flatMap((row, y) => [...row].flatMap((pixel, x) => pixel === "1" ? [<rect key={`${characterIndex}-${x}-${y}`} x={start + x} y={y} width="1" height="1" />] : []));
  });
  return <svg className={`pixel-icon pixel-word ${className}`.trim()} viewBox={`0 0 ${cursor} 7`} fill="currentColor" aria-hidden="true" focusable="false" shapeRendering="crispEdges">{glyphs}</svg>;
}

export function PixelCheck({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`pixel-icon pixel-check ${className}`.trim()}
      viewBox="0 0 8 8"
      width="12"
      height="12"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
    >
      <rect x="1" y="4" width="1" height="1" />
      <rect x="2" y="5" width="1" height="1" />
      <rect x="3" y="6" width="1" height="1" />
      <rect x="4" y="5" width="1" height="1" />
      <rect x="5" y="4" width="1" height="1" />
      <rect x="6" y="3" width="1" height="1" />
      <rect x="7" y="2" width="1" height="1" />
    </svg>
  );
}

export function PixelMascot({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`pixel-icon pixel-mascot ${className}`.trim()}
      viewBox="0 0 8 9"
      width="64"
      height="72"
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
    >
      <rect x="3" y="0" width="1" height="1" fill="#0b1130" />
      <rect x="3" y="1" width="1" height="1" fill="#0b1130" />
      <rect x="1" y="2" width="6" height="6" fill="#0b1130" />
      <rect x="2" y="3" width="4" height="4" fill="#6258e9" />
      <rect x="3" y="4" width="1" height="1" fill="#0b1130" />
      <rect x="5" y="4" width="1" height="1" fill="#0b1130" />
      <rect x="3" y="6" width="2" height="1" fill="#0b1130" />
      <rect x="0" y="4" width="1" height="2" fill="#0b1130" />
      <rect x="7" y="4" width="1" height="2" fill="#0b1130" />
    </svg>
  );
}
