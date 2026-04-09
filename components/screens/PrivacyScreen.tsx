"use client";

import { useState } from "react";
import { useSessionStore } from "@/lib/store";
import LegoButton from "@/components/ui/LegoButton";
import ProgressDots from "@/components/ui/ProgressDots";
import { PDPA_TEXT } from "@/lib/constants";

export default function PrivacyScreen() {
  const goTo = useSessionStore((s) => s.goTo);
  const setConsent = useSessionStore((s) => s.setConsent);
  const setSessionId = useSessionStore((s) => s.setSessionId);
  const userName = useSessionStore((s) => s.userName);
  const userEmail = useSessionStore((s) => s.userEmail);
  const gender = useSessionStore((s) => s.gender);

  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAgree = async () => {
    if (!agreed || loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userName, email: userEmail, gender, consent: true }),
      });
      const data = await res.json();
      if (data.sessionId) {
        setConsent(true);
        setSessionId(data.sessionId);
        goTo("capture");
      }
    } catch {
      // Will retry on next tap
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen min-h-dvh flex flex-col bg-gradient-to-b from-[var(--festival-purple)] to-[var(--deep-blue)]">
      <div className="pt-6 md:pt-8 lg:pt-10 pb-3 md:pb-4 px-5 md:px-8 lg:px-10">
        <ProgressDots currentStep={3} totalSteps={3} />
        <h1 className="font-[family-name:var(--font-fredoka-var)] font-bold text-[28px] md:text-[38px] lg:text-[48px] text-white text-center mt-4 md:mt-6">
          Privacy Notice
        </h1>
        <p className="font-[family-name:var(--font-nunito-var)] font-semibold text-[14px] md:text-[18px] lg:text-[22px] text-white/80 text-center mt-1">
          Protected under Malaysia&apos;s PDPA 2010
        </p>
      </div>

      <div className="flex-1 px-5 md:px-8 lg:px-10 overflow-hidden">
        <div className="bg-white/95 rounded-[16px] lg:rounded-[20px] p-5 md:p-6 lg:p-8 h-full overflow-y-auto">
          <div className="font-[family-name:var(--font-nunito-var)] text-[14px] md:text-[18px] lg:text-[22px] leading-[1.6] text-[var(--lego-black)] whitespace-pre-line">
            {PDPA_TEXT}
          </div>
        </div>
      </div>

      <div className="px-5 md:px-8 lg:px-10 pt-4 md:pt-5 lg:pt-6 pb-6 md:pb-8 lg:pb-12 flex flex-col items-center gap-4 md:gap-6">
        <button onClick={() => setAgreed(!agreed)} className="flex items-center gap-3 md:gap-4">
          <div
            className={`
              w-[40px] h-[40px] md:w-[46px] md:h-[46px] lg:w-[52px] lg:h-[52px] rounded-[10px] lg:rounded-[12px]
              border-3 lg:border-4 border-[var(--lego-black)]
              flex items-center justify-center transition-all duration-200
              ${agreed ? "bg-[var(--leaf-green)]" : "bg-white"}
            `}
          >
            {agreed && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span className="font-[family-name:var(--font-nunito-var)] font-bold text-[14px] md:text-[18px] lg:text-[22px] text-white text-left max-w-[600px] lg:max-w-[800px]">
            I have read and agree to the privacy statement above
          </span>
        </button>

        <LegoButton variant="green" size="lg" disabled={!agreed || loading} onClick={handleAgree}>
          {loading ? "LOADING..." : "I AGREE & CONTINUE"}
        </LegoButton>
      </div>
    </div>
  );
}
