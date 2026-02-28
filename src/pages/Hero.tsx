import React from "react";

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[60vh] flex flex-col items-center justify-center bg-[#0F172A] overflow-hidden">
      {/* Orbital Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[340px] h-[340px] rounded-full bg-emerald-500/10 blur-3xl animate-pulse-slow" style={{boxShadow: "0 0 80px 20px #10B981, 0 0 0 8px #0F172A inset"}} />
      </div>
      {/* Floating 3D Food Plate */}
      <div className="relative z-10 flex flex-col items-center">
        <img
          src="/public/food-plate-3d.png"
          alt="Floating Food Plate"
          className="w-48 h-48 object-contain drop-shadow-2xl animate-float"
          style={{filter: "drop-shadow(0 0 40px #10B981)"}}
        />
        <h1 className="mt-8 text-4xl md:text-6xl font-extrabold text-white text-center drop-shadow-lg">
          Stop Wasting Food.<br />Start Cooking Smart.
        </h1>
        <p className="mt-4 text-lg md:text-2xl text-emerald-200/80 text-center max-w-xl">
          AI-powered meal planning, recipe discovery, and wellness—all in one liquid glass dashboard.
        </p>
      </div>
    </section>
  );
};
