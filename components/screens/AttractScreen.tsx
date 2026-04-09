"use client";

import { useSessionStore } from "@/lib/store";
import FloatingBricks from "@/components/ui/FloatingBricks";
import LegoButton from "@/components/ui/LegoButton";

export default function AttractScreen() {
  const goTo = useSessionStore((s) => s.goTo);

  return (
    <div
      className="relative w-full min-h-screen min-h-dvh flex flex-col items-center justify-between overflow-hidden cursor-pointer"
      onClick={() => goTo("registration")}
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/myplayfestival_poster.jpeg)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/60" />
      <FloatingBricks />

      <div className="relative z-10 flex flex-col items-center pt-8 md:pt-12 lg:pt-16">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/myplayfest_masthead.png"
          alt="My Play Festival"
          className="w-[280px] md:w-[400px] lg:w-[500px] drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-4 md:gap-6 lg:gap-8 pb-20 md:pb-32 lg:pb-40 px-6">
        <h1 className="font-[family-name:var(--font-fredoka-var)] font-bold text-[36px] md:text-[56px] lg:text-[72px] text-white text-center leading-[1.1] drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
          Become a LEGO
          <br />
          Minifigure!
        </h1>
        <p className="font-[family-name:var(--font-nunito-var)] font-semibold text-[16px] md:text-[22px] lg:text-[28px] text-white/90 text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
          Take a photo and see yourself as a LEGO character
        </p>
        <div className="animate-pulse-cta">
          <LegoButton variant="yellow" size="lg">
            TOUCH TO START
          </LegoButton>
        </div>
      </div>
    </div>
  );
}
