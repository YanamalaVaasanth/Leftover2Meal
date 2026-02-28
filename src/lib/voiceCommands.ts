/**
 * Voice Command System
 * Handles Web Speech API for voice recognition & commands
 */

type VoiceCommand = {
  keywords: string[];
  action: () => void | Promise<void>;
  description: string;
};

type VoiceCommandMap = Record<string, VoiceCommand>;

const SpeechRecognition =
  typeof window !== "undefined"
    ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    : null;

export let voiceCommandMap: VoiceCommandMap = {};
let recognition: any = null;
let isListening = false;

// Initialize voice recognition
export const initializeVoiceCommands = (commands: VoiceCommandMap) => {
  if (!SpeechRecognition) {
    console.warn("Speech Recognition not supported in this browser");
    return false;
  }

  voiceCommandMap = commands;
  recognition = new SpeechRecognition();

  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-IN,en-US";

  recognition.onstart = () => {
    isListening = true;
    console.log("🎤 Voice command listening started");
  };

  recognition.onresult = (event: any) => {
    let interimTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript.toLowerCase();

      if (event.results[i].isFinal) {
        handleCommand(transcript);
      } else {
        interimTranscript += transcript;
      }
    }
  };

  recognition.onerror = (event: any) => {
    console.error("Voice recognition error:", event.error);
  };

  recognition.onend = () => {
    isListening = false;
    console.log("🎤 Voice command listening stopped");
  };

  return true;
};

// Start listening for commands
export const startVoiceListener = () => {
  if (!recognition) {
    console.warn("Voice commands not initialized");
    return;
  }

  if (!isListening) {
    recognition.start();
  }
};

// Stop listening for commands
export const stopVoiceListener = () => {
  if (!recognition || !isListening) return;
  recognition.abort();
  isListening = false;
};

// Handle recognized commands
const handleCommand = async (transcript: string) => {
  console.log("🎤 Command received:", transcript);

  for (const [key, command] of Object.entries(voiceCommandMap)) {
    for (const keyword of command.keywords) {
      if (transcript.includes(keyword.toLowerCase())) {
        console.log(`✅ Executing: ${command.description}`);
        
        // Show confirmation toast
        if (typeof window !== "undefined") {
          const event = new CustomEvent("voiceCommand", {
            detail: { command: key, description: command.description },
          });
          window.dispatchEvent(event);
        }

        try {
          await command.action();
        } catch (error) {
          console.error("Error executing voice command:", error);
        }
        return;
      }
    }
  }

  console.log("❌ Command not recognized:", transcript);
};

// Check if voice commands are available
export const isVoiceCommandsAvailable = (): boolean => {
  return Boolean(SpeechRecognition);
};

// Get listening status
export const isVoiceListening = (): boolean => {
  return isListening;
};

// Pre-defined command groups

export const commonCommands: VoiceCommandMap = {
  showVegRecipes: {
    keywords: ["show veg", "vegetarian", "veg recipes"],
    action: () => {
      window.dispatchEvent(
        new CustomEvent("voiceCommand", { detail: { action: "filterVeg" } })
      );
    },
    description: "Show vegetarian recipes",
  },
  showNonVegRecipes: {
    keywords: ["show non veg", "non vegetarian", "meat recipes"],
    action: () => {
      window.dispatchEvent(
        new CustomEvent("voiceCommand", { detail: { action: "filterNonVeg" } })
      );
    },
    description: "Show non-vegetarian recipes",
  },
  openDietPlanner: {
    keywords: ["open diet", "diet planner", "meal schedule"],
    action: () => {
      window.dispatchEvent(
        new CustomEvent("voiceCommand", { detail: { action: "openDietPlanner" } })
      );
    },
    description: "Open diet scheduler",
  },
  openAIChat: {
    keywords: ["open ai", "chat", "recipe bot"],
    action: () => {
      window.dispatchEvent(
        new CustomEvent("voiceCommand", { detail: { action: "openAIChat" } })
      );
    },
    description: "Open AI chat",
  },
  toggleTheme: {
    keywords: ["dark mode", "light mode", "toggle theme", "switch theme"],
    action: () => {
      window.dispatchEvent(
        new CustomEvent("voiceCommand", { detail: { action: "toggleTheme" } })
      );
    },
    description: "Toggle dark/light mode",
  },
  searchRecipes: {
    keywords: ["search", "find recipe", "look for"],
    action: () => {
      window.dispatchEvent(
        new CustomEvent("voiceCommand", { detail: { action: "focusSearch" } })
      );
    },
    description: "Search recipes",
  },
  openHomeMedicine: {
    keywords: ["home medicine", "medicine", "natural remedies", "ayurveda"],
    action: () => {
      window.dispatchEvent(
        new CustomEvent("voiceCommand", { detail: { action: "openHomeMedicine" } })
      );
    },
    description: "Open home medicine section",
  },
};
