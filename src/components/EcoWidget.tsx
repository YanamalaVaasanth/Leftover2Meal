import React, { useEffect, useState } from "react";

export const EcoWidget: React.FC = () => {
  const [co2, setCo2] = useState(0);
  const [waste, setWaste] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCo2((c) => +(c + 0.021).toFixed(2));
      setWaste((w) => +(w + 0.008).toFixed(2));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-8 left-8 z-50 bg-white/5 border border-white/10 backdrop-blur-[24px] rounded-2xl px-8 py-6 shadow-liquid-glass flex flex-col items-center gap-2 animate-fade-in">
      <span className="text-xs text-emerald-400 font-semibold tracking-wider">Eco Impact</span>
      <div className="flex gap-6 items-center">
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-emerald-300">{co2} kg</span>
          <span className="text-xs text-muted-foreground">CO₂ Saved</span>
        </div>
        <div className="w-px h-8 bg-white/10 mx-2" />
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-yellow-400">{waste} kg</span>
          <span className="text-xs text-muted-foreground">Food Waste</span>
        </div>
      </div>
    </div>
  );
};
