"use client";

import { useSessionStore } from "@/lib/store";
import LegoButton from "@/components/ui/LegoButton";
import ProgressDots from "@/components/ui/ProgressDots";

export default function GenderScreen() {
  const goTo = useSessionStore((s) => s.goTo);
  const gender = useSessionStore((s) => s.gender);
  const setGender = useSessionStore((s) => s.setGender);

  const handleNext = () => {
    if (gender) goTo("privacy");
  };

  return (
    <div className="w-full min-h-screen min-h-dvh flex flex-col bg-gradient-to-b from-[var(--festival-purple)] to-[var(--deep-blue)]">
      <div className="pt-6 md:pt-8 lg:pt-10 pb-4 md:pb-6 px-5 md:px-8 lg:px-10">
        <ProgressDots currentStep={2} totalSteps={3} />
        <h1 className="font-[family-name:var(--font-fredoka-var)] font-bold text-[32px] md:text-[44px] lg:text-[56px] text-white text-center mt-4 md:mt-6">
          Choose Your Character
        </h1>
        <p className="font-[family-name:var(--font-nunito-var)] font-semibold text-[16px] md:text-[20px] lg:text-[24px] text-white/80 text-center mt-1 md:mt-2">
          Select your minifigure style
        </p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 lg:gap-8 px-5 md:px-8 lg:px-10">
        {/* Male Card */}
        <button
          onClick={() => setGender("male")}
          className={`
            w-full max-w-[320px] md:max-w-[380px] lg:max-w-[440px]
            h-[250px] md:h-[400px] lg:h-[600px] rounded-[24px] lg:rounded-[32px]
            flex flex-col items-center justify-center gap-3 md:gap-4 lg:gap-6
            transition-all duration-300
            ${
              gender === "male"
                ? "bg-[var(--lego-blue)] border-[4px] lg:border-[6px] border-[var(--lego-yellow)] scale-105 shadow-[0_8px_40px_rgba(0,108,183,0.5)]"
                : "bg-[var(--lego-blue)]/80 border-3 lg:border-4 border-white/20 hover:border-white/40"
            }
          `}
        >
          <svg className="w-[80px] h-[110px] md:w-[130px] md:h-[180px] lg:w-[180px] lg:h-[240px]" viewBox="0 0 180 240" fill="none">
            <rect x="40" y="10" width="100" height="30" rx="8" fill="#5C3A1E" />
            <rect x="35" y="25" width="110" height="15" rx="4" fill="#5C3A1E" />
            <rect x="40" y="35" width="100" height="80" rx="12" fill="var(--minifig-yellow)" stroke="var(--lego-black)" strokeWidth="3" />
            <circle cx="70" cy="70" r="8" fill="var(--lego-black)" />
            <circle cx="110" cy="70" r="8" fill="var(--lego-black)" />
            <path d="M65 90 Q90 110 115 90" stroke="var(--lego-black)" strokeWidth="4" fill="none" strokeLinecap="round" />
            <rect x="30" y="115" width="120" height="60" rx="6" fill="var(--lego-red)" stroke="var(--lego-black)" strokeWidth="3" />
            <rect x="10" y="118" width="25" height="50" rx="6" fill="var(--minifig-yellow)" stroke="var(--lego-black)" strokeWidth="2" />
            <rect x="145" y="118" width="25" height="50" rx="6" fill="var(--minifig-yellow)" stroke="var(--lego-black)" strokeWidth="2" />
            <rect x="35" y="175" width="48" height="55" rx="6" fill="var(--lego-blue)" stroke="var(--lego-black)" strokeWidth="3" />
            <rect x="97" y="175" width="48" height="55" rx="6" fill="var(--lego-blue)" stroke="var(--lego-black)" strokeWidth="3" />
          </svg>
          <span className="font-[family-name:var(--font-fredoka-var)] font-bold text-[24px] md:text-[32px] lg:text-[40px] text-white uppercase tracking-wider">
            Male
          </span>
          {gender === "male" && (
            <span className="font-[family-name:var(--font-nunito-var)] font-bold text-[14px] md:text-[16px] lg:text-[20px] text-[var(--lego-yellow)] uppercase tracking-widest">
              &#10003; Selected
            </span>
          )}
        </button>

        {/* Female Card */}
        <button
          onClick={() => setGender("female")}
          className={`
            w-full max-w-[320px] md:max-w-[380px] lg:max-w-[440px]
            h-[250px] md:h-[400px] lg:h-[600px] rounded-[24px] lg:rounded-[32px]
            flex flex-col items-center justify-center gap-3 md:gap-4 lg:gap-6
            transition-all duration-300
            ${
              gender === "female"
                ? "bg-[var(--baseplate-pink)] border-[4px] lg:border-[6px] border-[var(--lego-yellow)] scale-105 shadow-[0_8px_40px_rgba(233,120,163,0.5)]"
                : "bg-[var(--baseplate-pink)]/80 border-3 lg:border-4 border-white/20 hover:border-white/40"
            }
          `}
        >
          <svg className="w-[80px] h-[110px] md:w-[130px] md:h-[180px] lg:w-[180px] lg:h-[240px]" viewBox="0 0 180 240" fill="none">
            <path d="M30 60 Q30 10 90 10 Q150 10 150 60 L150 80 Q140 75 130 80 L130 45 Q130 25 90 25 Q50 25 50 45 L50 80 Q40 75 30 80 Z" fill="#8B4513" />
            <rect x="40" y="35" width="100" height="80" rx="12" fill="var(--minifig-yellow)" stroke="var(--lego-black)" strokeWidth="3" />
            <circle cx="70" cy="65" r="7" fill="var(--lego-black)" />
            <circle cx="110" cy="65" r="7" fill="var(--lego-black)" />
            <line x1="63" y1="58" x2="60" y2="54" stroke="var(--lego-black)" strokeWidth="2" />
            <line x1="117" y1="58" x2="120" y2="54" stroke="var(--lego-black)" strokeWidth="2" />
            <path d="M65 85 Q90 105 115 85" stroke="var(--lego-black)" strokeWidth="4" fill="none" strokeLinecap="round" />
            <rect x="30" y="115" width="120" height="60" rx="6" fill="var(--baseplate-pink)" stroke="var(--lego-black)" strokeWidth="3" />
            <rect x="10" y="118" width="25" height="50" rx="6" fill="var(--minifig-yellow)" stroke="var(--lego-black)" strokeWidth="2" />
            <rect x="145" y="118" width="25" height="50" rx="6" fill="var(--minifig-yellow)" stroke="var(--lego-black)" strokeWidth="2" />
            <path d="M30 175 L30 165 Q30 175 60 175 L60 230 Q60 235 55 235 L35 235 Q30 235 30 230 Z" fill="var(--festival-purple)" stroke="var(--lego-black)" strokeWidth="3" />
            <path d="M150 175 L150 165 Q150 175 120 175 L120 230 Q120 235 125 235 L145 235 Q150 235 150 230 Z" fill="var(--festival-purple)" stroke="var(--lego-black)" strokeWidth="3" />
          </svg>
          <span className="font-[family-name:var(--font-fredoka-var)] font-bold text-[24px] md:text-[32px] lg:text-[40px] text-white uppercase tracking-wider">
            Female
          </span>
          {gender === "female" && (
            <span className="font-[family-name:var(--font-nunito-var)] font-bold text-[14px] md:text-[16px] lg:text-[20px] text-[var(--lego-yellow)] uppercase tracking-widest">
              &#10003; Selected
            </span>
          )}
        </button>
      </div>

      <div className="flex justify-center pb-8 md:pb-12 lg:pb-16">
        <LegoButton variant="yellow" size="lg" disabled={!gender} onClick={handleNext}>
          NEXT
        </LegoButton>
      </div>
    </div>
  );
}
