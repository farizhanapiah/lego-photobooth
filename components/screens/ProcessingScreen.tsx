"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSessionStore } from "@/lib/store";
import MinifigWalker from "@/components/ui/MinifigWalker";
import SurveyCard from "@/components/ui/SurveyCard";
import FloatingBricks from "@/components/ui/FloatingBricks";
import { SURVEY_QUESTIONS, POLL_INTERVAL_MS, AI_GENERATION_TIMEOUT_MS } from "@/lib/constants";

export default function ProcessingScreen() {
  const goTo = useSessionStore((s) => s.goTo);
  const generationTaskId = useSessionStore((s) => s.generationTaskId);
  const sessionId = useSessionStore((s) => s.sessionId);
  const setGenerationStatus = useSessionStore((s) => s.setGenerationStatus);
  const setGeneratedImageUrl = useSessionStore((s) => s.setGeneratedImageUrl);
  const surveyAnswers = useSessionStore((s) => s.surveyAnswers);
  const setSurveyAnswer = useSessionStore((s) => s.setSurveyAnswer);
  const generationStatus = useSessionStore((s) => s.generationStatus);

  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Uploading your photo...");
  const [error, setError] = useState(false);
  const [done, setDone] = useState(false);
  const startTime = useRef(Date.now());
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const GENERATION_TIME_MS = 20_000;
  const PROGRESS_TICK_MS = 200;

  const saveSurvey = useCallback(async () => {
    if (Object.keys(surveyAnswers).length === 0 || !sessionId) return;
    try {
      await fetch("/api/survey", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId, answers: surveyAnswers }) });
    } catch { /* Non-critical */ }
  }, [surveyAnswers, sessionId]);

  useEffect(() => {
    if (done || error) return;
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime.current;
      const raw = elapsed / GENERATION_TIME_MS;
      const eased = 1 - Math.pow(1 - Math.min(raw, 1), 2);
      const targetProgress = Math.min(eased * 90, 90);
      setProgress(targetProgress);
      if (targetProgress < 15) setStatusText("Uploading your photo...");
      else if (targetProgress < 35) setStatusText("Analyzing your photo...");
      else if (targetProgress < 60) setStatusText("Generating your minifigure...");
      else if (targetProgress < 80) setStatusText("Adding final details...");
      else setStatusText("Almost there...");
    }, PROGRESS_TICK_MS);
    return () => { if (progressRef.current) clearInterval(progressRef.current); };
  }, [done, error]);

  useEffect(() => {
    if (generationStatus === "error" && !generationTaskId) setError(true);
  }, [generationStatus, generationTaskId]);

  useEffect(() => {
    if (!generationTaskId) return;
    const poll = async () => {
      if (Date.now() - startTime.current > AI_GENERATION_TIMEOUT_MS) {
        setError(true); setGenerationStatus("error");
        if (pollingRef.current) clearInterval(pollingRef.current); return;
      }
      try {
        const res = await fetch(`/api/status/${generationTaskId}`);
        const data = await res.json();
        if (data.status === "complete" && data.resultUrl) {
          setDone(true); setProgress(100); setStatusText("Done!");
          setGenerationStatus("complete"); setGeneratedImageUrl(data.resultUrl);
          if (pollingRef.current) clearInterval(pollingRef.current);
          if (progressRef.current) clearInterval(progressRef.current);
          await saveSurvey(); setTimeout(() => goTo("result"), 800); return;
        }
        if (data.status === "error") {
          setError(true); setGenerationStatus("error");
          if (pollingRef.current) clearInterval(pollingRef.current);
          if (progressRef.current) clearInterval(progressRef.current); return;
        }
      } catch { /* Retry */ }
    };
    poll();
    pollingRef.current = setInterval(poll, POLL_INTERVAL_MS);
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generationTaskId]);

  if (error) {
    return (
      <div className="w-full min-h-screen min-h-dvh flex flex-col items-center justify-center bg-gradient-to-b from-[var(--sky-blue)] to-[var(--lego-blue)] gap-6 md:gap-8 px-6 md:px-10">
        <p className="font-[family-name:var(--font-fredoka-var)] font-bold text-[28px] md:text-[38px] lg:text-[48px] text-white text-center">Oops! Something went wrong</p>
        <p className="font-[family-name:var(--font-nunito-var)] font-semibold text-[16px] md:text-[20px] lg:text-[24px] text-white/80 text-center">Let&apos;s try taking your photo again</p>
        <LegoButton variant="yellow" size="lg" onClick={() => goTo("capture")}>TRY AGAIN</LegoButton>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen min-h-dvh flex flex-col bg-gradient-to-b from-[var(--sky-blue)] to-[var(--lego-blue)] relative overflow-y-auto">
      <FloatingBricks />

      <div className="relative z-10 pt-6 md:pt-8 lg:pt-10 px-5 md:px-8 lg:px-10">
        <div className="bg-[var(--festival-purple)] rounded-full px-5 md:px-6 lg:px-8 py-2 lg:py-3 mx-auto w-fit border-2 lg:border-3 border-white/20">
          <span className="font-[family-name:var(--font-fredoka-var)] font-bold text-[16px] md:text-[20px] lg:text-[26px] text-white">{statusText}</span>
        </div>
        <div className="mt-4 md:mt-6 lg:mt-8">
          <MinifigWalker progress={progress} />
        </div>
      </div>

      <div className="relative z-10 px-5 md:px-8 lg:px-10 mt-4 md:mt-6 lg:mt-8 flex-1">
        <h2 className="font-[family-name:var(--font-fredoka-var)] font-bold text-[24px] md:text-[32px] lg:text-[42px] text-white text-center mb-1 md:mb-2">While You Wait!</h2>
        <p className="font-[family-name:var(--font-nunito-var)] font-semibold text-[14px] md:text-[18px] lg:text-[22px] text-white/80 text-center mb-4 md:mb-6">Help LEGO Malaysia with a quick survey</p>
        <div className="flex flex-col gap-3 md:gap-4 lg:gap-5 pb-6 md:pb-8 lg:pb-10">
          {SURVEY_QUESTIONS.map((q, i) => (
            <SurveyCard key={q.id} questionNumber={i + 1} question={q.question} options={q.options} selectedOption={surveyAnswers[q.id] || null} onSelect={(option) => setSurveyAnswer(q.id, option)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function LegoButton({ variant, size, onClick, disabled, children }: { variant: string; size: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`px-8 py-3 text-[18px] md:px-12 md:py-4 md:text-[24px] lg:px-16 lg:py-5 lg:text-[32px] font-[family-name:var(--font-fredoka-var)] font-bold uppercase rounded-full border-3 lg:border-4 border-[var(--lego-black)] shadow-[0_4px_0_var(--lego-black)] lg:shadow-[0_6px_0_var(--lego-black)] active:shadow-[0_2px_0_var(--lego-black)] active:translate-y-[2px] transition-all duration-150 cursor-pointer ${variant === "yellow" ? "bg-[var(--lego-yellow)] text-[var(--lego-black)]" : "bg-[var(--lego-red)] text-white"} ${size} ${disabled ? "opacity-50" : ""}`}
    >{children}</button>
  );
}
