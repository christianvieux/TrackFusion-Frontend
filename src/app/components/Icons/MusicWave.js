// src/app/svgs/MusicNote.js
import React from "react";
import styles from "../../../../public/css/music_wave.module.css"

export default function MusicWave({
  className,
  baseHeight = 10  , // Controls base height of waves
  maxHeight = 35, // Controls maximum height of center wave
  scaleAmount = 0.6, // Controls how much the waves scale
  ...props
}) {
  const getPath = (index, offset) => {
    const centerY = 38.05 / 2;
    // Calculate height based on position - middle bar gets maxHeight
    const heightDiff = maxHeight - baseHeight;
    const heightMultiplier = 1 - Math.abs(2 - index) / 2; // Peak at center (index 2)
    const height = baseHeight + (heightDiff * heightMultiplier);
    const y1 = centerY - height / 2;
    const y2 = centerY + height / 2;
    const x = index * 11;
    return `M${x}.91,${y1}V${y2}H${x + 3.18}V${y1}H${x}.91Z`;
  };

  return (
    <div
      className={`${styles.wave_container} ${className}`}
      style={{ "--scale-amount": scaleAmount }}
      {...props}
    >
      <svg
        id="wave"
        data-name="Layer 1"
        viewBox="0 0 50 38.05"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <path className={`${styles.line} ${styles.line1}`} d={getPath(0, 0)} />
        <path className={`${styles.line} ${styles.line2}`} d={getPath(1, 4)} />
        <path className={`${styles.line} ${styles.line3}`} d={getPath(2, 8)} />
        <path className={`${styles.line} ${styles.line4}`} d={getPath(3, 4)} />
        <path className={`${styles.line} ${styles.line5}`} d={getPath(4, 0)} />
      </svg>
    </div>
  );
}
