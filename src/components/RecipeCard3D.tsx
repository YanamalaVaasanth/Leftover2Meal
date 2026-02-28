import React, { useRef } from "react";

export const RecipeCard3D: React.FC<{
  recipe: {
    id: string;
    name: string;
    image: string;
    estimatedCalories: number;
    ingredients: string[];
  };
  accent: "emerald" | "amber";
  onClick: (id: string) => void;
}> = ({ recipe, accent, onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * -10;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (card) card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
  };

  return (
    <div
      ref={cardRef}
      className={`reveal bg-white/5 border border-white/10 backdrop-blur-[24px] rounded-2xl p-8 shadow-liquid-glass transition-transform duration-300 cursor-pointer hover:shadow-${accent}-glow`}
      style={{ minWidth: 280, minHeight: 340 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(recipe.id)}
    >
      <img
        src={recipe.image}
        alt={recipe.name}
        className="w-32 h-32 object-cover rounded-full mx-auto mb-6 shadow-lg"
        style={{ boxShadow: accent === "emerald" ? "0 0 32px #10B98180" : "0 0 32px #F59E0B80" }}
      />
      <h3 className="text-xl font-bold text-white text-center mb-2">{recipe.name}</h3>
      <div className={`text-sm font-semibold text-center mb-2 ${accent === "emerald" ? "text-emerald-400" : "text-amber-400"}`}>
        {recipe.estimatedCalories} kcal
      </div>
      <div className="flex flex-wrap gap-2 justify-center mt-2">
        {recipe.ingredients.slice(0, 4).map((ing, i) => (
          <span key={i} className={`px-3 py-1 rounded-full bg-${accent}-500/20 text-xs text-white/80`}>{ing}</span>
        ))}
      </div>
    </div>
  );
};
