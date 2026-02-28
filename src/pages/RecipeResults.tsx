import React from "react";
import { Button } from "@/components/ui/button";

export const RecipeResults: React.FC<{
  recipes: any[];
  onRecipeClick: (id: string) => void;
  onAIClick: () => void;
}> = ({ recipes, onRecipeClick, onAIClick }) => {
  return (
    <section className="relative min-h-[40vh] bg-[#0F172A]/90 py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {recipes.map((r) => (
          <div
            key={r.id}
            className="rounded-2xl bg-[#0F172A]/80 border border-white/10 shadow-liquid-glass backdrop-blur-[20px] p-6 flex flex-col items-center transition-all hover:scale-105 cursor-pointer"
            style={{boxShadow: "0 0 20px #10B98140, 0 8px 32px 0 rgba(31,38,135,0.37)"}}
            onClick={() => onRecipeClick(r.id)}
          >
            <img src={r.image} alt={r.title} className="w-32 h-32 object-cover rounded-full mb-4 shadow-emerald-glow" />
            <h3 className="text-xl font-bold text-white mb-2">{r.title}</h3>
            <p className="text-emerald-200/80 text-sm mb-2">{r.desc}</p>
          </div>
        ))}
      </div>
      <Button
        className="fixed bottom-8 right-8 z-50 rounded-full bg-emerald-500 text-white shadow-emerald-glow px-8 py-4 text-lg font-bold animate-float"
        onClick={onAIClick}
      >
        Find with AI
      </Button>
    </section>
  );
};
