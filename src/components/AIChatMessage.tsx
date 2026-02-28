import { Bot, User, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Message {
  role: "user" | "assistant";
  content: string;
  recipeData?: {
    name: string;
    ingredients: string[];
    steps: string[];
    videoUrls?: string[];
  };
}

interface AIChatMessageProps {
  message: Message;
}

export const AIChatMessage = ({ message }: AIChatMessageProps) => {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2 max-w-[80%]">
          <div className="flex items-start gap-2">
            <User className="h-4 w-4 mt-0.5 shrink-0" />
            <p className="text-sm">{message.content}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="bg-muted rounded-lg px-4 py-2 max-w-[90%]">
        <div className="flex items-start gap-2 mb-2">
          <Bot className="h-4 w-4 mt-0.5 shrink-0" />
          <p className="text-sm">{message.content}</p>
        </div>
        
        {message.recipeData && (
          <Card className="mt-3 bg-card">
            <CardHeader>
              <CardTitle className="text-xl">{message.recipeData.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Ingredients */}
              <div>
                <h3 className="font-semibold mb-2 text-base">Ingredients Required:</h3>
                <div className="flex flex-wrap gap-2">
                  {message.recipeData.ingredients.map((ingredient, index) => (
                    <Badge key={index} variant="secondary">
                      {ingredient}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Steps */}
              <div>
                <h3 className="font-semibold mb-2 text-base">Step-by-Step Process:</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  {message.recipeData.steps.map((step, index) => (
                    <li key={index} className="leading-relaxed">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Video URLs */}
              {message.recipeData.videoUrls && message.recipeData.videoUrls.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 text-base">Recipe Videos:</h3>
                  <div className="space-y-2">
                    {message.recipeData.videoUrls.map((url, index) => {
                      const recipeName = message.recipeData?.name || 'recipe';
                      const buttonTexts = [
                        `Search "${recipeName}" on YouTube`,
                        `Search "${recipeName} tutorial" on YouTube`,
                        `Search "${recipeName}" recipes on YouTube`
                      ];
                      
                      return (
                        <Button
                          key={index}
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          {buttonTexts[index] || `Search on YouTube ${index + 1}`}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

