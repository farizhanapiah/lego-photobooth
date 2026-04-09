"use client";

import { create } from "zustand";

export type Screen =
  | "attract"
  | "registration"
  | "gender"
  | "privacy"
  | "capture"
  | "processing"
  | "result";

interface SessionStore {
  currentScreen: Screen;
  goTo: (screen: Screen) => void;

  sessionId: string | null;
  userName: string;
  userEmail: string;
  gender: "male" | "female" | null;
  consentGiven: boolean;

  capturedPhotoBlob: Blob | null;
  capturedPhotoUrl: string | null;

  generationTaskId: string | null;
  generationStatus: "idle" | "pending" | "processing" | "complete" | "error";
  generatedImageUrl: string | null;

  surveyAnswers: Record<string, string>;

  setUserName: (name: string) => void;
  setUserEmail: (email: string) => void;
  setGender: (gender: "male" | "female") => void;
  setConsent: (consent: boolean) => void;
  setSessionId: (id: string) => void;
  setCapturedPhoto: (blob: Blob) => void;
  setGenerationTask: (taskId: string) => void;
  setGenerationStatus: (
    status: "idle" | "pending" | "processing" | "complete" | "error"
  ) => void;
  setGeneratedImageUrl: (url: string) => void;
  setSurveyAnswer: (questionId: string, answer: string) => void;

  reset: () => void;
}

const initialState = {
  currentScreen: "attract" as Screen,
  sessionId: null,
  userName: "",
  userEmail: "",
  gender: null as "male" | "female" | null,
  consentGiven: false,
  capturedPhotoBlob: null,
  capturedPhotoUrl: null,
  generationTaskId: null,
  generationStatus: "idle" as const,
  generatedImageUrl: null,
  surveyAnswers: {},
};

export const useSessionStore = create<SessionStore>((set, get) => ({
  ...initialState,

  goTo: (screen) => set({ currentScreen: screen }),

  setUserName: (userName) => set({ userName }),
  setUserEmail: (userEmail) => set({ userEmail }),
  setGender: (gender) => set({ gender }),
  setConsent: (consentGiven) => set({ consentGiven }),
  setSessionId: (sessionId) => set({ sessionId }),

  setCapturedPhoto: (blob) => {
    const prev = get().capturedPhotoUrl;
    if (prev) URL.revokeObjectURL(prev);
    set({
      capturedPhotoBlob: blob,
      capturedPhotoUrl: URL.createObjectURL(blob),
    });
  },

  setGenerationTask: (generationTaskId) =>
    set({ generationTaskId, generationStatus: "pending" }),
  setGenerationStatus: (generationStatus) => set({ generationStatus }),
  setGeneratedImageUrl: (generatedImageUrl) => set({ generatedImageUrl }),

  setSurveyAnswer: (questionId, answer) =>
    set((state) => ({
      surveyAnswers: { ...state.surveyAnswers, [questionId]: answer },
    })),

  reset: () => {
    const prev = get().capturedPhotoUrl;
    if (prev) URL.revokeObjectURL(prev);
    set({ ...initialState, surveyAnswers: {} });
  },
}));
