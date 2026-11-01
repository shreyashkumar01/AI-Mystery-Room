# AI Mystery Room — API Documentation

This document defines the complete REST API specification implemented under `/api`.

---

## Base URL
```
http://localhost:5000/api
```

## Global Response Format

### Success Response
```json
{
  "success": true,
  "message": "Human readable status message",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Human readable error description",
  "error": {
    "code": "ERROR_CODE_ENUM",
    "details": []
  }
}
```

---

## Endpoints

### 1. Health Check
- **Route:** `GET /health`
- **Description:** Verifies server and database availability.
- **Response `200`:**
  ```json
  {
    "success": true,
    "message": "AI Mystery Room API is running",
    "data": {
      "status": "healthy",
      "timestamp": "2026-10-30T22:30:00.000Z"
    }
  }
  ```

---

### 2. Generate Mystery Case
- **Route:** `POST /cases`
- **Rate Limit:** 20 requests per 10 minutes per IP
- **Description:** Accepts a user-defined natural-language premise and difficulty (`easy`, `medium`, `hard`), generates a validated mystery via Gemini or deterministic fallback, creates an active investigation session, and returns sanitized public case data.
- **Request Body:**
  ```json
  {
    "premise": "A wealthy tech entrepreneur is found poisoned in his private study during an exclusive charity gala at his coastal estate. Five associates were present, and each holds a deep financial grudge.",
    "difficulty": "medium"
  }
  ```
- **Validation:**
  - `premise`: string, required, 20–2000 characters.
  - `difficulty`: enum `["easy", "medium", "hard"]`.
- **Response `201` (Sanitized — Culprit & Solution Strictly Omitted):**
  ```json
  {
    "success": true,
    "message": "Mystery generated successfully",
    "data": {
      "caseId": "654321abcdef...",
      "title": "The Secret of Arthur Pendelton",
      "difficulty": "medium",
      "story": "On a stormy autumn evening...",
      "victim": {
        "name": "Arthur Pendelton",
        "occupation": "Tech Magnate & Philanthropist"
      },
      "suspects": [
        {
          "suspectId": "SUSPECT_01",
          "name": "Marcus Sterling",
          "occupation": "Chief Financial Officer",
          "relationship": "Business Partner",
          "publicDescription": "A sharp-dressed executive...",
          "statement": "I arrived with the balance sheet..."
        }
      ],
      "clues": [
        {
          "clueId": "CLUE_01",
          "title": "Encrypted Wire Transfer Confirmation",
          "isDiscovered": false,
          "importance": "critical"
        }
      ],
      "evidence": [
        {
          "evidenceId": "EVIDENCE_01",
          "type": "CHAT",
          "title": "Private Messages"
        }
      ],
      "hintsAvailable": 3,
      "status": "active"
    }
  }
  ```

---

### 3. Retrieve Case Data
- **Route:** `GET /cases/:id`
- **Description:** Retrieves the public investigation workspace data for a given case ID.
- **Response `200`:** Returns public case structure with live clue discovery status and hints available.

---

### 4. Discover a Clue
- **Route:** `POST /cases/:id/clues/:clueId/discover`
- **Description:** Unlocks a clue from an evidence item and awards +5 investigation points. Repeated calls on the same clue are idempotent and award 0 additional points.
- **Response `200`:**
  ```json
  {
    "success": true,
    "message": "Clue discovered successfully",
    "data": {
      "clueId": "CLUE_01",
      "discovered": true,
      "pointsAwarded": 5,
      "score": 5,
      "discoveredClues": 1,
      "clueDetails": {
        "title": "Encrypted Wire Transfer Confirmation",
        "description": "A shredded slip retrieved from the study wastebasket...",
        "discoveryText": "The transfer details match Marcus Sterling's secret Cayman account!",
        "importance": "critical"
      }
    }
  }
  ```

---

### 5. Request Progressive Hint
- **Route:** `POST /cases/:id/hints`
- **Description:** Unlocks the next sequential hint and deducts 10 points from the score.
- **Response `200`:**
  ```json
  {
    "success": true,
    "message": "Hint revealed successfully",
    "data": {
      "hintLevel": 1,
      "hint": "Scrutinize the digital alibis carefully...",
      "pointsDeducted": 10,
      "score": 0,
      "hintsRemaining": 2
    }
  }
  ```
- **Response `409`:** When all difficulty-specific hints have already been consumed.

---

### 6. Submit Final Accusation
- **Route:** `POST /cases/:id/accuse`
- **Description:** Submits the player's formal indictment against a single suspect. Transitions case to `completed`, computes authoritative score, and locks further actions.
- **Request Body:**
  ```json
  {
    "suspectId": "SUSPECT_01",
    "reasoning": "The CCTV timestamp and repeater logs proved Marcus was inside the study at 22:12."
  }
  ```
- **Response `200`:**
  ```json
  {
    "success": true,
    "message": "Accusation submitted successfully",
    "data": {
      "caseId": "654321abcdef...",
      "investigationStatus": "completed",
      "isCorrect": true,
      "score": 155,
      "resultUrl": "/investigation/654321abcdef.../results"
    }
  }
  ```

---

### 7. Retrieve Case Resolution
- **Route:** `GET /cases/:id/result`
- **Description:** Unseals the full mystery resolution, motive, method, critical clue playback, and scoring breakdown. Accessible only after an accusation has been submitted.
- **Response `200`:**
  ```json
  {
    "success": true,
    "message": "Investigation result retrieved successfully",
    "data": {
      "caseId": "654321abcdef...",
      "title": "The Secret of Arthur Pendelton",
      "difficulty": "medium",
      "verdict": "correct",
      "selectedSuspect": { "suspectId": "SUSPECT_01", "name": "Marcus Sterling" },
      "culprit": { "suspectId": "SUSPECT_01", "name": "Marcus Sterling", "occupation": "Chief Financial Officer" },
      "motive": "Facing exposure of a $2.4M embezzlement scheme...",
      "method": "Overrode the hallway CCTV feed using executive code #MS-9941...",
      "explanation": "Master synthesis...",
      "criticalClues": [],
      "scoreBreakdown": {
        "basePoints": 150,
        "cluePoints": 25,
        "hintPenalty": 20,
        "finalScore": 155
      },
      "finalScore": 155
    }
  }
  ```
- **Response `409`:** If the investigation is still active and has not yet submitted an accusation.
