# My Learning - Modular Learning Portfolio

A modern, clean, dark-themed personal learning portfolio web application built with React, TypeScript, and Tailwind CSS. Organize your learning journey into **main topics → subtopics**, track completion with checkboxes, and automatically calculate topic and overall progress percentages.

---

## Features

- **Modular Topic System**: Dynamically create learning topics with optional descriptions and subtopics without touching code.
- **Dynamic Subtopics**: Add subtopics inline or in batches with instant UI updates.
- **Progress Tracking**: Real-time progress calculation:
  $$\text{Progress} = \frac{\text{completed subtopics}}{\text{total subtopics}} \times 100$$
  Rounded to the nearest whole percentage.
- **Overall Learning Progress**: Aggregated completion percentage and statistics across all topics and subtopics.
- **Persistent Storage**: Uses browser `localStorage` under the key `learningPortfolio`, retaining completion states across browser reloads and sessions.
- **Topic & Subtopic Management**:
  - Edit topic name and description.
  - Delete topic with confirmation dialog.
  - Inline rename and delete for individual subtopics.
  - Expand/collapse subtopics for clean workspace organization.
- **Data Safety & Portability**:
  - **Export Portfolio**: Download learning records as a structured JSON file.
  - **Import Portfolio**: Restore or migrate your learning portfolio from JSON.
  - **Clear All Data**: Safe wipe option with double confirmation.
- **Clean Dark Theme**: High-contrast, minimal dark UI with subtle emerald accents and comfortable typography.

---

## Local Setup & Running

### 1. Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### 2. Installing Dependencies

```bash
npm install
```

### 3. Starting the Application

```bash
npm run dev
```

The app will start on `http://localhost:3000` (or the port configured by your environment).

### 4. Building for Production

```bash
npm run build
```

The static production assets will be built in the `dist/` directory.

---

## Architecture & Data Persistence

### Current Mode: Offline-First Client Architecture

Per design requirements, this version operates fully offline using the browser's **localStorage** as the local database:

```text
User Action (Add / Check / Edit / Delete)
   ↓
React State (Interactive UI)
   ↓
localStorage ("learningPortfolio")
```

#### Data Schema

```typescript
interface Topic {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  subtopics: Subtopic[];
}

interface Subtopic {
  id: string;
  topic_id: string;
  name: string;
  completed: boolean;
  created_at?: string;
}
```

### Future Extensibility: REST API & SQLite Backend

The modular codebase is designed for plug-and-play extension to a Node.js + Express backend with SQLite:

#### Planned REST Endpoints:
```text
GET    /api/topics
POST   /api/topics
GET    /api/topics/:id
PUT    /api/topics/:id
DELETE /api/topics/:id

POST   /api/topics/:id/subtopics
PUT    /api/subtopics/:id
DELETE /api/subtopics/:id
```

---

## Verification Test (Section 20)

1. Open the application.
2. Click **+ Add Learning Topic**, enter "Machine Learning", and add 5 subtopics.
3. Check 3 of the subtopics. Notice topic and overall progress update to **60%**.
4. Refresh or reopen the browser.
5. All 5 subtopics and the 3 checked states remain preserved at **60%**.
