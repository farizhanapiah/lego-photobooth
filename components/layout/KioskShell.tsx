"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSessionStore } from "@/lib/store";
import { INACTIVITY_TIMEOUT_MS } from "@/lib/constants";

export default function KioskShell({ children }: { children: React.ReactNode }) {
  const currentScreen = useSessionStore((s) => s.currentScreen);
  const reset = useSessionStore((s) => s.reset);
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shellRef = useRef<HTMLDivElement>(null);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (currentScreen !== "attract") {
      inactivityTimer.current = setTimeout(() => {
        reset();
      }, INACTIVITY_TIMEOUT_MS);
    }
  }, [currentScreen, reset]);

  const handleInteraction = useCallback(() => {
    resetInactivityTimer();
  }, [resetInactivityTimer]);

  useEffect(() => {
    resetInactivityTimer();
    return () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [currentScreen, resetInactivityTimer]);

  return (
    <div
      ref={shellRef}
      className="relative w-full min-h-screen min-h-dvh max-w-[1080px] mx-auto overflow-x-hidden bg-lego-black"
      style={{ touchAction: "manipulation" }}
      onContextMenu={(e) => e.preventDefault()}
      onTouchStart={handleInteraction}
      onClick={handleInteraction}
    >
      {children}
    </div>
  );
}
