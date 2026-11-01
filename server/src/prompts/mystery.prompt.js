import { DIFFICULTY_CONFIG } from "../validators/case.validator.js";

/**
 * Builds the comprehensive prompt for Google Gemini (spec.md Section E6)
 */
export const buildMysteryPrompt = (premise, difficulty) => {
  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.medium;

  return `You are an expert mystery writer, criminologist, and interactive detective-game designer.
Your task is to create a logically consistent, thrilling, and 100% solvable detective investigation case based on the player's premise.

PLAYER MYSTERY PREMISE:
"${premise}"

DIFFICULTY LEVEL: ${difficulty.toUpperCase()}
MANDATORY STRUCTURAL REQUIREMENTS:
- Exactly ${config.suspects} suspects (with IDs: "SUSPECT_01", "SUSPECT_02", etc.)
- Exactly ${config.clues} clues (with IDs: "CLUE_01", "CLUE_02", etc.)
- Exactly ${config.hints} progressive hints (levels 1 to ${config.hints})
- Exactly ONE predetermined culprit from among the suspects.
- Between 3 and 5 rich evidence items (with IDs: "EVIDENCE_01", "EVIDENCE_02", etc.). Supported types: "CHAT", "CCTV", "IMAGE", "DOCUMENT", "WITNESS".

CRITICAL GAMEPLAY & NARRATIVE RULES:
1. One Culprit: Choose the culprit FIRST before writing evidence. The culprit must be logically deducible purely through the evidence and clues provided.
2. Progressive Hints:
   - Hint 1: Broad investigative lead or area to focus on.
   - Hint 2: Point toward a specific evidence item or discrepancy.
   - Hint 3 (if applicable): Reveal an alibi contradiction or timeline flaw without naming the culprit directly.
   - NEVER explicitly state the culprit in any hint.
3. Logical Consistency:
   - Evidence timestamps must align with the timeline.
   - Suspect alibis must be testable against the CCTV, chat logs, documents, or witness statements.
   - Include red herrings, but their deceptive appearance must be explained in the final solution.
   - At least 2-3 clues must be "critical" and directly convict the culprit.
4. Rich Digital Evidence Formatting:
   - CHAT: Include "participants" array and "messages" array (sender, text, timestamp).
   - CCTV: Include "cameraName", "location", "recordingTime", and "observations" array of timestamped movements.
   - DOCUMENT: Fictional autopsy, financial records, emails, or police report text.
   - WITNESS: Witness name, statement transcript, and relation to victim.
   - IMAGE: Photographic description of crime scene or suspicious physical object.

OUTPUT FORMAT:
You MUST output strictly raw JSON matching this schema with no markdown backticks, no markdown codeblocks, and no preamble:

{
  "title": "A captivating case title",
  "category": "murder | theft | disappearance | corporate_crime",
  "story": "Detailed incident narrative describing the crime scene and situation...",
  "victim": {
    "name": "Full Name",
    "age": 45,
    "occupation": "Occupation",
    "description": "Short bio and relation to the case"
  },
  "suspects": [
    {
      "suspectId": "SUSPECT_01",
      "name": "Full Name",
      "age": 34,
      "occupation": "Occupation",
      "relationship": "Relationship to victim",
      "background": "Personal background...",
      "motive": "Plausible reason for suspicion...",
      "alibi": "Where they claim to have been...",
      "statement": "Direct quote statement given to investigators...",
      "publicDescription": "Brief summary visible to player..."
    }
  ],
  "timeline": [
    {
      "time": "21:30",
      "event": "Description of event...",
      "relatedSuspects": ["SUSPECT_01"]
    }
  ],
  "evidence": [
    {
      "evidenceId": "EVIDENCE_01",
      "type": "CHAT",
      "title": "Private WhatsApp Exchange",
      "description": "Extracted phone messages from the victim's phone...",
      "timestamp": "22:15",
      "relatedSuspects": ["SUSPECT_01", "SUSPECT_02"],
      "content": {
        "participants": ["Alice", "Bob"],
        "messages": [
          { "sender": "Alice", "text": "Are you at the office?", "timestamp": "22:14" },
          { "sender": "Bob", "text": "I'm heading out now.", "timestamp": "22:15" }
        ]
      }
    }
  ],
  "clues": [
    {
      "clueId": "CLUE_01",
      "title": "Key Clue Title",
      "description": "Full description of what this clue signifies once discovered...",
      "type": "digital | physical | forensic | testimonial",
      "evidenceId": "EVIDENCE_01",
      "importance": "critical",
      "relatedSuspects": ["SUSPECT_01"],
      "discoveryText": "Alert text shown when the player discovers this clue...",
      "solutionExplanation": "Internal explanation of how this proves or disproves guilt..."
    }
  ],
  "hints": [
    {
      "level": 1,
      "content": "Look closely at the timestamps on the digital evidence."
    }
  ],
  "solution": {
    "culpritId": "SUSPECT_01",
    "motive": "Clear, detailed breakdown of why they committed the crime...",
    "method": "Step-by-step description of how they executed it...",
    "explanation": "Master detective synthesis connecting all critical clues...",
    "criticalClueIds": ["CLUE_01"],
    "redHerringExplanations": ["Why the other suspects looked suspicious but are innocent..."]
  }
}
`;
};
