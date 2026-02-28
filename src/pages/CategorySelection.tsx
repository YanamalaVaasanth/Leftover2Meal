import React from "react";

export const CategorySelection: React.FC<{
  onSelect: (cat: "veg" | "non-veg") => void;
  selected: "veg" | "non-veg" | null;
}> = ({ onSelect, selected }) => {
  return (
    <section className="flex flex-col items-center justify-center min-h-[40vh] bg-transparent py-12">
      <div className="flex gap-8">
        {[
          { label: "Vegetarian", value: "veg", emoji: "🥗" },
          { label: "Protein+", value: "non-veg", emoji: "🍗" },
        ].map((cat) => (
          <button
            key={cat.value}
            onClick={() => onSelect(cat.value as "veg" | "non-veg")}
            className={`relative w-64 h-64 rounded-3xl flex flex-col items-center justify-center text-3xl font-bold bg-[#0F172A]/70 border border-white/10 shadow-liquid-glass backdrop-blur-[20px] transition-all duration-300 hover:scale-105 focus:scale-105 outline-none ${selected === cat.value ? "ring-4 ring-emerald-500/40 shadow-emerald-glow" : ""}`}
            style={{boxShadow: selected === cat.value ? "0 0 40px 8px #10B981, 0 8px 32px 0 rgba(31,38,135,0.37)" : undefined}}
          >
            <span className="text-6xl mb-4">{cat.emoji}</span>
            {cat.label}
            {selected === cat.value && (
              <span className="absolute inset-0 rounded-3xl pointer-events-none border-2 border-emerald-400/40 animate-pulse-slow" />
            )}
          </button>
        ))}
      </div>
    </section>
  );
};
