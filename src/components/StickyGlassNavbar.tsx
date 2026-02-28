import React from "react";
import { Command } from "lucide-react";

export const StickyGlassNavbar: React.FC<{
  onCommandPalette: () => void;
  accent: "emerald" | "amber";
}> = ({ onCommandPalette, accent }) => {
  return (
    <nav className={`navbar-glass navbar-blur-on-scroll sticky top-0 z-50 w-full transition-all duration-300 bg-[#0F172A]/80 border-b border-white/10 backdrop-blur-[24px] shadow-liquid-glass`}> 
      <div className="container-premium flex items-center justify-between py-4 px-8">
        <div className="font-extrabold text-2xl tracking-tight select-none text-white">
          Leftover2Meal
        </div>
        <div className="flex items-center gap-8">
          <button
            className={`flex items-center gap-2 px-6 py-2 rounded-xl font-semibold text-base shadow-${accent}-glow bg-${accent}-500/20 text-${accent}-400 hover:bg-${accent}-500/40 transition-all`}
            onClick={onCommandPalette}
            tabIndex={0}
            aria-label="Open Command Palette (Ctrl+K)"
          >
            <Command className="w-5 h-5" />
            <span>Command Palette</span>
            <span className="ml-2 text-xs bg-white/10 px-2 py-1 rounded">Ctrl+K</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
