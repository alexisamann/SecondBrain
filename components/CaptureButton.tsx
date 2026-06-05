"use client";

import { useState } from "react";
import { Mic, Square } from "lucide-react";

export function CaptureButton() {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={isPressed}
      onClick={() => setIsPressed((current) => !current)}
      className="group flex aspect-square w-52 max-w-[68vw] flex-col items-center justify-center rounded-full border border-black/10 bg-ink text-paper shadow-soft transition duration-200 active:scale-[0.98]"
    >
      <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-paper/10">
        {isPressed ? (
          <Square aria-hidden="true" className="h-8 w-8 fill-paper" strokeWidth={2} />
        ) : (
          <Mic aria-hidden="true" className="h-9 w-9" strokeWidth={1.9} />
        )}
      </span>
      <span className="text-2xl font-semibold">
        {isPressed ? "Platzhalter" : "Sprich los"}
      </span>
      <span className="mt-2 text-sm text-paper/68">
        {isPressed ? "Noch keine Aufnahme aktiv" : "Tippen zum Testen"}
      </span>
    </button>
  );
}
