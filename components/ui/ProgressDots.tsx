"use client";

interface ProgressDotsProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressDots({ currentStep, totalSteps }: ProgressDotsProps) {
  return (
    <div className="flex items-center justify-center gap-[8px] lg:gap-[10px]">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={`
            h-[10px] lg:h-[12px] rounded-full transition-all duration-300
            ${
              i + 1 === currentStep
                ? "w-[28px] lg:w-[36px] bg-[var(--lego-yellow)]"
                : i + 1 < currentStep
                ? "w-[10px] lg:w-[12px] bg-[var(--lego-yellow)] opacity-60"
                : "w-[10px] lg:w-[12px] bg-white/30"
            }
          `}
        />
      ))}
    </div>
  );
}
