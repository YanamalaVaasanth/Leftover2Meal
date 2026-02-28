# Speech-to-Text Process Flow

## Overview
This document explains how voice input (speech-to-text) works in the AI Recipe Finder application.

## Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│  1. USER CLICKS MICROPHONE BUTTON                                │
│     (AIChat.tsx - startRecording function)                     │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. CHECK BROWSER SUPPORT                                        │
│     • Checks if Web Speech API is available                     │
│     • Supported: Chrome, Edge, Safari                          │
│     • Not supported: Firefox (shows alert)                      │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. REQUEST MICROPHONE PERMISSION                                │
│     • Browser automatically prompts user                         │
│     • User must click "Allow" to continue                        │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. INITIALIZE SPEECH RECOGNITION                                │
│     (whisperService.ts - transcribeAudio function)              │
│                                                                   │
│     • Creates SpeechRecognition instance                         │
│     • Sets language based on dropdown selection:                │
│       - English: "en-US"                                         │
│       - Telugu: "te-IN"                                          │
│       - Tamil: "ta-IN"                                           │
│       - Hindi: "hi-IN"                                           │
│       - Kannada: "kn-IN"                                         │
│       - Malayalam: "ml-IN"                                       │
│     • Sets continuous: false (stops after silence)              │
│     • Sets interimResults: false (only final results)           │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│  5. START LISTENING                                              │
│     recognition.start()                                          │
│     • Browser captures audio from microphone                    │
│     • Audio is sent to browser's speech recognition engine      │
│     • User sees: "Listening... Please speak your ingredients"   │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│  6. USER SPEAKS                                                  │
│     Example: "chicken, tomatoes, onions, garlic"                │
│     • Browser records audio in real-time                         │
│     • Audio is processed by browser's speech engine             │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│  7. BROWSER PROCESSES AUDIO                                      │
│     • Browser uses built-in speech recognition (Google/Apple)  │
│     • Audio → Phonemes → Words → Text                           │
│     • Recognition happens in cloud (Chrome) or locally (Safari) │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│  8. RECEIVE TRANSCRIPTION RESULT                                  │
│     (whisperService.ts - onresult event)                        │
│                                                                   │
│     recognition.onresult = (event) => {                          │
│       transcript = "chicken, tomatoes, onions, garlic"           │
│       finalTranscript += transcript                              │
│     }                                                            │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│  9. RECOGNITION ENDS                                             │
│     (whisperService.ts - onend event)                           │
│     • Browser stops listening after silence                      │
│     • Final transcript is ready                                 │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│  10. RETURN TEXT TO COMPONENT                                    │
│      transcribeAudio() resolves with text                       │
│      Example: "chicken, tomatoes, onions, garlic"               │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│  11. UPDATE INPUT FIELD                                          │
│      (AIChat.tsx - startRecording function)                    │
│                                                                   │
│      setInput(prev => prev ? `${prev} ${transcribedText}`        │
│                      : transcribedText)                          │
│      • Text appears in the textarea                              │
│      • User can edit if needed                                  │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│  12. USER CLICKS SEND                                            │
│      • Text is sent to Gemini API                               │
│      • Gemini generates recipe in selected language             │
└─────────────────────────────────────────────────────────────────┘
```

## Key Code Locations

### 1. User Interaction (AIChat.tsx)
```typescript
// Line 112-151: startRecording function
const startRecording = async () => {
  // Check browser support
  // Call transcribeAudio
  // Update input field with result
}
```

### 2. Speech Recognition (whisperService.ts)
```typescript
// Line 29-115: transcribeAudio function
export const transcribeAudio = async (audioBlob: Blob, language: Language) => {
  // Create SpeechRecognition instance
  // Configure language
  // Handle onresult, onend, onerror events
  // Return transcribed text
}
```

## Technical Details

### Browser Support
- **Chrome/Edge**: Uses Google's cloud-based speech recognition
- **Safari**: Uses Apple's local speech recognition
- **Firefox**: Not supported (uses different API)

### Language Codes Mapping
The selected language from the dropdown is mapped to browser language codes:
- English → `en-US`
- Telugu → `te-IN`
- Tamil → `ta-IN`
- Hindi → `hi-IN`
- Kannada → `kn-IN`
- Malayalam → `ml-IN`

### How It Works Behind the Scenes
1. **Browser API**: Uses `webkitSpeechRecognition` or `SpeechRecognition`
2. **Audio Capture**: Browser captures microphone audio
3. **Processing**: 
   - Chrome: Sends audio to Google servers for recognition
   - Safari: Processes audio locally on device
4. **Result**: Returns transcribed text as JavaScript string

### Error Handling
The system handles various error scenarios:
- **no-speech**: User didn't speak or spoke too quietly
- **audio-capture**: No microphone detected
- **not-allowed**: Microphone permission denied
- **network**: Network error (Chrome only, uses cloud)
- **aborted**: User stopped recognition manually

## Advantages of This Approach
✅ **No Dependencies**: Uses browser built-in API
✅ **Instant**: No model downloads required
✅ **Free**: No API costs
✅ **Multi-language**: Supports 6 languages
✅ **Simple**: Easy to implement and maintain

## Limitations
⚠️ **Browser Support**: Only Chrome, Edge, Safari
⚠️ **Requires Internet**: Chrome sends audio to Google (privacy consideration)
⚠️ **Accuracy**: May vary by language and accent
⚠️ **Continuous Mode**: Currently stops after silence (can be changed)


