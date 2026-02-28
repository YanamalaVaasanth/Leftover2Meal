import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { ChefHat } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export const AuthHeader = () => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex justify-end items-center p-4">
        <div className="h-10 w-20 bg-muted animate-pulse rounded-md"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-end items-center gap-3 p-4 border-b border-border">
      <ThemeToggle />
      {!isSignedIn ? (
        <>
          <SignInButton mode="modal">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button size="sm" className="gradient-primary">
              Sign Up
            </Button>
          </SignUpButton>
        </>
      ) : (
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <ChefHat className="h-4 w-4" />
            <span>Welcome back!</span>
          </div>
          <UserButton 
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-9 w-9",
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

