# StadiumPulse AI Architecture

## Deterministic Engine vs GenAI Split

StadiumPulse AI is designed around a strict architectural separation of concerns between **Deterministic Operations Math** and **Generative AI Natural Language Understanding**.

### Deterministic Engine (Pure Typescript)

To ensure safety and audibility in high-stakes stadium operations (like emergency routing and capacity planning), all core calculations are processed by pure, fully-typed, side-effect-free TypeScript functions.

- **Pathfinding**: Implements a strict Dijkstra's algorithm for shortest paths, factoring in wheelchair accessibility invariants.
- **Crowd Engine**: Calculates crowd buildup using logistic regression math and assigns deterministic risk scores based on capacity thresholds.
- **Transport Engine**: Computes CO2 metrics and ranks transportation modalities rigidly.

### GenAI Explanation Layer (Google Gemini)

The Generative AI layer acts strictly as a translator, summarizer, and explainer. **The AI is instructed never to invent numbers or operational data.** Instead, the deterministic engine feeds real-time context (e.g., current zone density, shortest path) into the Gemini prompt. Gemini formats this data into accessible, multilingual, and persona-specific responses (e.g., generating a volunteer phrasebook or writing an executive briefing based on the live incident feed).

## Four Personas, One Data Layer

StadiumPulse AI caters to four distinct user roles, all synchronized via **Firebase Firestore Realtime Listeners**:

1. **Fan Experience**: Uses telemetry for live navigation and reads safety alerts.
2. **Operations Organizer**: Aggregates all telemetry and incidents into an executive dashboard.
3. **Volunteer Assistant**: Relies on real-time zone data to assist fans and escalate issues to staff.
4. **Staff & Security**: Triages critical incidents globally pushed to the feed.

By using Firebase Firestore's `onSnapshot`, all four personas stay perfectly in sync. When a Fan triggers an SOS, the incident is written to Firestore, instantly pushing an alert to the Staff dashboard and updating the Organizer's executive AI briefing context.

## Deployment Architecture

This project is fully serverless and designed to be deployed natively via Vercel's Next.js build pipeline. **No Docker, no Cloud Run, no VMs.**

- **Hosting**: Next.js 14 App Router deployed on **Vercel's Edge Network**. Vercel auto-detects the Next.js framework, applies optimized builds, and provisions global CDN caching and HTTPS automatically.
- **Database**: **Firebase Firestore** handles all real-time data fully decoupled from the hosting provider.
- **AI Integration**: **Google Gemini API** is called client-side via a `NEXT_PUBLIC_GEMINI_API_KEY`.
  - _Note on Tradeoffs_: Calling the API directly from the client is acceptable for the scope of this hackathon to demonstrate low-latency interactions. In a production environment, this would be proxied through a Vercel Serverless Function (API Route) to completely hide the API key from the browser.

## Data Flow Diagram

```text
+---------------------+        +---------------------+       +------------------------+
|                     |        |                     |       |                        |
|   Fan Mobile App    +------->+  Deterministic Core +------>+    Operations Dash     |
|   (Next.js UI)      |        |  (Pure TypeScript)  |       |    (Next.js UI)        |
|                     |        |                     |       |                        |
+---------+-----------+        +----------+----------+       +-----------+------------+
          |                               |                              ^
          |                               |                              |
          v                               v                              |
+---------+-----------+        +----------+----------+                   |
|                     |        |                     |                   |
|  Google Gemini API  |        |  Firebase Firestore +-------------------+
|  (LLM Explainer)    |        |  (Realtime DB)      |
|                     |        |                     |
+---------------------+        +---------------------+
```
