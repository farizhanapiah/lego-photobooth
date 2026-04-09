"use client";

import { LEGO_COLORS } from "@/lib/constants";

const bricks = [
  { x: "5%", y: "10%", size: 32, rotation: 15, delay: 0, color: 0 },
  { x: "88%", y: "8%", size: 24, rotation: -20, delay: 1.5, color: 1 },
  { x: "92%", y: "45%", size: 28, rotation: 30, delay: 3, color: 2 },
  { x: "8%", y: "55%", size: 20, rotation: -10, delay: 2, color: 3 },
  { x: "85%", y: "75%", size: 26, rotation: 25, delay: 4, color: 4 },
  { x: "10%", y: "82%", size: 22, rotation: -30, delay: 1, color: 0 },
];

export default function FloatingBricks() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {bricks.map((brick, i) => (
        <div
          key={i}
          className="absolute animate-float-brick"
          style={{
            left: brick.x,
            top: brick.y,
            animationDelay: `${brick.delay}s`,
            animationDuration: `${8 + i * 0.5}s`,
            opacity: 0.7,
          }}
        >
          <svg
            width={brick.size}
            height={brick.size * 0.6}
            viewBox="0 0 40 24"
            style={{ transform: `rotate(${brick.rotation}deg)` }}
          >
            <rect
              x="1"
              y="6"
              width="38"
              height="17"
              rx="3"
              fill={LEGO_COLORS[brick.color]}
              stroke="rgba(0,0,0,0.2)"
              strokeWidth="1"
            />
            <circle cx="12" cy="6" r="5" fill={LEGO_COLORS[brick.color]} stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
            <circle cx="28" cy="6" r="5" fill={LEGO_COLORS[brick.color]} stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
            <circle cx="12" cy="5" r="3" fill="rgba(255,255,255,0.25)" />
            <circle cx="28" cy="5" r="3" fill="rgba(255,255,255,0.25)" />
          </svg>
        </div>
      ))}
    </div>
  );
}
