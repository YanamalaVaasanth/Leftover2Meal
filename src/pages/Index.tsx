import { useState, useMemo, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { SearchBar } from "@/components/SearchBar";
import { RecipeGrid } from "@/components/RecipeGrid";
import { RecipeModal } from "@/components/RecipeModal";
import { CategoryFilter } from "@/components/CategoryFilter";
import { AIChat } from "@/components/AIChat";
import DietScheduler from "../components/DietScheduler";
import HomeMedicine from "../components/HomeMedicine";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bot, ArrowRight, Zap, Leaf, Drumstick, ShieldPlus, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/clerk-react";

const Index = () => {
  const { isSignedIn, isLoaded } = useUser();
  
  // --- Navigation & Feature States ---
  const [selectedFeature, setSelectedFeature] = useState("diet");
  const [dietaryPreference, setDietaryPreference] = useState<"veg" | "non-veg" | null>(null);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  
  // --- Search & Filter States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [defaultRecipes, setDefaultRecipes] = useState([]);

  // --- Dynamic Theme Engine (Liquid Logic) ---
  const themeColor = dietaryPreference === "veg" ? "emerald" : dietaryPreference === "non-veg" ? "orange" : "slate";

  // --- Fetch Default Recipes on Mount ---
  useEffect(() => {
    const fetchDefaultRecipes = async () => {
      try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=a`);
        const data = await res.json();
        setDefaultRecipes(data.meals || []);
      } catch (error) {
        console.error("Failed to fetch default recipes:", error);
      }
    };

    if (isLoaded) {
      fetchDefaultRecipes();
    }
  }, [isLoaded]);

  // --- API Search Hook ---
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ["recipes", searchTerm, selectedCategory],
    queryFn: async () => {
      let url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`;
      
      // If category is selected, fetch by category instead
      if (selectedCategory && !searchTerm) {
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`;
      }
      
      const res = await fetch(url);
      const data = await res.json();
      return data.meals;
    },
    enabled: isLoaded,
  });

  // --- Layout Positioning & Content Rendering ---
  const renderContent = () => {
    // Stage 1: The Personalization Gateway
    if (!dietaryPreference) {
      return (
        <section className="min-h-[60vh] flex flex-col items-center justify-center animate-scale-in">
          <div className="glass p-12 rounded-[48px] border-white/20 shadow-2xl text-center max-w-4xl w-full">
            <h2 className="text-4xl font-black mb-4 tracking-tight">Select Your Diet Plan</h2>
            <p className="text-slate-500 mb-12">Choose your dietary preference to get started with your personalized meal plan.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <button
                onClick={() => setDietaryPreference("veg")}
                className="group p-10 rounded-[32px] bg-emerald-500/5 border-2 border-emerald-500/10 hover:border-emerald-500 transition-all duration-500 hover:scale-[1.05]"
              >
                <Leaf className="w-16 h-16 text-emerald-500 mx-auto mb-4 group-hover:rotate-12 transition-transform" />
                <h3 className="text-2xl font-bold text-emerald-700">Pure Veg</h3>
                <p className="text-sm text-slate-400 mt-2">Plant-based meal plans</p>
              </button>

              <button
                onClick={() => setDietaryPreference("non-veg")}
                className="group p-10 rounded-[32px] bg-orange-500/5 border-2 border-orange-500/10 hover:border-orange-500 transition-all duration-500 hover:scale-[1.05]"
              >
                <Drumstick className="w-16 h-16 text-orange-500 mx-auto mb-4 group-hover:-rotate-12 transition-transform" />
                <h3 className="text-2xl font-bold text-orange-700">Protein Power</h3>
                <p className="text-sm text-slate-400 mt-2">Meat & protein-based plans</p>
              </button>
            </div>
          </div>
        </section>
      );
    }

    // Stage 2: Feature Routing
    switch (selectedFeature) {
      case "diet":
        return <DietScheduler preference={dietaryPreference} />;
      case "medicine":
        return <HomeMedicine />;
      case "ai":
        return (
          <div className="space-y-12 animate-fade-in">
            <div className="max-w-4xl mx-auto text-center space-y-6 pt-12">
              <h2 className="text-4xl font-bold text-slate-900">AI Cooking Assistant</h2>
              <p className="text-lg text-slate-500">Chat with our AI assistant to get cooking suggestions and recipes</p>
              <Button onClick={() => setIsAIChatOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-8 py-6 text-lg font-bold">
                <Bot className="mr-2" /> Open AI Cooking Assistant
              </Button>
            </div>
          </div>
        );
      case "recipes":
        return (
          <div className="space-y-12 animate-fade-in">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="glass p-4 rounded-3xl">
                <SearchBar onSearch={setSearchTerm} isLoading={isSearching} />
              </div>
              <CategoryFilter 
                selectedCategory={selectedCategory} 
                onCategoryChange={setSelectedCategory} 
                dietaryPreference={dietaryPreference} 
              />
              <div className="flex justify-center gap-4">
                <Button onClick={() => setIsAIChatOpen(true)} className={`bg-${themeColor}-500 hover:bg-${themeColor}-600 text-white rounded-2xl px-10 py-7 text-lg font-bold shadow-xl shadow-${themeColor}-200`}>
                  <Bot className="mr-2" /> Find with AI Chef
                </Button>
                <Button variant="outline" onClick={() => setDietaryPreference(null)} className="rounded-2xl px-6 py-7 border-slate-200 font-semibold">
                  Change Preference
                </Button>
              </div>
            </div>
            <RecipeGrid recipes={searchResults || defaultRecipes} onRecipeClick={setSelectedRecipeId} />
          </div>
        );
      default:
        return <DietScheduler preference={dietaryPreference} />;
    }
  };

  return (
    <div className={`min-h-screen bg-white transition-all duration-1000 ${dietaryPreference === 'veg' ? 'bg-emerald-50/30' : dietaryPreference === 'non-veg' ? 'bg-orange-50/30' : ''}`}>
      <Navbar onFeatureSelect={setSelectedFeature} selectedFeature={selectedFeature} />
      
      <main className="container-premium pb-32">
        {/* 🚀 Stunning Hero Section */}
        <section className="relative pt-40 pb-20 px-6 text-center overflow-hidden">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-400/10 blur-[120px] rounded-full -z-10" />
          
          <div className="max-w-5xl mx-auto space-y-6">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-${themeColor}-50 text-${themeColor}-600 text-xs font-bold uppercase tracking-widest border border-${themeColor}-100`}>
              <Sparkles className="w-3 h-3" /> Personalized Health v3.0
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-slate-900">
              Reach Your <br />
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${dietaryPreference === 'veg' ? 'from-emerald-500 to-teal-400' : dietaryPreference === 'non-veg' ? 'from-orange-500 to-rose-400' : 'from-slate-500 to-slate-400'} transition-all duration-700`}>
                {dietaryPreference ? 'Goal Weight' : 'Health Goals'}
              </span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
              {dietaryPreference 
                ? 'Track your progress with personalized meal plans and weight monitoring.'
                : 'Create a customized diet plan tailored to your body metrics and preferences.'}
            </p>

            {/* Live Stats UI */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto pt-8">
              {([
                { n: "1000+", l: "Recipes" },
                { n: "24/7", l: "Support" },
                { n: "100%", l: "Safe" }
              ]).map((s, i) => (
                <div key={i} className="glass p-4 rounded-2xl border-slate-100 shadow-xl">
                  <p className={`text-2xl font-black text-${themeColor}-600`}>{s.n}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 🧩 Dynamic Feature Rendering */}
        <div className="mt-12">
          {renderContent()}
        </div>
      </main>

      {/* 🔮 Fixed AI Toggle (FAB) */}
      <button 
        onClick={() => setIsAIChatOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition active:scale-95 z-50 group"
      >
        <Bot className="group-hover:animate-bounce" />
      </button>

      {/* 🖼️ Modals & Overlays */}
      <RecipeModal recipeId={selectedRecipeId} onClose={() => setSelectedRecipeId(null)} />
      <AIChat open={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />

      {/* Elegant Footer */}
      <footer className="py-12 border-t border-slate-100 text-center opacity-50">
        <p className="text-sm font-bold tracking-widest uppercase">ImpactX Labs © 2026</p>
      </footer>
    </div>
  );
};

export default Index;