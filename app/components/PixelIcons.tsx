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
