"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleGenAI } from "@google/genai";

interface DietSchedulerProps {
  preference?: string;
}

interface Meal {
  name: string;
  calories: number;
  description: string;
  ingredients?: string[];
  recipe?: string;
}

interface DayPlan {
  day: number;
  date: string;
  meals: Meal[];
  totalCalories: number;
  dayTip?: string;
}

const DietScheduler: React.FC<DietSchedulerProps> = ({ preference }) => {
  const [expandedDay, setExpandedDay] = useState<number>(1);
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const [mealPlan, setMealPlan] = useState<DayPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState<number>(0);

  const [currentWeight, setCurrentWeight] = useState<string>("");
  const [targetWeight, setTargetWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [showWeightForm, setShowWeightForm] = useState<boolean>(true);

  useEffect(() => {
    if (!showWeightForm) generateMealPlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preference, showWeightForm]);

  const generateMealPlan = async () => {
    try {
      setLoading(true);
      setError(null);
      setGenerationProgress(0);

      const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      const GEMINI_MODEL = "gemini-3-flash-preview";

      if (!GEMINI_API_KEY) {
        throw new Error("Gemini API key is not configured");
      }

      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      const dietType = preference === "veg" ? "vegetarian" : "non-vegetarian";
      const bmi = parseFloat(currentWeight) / Math.pow(parseFloat(height) / 100, 2);
      const weightToLose = parseFloat(currentWeight) - parseFloat(targetWeight);

      // Generate all 7 days in a single fast call with optimized prompt
      const prompt = `Generate a compact 7-day ${dietType} meal plan. Return ONLY valid JSON, no other text.
Weight: ${currentWeight}kg → ${targetWeight}kg (${weightToLose.toFixed(1)}kg loss). BMI: ${bmi.toFixed(1)}
Daily: 1500 cal (B:375, L:525, S:150, D:450)

{"days":[${Array.from({length: 7}, (_, i) => `{"day":${i+1},"dayTip":"Health tip","meals":[{"name":"Breakfast","calories":375,"description":"Meal","ingredients":["a","b"],"recipe":"Steps"},{"name":"Lunch","calories":525,"description":"Meal","ingredients":["a","b"],"recipe":"Steps"},{"name":"Snack","calories":150,"description":"Meal","ingredients":["a"],"recipe":"Steps"},{"name":"Dinner","calories":450,"description":"Meal","ingredients":["a","b"],"recipe":"Steps"}]}`).join(",")}]}`;

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
      });

      const responseText = response.text;
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error("Invalid response format");
      }

      const mealData = JSON.parse(jsonMatch[0]);
      const plans: DayPlan[] = mealData.days.map((day: any, index: number) => {
        setGenerationProgress(((index + 1) / 7) * 100);
        return {
          day: day.day,
          date: `Day ${day.day}`,
          meals: day.meals || [],
          totalCalories: day.meals?.reduce((sum: number, meal: any) => sum + (meal.calories || 0), 0) || 1500,
          dayTip: day.dayTip,
        };
      });

      setMealPlan(plans);
      setGenerationProgress(100);
    } catch (err) {
      console.error("Error generating meal plan:", err);
      setError("Failed to generate meal plan. Please try again.");
    } finally {
      setLoading(false);
      setGenerationProgress(0);
    }
  };

  const handleWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentWeight && targetWeight && height) {
      setShowWeightForm(false);
    }
  };

  const weightDiff =
    parseFloat(currentWeight) - parseFloat(targetWeight);
  const bmi =
    parseFloat(height) > 0
      ? parseFloat(currentWeight) /
        Math.pow(parseFloat(height) / 100, 2)
      : 0;

  if (error) {
    return (
      <div className="text-center py-12 text-red-600 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-6">

      {/* Weight Form */}
      {showWeightForm && (
        <Card className="p-8 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
          <h2 className="text-2xl font-bold mb-6">
            🎯 Personal Weight Tracking
          </h2>

          <form onSubmit={handleWeightSubmit} className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Input
                type="number"
                placeholder="Current Weight (kg)"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(e.target.value)}
                required
              />
              <Input
                type="number"
                placeholder="Target Weight (kg)"
                value={targetWeight}
                onChange={(e) => setTargetWeight(e.target.value)}
                required
              />
              <Input
                type="number"
                placeholder="Height (cm)"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                required
              />
            </div>

            {currentWeight && targetWeight && height && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white rounded-lg">
                <div>
                  <p className="text-xs">Weight to Lose</p>
                  <p className="font-bold text-emerald-600">
                    {weightDiff.toFixed(1)} kg
                  </p>
                </div>
                <div>
                  <p className="text-xs">BMI</p>
                  <p className="font-bold text-blue-600">
                    {bmi.toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-xs">Daily Target</p>
                  <p className="font-bold text-amber-600">~1500 cal</p>
                </div>
                <div>
                  <p className="text-xs">Est. Weeks</p>
                  <p className="font-bold text-purple-600">
                    {(weightDiff / 0.5).toFixed(0)}
                  </p>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full">
              Generate 7-Day Meal Plan
            </Button>
          </form>
        </Card>
      )}

      {/* Meal Plan */}
      {!showWeightForm && (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold">
              📅 Your 7-Day Meal Plan
            </h2>
            <Button
              variant="outline"
              onClick={() => setShowWeightForm(true)}
            >
              Edit Weight
            </Button>
          </div>

          {loading && (
            <Card className="p-8 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
              <div className="text-center space-y-4">
                <div className="inline-block">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600"></div>
                </div>
                <div>
                  <p className="font-semibold text-emerald-900">
                    Generating your personalized meal plan...
                  </p>
                  <p className="text-sm text-emerald-700 mt-2">
                    Day {Math.ceil(generationProgress / 14.3)} of 7
                  </p>
                </div>
                <div className="w-full bg-emerald-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full transition-all duration-300 ease-out"
                    style={{ width: `${generationProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-emerald-600">
                  {Math.round(generationProgress)}%
                </p>
              </div>
            </Card>
          )}

          {!loading &&
            mealPlan.map((day) => (
              <Card key={day.day} className="p-6 hover:shadow-lg transition-shadow">
                {/* Day Header */}
                <div
                  onClick={() =>
                    setExpandedDay(
                      expandedDay === day.day ? 0 : day.day
                    )
                  }
                  className="cursor-pointer flex justify-between items-center pb-4 border-b"
                >
                  <div>
                    <h3 className="text-xl font-bold">
                      Day {day.day}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {day.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-emerald-600 text-lg">
                      {day.totalCalories} cal
                    </div>
                    <span className="text-xs text-muted-foreground">↓ Click to view</span>
                  </div>
                </div>

                {/* Day Tip */}
                {expandedDay === day.day && day.dayTip && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <p className="text-sm text-blue-700">
                      💡 <strong>Tip:</strong> {day.dayTip}
                    </p>
                  </div>
                )}

                {/* Meals */}
                {expandedDay === day.day && (
                  <div className="mt-4 space-y-3">
                    {day.meals.map((meal, idx) => (
                      <div key={idx}>
                        {/* Meal Header */}
                        <div
                          onClick={() =>
                            setExpandedMeal(
                              expandedMeal ===
                                `${day.day}-${meal.name}`
                                ? null
                                : `${day.day}-${meal.name}`
                            )
                          }
                          className="cursor-pointer flex justify-between items-center p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg hover:from-emerald-100 hover:to-teal-100 transition-colors"
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">
                              {meal.name}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              {meal.description}
                            </p>
                          </div>
                          <div className="text-right min-w-fit ml-4">
                            <p className="font-bold text-emerald-600">
                              {meal.calories} cal
                            </p>
                          </div>
                        </div>

                        {/* Meal Details */}
                        {expandedMeal ===
                          `${day.day}-${meal.name}` && (
                          <div className="mt-2 p-4 bg-white rounded-lg border border-emerald-200 space-y-3">
                            <div>
                              <h5 className="font-semibold text-sm mb-2">
                                📝 Description
                              </h5>
                              <p className="text-sm text-muted-foreground">
                                {meal.description}
                              </p>
                            </div>

                            {meal.ingredients && meal.ingredients.length > 0 && (
                              <div>
                                <h5 className="font-semibold text-sm mb-2">
                                  🥗 Ingredients
                                </h5>
                                <ul className="text-sm space-y-1">
                                  {meal.ingredients.map((ing, i) => (
                                    <li key={i} className="text-muted-foreground">
                                      ✓ {ing}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {meal.recipe && (
                              <div>
                                <h5 className="font-semibold text-sm mb-2">
                                  👨‍🍳 Cooking Instructions
                                </h5>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {meal.recipe}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))}
        </>
      )}
    </div>
  );
};

export default DietScheduler;