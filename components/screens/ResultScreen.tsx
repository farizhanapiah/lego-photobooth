"use client";

import { useState, useEffect } from "react";
import { useSessionStore } from "@/lib/store";
import LegoButton from "@/components/ui/LegoButton";
import QRCodeDisplay from "@/components/ui/QRCodeDisplay";
import ConfettiEffect from "@/components/ui/ConfettiEffect";
import { AUTO_RESET_TIMEOUT_MS } from "@/lib/constants";

export default function ResultScreen() {
  const reset = useSessionStore((s) => s.reset);
  const userName = useSessionStore((s) => s.userName);
  const generatedImageUrl = useSessionStore((s) => s.generatedImageUrl);
  const sessionId = useSessionStore((s) => s.sessionId);

  const [countdown, setCountdown] = useState(Math.floor(AUTO_RESET_TIMEOUT_MS / 1000));
  const [imageLoaded, setImageLoaded] = useState(false);

  const [downloadUrl, setDownloadUrl] = useState("");

  useEffect(() => {
    const origin = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    setDownloadUrl(`${origin}/download/${sessionId}`);
  }, [sessionId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(timer); reset(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [reset]);

  return (
    <div className="w-full min-h-screen min-h-dvh flex flex-col bg-gradient-to-b from-[var(--lego-yellow)] to-white relative overflow-hidden">
      <ConfettiEffect />

      <div className="pt-4 md:pt-6 lg:pt-8 flex justify-center">
        <div className="animate-bounce-in bg-[var(--leaf-green)] rounded-full px-6 md:px-8 lg:px-10 py-2 md:py-3 lg:py-4 border-3 lg:border-4 border-[var(--lego-black)] shadow-[0_3px_0_var(--lego-black)] lg:shadow-[0_4px_0_var(--lego-black)]">
          <span className="font-[family-name:var(--font-fredoka-var)] font-bold text-[18px] md:text-[24px] lg:text-[30px] text-white">Your Minifigure is Ready!</span>
        </div>
      </div>

      <h1 className="font-[family-name:var(--font-fredoka-var)] font-bold text-[28px] md:text-[40px] lg:text-[52px] text-[var(--lego-black)] text-center mt-2 md:mt-3 lg:mt-4">
        Amazing, {userName}!
      </h1>

      <div className="flex-1 flex items-center justify-center px-4 md:px-8 lg:px-10 py-2 md:py-4">
        <div
          className={`relative rounded-[16px] lg:rounded-[20px] border-3 lg:border-4 border-[var(--lego-black)] shadow-[0_6px_20px_rgba(29,29,27,0.2)] lg:shadow-[0_8px_30px_rgba(29,29,27,0.2)] overflow-hidden bg-white transition-all duration-800 w-full max-w-[400px] md:max-w-[550px] lg:max-w-[700px] ${imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-[0.8]"}`}
        >
          {generatedImageUrl && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={generatedImageUrl} alt={`${userName}'s LEGO Minifigure`} className="w-full h-full object-contain" onLoad={() => setImageLoaded(true)} />
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 lg:gap-12 px-5 md:px-8 lg:px-10 pb-6 md:pb-8">
        <QRCodeDisplay url={downloadUrl} />
        <div className="flex flex-col items-center gap-3 md:gap-4">
          <LegoButton variant="red" size="lg" onClick={reset}>TRY AGAIN</LegoButton>
          <p className="font-[family-name:var(--font-nunito-var)] font-semibold text-[14px] md:text-[16px] lg:text-[18px] text-[var(--lego-black)]/50">
            Auto-reset in {countdown}s
          </p>
        </div>
      </div>
    </div>
  );
}
