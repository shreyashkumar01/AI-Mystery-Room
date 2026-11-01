# AI Mystery Room — Gemini AI Prompt Specification

This document details the system prompt engineering, structural parameters, and validation criteria used by the Gemini AI Generation Service (`server/src/services/gemini.service.js`).

---

## 1. System Prompt & Generation Rules

The prompt instructs the AI as follows:

```text
You are an expert mystery writer, criminologist, and interactive detective-game designer.
Your task is to create a logically consistent, thrilling, and 100% solvable detective investigation case based on the player's premise.
```

### Mandatory Structural Rules:
- **Easy:** Exactly 3 suspects, exactly 5 clues, exactly 2 hints.
- **Medium:** Exactly 4 suspects, exactly 7 clues, exactly 3 hints.
- **Hard:** Exactly 5 suspects, exactly 9 clues, exactly 3 hints.
- **Culprit Selection:** Chosen **first** before generating evidence.
- **Evidence Consistency:** Digital timestamps, CCTV feeds, and chat transcripts must strictly align with the chronological incident timeline.

---

## 2. Progressive Hint Design Rules

1. **Hint Level 1:** Broad investigative lead (e.g. "Focus on digital telecommunication timestamps").
2. **Hint Level 2:** Specific evidence connection or contradiction (e.g. "Compare the CCTV override log with the executive access codes").
3. **Hint Level 3:** Critical deduction pointer without explicitly naming the culprit (e.g. "Review who had access to both the study keycard and the internal Wi-Fi repeater at 22:12").
4. **Forbidden:** Hints must **never** explicitly name the culprit or reveal the solution method.

---

## 3. Automated Error Correction & Validation Loop

1. **Zod Schema Parsing:** Verifies types, array lengths, and object shapes.
2. **Logical Consistency Checks:**
   - Culprit ID must exist in `suspects`.
   - All `criticalClueIds` must exist in `clues`.
   - Suspect and clue IDs must be unique.
3. **Retry Mechanism:**
   - If validation fails, the service appends specific corrective error messages to the prompt.
   - Retries up to 3 times before falling back to the deterministic offline case engine.
