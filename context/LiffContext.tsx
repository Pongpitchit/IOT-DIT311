"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Profile = {
  userId?: string;
  displayName?: string;
  pictureUrl?: string;
};

type LiffContextType = {
  profile: Profile | null;
  setProfile: (p: Profile | null) => void;
};

const LiffContext = createContext<LiffContextType | undefined>(undefined);

export function LiffProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);

  return (
    <LiffContext.Provider value={{ profile, setProfile }}>
      {children}
    </LiffContext.Provider>
  );
}

export function useLiffProfile() {
  const ctx = useContext(LiffContext);
  if (!ctx) throw new Error("useLiffProfile must be used inside LiffProvider");
  return ctx;
}
