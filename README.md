🍽️ Leftover2Meal – AI-Powered Smart Cooking App
📌 Project Overview

Leftover2Meal is a smart AI-powered web application that helps users create healthy and creative meals using ingredients already available in their fridge.

Instead of browsing fixed recipes, the app dynamically generates personalized recipes using AI. It also supports dietary preferences, health goals, multilingual content, voice input, and authentication.

🚀 How to Run the Project Locally
Prerequisites

Node.js (recommended via nvm)

npm installed

Setup Steps
# 1. Clone the repository
git clone <YOUR_GIT_URL>

# 2. Navigate into the project folder
cd <YOUR_PROJECT_NAME>

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev

The app will run with hot reload and instant preview.

🛠️ Technologies Used

Vite

React

TypeScript

Tailwind CSS

shadcn/ui

Google Gemini AI API

Clerk Authentication

TanStack React Query

Web Speech API (Voice Commands)

🔐 Environment Variables Setup

Create a .env file in the root directory.

Clerk Authentication (User Login)

Create an account at Clerk

Create a new application

Copy the Publishable Key

Add to .env:

VITE_CLERK_PUBLISHABLE_KEY=your_publishable_key_here
Google Gemini API (AI Recipe Generation)

Generate API key from Google AI Studio

Add to .env:

VITE_GEMINI_API_KEY=your_gemini_api_key_here
Voice Input

Uses browser’s built-in Web Speech API

No API key required

Works in Chrome, Edge, Safari

Requires microphone permission

📦 Example .env File
VITE_CLERK_PUBLISHABLE_KEY=your_publishable_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here

⚠ Restart the dev server after adding environment variables.

🌍 Deployment

You can deploy using:

Vercel

Netlify

GitHub Pages

Any Node-supported hosting service

Build command:

npm run build
🌐 Custom Domain

After deployment, configure a custom domain through your hosting provider's domain settings.
