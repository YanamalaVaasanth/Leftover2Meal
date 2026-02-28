import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Send, Loader2, CheckCircle2, XCircle, Mic, MicOff } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AIChatMessage } from "./AIChatMessage";
import { getGeminiRecipe } from "@/lib/geminiService";
import { transcribeAudio, stopRecognition } from "@/lib/whisperService";

// --- UPDATED SDK IMPORT ---
import { GoogleGenAI } from "@google/genai";

interface AIChatProps {
  open: boolean;
  onClose: () => void;
}

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

type Language = "english" | "telugu" | "tamil" | "hindi" | "kannada" | "malayalam";

const languageOptions: { value: Language; label: string; nativeName: string }[] = [
  { value: "english", label: "English", nativeName: "English" },
  { value: "telugu", label: "Telugu", nativeName: "తెలుగు" },
  { value: "tamil", label: "Tamil", nativeName: "தமிழ்" },
  { value: "hindi", label: "Hindi", nativeName: "हिंदी" },
  { value: "kannada", label: "Kannada", nativeName: "ಕನ್ನಡ" },
  { value: "malayalam", label: "Malayalam", nativeName: "മലയാളം" },
];

export const AIChat = ({ open, onClose }: AIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("english");
  const [isLoading, setIsLoading] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle");
  const [connectionMessage, setConnectionMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const testConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus("idle");
    setConnectionMessage("Testing connection...");

    try {
      // Use Vite environment variable
      const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      const GEMINI_MODEL = "gemini-3-flash-preview";

      if (!GEMINI_API_KEY) {
        throw new Error("VITE_GEMINI_API_KEY is not configured");
      }

      // --- NEW CLIENT INITIALIZATION ---
      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

      // --- NEW REQUEST SYNTAX ---
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: "Say 'Gemini 3 Connection Successful' in exactly 4 words.",
      });

      // In the new SDK, .text is a direct property, not a function
      const text = response.text;

      setConnectionStatus("success");
      setConnectionMessage(`✅ Success! Model says: "${text}"`);
    } catch (error: any) {
      setConnectionStatus("error");
      setConnectionMessage(`❌ Error: ${error.message || "Unknown error"}`);
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const recipeData = await getGeminiRecipe(input.trim(), selectedLanguage);
      
      const welcomeMessages: Record<Language, string> = {
        english: "Here's a recipe based on your ingredients:",
        telugu: "ఇక్కడ మీ పదార్థాల ఆధారంగా వంటకం:",
        tamil: "இங்கே உங்கள் பொருட்களின் அடிப்படையில் ஒரு செய்முறை:",
        hindi: "यहाँ आपकी सामग्री के आधार पर एक व्यंजन है:",
        kannada: "ಇಲ್ಲಿ ನಿಮ್ಮ ಪದಾರ್ಥಗಳ ಆಧಾರದ ಮೇಲೆ ಒಂದು ಪಾಕವಿಧಾನ:",
        malayalam: "ഇവിടെ നിങ്ങളുടെ ചേരുവകളുടെ അടിസ്ഥാനത്തിൽ ഒരു പാചകക്കുറിപ്പ്:",
      };
      
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: welcomeMessages[selectedLanguage],
        recipeData,
      }]);
    } catch (error) {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "Sorry, I couldn't generate that recipe. Please check your API key and model settings.",
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert("Speech recognition not supported in this browser.");
        return;
      }
      setIsRecording(true);
      setIsTranscribing(true);
      const text = await transcribeAudio(new Blob(), selectedLanguage);
      if (text) setInput(prev => prev ? `${prev} ${text}` : text);
      setIsRecording(false);
      setIsTranscribing(false);
    } catch (e) {
      setIsRecording(false);
      setIsTranscribing(false);
    }
  };

  const stopRecording = () => {
    stopRecognition();
    setIsRecording(false);
    setIsTranscribing(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">AI Cooking Assistant</DialogTitle>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-2">
              <Label htmlFor="language-select" className="text-sm font-medium">Language:</Label>
              <Select value={selectedLanguage} onValueChange={(v) => setSelectedLanguage(v as Language)}>
                <SelectTrigger id="language-select" className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((l) => (
                    <SelectItem key={l.value} value={l.value}>{l.nativeName} ({l.label})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={testConnection} disabled={isTestingConnection} variant="outline" size="sm">
              {isTestingConnection ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : "🔍"}
            </Button>
            {connectionStatus !== "idle" && (
               <div className={`flex items-center gap-1 text-xs ${connectionStatus === "success" ? "text-green-600" : "text-red-600"}`}>
                 {connectionStatus === "success" ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                 <span>{connectionStatus === "success" ? "Connected" : "Error"}</span>
               </div>
            )}
          </div>
          {connectionMessage && <p className="text-xs mt-1 text-muted-foreground">{connectionMessage}</p>}
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4 min-h-full flex flex-col justify-between">
            {messages.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-12 px-4">
                <div className="space-y-2">
                  <p className="text-3xl">🤖</p>
                  <h3 className="text-xl font-bold text-foreground">AI Chef Assistant</h3>
                  <p className="text-muted-foreground">
                    Tell me your ingredients and I'll concoct the perfect recipe
                  </p>
                </div>

                {/* Suggestion Prompts */}
                <div className="w-full max-w-sm space-y-2">
                  {[
                    { icon: "🍗", text: "I have rice and eggs", ingredients: "rice, eggs" },
                    { icon: "💪", text: "High protein dinner", ingredients: "chicken, lentils" },
                    { icon: "⚡", text: "Under 20 mins meal", ingredients: "pasta, tomato" },
                  ].map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInput(suggestion.ingredients)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary bg-muted/30 hover:bg-muted/60 transition-all duration-200 text-left group"
                    >
                      <span className="text-xl">{suggestion.icon}</span>
                      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {suggestion.text}
                      </span>
                      <span className="ml-auto text-xs text-muted-foreground">→</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => <AIChatMessage key={i} message={m} />)}
            {isLoading && (
              <div className="flex items-center gap-3 bg-muted/30 p-3 rounded-lg">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm font-medium">Generating recipe...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="flex gap-2 pt-4 border-t space-y-2">
          {/* Quick Suggestion Buttons */}
          {messages.length > 0 && !isLoading && (
            <div className="w-full flex gap-2 mb-2 flex-wrap">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setInput("I have rice and eggs")}
                className="text-xs"
              >
                🍗 Rice & Eggs
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setInput("I have chicken and lentils")}
                className="text-xs"
              >
                💪 Protein meal
              </Button>
            </div>
          )}

          {/* Input Area */}
          <div className="flex gap-2 w-full">
            <Textarea 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="e.g., chicken, garlic, onion" 
              className="flex-1 min-h-[80px] input-premium"
              disabled={isLoading || isTranscribing}
            />
            <div className="flex flex-col gap-2">
              <Button 
                onClick={isRecording ? stopRecording : startRecording} 
                variant={isRecording ? "destructive" : "outline"}
                size="sm"
                title={isRecording ? "Stop recording" : "Start voice input"}
              >
                {isRecording ? (
                  <>
                    <MicOff className="h-4 w-4" />
                    <span className="animate-pulse ml-1 text-xs">●</span>
                  </>
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
              <Button 
                onClick={handleSend} 
                disabled={isLoading || !input.trim()}
                className="btn-glow"
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};