import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ExternalLink, CheckCircle2, XCircle, Clock, Flame, Lightbulb } from "lucide-react";
import {
  calculateIngredientMatch,
  extractRecipeIngredients,
} from "@/lib/ingredientMatcher";

interface RecipeModalProps {
  recipeId: string | null;
  userIngredients?: string[];
  onClose: () => void;
}

export const RecipeModal = ({
  recipeId,
  userIngredients = [],
  onClose,
}: RecipeModalProps) => {
  const { data: recipe, isLoading } = useQuery({
    queryKey: ["recipe", recipeId],
    queryFn: async () => {
      if (!recipeId) return null;
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`
      );
      const data = await response.json();
      return data.meals?.[0];
    },
    enabled: !!recipeId,
  });

  const getIngredients = () => {
    if (!recipe) return [];
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push(`${measure} ${ingredient}`);
      }
    }
    return ingredients;
  };

  const ingredientMatch =
    recipe && userIngredients.length > 0
      ? calculateIngredientMatch(
          userIngredients,
          extractRecipeIngredients(recipe)
        )
      : null;

  // Mock nutrition data - in production, integrate with a nutrition API
  const nutritionData = {
    prepTime: "20 mins",
    cookTime: "30 mins",
    difficulty: "Medium",
    servings: "4",
    calories: "350",
    protein: "12g",
    carbs: "45g",
    fat: "8g",
  };

  // AI suggestion based on recipe
  const aiSuggestion = "Pair this with a fresh side salad and whole wheat bread for a complete meal!";

  return (
    <Dialog open={!!recipeId} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading recipe details...</p>
          </div>
        ) : recipe ? (
          <>
            {/* Hero Image Section */}
            <div className="relative h-64 md:h-80 overflow-hidden group">
              <img
                src={recipe.strMealThumb}
                alt={recipe.strMeal}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              
              {/* Header Overlay */}
              <DialogHeader className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-3">
                <DialogTitle className="text-3xl md:text-4xl font-bold text-balance">
                  {recipe.strMeal}
                </DialogTitle>
                <div className="flex flex-wrap gap-2">
                  {recipe.strCategory && (
                    <Badge className="gradient-accent text-white animate-slide-in-left">
                      {recipe.strCategory}
                    </Badge>
                  )}
                  {recipe.strArea && (
                    <Badge className="bg-white/20 backdrop-blur-md border border-white/30 text-white">
                      🌍 {recipe.strArea}
                    </Badge>
                  )}
                  {recipe.strTags?.split(",").slice(0, 2).map((tag: string) => (
                    <Badge key={tag} className="bg-white/20 backdrop-blur-md border border-white/30 text-white">
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              </DialogHeader>
            </div>

            <ScrollArea className="max-h-[calc(90vh-320px)] overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Quick Info Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Card className="card-premium p-4 text-center space-y-2 border-primary/20">
                    <Clock className="w-5 h-5 mx-auto text-primary" />
                    <p className="text-xs text-muted-foreground">Prep Time</p>
                    <p className="font-bold">{nutritionData.prepTime}</p>
                  </Card>

                  <Card className="card-premium p-4 text-center space-y-2 border-accent/20">
                    <Flame className="w-5 h-5 mx-auto text-accent" />
                    <p className="text-xs text-muted-foreground">Calories</p>
                    <p className="font-bold">{nutritionData.calories}</p>
                  </Card>

                  <Card className="card-premium p-4 text-center space-y-2 border-primary/20">
                    <p className="text-xs text-muted-foreground">Difficulty</p>
                    <p className="font-bold text-sm">{nutritionData.difficulty}</p>
                    <p className="text-xs">⭐⭐⭐</p>
                  </Card>

                  <Card className="card-premium p-4 text-center space-y-2 border-accent/20">
                    <p className="text-xs text-muted-foreground">Servings</p>
                    <p className="font-bold">{nutritionData.servings}</p>
                    <p className="text-xs">👥</p>
                  </Card>
                </div>

                {/* Nutrition Breakdown */}
                <Card className="card-premium p-6 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground">
                    <Flame className="w-5 h-5 text-accent" />
                    Nutrition Info (Per Serving)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Protein", value: nutritionData.protein, color: "text-red-500" },
                      { label: "Carbs", value: nutritionData.carbs, color: "text-blue-500" },
                      { label: "Fat", value: nutritionData.fat, color: "text-green-500" },
                      { label: "Total", value: nutritionData.calories, color: "text-amber-500" },
                    ].map((item) => (
                      <div key={item.label} className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                        <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Ingredient Match */}
                {ingredientMatch && (
                  <Card className="card-premium p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-primary">
                        ✨ Ingredient Match
                      </h3>
                      <Badge
                        className={`text-lg font-bold px-4 py-2 ${
                          ingredientMatch.matchPercentage >= 80
                            ? "gradient-accent text-white"
                            : ingredientMatch.matchPercentage >= 50
                            ? "bg-yellow-500 text-white"
                            : "bg-orange-500 text-white"
                        }`}
                      >
                        {ingredientMatch.matchPercentage}%
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground">
                      You have <span className="font-bold text-primary">{ingredientMatch.availableIngredients.length}</span> out
                      of <span className="font-bold">{ingredientMatch.totalIngredients}</span> ingredients
                    </p>
                  </Card>
                )}

                {/* Ingredients */}
                <div>
                  <h3 className="text-lg font-bold mb-4 text-foreground">
                    📋 {ingredientMatch ? "All Ingredients" : "Ingredients"}
                  </h3>
                  {ingredientMatch ? (
                    <div className="space-y-4">
                      {ingredientMatch.availableIngredients.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2 text-green-600 dark:text-green-400">
                            <CheckCircle2 className="h-4 w-4" />
                            Available ({ingredientMatch.availableIngredients.length})
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {getIngredients()
                              .filter((ing) =>
                                ingredientMatch.availableIngredients.some(
                                  (avail) => ing.includes(avail)
                                )
                              )
                              .map((ingredient, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 text-sm bg-green-50 dark:bg-green-950/20 p-3 rounded-lg border border-green-200 dark:border-green-900/30"
                                >
                                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                                  <span>{ingredient}</span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                      {ingredientMatch.missingIngredients.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2 text-orange-600 dark:text-orange-400">
                            <XCircle className="h-4 w-4" />
                            Missing ({ingredientMatch.missingIngredients.length})
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {getIngredients()
                              .filter((ing) =>
                                ingredientMatch.missingIngredients.some(
                                  (miss) => ing.includes(miss)
                                )
                              )
                              .map((ingredient, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 text-sm bg-orange-50 dark:bg-orange-950/20 p-3 rounded-lg border border-orange-200 dark:border-orange-900/30"
                                >
                                  <XCircle className="h-4 w-4 text-orange-600 flex-shrink-0" />
                                  <span>{ingredient}</span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {getIngredients().map((ingredient, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm p-2 rounded bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <span className="w-2 h-2 rounded-full bg-primary" />
                          {ingredient}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Instructions */}
                <div>
                  <h3 className="text-lg font-bold mb-4 text-foreground">
                    👨‍🍳 Instructions
                  </h3>
                  <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                      {recipe.strInstructions}
                    </p>
                  </div>
                </div>

                {/* AI Suggestion */}
                <Card className="card-premium p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-900/30">
                  <div className="flex gap-3">
                    <Lightbulb className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-purple-900 dark:text-purple-200 text-sm mb-1">
                        🤖 AI Chef Tip
                      </p>
                      <p className="text-sm text-purple-800 dark:text-purple-300">
                        {aiSuggestion}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Video Link */}
                {recipe.strYoutube && (
                  <Button
                    asChild
                    className="w-full btn-premium gradient-accent text-white"
                  >
                    <a
                      href={recipe.strYoutube}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Watch Video Tutorial on YouTube
                    </a>
                  </Button>
                )}
              </div>
            </ScrollArea>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
