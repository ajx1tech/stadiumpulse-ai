# StadiumPulse AI

**One assistant, every role, every language — GenAI operations for FIFA World Cup 2026 stadiums**

StadiumPulse AI is a comprehensive, real-time stadium operations platform designed to seamlessly fuse strict, deterministic operational math with the natural language reasoning capabilities of Google Gemini. It empowers fans, operations organizers, volunteers, and security staff through a unified, fully localized interface.

[**View Live Demo on Vercel**](https://stadiumpulse-ai-support.vercel.app/)

---

## Problem Statement Alignment

This project directly addresses the core pillars of the hackathon challenge:

- **Navigation (Wayfinding)**: Solved via `pathfinding.ts` (Dijkstra's Algorithm) calculating optimal routes between gates, concourses, and sections.
- **Crowd Management (Bottleneck Prediction)**: Addressed by `crowdEngine.ts` and the `OperationsDashboard`. The system uses logistic regression to predict fan buildup and assigns deterministic risk scores to gates.
- **Real-Time Decision Support**: The `EmergencySOSButton` allows fans to trigger alerts, instantly propagating via live Firestore listeners to the `StaffAlertsPanel`.
- **Accessibility (Inclusivity)**: Integrated deeply at the core logic level. Pathfinding includes an exclusive "wheelchair accessible" toggle that reroutes avoiding stairs. UI is built to WCAG 2.1 AA standards.
- **Transportation Options**: The `SustainableTransportPanel` ranks local transit modalities dynamically based on distance.
- **Sustainability (Green Initiatives)**: Transport options are ranked by real-time CO2 emissions math, and Gemini generates contextual sustainability tips.
- **Multilingual Assistance**: 7 fully functional languages: English, Español, Português, Français, العربية, हिन्दी, 中文. The `VolunteerAssistant` leverages Gemini to dynamically generate localized phrasebooks in these languages for scenario-specific fan aid.
- **Operational Intelligence**: Staff dashboards feature a Gemini-powered "AI Briefing Generator" that reads the live deterministic incident feed and produces an executive summary for immediate action.

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Radix UI, Framer Motion
- **Data Visualization**: Recharts
- **Database**: Firebase Firestore
- **AI / LLM**: Google Gemini API
- **Deployment**: Vercel

---

## Deployment

**This app is deployed on Vercel**, which provides native Next.js support with zero-config builds, automatic HTTPS, and a global edge network. Firebase Firestore handles all real-time data independently of the hosting provider. No Docker containers or VMs are required to run this application.

---

## Getting Started

### Local Run Instructions

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env.local` file at the project root with the following keys:
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Testing Instructions

The project contains a comprehensive Jest test suite ensuring the deterministic math layer is flawless and GenAI hooks are properly sanitized.

- **Run Tests**: `npm test`
- **Run Tests with Coverage**: `npm run test:coverage` (Current coverage: 94% statements, 88% branches. Run this command to regenerate the exact metrics)

---

## CI/CD

This repository uses GitHub Actions to automatically run linting, type-checking, and the full test suite on every push, ensuring continuous code quality validation.

---

## Security & Accessibility Summary

### Security Hardening

- **Content Security Policy**: Hardened CSP in `next.config.ts`.
- **Input Sanitization**: Centralized `lib/sanitize.ts` using Regex to proactively strip HTML strings prior to LLM injection to prevent prompt poisoning.
- **Client Constraints**: Explicit `maxLength` boundaries applied to all raw user input fields.
- **Data Rules**: Strict `firestore.rules` implemented requiring admin authentication for backend telemetry mutations.

### Accessibility (WCAG 2.1 AA)

- High-contrast, deep navy/emerald stadium-night aesthetic.
- Fully semantic HTML with ARIA properties embedded in complex SVG map interactions.
- Respects `prefers-reduced-motion` queries.
- Screen reader fallbacks for all visual telemetry graphs.

---

## Assumptions

- Telemetry sensors (beacons/cameras) exist in the physical stadium to write to the Firestore `/telemetry` collection.
- API keys used strictly client-side are acceptable for hackathon demonstration. A production environment would proxy these calls through Vercel serverless API routes.

---

**Google Services Used**: Gemini API, Firebase Firestore
