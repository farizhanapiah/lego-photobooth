"use client";

interface MinifigWalkerProps {
  progress: number;
}

export default function MinifigWalker({ progress }: MinifigWalkerProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full px-4 md:px-6 lg:px-8">
      <div className="relative w-full h-[40px] md:h-[50px] lg:h-[60px] mb-1 md:mb-2">
        <div
          className="absolute bottom-0 transition-all duration-500 ease-out"
          style={{ left: `${clampedProgress}%`, transform: "translateX(-50%)" }}
        >
          <svg className="w-[28px] h-[40px] md:w-[34px] md:h-[48px] lg:w-[40px] lg:h-[56px]" viewBox="0 0 40 56" fill="none">
            <rect x="8" y="0" width="24" height="20" rx="4" fill="var(--minifig-yellow)" stroke="var(--lego-black)" strokeWidth="2" />
            <circle cx="15" cy="10" r="2.5" fill="var(--lego-black)" />
            <circle cx="25" cy="10" r="2.5" fill="var(--lego-black)" />
            <path d="M14 15 Q20 20 26 15" stroke="var(--lego-black)" strokeWidth="2" fill="none" strokeLinecap="round" />
            <rect x="6" y="20" width="28" height="16" rx="2" fill="var(--lego-red)" stroke="var(--lego-black)" strokeWidth="2" />
            <rect x="8" y="36" width="10" height="18" rx="2" fill="var(--lego-blue)" stroke="var(--lego-black)" strokeWidth="2" style={{ transformOrigin: "13px 36px", animation: "walk-cycle 0.4s ease-in-out infinite" }} />
            <rect x="22" y="36" width="10" height="18" rx="2" fill="var(--lego-blue)" stroke="var(--lego-black)" strokeWidth="2" style={{ transformOrigin: "27px 36px", animation: "walk-cycle 0.4s ease-in-out infinite reverse" }} />
          </svg>
        </div>
      </div>

      <div className="relative w-full h-[14px] md:h-[16px] lg:h-[20px] bg-white/20 rounded-full overflow-hidden border-2 border-white/30">
        <div className="h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${clampedProgress}%`, background: "linear-gradient(90deg, var(--lego-yellow), var(--brick-orange))" }} />
      </div>

      <p className="text-center mt-1 md:mt-2 font-[family-name:var(--font-nunito-var)] font-bold text-[14px] md:text-[16px] lg:text-[20px] text-white/80">
        {Math.round(clampedProgress)}%
      </p>
    </div>
  );
}
