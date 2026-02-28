import { useState, useEffect } from "react";
import { Bot, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingAIButtonProps {
  onOpen: () => void;
}

export const FloatingAIButton = ({ onOpen }: FloatingAIButtonProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    // Remove notification after 3 seconds
    const timer = setTimeout(() => {
      if (notifications.length > 0) {
        setNotifications((n) => n.slice(1));
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [notifications]);

  const handleClick = () => {
    onOpen();
    setIsExpanded(false);
  };

  return (
    <>
      {/* Notifications Stack */}
      <div className="fixed bottom-24 right-6 flex flex-col gap-2 pointer-events-none">
        {notifications.map((notif, idx) => (
          <div
            key={idx}
            className="animate-slide-in-right pointer-events-auto bg-gradient-to-r from-primary to-accent text-white px-4 py-3 rounded-lg shadow-lg text-sm font-semibold"
          >
            {notif}
          </div>
        ))}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {/* Quick Actions Menu */}
        {isExpanded && (
          <div className="absolute bottom-24 right-0 space-y-3 animate-fade-up">
            <button
              onClick={handleClick}
              className="flex items-center gap-3 px-4 py-3 rounded-full bg-white dark:bg-slate-900 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 group"
              title="Generate Recipe from Ingredients"
            >
              <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary">
                AI Chef
              </span>
              <Bot className="w-5 h-5 text-primary animate-bounce-slow" />
            </button>

            <button
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent("voiceCommand", {
                    detail: { action: "openDietPlanner" },
                  })
                );
                setIsExpanded(false);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-full bg-white dark:bg-slate-900 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 group"
              title="Open Diet Scheduler"
            >
              <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary">
                Diet
              </span>
              <span className="text-lg">🥗</span>
            </button>

            <button
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent("voiceCommand", {
                    detail: { action: "openHomeMedicine" },
                  })
                );
                setIsExpanded(false);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-full bg-white dark:bg-slate-900 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 group"
              title="Home Medicine"
            >
              <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary">
                Health
              </span>
              <span className="text-lg">🌿</span>
            </button>
          </div>
        )}

        {/* Main Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative w-16 h-16 rounded-full bg-gradient-accent shadow-glow hover:shadow-[0_0_30px_rgba(96,165,250,0.6)] flex items-center justify-center text-white hover:scale-110 transition-all duration-300 group overflow-hidden"
        >
          {/* Background animation */}
          <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-20 transition-opacity animate-pulse" />

          {/* Icon */}
          <div className="relative z-10">
            {isExpanded ? (
              <X className="w-6 h-6 animate-pop" />
            ) : (
              <Bot className="w-6 h-6 animate-bounce-slow" />
            )}
          </div>

          {/* Pulse ring */}
          <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-pulse" />
        </button>

        {/* Tooltip */}
        {!isExpanded && (
          <div className="absolute bottom-20 right-0 whitespace-nowrap bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-2 rounded-lg text-xs font-semibold animate-fade-up pointer-events-none">
            AI Cooking Assistant
            <div className="absolute bottom-0 right-4 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-900 dark:border-t-white"></div>
          </div>
        )}
      </div>
    </>
  );
};
