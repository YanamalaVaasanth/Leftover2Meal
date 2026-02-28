import React from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NAV_FEATURES = [
  { label: "Recipes", value: "recipes" },
  { label: "Diet Planner", value: "diet" },
  { label: "Home Medicine", value: "medicine" },
  { label: "AI Cooking Assistant", value: "ai" },
];

export const Navbar: React.FC<{
  onFeatureSelect: (feature: string) => void;
  selectedFeature: string;
}> = ({ onFeatureSelect, selectedFeature }) => {
  const navigate = useNavigate();

  const handleSelect = (feature: string) => {
    onFeatureSelect(feature);
    // Optionally navigate to a route if needed
    // navigate(`/${feature}`);
  };

  return (
    <nav className="navbar-glass navbar-blur-on-scroll sticky top-0 z-50 w-full">
      <div className="container-premium flex items-center justify-between py-2">
        <div className="font-bold text-xl gradient-text select-none"> ImpactX Labs</div>
        <NavigationMenu>
          <NavigationMenuList>
            {NAV_FEATURES.map((f) => (
              <NavigationMenuItem key={f.value}>
                <NavigationMenuTrigger
                  className={
                    selectedFeature === f.value
                      ? "bg-accent text-accent-foreground shadow-lg"
                      : ""
                  }
                  onClick={() => handleSelect(f.value)}
                >
                  {f.label}
                </NavigationMenuTrigger>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex gap-2">
          {/* Place for auth buttons or user menu */}
        </div>
      </div>
    </nav>
  );
};
