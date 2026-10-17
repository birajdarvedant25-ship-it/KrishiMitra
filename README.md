# KrishiMitra — AI-Powered Farming Assistant 🌾
> **कृषिमित्र** — भारतीय शेतकऱ्यांसाठी आणि किसान भाईयों के लिए आधुनिक, वेगवान व विश्वासू शेती सल्लागार ॲप.

**KrishiMitra** is a fast, modern, mobile-first, and farmer-friendly agricultural web application specifically designed for Indian farmers (with deep localization for Maharashtra and India in **English, हिन्दी (Hindi), and मराठी (Marathi)**). 

It empowers small and medium-scale farmers to detect crop diseases and pests via image analysis, monitor hyper-local weather and spray suitability, receive organic and biological treatment solutions first, obtain smart irrigation guidance, and converse with an AI farming companion.

---

## 🌟 Key Features

1. **📷 Crop Disease & Pest Detection**:
   - Take photos directly with a smartphone camera (`capture="environment"`) or upload leaf/plant images.
   - AI vision analysis identifies the crop, possible issue, estimated severity, and visual symptoms.
   - **🌿 Organic & Biological Solutions FIRST**: Prominently highlights eco-friendly, chemical-free cultural methods (Neem oil, *Trichoderma viride*, sour buttermilk spray, *Jeevamrut*, *Dashparni Ark*, sticky traps) before any chemical intervention.
   - **🧪 Verified Treatment Information**: Conservative, evidence-based guidelines following university package of practices with mandatory PPE mask/gloves precautions, waiting period (PHI) compliance, and guidance to consult local Krishi Vigyan Kendras (KVK).
   - **🔊 Voice Read-out (Text-To-Speech)**: Integrated Web Speech API audio narration in Marathi, Hindi, and English for farmers with limited literacy.

2. **🌦️ Hyper-Local Weather & Agricultural Advisory**:
   - Live temperature, apparent temperature, humidity, rain probability, wind speed, and 5-day farm forecasts.
   - Free, zero-API-key Open-Meteo integration calibrated with a built-in geo-database for all 36 Maharashtra districts + Indian agricultural hubs.
   - **Spraying Suitability Index**: Evaluates wind velocity and rain risk to notify whether spraying today will wash off or cause wasteful drift.
   - **Fungal Disease Threat Index**: Detects temperature and humidity conditions that favor fungal outbreaks.

3. **💧 Smart Irrigation Advisor**:
   - Calculates custom watering recommendations using crop growth stage, soil type (Black soil, Sandy loam, Clay), irrigation method (Drip, Sprinkler, Flood), recent rainfall, and upcoming precipitation forecast.
   - Practical field test guidance ("soil ball test" at 4-inch depth) and water-conservation tips.

4. **🤖 Conversational AI Farmer Assistant**:
   - Multilingual conversational assistant aware of the farmer's active crops, farm location, and current weather.
   - Pre-configured quick prompt chips for common farmer queries.
   - Audio read-aloud support.

5. **🌱 Crop Management & Schedules**:
   - Log planted crops, varieties, planting dates, growth stages, soil types, and irrigation methods.
   - Cross-references each crop with known pests and organic prevention methods from the curated knowledge base.

6. **🚨 Real-Time Weather & Disease Alerts**:
   - Automatic generation of Rain alerts, Heat advisories, Fungal risk warnings, and Spray condition notices based on real-time sensor and forecast data.

7. **🌐 Deep Tri-Lingual Internationalization (i18n)**:
   - Complete native localization across **English (`en`)**, **हिन्दी (`hi`)**, and **मराठी (`mr`)**.
   - Every navigation item, button, modal, error message, and AI prompt operates in the farmer's selected language.

---

## 🏗️ Architecture & Multi-AI Orchestration

KrishiMitra implements a secure decoupled architecture where all secret API keys remain strictly on the backend:

```text
[ Browser / Mobile Client ]
           │
           │  (REST API with JWT Auth)
           ▼
[ Express Backend API (/api) ]
           │
           ├── [ Agricultural Knowledge Layer (knowledgeBase.ts) ]
           │        ├── Curated Crop Disease Profiles
           │        ├── Organic & Biocontrol Protocols
           │        └── Safe University Practices
           │
           ├── [ Weather Service (weatherService.ts) ]
           │        ├── Open-Meteo API / OpenWeather
           │        └── 36 Maharashtra Districts Geo-Dictionary
           │
           └── [ Multi-AI Orchestrator (aiService.ts) ]
                    │
                    ├── 1. Google Gemini 1.5/2.0 Flash (Primary Multimodal Vision)
                    │
                    ├── 2. OpenAI GPT-4o-mini (Secondary / Fallback)
                    │
                    └── 3. Mock AI Engine (Zero-Key Offline Development Mode)
```

### AI Fallback & Safety Guarantee
- If `AI_MODE=mock` or if external keys are absent, the application runs seamlessly using the built-in deterministic agricultural mock engine.
- When `AI_MODE=production`:
  1. The orchestrator calls **Google Gemini** multimodal vision.
  2. If Gemini fails or times out, it gracefully falls back to **OpenAI GPT-4o-mini**.
  3. If both providers fail, it serves verified knowledge base advice so farmers never experience downtime or raw stack trace errors.
- Every prediction is enriched with the verified `knowledgeBase.ts` to ensure organic solutions are never omitted and no chemical dosages are fabricated.

---

## 💻 Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS v4 (Agricultural palette: leaf greens, earth tones, high-contrast, large touch targets)
- **Icons**: Lucide React
- **Routing**: React Router DOM v7
- **Speech**: Web Speech API (`SpeechSynthesis`)

### Backend
- **Runtime**: Node.js v24 (ES Modules) + TypeScript (`tsx`)
- **Web Framework**: Express 4
- **Database**: Atomic file-backed JSON relational repository (Zero external setup, 100% crash-safe)
- **Security**: JWT authentication, bcrypt password hashing, input sanitization, file-type & size limits
- **AI SDKs**: `@google/generative-ai` & `openai`

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18+ or v24+)
- npm (v9+)

### 2. Installation
Clone or navigate to the project directory and install dependencies:

```bash
# In the root project directory:
npm install

# Backend packages:
cd backend && npm install

# Frontend packages:
cd ../frontend && npm install
cd ..
```

### 3. Environment Configuration
Copy the template configuration in `.env.example`:

```bash
cp .env.example .env
```

Your `.env` file contains:
```env
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=krishimitra_super_secret_jwt_key_2026_dev
AI_MODE=mock
GEMINI_API_KEY=
OPENAI_API_KEY=
WEATHER_API_KEY=
DATABASE_PATH=./data/krishimitra.json
```

> **Note**: To test immediately without any API keys, leave `AI_MODE=mock`. To enable real cloud AI image analysis and chat, set `AI_MODE=production` and provide your `GEMINI_API_KEY` or `OPENAI_API_KEY`.

### 4. Running the Application

You can start both frontend and backend concurrently from the root directory:

```bash
npm run dev
```

Alternatively, you can run them in separate terminals:

```bash
# Terminal 1: Backend API (runs on http://localhost:5000)
npm run dev:backend

# Terminal 2: Frontend Client (runs on http://localhost:5173)
npm run dev:frontend
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Running Automated Tests

KrishiMitra includes a comprehensive test suite validating authentication, live weather APIs, AI disease detection fallback, smart irrigation calculations, and multilingual advisory:

```bash
npm test
```

Sample output:
```text
✔ 1. Health Check Endpoint
✔ 2. Authentication Flow - Registration & Login
✔ 3. Weather API - Live Open-Meteo & Location Resolution
✔ 4. Crop Disease Detection & AI Orchestrator Fallback
✔ 5. Irrigation Calculator
✔ 6. AI Farmer Assistant Chatbot & Daily Advisory
ℹ pass 7
ℹ fail 0
```

---

## 📱 Mobile Experience

The application is built **mobile-first**:
- Large touch targets for buttons and inputs.
- Mobile bottom navigation bar for quick one-thumb reach between Dashboard, Disease Detect, Weather, Irrigation, and AI Chat.
- Direct hardware camera integration (`capture="environment"`) to snap pictures of crop leaves directly on smartphones.
- Audio read-aloud buttons allowing farmers to listen to recommendations in Marathi, Hindi, or English.

---

## 🔒 Security & Privacy

- **No Plaintext Passwords**: Passwords hashed with `bcryptjs` (salt rounds: 10).
- **Backend Key Isolation**: API keys (`GEMINI_API_KEY`, `OPENAI_API_KEY`, `WEATHER_API_KEY`) are loaded on the server only and never exposed to client-side scripts.
- **Image Upload Protection**: Limits file size to 10MB and restricts MIME types to JPG, PNG, and WEBP.
- **Privacy Assurance**: Location is used solely to query local weather and irrigation metrics; precise GPS coordinates are never stored or sold.

---

## 📄 License
MIT License. Created with ❤️ for Indian farmers.
#   K r i s h i M i t r a  
 "# KrishiMitra" 
