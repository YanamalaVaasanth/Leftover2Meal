import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChefHat } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SearchBarProps {
  onSearch: (term: string, isIngredientSearch: boolean) => void;
  isLoading?: boolean;
}

export const SearchBar = ({ onSearch, isLoading }: SearchBarProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isIngredientMode, setIsIngredientMode] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim(), isIngredientMode);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2 justify-center">
        <Badge
          onClick={() => setIsIngredientMode(false)}
          className={`cursor-pointer px-4 py-2 transition-all ${
            !isIngredientMode
              ? "gradient-primary"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <Search className="mr-1 h-3 w-3" />
          Recipe Name
        </Badge>
        <Badge
          onClick={() => setIsIngredientMode(true)}
          className={`cursor-pointer px-4 py-2 transition-all ${
            isIngredientMode
              ? "gradient-primary"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <ChefHat className="mr-1 h-3 w-3" />
          
        </Badge>
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2 w-full">
        <Input
          type="text"
          placeholder={
            isIngredientMode
              ? "Enter ingredients (e.g., 'chicken, rice, tomato')"
              : "Search by recipe name (e.g., 'pasta')"
          }
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 h-12 text-base shadow-md border-2 focus-visible:ring-primary"
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="gradient-primary hover:opacity-90 transition-opacity h-12 px-6 shadow-lg text-base font-semibold"
        >
          {isIngredientMode ? (
            <>
              <ChefHat className="mr-2 h-5 w-5" />
              Match
            </>
          ) : (
            <>
              <Search className="mr-2 h-5 w-5" />
              Search
            </>
          )}
        </Button>
      </form>
    </div>
  );
};
