import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  dietaryPreference: "veg" | "non-veg";
}

const vegCategories = [
  { value: "", label: "All Recipes", emoji: "🥗" },
  { value: "Breakfast", label: "Breakfast", emoji: "🥞" },
  { value: "Vegetarian", label: "Lunch", emoji: "🥙" },
  { value: "Pasta", label: "Dinner", emoji: "🍝" },
  { value: "Dessert", label: "Dessert", emoji: "🍰" },
  { value: "Side", label: "Sides", emoji: "🥔" },
];

const nonVegCategories = [
  { value: "", label: "All Recipes", emoji: "🍽️" },
  { value: "Breakfast", label: "Breakfast", emoji: "🍳" },
  { value: "Chicken", label: "Lunch", emoji: "🍗" },
  { value: "Beef", label: "Dinner", emoji: "🥩" },
  { value: "Seafood", label: "Seafood", emoji: "🦐" },
  { value: "Lamb", label: "Lamb", emoji: "🍖" },
  { value: "Dessert", label: "Dessert", emoji: "🍰" },
];

export const CategoryFilter = ({
  selectedCategory,
  onCategoryChange,
  dietaryPreference,
}: CategoryFilterProps) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const categories = dietaryPreference === "veg" ? vegCategories : nonVegCategories;
  
  return (
    <div className="w-full">
      {/* Category Pills with Scroll */}
      <div className="flex flex-wrap gap-3 justify-center animate-fade-up p-4 rounded-2xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10 overflow-x-auto">
        {categories.map((category, idx) => {
          const isSelected = selectedCategory === category.value;
          const isHovered = hoveredCategory === category.value;

          return (
            <button
              key={category.value}
              onClick={() => onCategoryChange(category.value)}
              onMouseEnter={() => setHoveredCategory(category.value)}
              onMouseLeave={() => setHoveredCategory(null)}
              style={{
                animationDelay: `${idx * 0.05}s`,
              }}
              className={`
                relative px-4 py-2 rounded-full font-semibold text-sm 
                transition-all duration-300 transform
                flex items-center gap-2 whitespace-nowrap
                ${isSelected
                  ? "bg-gradient-accent text-white shadow-lg scale-105 glow-accent"
                  : isHovered
                  ? "bg-muted/80 text-foreground scale-105 shadow-md"
                  : "bg-white dark:bg-slate-900 text-foreground shadow-sm border border-border/50"
                }
              `}
            >
              {/* Background shimmer effect for selected */}
              {isSelected && (
                <div className="absolute inset-0 rounded-full opacity-20 animate-pulse" />
              )}

              {/* Icon with animation */}
              <span className={`text-lg transition-transform ${isHovered ? 'scale-125' : 'scale-100'}`}>
                {category.emoji}
              </span>

              {/* Label */}
              <span className="relative z-10">{category.label}</span>

              {/* Glow effect for selected */}
              {isSelected && (
                <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Floating Suggestions */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center text-xs">
        <div className="px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 font-semibold animate-fade-up">
          ⚡ Quick Pick
        </div>
        {selectedCategory && (
          <div className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold animate-slide-in-right">
            ✓ {categories.find(c => c.value === selectedCategory)?.label} selected
          </div>
        )}
      </div>
    </div>
  );
};
