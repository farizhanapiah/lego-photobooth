"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { LEGO_COLORS } from "@/lib/constants";

export default function ConfettiEffect() {
  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: [...LEGO_COLORS],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: [...LEGO_COLORS],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    // Initial burst
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { x: 0.5, y: 0.5 },
      colors: [...LEGO_COLORS],
    });

    frame();
  }, []);

  return null;
}
