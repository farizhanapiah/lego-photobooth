"use client";

import { useState, useEffect } from "react";
import { COUNTDOWN_SECONDS } from "@/lib/constants";

interface CountdownOverlayProps {
  onComplete: () => void;
}

export default function CountdownOverlay({ onComplete }: CountdownOverlayProps) {
  const [count, setCount] = useState(COUNTDOWN_SECONDS);

  useEffect(() => {
    if (count === 0) { onComplete(); return; }
    const timer = setTimeout(() => setCount(count - 1), 1000);
    return () => clearTimeout(timer);
  }, [count, onComplete]);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60">
      {count > 0 && (
        <span
          key={count}
          className="animate-countdown-pop font-[family-name:var(--font-fredoka-var)] font-bold text-[100px] md:text-[150px] lg:text-[200px] text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
        >
          {count}
        </span>
      )}
    </div>
  );
}
