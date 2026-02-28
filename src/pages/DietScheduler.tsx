import React, { useState, useEffect } from 'react';
import { ChevronDown, Clock, Flame } from 'lucide-react';

interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
  strIngredient1?: string;
  strMeasure1?: string;
  [key: string]: any;
}

interface MealPlan {
  day: number;
  date: string;
  meals: {
    name: string;
    calories: number;
    recipe?: Recipe;
  }[];
}

const DietScheduler = ({ preference }: { preference?: "veg" | "non-veg" }) => {
  const [expandedDay, setExpandedDay] = useState<number>(1);
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const [mealPlan, setMealPlan] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateMealPlan();
  }, [preference]);

  const generateMealPlan = async () => {
    setLoading(true);
    const plans: MealPlan[] = [];
    const mealTypes = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];
    const calorieTargets: { [key: string]: number } = {
      'Breakfast': 375,
      'Lunch': 525,
      'Snack': 150,
      'Dinner': 450,
    };

    for (let day = 1; day <= 7; day++) {
      const dayPlan: MealPlan = {
        day,
        date: new Date(Date.now() + day * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        }),
        meals: [],
      };

      for (const mealType of mealTypes) {
        const recipe = await fetchRecipeByCalories(mealType, calorieTargets[mealType]);
        dayPlan.meals.push({
          name: mealType,
          calories: calorieTargets[mealType],
          recipe,
        });
      }

      plans.push(dayPlan);
    }

    setMealPlan(plans);
    setLoading(false);
  };

  const fetchRecipeByCalories = async (mealType: string, targetCalories: number) => {
    try {
      // Fetch a random recipe based on meal type
      const queries = {
        'Breakfast': ['Pancake', 'Omelette', 'Porridge', 'Toast'],
        'Lunch': ['Salad', 'Rice', 'Curry', 'Pasta'],
        'Snack': ['Fruit', 'Nuts', 'Yogurt', 'Smoothie'],
        'Dinner': ['Grilled', 'Stew', 'Baked', 'Soup'],
      };

      const queries_list = queries[mealType as keyof typeof queries] || ['Food'];
      const randomQuery = queries_list[Math.floor(Math.random() * queries_list.length)];

      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${randomQuery}`);
      const data = await res.json();

      if (data.meals && data.meals.length > 0) {
        return data.meals[0];
      }
      return null;
    } catch (error) {
      console.error('Failed to fetch recipe:', error);
      return null;
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading meal plans...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-fade-in">
      {mealPlan.map((day) => (
        <div key={day.day} className="glass rounded-2xl overflow-hidden">
          {/* Day Header */}
          <button
            onClick={() => setExpandedDay(expandedDay === day.day ? 0 : day.day)}
            className="w-full p-6 flex justify-between items-center hover:bg-white/5 transition"
          >
            <div className="flex items-center gap-4">
              <h3 className="text-2xl font-bold text-slate-900">Day {day.day}</h3>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                {day.date}
              </span>
            </div>
            <span className="text-2xl font-bold text-emerald-500">
              {day.meals.reduce((sum, m) => sum + m.calories, 0)} cal
            </span>
            <ChevronDown 
              className={`transition-transform ${expandedDay === day.day ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Day Meals */}
          {expandedDay === day.day && (
            <div className="border-t border-white/10 p-6 space-y-4">
              {day.meals.map((meal) => (
                <div key={meal.name} className="space-y-2">
                  {/* Meal Header */}
                  <button
                    onClick={() => setExpandedMeal(expandedMeal === `${day.day}-${meal.name}` ? null : `${day.day}-${meal.name}`)}
                    className="w-full p-4 bg-slate-50/50 rounded-xl flex justify-between items-center hover:bg-slate-100/50 transition"
                  >
                    <div className="flex justify-between w-full">
                      <h4 className="text-lg font-semibold text-slate-900">{meal.name}</h4>
                      <span className="text-emerald-600 font-bold flex items-center gap-2">
                        <Flame className="w-4 h-4" />
                        {meal.calories} cal
                      </span>
                    </div>
                  </button>

                  {/* Meal Recipe Details */}
                  {expandedMeal === `${day.day}-${meal.name}` && meal.recipe && (
                    <div className="mt-4 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl space-y-4">
                      <div className="flex gap-4">
                        <img 
                          src={meal.recipe.strMealThumb} 
                          alt={meal.recipe.strMeal}
                          className="w-32 h-32 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h5 className="text-xl font-bold text-slate-900 mb-2">{meal.recipe.strMeal}</h5>
                          <div className="flex items-center gap-4 text-sm text-slate-600">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" /> ~30 mins
                            </span>
                            <span className="flex items-center gap-1">
                              <Flame className="w-4 h-4" /> {meal.calories} calories
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Cooking Instructions */}
                      <div>
                        <h6 className="font-bold text-slate-900 mb-3">Step-by-Step Instructions:</h6>
                        <div className="space-y-3">
                          {meal.recipe.strInstructions
                            .split('.')
                            .filter((step: string) => step.trim())
                            .slice(0, 5)
                            .map((step: string, idx: number) => (
                              <div key={idx} className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                  {idx + 1}
                                </span>
                                <p className="text-slate-700 text-sm leading-relaxed">
                                  {step.trim()}
                                </p>
                              </div>
                            ))}
                        </div>
                      </div>

                      <button className="w-full mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition font-semibold">
                        Cook This Recipe
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DietScheduler;
