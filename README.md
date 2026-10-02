# RECRUIT X — AI-Powered Mock Interview Platform

> **Production-ready AI-driven technical mock interview SaaS platform featuring real-time voice interactions, dynamic question generation, multi-dimensional competency scoring, and performance analytics.**

---

## 📌 1. Project Overview & Architecture

**RECRUIT X** is an interactive full-stack mock interview platform designed to empower engineering students and software developers to prepare for rigorous technical interviews. It combines Google Gemini for adaptive question generation and evaluation with Vapi.ai for voice interactions, backed by Firebase for authentication and Firestore data persistence.

```
                                  RECRUIT X ARCHITECTURE
                                  
   +-------------------------------------------------------------------------+
   |                             USER (BROWSER)                              |
   +------------------------------------+------------------------------------+
                                        |
                 +----------------------+----------------------+
                 |                                             |
                 v                                             v
     +-----------------------+                     +-----------------------+
     |   Next.js Frontend    |                     |  Vapi.ai Voice Web    |
     | (App Router, Tailwind)|                     |  (Web Speech Fallback)|
     +-----------+-----------+                     +-----------+-----------+
                 |                                             |
                 v                                             v
     +-----------------------+                     +-----------------------+
     | Next.js Route Handlers| <=================> |  Google Gemini 1.5    |
     | (/api/interview/...)  |   Adaptive Prompt   |  (Question Gen & Rubric|
     +-----------+-----------+   Engine & Eval     +-----------------------+
                 |
                 v
     +-----------------------+
     | Firebase Auth &       |
     | Cloud Firestore DB    |
     +-----------------------+
```

---

## ✨ 2. Key Features

- 🎙️ **Natural AI Voice Interviewer**: Realistic two-way conversational interviews with speech recognition, text-to-speech synthesis, interruption support, and visual waveforms.
- 🧠 **Dynamic AI Question Generation**: Generates contextual technical questions on demand across Java & OOP, DSA, React, SQL, Operating Systems, Computer Networks, and System Design.
- 📊 **Comprehensive Feedback Rubrics**: Evaluates candidate performance across 6 distinct competencies:
  - Technical Knowledge (0–100)
  - Problem Solving (0–100)
  - Communication & Articulation (0–100)
  - Answer Quality (0–100)
  - Confidence & Delivery (0–100)
  - Relevance & Precision (0–100)
- 📝 **Live Synchronized Transcript**: Real-time dialogue capturing with AI questions, candidate responses, and timestamps.
- 📈 **Performance Analytics Dashboard**: Historical score tracking, difficulty breakdown, and competency analytics powered by Firestore.
- 🔒 **Enterprise-Grade Security**: Firebase Authentication with protected routes and strict Firestore security rules.
- ⚡ **Zero-Latency Fallback Architecture**: Seamlessly operates with browser Web Speech synthesis and built-in question catalogs if cloud API keys are pending.

---

## 🛠️ 3. Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js (App Router), React 18, TypeScript, Tailwind CSS |
| **Icons & UI** | Lucide React, Custom CSS Audio Waveforms |
| **Authentication** | Firebase Authentication (Email/Password & Session State) |
| **Database** | Firebase Cloud Firestore |
| **AI Generation** | Google Gemini 1.5 Flash (`@google/generative-ai`) |
| **Voice Layer** | Vapi.ai Web SDK (`@vapi-ai/web`) & Browser Web Speech API |
| **Testing** | Jest, React Testing Library, Cypress E2E |
| **API Format** | Next.js Server Route Handlers & Postman Collection v2.1 |

---

## 📂 4. Project Directory Structure

```
recruit-x/
├── app/
│   ├── layout.tsx                    # Global root layout with AuthProvider & Navbar
│   ├── globals.css                   # Tailwind styles & soundwave animations
│   ├── page.tsx                      # Modern SaaS Landing page
│   ├── signin/page.tsx               # Secure candidate login
│   ├── signup/page.tsx               # Candidate registration
│   ├── dashboard/page.tsx            # Protected dashboard with stats & modules
│   ├── history/page.tsx              # Historical interview archives with search
│   ├── analytics/page.tsx            # Performance telemetry & charts
│   ├── api-docs/page.tsx             # Interactive API test suite & verification
│   ├── interview/
│   │   ├── setup/page.tsx            # Track & difficulty configuration
│   │   └── [id]/
│   │       ├── page.tsx              # Live AI voice interview room
│   │       └── feedback/page.tsx     # Comprehensive evaluation scorecard
│   └── api/
│       ├── interview/
│       │   ├── start/route.ts        # POST: Initialize interview & generate questions
│       │   ├── question/route.ts     # POST: Dynamic question generation
│       │   ├── evaluate/route.ts     # POST: Real-time answer evaluation
│       │   └── feedback/route.ts     # POST: Complete session rubric generation
│       ├── interviews/route.ts       # GET: List user interview sessions
│       ├── interview/[id]/route.ts   # GET: Fetch single session
│       └── webhooks/vapi/route.ts    # POST: Vapi assistant webhook handler
├── components/
│   ├── ui/                           # Reusable UI (Button, Card, Modal, Input, Badge, etc.)
│   ├── dashboard/                    # StatsOverview, CategoryGrid, RecentInterviews
│   ├── interview/                    # AIAvatar, CandidateSection, TranscriptPanel, Controls
│   └── feedback/                     # ScoreCard, CategoryBreakdown, QuestionReviewList
├── lib/
│   ├── firebase/                     # Firebase Auth, Firestore helpers & config
│   ├── gemini/                       # Gemini client, Question & Feedback generators
│   ├── vapi/                         # Vapi client & Browser Voice Engine fallback
│   └── utils/                        # formatters, tailwind-merge, mock data
├── types/                            # TypeScript interfaces (Auth, Interview, Feedback, Analytics)
├── tests/                            # Jest unit tests & test suites
├── cypress/                          # Cypress E2E integration test specifications
├── firestore.rules                   # Firebase Security Rules
├── postman_collection.json           # Postman Collection v2.1
└── README.md                         # Project documentation
```

---

## ⚙️ 5. Setup & Environment Variables

### 1. Clone & Install Dependencies
```bash
cd recruit-x
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your service keys:
```env
# Firebase Client SDK Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=recruit-x-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=recruit-x-app
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=recruit-x-app.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Google Gemini API Key (Get at: https://aistudio.google.com/)
GEMINI_API_KEY=AIzaSyYourGeminiApiKeyHere

# Vapi.ai Voice API (Get at: https://dashboard.vapi.ai/)
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key
VAPI_PRIVATE_KEY=your_vapi_private_key
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_vapi_assistant_id
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 6. Testing

### Run Unit Tests (Jest)
```bash
npm test
```

### Run E2E Tests (Cypress)
```bash
npm run cypress:run
```

---

## 📄 7. Postman API Collection

Import the included `postman_collection.json` directly into Postman or use the interactive test dashboard at `/api-docs`.

---

## 🎓 8. Academic & Resume Alignment

### Resume Bullet Points:
> **"Architected and deployed RECRUIT X, a full-stack AI mock interview SaaS using Next.js (App Router), TypeScript, and Tailwind CSS with real-time audio interaction powered by Vapi.ai and Google Gemini."**

> **"Implemented multi-category performance evaluation algorithms generating standardized 6-dimension scorecards and question-by-question candidate analysis persisted on Firebase Firestore."**
