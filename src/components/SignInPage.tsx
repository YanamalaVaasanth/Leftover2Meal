import { SignIn, SignUp } from "@clerk/clerk-react";
import { useState } from "react";
import { ChefHat, UtensilsCrossed, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export const SignInPage = () => {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Left Side - Branding (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center relative z-10 p-8 glass">
        <div className="space-y-8 text-center max-w-md">
          {/* Logo */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-accent rounded-2xl rotate-3 flex items-center justify-center shadow-glow">
                  <UtensilsCrossed className="h-10 w-10 text-white" />
                </div>
                <div className="w-12 h-12 bg-primary rounded-xl absolute -top-4 -right-4 flex items-center justify-center shadow-lg">
                  <ChefHat className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl font-bold gradient-text">
              ImpactX Labs
            </h1>
            <p className="text-xl text-muted-foreground font-medium">
              AI-Powered Smart Cooking Platform
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 pt-8">
            {[
              { icon: "🤖", title: "AI Recipe Generation", desc: "Get instant recipes from your ingredients" },
              { icon: "🎤", title: "Voice Commands", desc: "Hands-free recipe discovery" },
              { icon: "📊", title: "Diet Planning", desc: "Personalized meal schedules" },
              { icon: "🌿", title: "Home Remedies", desc: "Natural wellness tips" },
            ].map((feature, idx) => (
              <div key={idx} className="flex gap-3 text-left animate-fade-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                <span className="text-2xl">{feature.icon}</span>
                <div>
                  <h4 className="font-semibold text-foreground">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 pt-8 border-t border-border">
            {[
              { number: "50K+", label: "Meals" },
              { number: "10K+", label: "Users" },
            ].map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <p className="text-2xl font-bold gradient-text">{stat.number}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Sign In/Up Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center relative z-10 p-4 md:p-8">
        {/* Theme Toggle */}
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-sm space-y-6 animate-fade-up">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="flex justify-center lg:hidden">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-accent rounded-2xl rotate-3 flex items-center justify-center shadow-glow">
                  <UtensilsCrossed className="h-8 w-8 text-white" />
                </div>
                <div className="w-10 h-10 bg-primary rounded-lg absolute -top-3 -right-3 flex items-center justify-center shadow-lg">
                  <ChefHat className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-foreground">
              {isSignIn ? "Welcome Back" : "Join Us"}
            </h2>
            <p className="text-muted-foreground">
              {isSignIn 
                ? "Sign in to start cooking smarter" 
                : "Create an account and start your journey"}
            </p>
          </div>

          {/* Toggle Buttons */}
          <div className="flex gap-2 justify-center bg-muted p-1 rounded-full">
            <Button
              variant={isSignIn ? "default" : "ghost"}
              onClick={() => setIsSignIn(true)}
              className={`flex-1 rounded-full transition-all ${
                isSignIn ? "gradient-accent shadow-lg" : ""
              }`}
            >
              Sign In
            </Button>
            <Button
              variant={!isSignIn ? "default" : "ghost"}
              onClick={() => setIsSignIn(false)}
              className={`flex-1 rounded-full transition-all ${
                !isSignIn ? "gradient-accent shadow-lg" : ""
              }`}
            >
              Sign Up
            </Button>
          </div>

          {/* Clerk Auth Form - Glass Card */}
          <div className="glass rounded-2xl p-6 md:p-8 border-white/20 backdrop-blur-xl">
            {isSignIn ? (
              <SignIn
                routing="virtual"
                appearance={{
                  elements: {
                    rootBox: "mx-auto",
                    card: "shadow-none bg-transparent border-0",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                  },
                }}
              />
            ) : (
              <SignUp
                routing="virtual"
                appearance={{
                  elements: {
                    rootBox: "mx-auto",
                    card: "shadow-none bg-transparent border-0",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                  },
                }}
              />
            )}
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground">
            {isSignIn
              ? "New here? Sign up to get started!"
              : "Already have an account? Sign in now!"}
          </p>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground pt-4 border-t border-border">
            <Sparkles className="h-3 w-3 text-accent" />
            <span>Secure • Fast • AI-Powered</span>
          </div>
        </div>
      </div>
    </div>
  );
};

