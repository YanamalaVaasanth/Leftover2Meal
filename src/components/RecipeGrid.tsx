import { RecipeCard } from "./RecipeCard";

interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
}

interface RecipeGridProps {
  recipes: Recipe[];
  userIngredients?: string[];
  onRecipeClick: (id: string) => void;
}

export const RecipeGrid = ({ recipes, userIngredients = [], onRecipeClick }: RecipeGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
      {recipes.map((recipe, index) => (
        <div
          key={recipe.idMeal}
          style={{
            animationDelay: `${index * 50}ms`,
          }}
          className="animate-scale-in"
        >
          <RecipeCard
            id={recipe.idMeal}
            title={recipe.strMeal}
            image={recipe.strMealThumb}
            category={recipe.strCategory}
            area={recipe.strArea}
            userIngredients={userIngredients}
            onClick={() => onRecipeClick(recipe.idMeal)}
          />
        </div>
      ))}
    </div>
  );
};
