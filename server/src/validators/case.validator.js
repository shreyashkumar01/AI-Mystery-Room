import { z } from "zod";

/**
 * Difficulty Configurations (spec.md Section E2)
 */
export const DIFFICULTY_CONFIG = {
  easy: { suspects: 3, clues: 5, hints: 2, basePoints: 100 },
  medium: { suspects: 4, clues: 7, hints: 3, basePoints: 150 },
  hard: { suspects: 5, clues: 9, hints: 3, basePoints: 200 }
};

/**
 * Client Case Generation Request Validator (spec.md Section D3)
 */
export const createCaseRequestSchema = z.object({
  premise: z
    .string({ required_error: "Please enter a mystery premise." })
    .trim()
    .min(20, { message: "Premise must be at least 20 characters long." })
    .max(2000, { message: "Premise cannot exceed 2000 characters." }),
  difficulty: z.enum(["easy", "medium", "hard"], {
    errorMap: () => ({ message: "Please select a valid difficulty (easy, medium, or hard)." })
  })
});

/**
 * Gemini AI Output Validation Schema (spec.md Section E5 & E7)
 */
const suspectSchema = z.object({
  suspectId: z.string().min(1),
  name: z.string().min(1),
  age: z.number().optional(),
  occupation: z.string().min(1),
  relationship: z.string().min(1),
  background: z.string().min(1),
  motive: z.string().min(1),
  alibi: z.string().min(1),
  statement: z.string().min(1),
  publicDescription: z.string().min(1),
  avatarUrl: z.string().optional()
});

const clueSchema = z.object({
  clueId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  type: z.string().min(1),
  evidenceId: z.string().optional(),
  importance: z.enum(["critical", "supporting", "misleading"]).default("supporting"),
  relatedSuspects: z.array(z.string()).default([]),
  discoveryText: z.string().min(1),
  solutionExplanation: z.string().min(1)
});

const evidenceSchema = z.object({
  evidenceId: z.string().min(1),
  type: z.enum(["CHAT", "CCTV", "IMAGE", "DOCUMENT", "WITNESS"]),
  title: z.string().min(1),
  description: z.string().min(1),
  content: z.any(),
  mediaUrl: z.string().optional(),
  timestamp: z.string().optional(),
  relatedSuspects: z.array(z.string()).default([])
});

const timelineSchema = z.object({
  time: z.string().min(1),
  event: z.string().min(1),
  relatedSuspects: z.array(z.string()).default([])
});

const hintSchema = z.object({
  level: z.number().int().min(1),
  content: z.string().min(1)
});

const solutionSchema = z.object({
  culpritId: z.string().min(1),
  motive: z.string().min(1),
  method: z.string().min(1),
  explanation: z.string().min(1),
  criticalClueIds: z.array(z.string()).min(1),
  redHerringExplanations: z.array(z.string()).default([])
});

export const geminiMysteryOutputSchema = z.object({
  title: z.string().min(1),
  category: z.string().default("murder"),
  story: z.string().min(20),
  victim: z.object({
    name: z.string().min(1),
    age: z.number().optional(),
    occupation: z.string().min(1),
    description: z.string().min(1)
  }),
  suspects: z.array(suspectSchema),
  clues: z.array(clueSchema),
  evidence: z.array(evidenceSchema),
  timeline: z.array(timelineSchema),
  hints: z.array(hintSchema),
  solution: solutionSchema
});

/**
 * Deep Structural & Logical Verification of AI-Generated Mystery (spec.md Section E7)
 */
export const validateGeneratedMystery = (data, difficulty) => {
  // Step 1: Structural schema validation
  const parsed = geminiMysteryOutputSchema.parse(data);

  const config = DIFFICULTY_CONFIG[difficulty];
  if (!config) {
    throw new Error(`Invalid difficulty level: ${difficulty}`);
  }

  const errors = [];

  // Step 2: Exact counts check
  if (parsed.suspects.length !== config.suspects) {
    errors.push(
      `Difficulty '${difficulty}' requires exactly ${config.suspects} suspects, but AI generated ${parsed.suspects.length}`
    );
  }

  if (parsed.clues.length !== config.clues) {
    errors.push(
      `Difficulty '${difficulty}' requires exactly ${config.clues} clues, but AI generated ${parsed.clues.length}`
    );
  }

  if (parsed.hints.length !== config.hints) {
    errors.push(
      `Difficulty '${difficulty}' requires exactly ${config.hints} hints, but AI generated ${parsed.hints.length}`
    );
  }

  // Step 3: Logical consistency checks
  const suspectIds = new Set(parsed.suspects.map((s) => s.suspectId));
  if (!suspectIds.has(parsed.solution.culpritId)) {
    errors.push(`Culprit ID '${parsed.solution.culpritId}' does not match any generated suspect ID`);
  }

  const clueIds = new Set(parsed.clues.map((c) => c.clueId));
  for (const critClueId of parsed.solution.criticalClueIds) {
    if (!clueIds.has(critClueId)) {
      errors.push(`Critical clue ID '${critClueId}' does not exist in generated clues`);
    }
  }

  // Check unique IDs
  if (suspectIds.size !== parsed.suspects.length) {
    errors.push("Duplicate suspect IDs detected in generated mystery");
  }
  if (clueIds.size !== parsed.clues.length) {
    errors.push("Duplicate clue IDs detected in generated mystery");
  }

  if (errors.length > 0) {
    const error = new Error(`Logical validation failed for generated mystery: ${errors.join("; ")}`);
    error.validationDetails = errors;
    throw error;
  }

  return parsed;
};
