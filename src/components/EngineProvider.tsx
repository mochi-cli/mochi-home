"use client";

import React, { createContext, useContext, useState } from "react";

interface EngineContextType {
  /** "ALL" or one of ALL_ENGINES — single-select, "ALL" by default */
  selectedEngine: string;
  selectEngine: (engine: string) => void;
  /** lowercase value used in the install command, e.g. "all" or "claude" */
  kitValue: string;
}

const EngineContext = createContext<EngineContextType | undefined>(undefined);

export const ALL_ENGINES = [
  "CLAUDE",
  "CODEX",
  "OPENCODE",
  "HERMES-AGENT",
  "OPENCLAW",
] as const;

export const ALL_OPTION = "ALL";

export function EngineProvider({ children }: { children: React.ReactNode }) {
  const [selectedEngine, setSelectedEngine] = useState<string>(ALL_OPTION);

  const selectEngine = (engine: string) => setSelectedEngine(engine);

  const kitValue = selectedEngine === ALL_OPTION ? "all" : selectedEngine.toLowerCase();

  return (
    <EngineContext.Provider value={{ selectedEngine, selectEngine, kitValue }}>
      {children}
    </EngineContext.Provider>
  );
}

export function useEngine() {
  const context = useContext(EngineContext);
  if (context === undefined) {
    throw new Error("useEngine must be used within an EngineProvider");
  }
  return context;
}
