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

export function PixelBell({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`pixel-icon pixel-bell ${className}`.trim()}
      viewBox="0 0 9 9"
      width="16"
      height="16"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
    >
      <rect x="3" y="0" width="3" height="1" />
      <rect x="2" y="1" width="5" height="1" />
      <rect x="2" y="2" width="5" height="3" />
      <rect x="1" y="5" width="7" height="2" />
      <rect x="0" y="7" width="9" height="1" />
      <rect x="3" y="8" width="3" height="1" />
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

const cursorGlyph = [
  "1000000000",
  "1100000000",
  "1110000000",
  "1111000000",
  "1111100000",
  "1111110000",
  "1111111000",
  "1111111100",
  "1111000000",
  "1110110000",
  "1100110000",
  "1100110000",
];

const pointerGlyph = [
  "0001100000",
  "0001100000",
  "0001100000",
  "0001100000",
  "0001100000",
  "0001111000",
  "1101111100",
  "1111111110",
  "0111111111",
  "0011111111",
  "0011111110",
  "0001111100",
  "0000111000",
];

function dilate(glyph: string[]): string[] {
  const width = glyph[0].length;
  const height = glyph.length;
  const solid = (x: number, y: number) => x >= 0 && y >= 0 && x < width && y < height && glyph[y][x] === "1";
  return glyph.map((row, y) => [...row].map((_, x) => {
    for (let dy = -1; dy <= 1; dy += 1) {
      for (let dx = -1; dx <= 1; dx += 1) {
        if (solid(x + dx, y + dy)) return "1";
      }
    }
    return "0";
  }).join(""));
}

const cursorSilhouette = dilate(cursorGlyph);
const pointerSilhouette = dilate(pointerGlyph);

type PixelPointerSpriteProps = {
  className?: string;
  glyph: string[];
  silhouette: string[];
  hotspotX?: number;
};

function PixelPointerSprite({ className, glyph, silhouette, hotspotX = 0 }: PixelPointerSpriteProps) {
  const rects = (source: string[], prefix: string) => source.flatMap((row, y) => [...row].flatMap((pixel, x) => pixel === "1" ? <rect key={`${prefix}-${x}-${y}`} x={x} y={y} width="1" height="1" /> : []));
  const edge = silhouette.map((row, y) => [...row].map((pixel, x) => pixel === "1" && glyph[y][x] !== "1" ? "1" : "0").join(""));
  return (
    <svg
      className={`pixel-icon ${className ?? ""}`.trim()}
      viewBox={`0 0 ${glyph[0].length + 2} ${glyph.length + 2}`}
      style={hotspotX ? { left: `${-hotspotX * 2}px` } : undefined}
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
    >
      <g fill="#0b1130" transform="translate(1 1)">{rects(silhouette, "shadow")}</g>
      <g fill="#0b1130">{rects(edge, "edge")}</g>
      <g fill="currentColor">{rects(glyph, "face")}</g>
    </svg>
  );
}

export function PixelCursor({ className = "" }: { className?: string }) {
  return <PixelPointerSprite className={`pixel-cursor ${className}`.trim()} glyph={cursorGlyph} silhouette={cursorSilhouette} />;
}

export function PixelPointer({ className = "" }: { className?: string }) {
  return <PixelPointerSprite className={`pixel-pointer ${className}`.trim()} glyph={pointerGlyph} silhouette={pointerSilhouette} hotspotX={3.5} />;
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
