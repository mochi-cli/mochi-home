"use client";

import React, { createContext, useContext, useState } from "react";

export const MOCHI_VERSION = "main";

export interface Engine {
  slug: string;
  label: string;
}

// The real install targets Mochi supports — one `install <slug>` per agent.
export const ALL_ENGINES: Engine[] = [
  { slug: "claude-code", label: "CLAUDE CODE" },
  { slug: "claude-desktop", label: "CLAUDE DESKTOP" },
  { slug: "opencode", label: "OPENCODE" },
  { slug: "hermes-agent", label: "HERMES-AGENT" },
];

interface EngineContextType {
  selectedEngine: Engine;
  selectEngine: (slug: string) => void;
  /** the exact command shown/copied, e.g. `npx --yes github:mochi-cli/mochi#v0.2.20 install claude-code` */
  installCommand: string;
}

const EngineContext = createContext<EngineContextType | undefined>(undefined);

export function EngineProvider({ children }: { children: React.ReactNode }) {
  const [selectedEngine, setSelectedEngine] = useState<Engine>(ALL_ENGINES[0]);

  const selectEngine = (slug: string) => {
    const engine = ALL_ENGINES.find((e) => e.slug === slug);
    if (engine) setSelectedEngine(engine);
  };

  const installCommand = `npx --yes github:mochi-cli/mochi#${MOCHI_VERSION} install ${selectedEngine.slug}`;

  return (
    <EngineContext.Provider value={{ selectedEngine, selectEngine, installCommand }}>
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
