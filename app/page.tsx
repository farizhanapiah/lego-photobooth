"use client";

import { useSessionStore } from "@/lib/store";
import KioskShell from "@/components/layout/KioskShell";
import AttractScreen from "@/components/screens/AttractScreen";
import RegistrationScreen from "@/components/screens/RegistrationScreen";
import GenderScreen from "@/components/screens/GenderScreen";
import PrivacyScreen from "@/components/screens/PrivacyScreen";
import CaptureScreen from "@/components/screens/CaptureScreen";
import ProcessingScreen from "@/components/screens/ProcessingScreen";
import ResultScreen from "@/components/screens/ResultScreen";

const screens = {
  attract: AttractScreen,
  registration: RegistrationScreen,
  gender: GenderScreen,
  privacy: PrivacyScreen,
  capture: CaptureScreen,
  processing: ProcessingScreen,
  result: ResultScreen,
};

export default function Home() {
  const currentScreen = useSessionStore((s) => s.currentScreen);
  const ScreenComponent = screens[currentScreen];

  return (
    <KioskShell>
      <div key={currentScreen} className="animate-slide-up-enter w-full h-full">
        <ScreenComponent />
      </div>
    </KioskShell>
  );
}
