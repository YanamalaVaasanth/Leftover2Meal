import React from "react";

const REMEDIES = [
  { icon: "💧", label: "Hydration" },
  { icon: "🌿", label: "Herbs" },
  { icon: "🍋", label: "Vitamin C" },
  { icon: "🧄", label: "Garlic" },
  { icon: "🫚", label: "Ginger" },
  { icon: "🍯", label: "Honey" },
];

export const HomeRemedies: React.FC = () => {
  return (
    <section className="min-h-[40vh] bg-[#0F172A]/90 py-12 px-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
        {REMEDIES.map((r) => (
          <div
            key={r.label}
            className="flex flex-col items-center justify-center rounded-full bg-[#0F172A]/70 border border-white/10 shadow-liquid-glass backdrop-blur-[20px] w-40 h-40 mx-auto transition-all duration-300 hover:shadow-emerald-glow hover:scale-105 group cursor-pointer"
          >
            <span className="text-5xl mb-3 group-hover:animate-pulse-slow">{r.icon}</span>
            <span className="text-lg font-semibold text-white group-hover:text-emerald-400">{r.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
