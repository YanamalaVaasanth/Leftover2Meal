import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { SignInPage } from "@/components/SignInPage";
import { FloatingAIButton } from "@/components/FloatingAIButton";
import { StickyGlassNavbar } from "@/components/StickyGlassNavbar";
import { AuthHeader } from "@/components/AuthHeader";
import { EcoWidget } from "@/components/EcoWidget";
import { initializeAnimations } from "@/lib/animations";
import { setupScrollReveal } from "@/lib/scrollReveal";
import { initializeVoiceCommands, commonCommands } from "@/lib/voiceCommands";

const queryClient = new QueryClient();

const App = () => {
  const { isSignedIn, isLoaded } = useUser();
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [accent, setAccent] = useState<"emerald" | "amber">("emerald");

  useEffect(() => {
    // Initialize premium animations
    initializeAnimations();
    setupScrollReveal();

    // Initialize voice commands
    initializeVoiceCommands(commonCommands);

    // Handle voice command events
    const handleVoiceCommand = (e: any) => {
      const action = e.detail?.action;
      switch (action) {
        case "openAIChat":
          setIsAIChatOpen(true);
          break;
        case "toggleTheme":
          toggleTheme();
          break;
        case "focusSearch":
          document.getElementById("search-input")?.focus();
          break;
        case "veg":
          setAccent("emerald");
          break;
        case "non-veg":
          setAccent("amber");
          break;
        default:
          break;
      }
    };

    window.addEventListener("voiceCommand", handleVoiceCommand);

    // Check initial theme
    setIsDarkMode(document.documentElement.classList.contains("dark"));

    return () => {
      window.removeEventListener("voiceCommand", handleVoiceCommand);
    };
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDarkMode(!isDarkMode);
  };

  // Show loading state while auth is loading
  if (!isLoaded) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </ThemeProvider>
    );
  }

  // Show login page if not signed in
  if (!isSignedIn) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SignInPage />
      </ThemeProvider>
    );
  }

  // Show main app if signed in
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {/* Auth Header */}
          <AuthHeader />
          {/* Sticky Glass Navbar */}
          <StickyGlassNavbar
            onCommandPalette={() => {}}
            accent={accent}
          />
          {/* EcoWidget */}
          <EcoWidget />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          {/* Floating AI Button */}
          <FloatingAIButton onOpen={() => setIsAIChatOpen(true)} />
          {/* Command Palette removed for single-page mode */}
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
