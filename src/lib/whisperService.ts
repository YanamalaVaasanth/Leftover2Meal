// Browser Web Speech API for speech-to-text conversion (no external dependencies needed)

type Language = "english" | "telugu" | "tamil" | "hindi" | "kannada" | "malayalam";

// Map our language codes to Web Speech API language codes
const languageCodes: Record<Language, string> = {
  english: "en-US",
  telugu: "te-IN",
  tamil: "ta-IN",
  hindi: "hi-IN",
  kannada: "kn-IN",
  malayalam: "ml-IN",
};

// Store recognition instance so it can be stopped
let currentRecognition: any = null;

export const stopRecognition = () => {
  if (currentRecognition) {
    try {
      currentRecognition.stop();
      currentRecognition = null;
    } catch (e) {
      console.log("Recognition already stopped");
    }
  }
};

export const transcribeAudio = async (audioBlob: Blob, language: Language): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Check if Web Speech API is available
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      reject(new Error("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari."));
      return;
    }

    // Create SpeechRecognition instance
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    currentRecognition = recognition;

    // Configure recognition
    const langCode = languageCodes[language];
    recognition.lang = langCode;
    recognition.continuous = false;
    recognition.interimResults = false;

    let finalTranscript = '';
    let hasResult = false;

    recognition.onresult = (event: any) => {
      hasResult = true;
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          // Also capture interim results
          finalTranscript += transcript;
        }
      }
    };

    recognition.onend = () => {
      currentRecognition = null;
      if (finalTranscript.trim()) {
        resolve(finalTranscript.trim());
      } else if (hasResult) {
        // Sometimes onend fires before onresult completes
        setTimeout(() => {
          if (finalTranscript.trim()) {
            resolve(finalTranscript.trim());
          } else {
            reject(new Error("No speech detected. Please try speaking again."));
          }
        }, 100);
      } else {
        reject(new Error("No speech detected. Please try speaking again."));
      }
    };

    recognition.onerror = (event: any) => {
      currentRecognition = null;
      let errorMessage = "Speech recognition error: ";
      switch (event.error) {
        case 'no-speech':
          errorMessage = "No speech detected. Please try speaking again.";
          break;
        case 'audio-capture':
          errorMessage = "No microphone found. Please check your microphone connection.";
          break;
        case 'not-allowed':
          errorMessage = "Microphone permission denied. Please allow microphone access.";
          break;
        case 'network':
          errorMessage = "Network error occurred. Please check your connection.";
          break;
        case 'aborted':
          errorMessage = "Speech recognition was aborted.";
          break;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
      }
      reject(new Error(errorMessage));
    };

    // Start recognition
    try {
      recognition.start();
    } catch (startError: any) {
      currentRecognition = null;
      reject(new Error(`Failed to start speech recognition: ${startError.message}`));
    }
  });
};
