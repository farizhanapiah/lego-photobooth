"use client";

import { useState, useCallback } from "react";
import { useSessionStore } from "@/lib/store";
import { useIsKiosk } from "@/lib/use-is-kiosk";
import LegoButton from "@/components/ui/LegoButton";
import LegoInput from "@/components/ui/LegoInput";
import VirtualKeyboard from "@/components/ui/VirtualKeyboard";
import ProgressDots from "@/components/ui/ProgressDots";

type FocusedField = "name" | "email";

export default function RegistrationScreen() {
  const goTo = useSessionStore((s) => s.goTo);
  const userName = useSessionStore((s) => s.userName);
  const userEmail = useSessionStore((s) => s.userEmail);
  const setUserName = useSessionStore((s) => s.setUserName);
  const setUserEmail = useSessionStore((s) => s.setUserEmail);
  const isKiosk = useIsKiosk();

  const [focusedField, setFocusedField] = useState<FocusedField>("name");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const handleKeyPress = useCallback(
    (key: string) => {
      if (focusedField === "name") {
        setUserName(userName + key);
      } else {
        setUserEmail(userEmail + key);
      }
      setErrors((prev) => ({ ...prev, [focusedField]: undefined }));
    },
    [focusedField, userName, userEmail, setUserName, setUserEmail]
  );

  const handleBackspace = useCallback(() => {
    if (focusedField === "name") {
      setUserName(userName.slice(0, -1));
    } else {
      setUserEmail(userEmail.slice(0, -1));
    }
  }, [focusedField, userName, userEmail, setUserName, setUserEmail]);

  const handleDone = useCallback(() => {
    if (focusedField === "name") {
      setFocusedField("email");
    }
  }, [focusedField]);

  const handleNext = () => {
    const newErrors: { name?: string; email?: string } = {};

    if (userName.trim().length < 2) {
      newErrors.name = "Please enter your name (at least 2 characters)";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    goTo("gender");
  };

  return (
    <div className="w-full min-h-screen min-h-dvh flex flex-col bg-gradient-to-b from-[var(--festival-purple)] to-[var(--deep-blue)]">
      <div className="pt-6 md:pt-8 lg:pt-10 pb-4 md:pb-6 px-5 md:px-8 lg:px-10">
        <ProgressDots currentStep={1} totalSteps={3} />
        <h1 className="font-[family-name:var(--font-fredoka-var)] font-bold text-[32px] md:text-[44px] lg:text-[56px] text-white text-center mt-4 md:mt-6">
          Tell Us About You!
        </h1>
        <p className="font-[family-name:var(--font-nunito-var)] font-semibold text-[16px] md:text-[20px] lg:text-[24px] text-white/80 text-center mt-1 md:mt-2">
          We&apos;ll use this to personalise your LEGO Minifigure
        </p>
      </div>

      <div className="flex-1 px-5 md:px-8 lg:px-10 flex flex-col gap-4 md:gap-6">
        <LegoInput
          label="Your Name"
          value={userName}
          placeholder="Enter your name"
          error={errors.name}
          isFocused={focusedField === "name"}
          onFocus={() => setFocusedField("name")}
          onChange={(v) => { setUserName(v); setErrors((p) => ({ ...p, name: undefined })); }}
          useNativeInput={!isKiosk}
        />
        <LegoInput
          label="Email Address"
          value={userEmail}
          placeholder="Enter your email"
          error={errors.email}
          isFocused={focusedField === "email"}
          onFocus={() => setFocusedField("email")}
          onChange={(v) => { setUserEmail(v); setErrors((p) => ({ ...p, email: undefined })); }}
          useNativeInput={!isKiosk}
          type="email"
        />

        <div className="flex justify-center mt-2 md:mt-4">
          <LegoButton variant="yellow" size="lg" onClick={handleNext}>
            NEXT
          </LegoButton>
        </div>
      </div>

      {isKiosk && (
        <VirtualKeyboard
          onKeyPress={handleKeyPress}
          onBackspace={handleBackspace}
          onDone={handleDone}
          showEmailKeys={focusedField === "email"}
        />
      )}
    </div>
  );
}
