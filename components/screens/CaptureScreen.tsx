"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useSessionStore } from "@/lib/store";
import LegoButton from "@/components/ui/LegoButton";
import CountdownOverlay from "@/components/ui/CountdownOverlay";

export default function CaptureScreen() {
  const goTo = useSessionStore((s) => s.goTo);
  const sessionId = useSessionStore((s) => s.sessionId);
  const setCapturedPhoto = useSessionStore((s) => s.setCapturedPhoto);
  const setGenerationTask = useSessionStore((s) => s.setGenerationTask);
  const capturedPhotoUrl = useSessionStore((s) => s.capturedPhotoUrl);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraReady, setCameraReady] = useState(false);
  const [counting, setCounting] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    setCameraReady(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1080 }, height: { ideal: 1080 }, facingMode: "user" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().then(() => setCameraReady(true));
        };
      }
    } catch (err) {
      setCameraError(err instanceof Error ? err.message : "Camera access denied");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  const handleCapture = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = Math.min(video.videoWidth, video.videoHeight);
    canvas.width = size;
    canvas.height = size;
    ctx.translate(size, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, size, size);

    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 200);

    canvas.toBlob(
      (blob) => {
        if (blob) { setCapturedPhoto(blob); setCaptured(true); stopCamera(); }
      },
      "image/jpeg",
      0.92
    );
  }, [setCapturedPhoto, stopCamera]);

  const handleRetake = () => { setCaptured(false); setCounting(false); startCamera(); };

  const handleConfirm = async () => {
    if (uploading) return;
    setUploading(true);
    goTo("processing");
    try {
      const blob = useSessionStore.getState().capturedPhotoBlob;
      if (!blob || !sessionId) return;
      const formData = new FormData();
      formData.append("photo", blob, "photo.jpg");
      formData.append("sessionId", sessionId);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.taskId) { setGenerationTask(data.taskId); }
      else { useSessionStore.getState().setGenerationStatus("error"); }
    } catch { useSessionStore.getState().setGenerationStatus("error"); }
  };

  const handleShutterPress = () => {
    if (!cameraReady) { startCamera(); return; }
    setCounting(true);
  };

  return (
    <div className="w-full min-h-screen min-h-dvh flex flex-col bg-[var(--lego-black)] relative">
      <div className="absolute top-4 md:top-6 lg:top-8 left-1/2 -translate-x-1/2 z-20">
        <div className="bg-[var(--lego-yellow)] rounded-full px-6 md:px-8 lg:px-10 py-2 lg:py-3 border-2 lg:border-3 border-[var(--lego-black)] shadow-[0_3px_0_var(--lego-black)] lg:shadow-[0_4px_0_var(--lego-black)]">
          <span className="font-[family-name:var(--font-fredoka-var)] font-bold text-[18px] md:text-[22px] lg:text-[28px] text-[var(--lego-black)]">
            {captured ? "Looking Good!" : cameraReady ? "Strike a Pose!" : "Starting Camera..."}
          </span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center relative px-4 md:px-6 pt-16 md:pt-20">
        {cameraError ? (
          <div className="text-center px-6 md:px-10">
            <p className="font-[family-name:var(--font-fredoka-var)] font-bold text-[24px] md:text-[30px] lg:text-[36px] text-white mb-3 md:mb-4">{cameraError === "Camera access denied" ? "Camera Not Available" : "Camera Error"}</p>
            <p className="font-[family-name:var(--font-nunito-var)] text-[16px] md:text-[20px] lg:text-[24px] text-white/70 mb-6 md:mb-8">Please allow camera access in your browser</p>
            <LegoButton variant="yellow" size="md" onClick={startCamera}>RETRY CAMERA</LegoButton>
          </div>
        ) : captured && capturedPhotoUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={capturedPhotoUrl} alt="Captured photo" className="w-full max-w-[600px] lg:max-w-[900px] aspect-square object-cover rounded-[16px] lg:rounded-[24px] border-3 lg:border-4 border-white/20" />
        ) : (
          <>
            <video ref={videoRef} autoPlay playsInline muted className="w-full max-w-[600px] lg:max-w-[900px] aspect-square object-cover rounded-[16px] lg:rounded-[24px] border-3 lg:border-4 border-white/20" style={{ transform: "scaleX(-1)" }} />
            {cameraReady && !counting && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg className="w-[150px] h-[200px] md:w-[220px] md:h-[300px] lg:w-[300px] lg:h-[400px]" viewBox="0 0 300 400" fill="none" opacity="0.25">
                  <ellipse cx="150" cy="120" rx="80" ry="100" stroke="white" strokeWidth="3" strokeDasharray="12 8" />
                  <path d="M70 200 Q70 180 150 180 Q230 180 230 200 L250 350 Q250 380 220 380 L80 380 Q50 380 50 350 Z" stroke="white" strokeWidth="3" strokeDasharray="12 8" fill="none" />
                </svg>
              </div>
            )}
          </>
        )}
        <canvas ref={canvasRef} className="hidden" />
        {showFlash && <div className="absolute inset-0 bg-white animate-flash z-30" />}
        {counting && <CountdownOverlay onComplete={() => { setCounting(false); handleCapture(); }} />}
      </div>

      <div className="flex justify-center gap-4 md:gap-6 pb-8 md:pb-12 lg:pb-16 pt-4 md:pt-6">
        {captured ? (
          <>
            <LegoButton variant="white" size="md" onClick={handleRetake}>RETAKE</LegoButton>
            <LegoButton variant="green" size="lg" onClick={handleConfirm} disabled={uploading}>
              {uploading ? "UPLOADING..." : "USE THIS PHOTO"}
            </LegoButton>
          </>
        ) : !cameraError ? (
          <button
            onClick={handleShutterPress}
            className={`w-[80px] h-[80px] md:w-[100px] md:h-[100px] lg:w-[120px] lg:h-[120px] rounded-full border-4 lg:border-[6px] border-white shadow-[0_0_0_4px_var(--lego-black),0_6px_0_var(--lego-black)] lg:shadow-[0_0_0_6px_var(--lego-black),0_8px_0_var(--lego-black)] active:shadow-[0_0_0_4px_var(--lego-black),0_2px_0_var(--lego-black)] active:translate-y-[4px] lg:active:translate-y-[6px] transition-all duration-150 flex items-center justify-center ${cameraReady ? "bg-[var(--lego-red)]" : "bg-[var(--lego-red)]/50"}`}
          >
            <svg className="w-[32px] h-[32px] md:w-[40px] md:h-[40px] lg:w-[48px] lg:h-[48px]" viewBox="0 0 24 24" fill="white">
              <path d="M12 15.2a3.2 3.2 0 100-6.4 3.2 3.2 0 000 6.4z" />
              <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
            </svg>
          </button>
        ) : null}
      </div>
    </div>
  );
}
