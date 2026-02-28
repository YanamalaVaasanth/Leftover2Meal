import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { calculateIngredientMatch, extractRecipeIngredients } from "@/lib/ingredientMatcher";

interface RecipeCardProps {
  id: string;
  title: string;
  image: string;
  category?: string;
  area?: string;
  userIngredients?: string[];
  onClick: () => void;
}

export const RecipeCard = ({
  id,
  title,
  image,
  category,
  area,
  userIngredients = [],
  onClick,
}: RecipeCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  // Fetch full recipe details if we need to calculate match percentage
  const { data: recipeDetails } = useQuery({
    queryKey: ["recipeDetails", id],
    queryFn: async () => {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
      );
      const data = await response.json();
      return data.meals?.[0];
    },
    enabled: userIngredients.length > 0,
  });

  const ingredientMatch = recipeDetails && userIngredients.length > 0
    ? calculateIngredientMatch(
        userIngredients,
        extractRecipeIngredients(recipeDetails)
      )
    : null;

  // 3D Tilt effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / rect.height) * -15;
    const rotY = ((x - centerX) / rect.width) * 15;

    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: "transform 0.1s ease-out",
      }}
    >
      <Card
        className="overflow-hidden cursor-pointer h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 card-premium group"
        onClick={onClick}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden h-56 bg-muted">
          {/* Image with zoom animation */}
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1"
            loading="lazy"
          />

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges Container */}
          <div className="absolute top-3 right-3 flex gap-2 flex-wrap justify-end">
            {ingredientMatch && (
              <Badge
                className={`shadow-lg font-bold text-sm animate-pop ${
                  ingredientMatch.matchPercentage >= 80
                    ? "gradient-accent text-white"
                    : ingredientMatch.matchPercentage >= 50
                    ? "bg-yellow-500 text-white"
                    : "bg-orange-500 text-white"
                }`}
              >
                {ingredientMatch.matchPercentage}% ✓
              </Badge>
            )}
            {category && (
              <Badge className="shadow-lg bg-gradient-accent text-white animate-slide-in-right">
                {category}
              </Badge>
            )}
          </div>

          {/* Quick Action Buttons - appear on hover */}
          <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
            <Button
              size="sm"
              variant="secondary"
              className="rounded-full shadow-lg bg-white dark:bg-slate-900 hover:scale-110 transition-transform"
              onClick={(e) => {
                e.stopPropagation();
                setIsFavorite(!isFavorite);
              }}
            >
              <Heart
                className={`w-4 h-4 ${
                  isFavorite
                    ? "fill-red-500 text-red-500"
                    : "text-foreground"
                }`}
              />
            </Button>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4 space-y-3">
          {/* Title */}
          <h3 className="font-bold text-lg line-clamp-2 text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>

          {/* Area/Cuisine */}
          {area && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>🌍</span>
              <span className="font-medium">{area}</span>
            </div>
          )}

          {/* Ingredient Match Info */}
          {ingredientMatch && (
            <div className="space-y-2 pt-2 border-t border-border">
              {/* Match bars */}
              <div className="bg-gradient-to-r from-accent/20 to-primary/20 rounded-lg p-2 space-y-1.5">
                <div className="flex text-xs font-semibold justify-between">
                  <span>✓ Available</span>
                  <span className="text-accent">
                    {ingredientMatch.availableIngredients.length}
                  </span>
                </div>
                <div className="flex text-xs font-semibold justify-between">
                  <span>✗ Missing</span>
                  <span className="text-orange-500">
                    {ingredientMatch.missingIngredients.length}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
