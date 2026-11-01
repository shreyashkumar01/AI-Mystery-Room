# AI Mystery Room — Database Documentation

This document describes the MongoDB database schemas, relationships, indexing strategies, and security isolation policies for AI Mystery Room.

---

## 1. Collections Overview

The application utilizes two primary persistent MongoDB collections managed via Mongoose:

1. **`cases`** (`Case` Model) — Holds generated mysteries, victims, suspects, digital evidence, clues, timeline records, progressive hints, and the isolated hidden solution.
2. **`investigations`** (`Investigation` Model) — Tracks active investigation sessions, discovered clue IDs, consumed hints, current score, submitted accusation, and final score breakdowns.

---

## 2. Model Schemas

### `Case` Schema (`server/src/models/Case.js`)

```javascript
{
  _id: ObjectId,
  title: String,               // Case title
  premise: String,             // User-provided scenario description
  story: String,               // Detailed incident narrative
  category: String,            // "murder" | "theft" | "disappearance" | "corporate_crime"
  difficulty: "easy" | "medium" | "hard",
  status: "generating" | "active" | "failed",
  
  victim: {
    name: String,
    age: Number,
    occupation: String,
    description: String
  },

  suspects: [
    {
      suspectId: String,       // e.g. "SUSPECT_01"
      name: String,
      age: Number,
      occupation: String,
      relationship: String,
      background: String,
      motive: String,
      alibi: String,
      statement: String,
      publicDescription: String,
      avatarUrl: String
    }
  ],

  clues: [
    {
      clueId: String,          // e.g. "CLUE_01"
      title: String,
      description: String,
      type: String,
      evidenceId: String,      // References evidence.evidenceId
      importance: "critical" | "supporting" | "misleading",
      relatedSuspects: [String],
      discoveryText: String,
      solutionExplanation: String // Strip in public case responses!
    }
  ],

  evidence: [
    {
      evidenceId: String,      // e.g. "EVIDENCE_01"
      type: "CHAT" | "CCTV" | "IMAGE" | "DOCUMENT" | "WITNESS",
      title: String,
      description: String,
      content: Mixed,          // Chat messages array, CCTV observation log, doc text, etc.
      mediaUrl: String,
      timestamp: String,
      relatedSuspects: [String]
    }
  ],

  timeline: [
    {
      time: String,
      event: String,
      relatedSuspects: [String]
    }
  ],

  hints: [
    {
      level: Number,           // 1, 2, or 3
      content: String
    }
  ],

  solution: {                  // ISOLATED & PRIVATE
    culpritId: String,         // Must match suspects.suspectId
    motive: String,
    method: String,
    explanation: String,
    criticalClueIds: [String],
    redHerringExplanations: [String]
  },

  generationMetadata: {
    model: String,
    promptVersion: String,
    generatedAt: Date,
    validationStatus: String
  },

  createdAt: Date,
  updatedAt: Date
}
```

---

### `Investigation` Schema (`server/src/models/Investigation.js`)

```javascript
{
  _id: ObjectId,
  caseId: ObjectId,            // Foreign Key ref -> Case (Indexed)
  status: "active" | "completed" | "abandoned",
  discoveredClues: [String],   // Unique clueIds discovered by player (+5 pts each)
  hintsUsed: [Number],         // Hint levels requested (e.g. [1, 2], -10 pts each)
  score: Number,               // Current authoritative score
  
  accusation: {
    suspectId: String,
    reasoning: String,
    submittedAt: Date,
    isCorrect: Boolean
  },

  scoreBreakdown: {
    basePoints: Number,        // 100 (Easy), 150 (Med), 200 (Hard) if correct; 0 if incorrect
    cluePoints: Number,        // 5 * discoveredClues.length
    hintPenalty: Number,       // 10 * hintsUsed.length
    finalScore: Number         // max(0, basePoints + cluePoints - hintPenalty)
  },

  startedAt: Date,
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 3. Security Isolation Policies

1. **`toPublicCase()` Serializer:**
   - Drops `solution` and `generationMetadata`.
   - Strips `solutionExplanation` from all clues.
   - Masks clue descriptions for clues not yet discovered.
2. **Post-Accusation Resolution:**
   - Solution data is exposed only via `GET /api/cases/:id/result` when the associated `Investigation` record has status `completed`.
   - Prevents client inspect-element or network tab discovery of the culprit prior to the final accusation.
