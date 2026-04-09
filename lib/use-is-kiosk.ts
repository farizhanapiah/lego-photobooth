"use client";

import { useState, useEffect } from "react";

export function useIsKiosk(): boolean {
  const [isKiosk, setIsKiosk] = useState(false);

  useEffect(() => {
    const hasTouch = navigator.maxTouchPoints > 0;
    const isLargeScreen = window.innerWidth >= 1024;
    setIsKiosk(hasTouch && isLargeScreen);
  }, []);

  return isKiosk;
}
