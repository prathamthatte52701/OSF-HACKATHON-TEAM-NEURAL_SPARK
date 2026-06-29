# STEMLearn — Bilingual Python Learning Platform

## Quick Start

### 1. Setup Environment

Copy `server/.env` and fill in your keys:
```
MONGODB_URI=mongodb://localhost:27017/stemlearn
JWT_SECRET=your_secret_here
GROQ_KEY_1=your_groq_key_1   # Theory generation
GROQ_KEY_2=your_groq_key_2   # Wrong answer summaries
GROQ_KEY_3=your_groq_key_3   # AI Challenge
```

### 2. Run Backend
```bash
cd server
npm install
npm start         # or: node server.js
```

### 3. Run Frontend
```bash
cd client
npm install
npm run dev
```

App runs at: http://localhost:3000
API runs at: http://localhost:5000

---

## Demo Account (for judges)
Create via signup, then use these Groq API keys to enable AI features.

## Tech Stack
- MongoDB + Express + React + Node.js
- Groq API (llama3-8b-8192) — 3 separate keys
- Monaco Editor (Level 5 IDE)
- Web Speech API (TTS)
- React Router v6

## Features
- Bilingual (Hindi/English) learning
- 10 Python concepts with adaptive difficulty
- Hobby-based STEM context (10 hobbies)
- 5-level progression per topic
- AI Socratic Challenge (7-day streak unlock)
- Daily Challenges (30 pre-written)
- Leaderboard (All Time / Weekly / Daily)
- Streak system with freeze
- Dark/Light mode
- Profile with weak spot tracker
- WhatsApp share cards
