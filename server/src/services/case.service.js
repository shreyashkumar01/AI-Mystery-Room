import { Case } from "../models/Case.js";
import { Investigation } from "../models/Investigation.js";
import { generateMysteryWithGemini } from "./gemini.service.js";
import { calculateScore, calculateCurrentScore } from "./scoring.service.js";

/**
 * Case Service orchestrating business logic and database interactions
 */

export const createMysteryCase = async (premise, difficulty) => {
  // 1. Generate case structure via Gemini / dynamic engine
  const generatedData = await generateMysteryWithGemini(premise, difficulty);

  // 2. Persist Case in MongoDB
  const caseDoc = new Case({
    title: generatedData.title,
    premise,
    story: generatedData.story,
    category: generatedData.category || "mystery",
    difficulty,
    status: "active",
    victim: generatedData.victim,
    suspects: generatedData.suspects,
    clues: generatedData.clues,
    evidence: generatedData.evidence,
    timeline: generatedData.timeline,
    hints: generatedData.hints,
    solution: generatedData.solution,
    generationMetadata: {
      model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
      generatedAt: new Date(),
      validationStatus: "passed"
    }
  });

  await caseDoc.save();

  // 3. Create initial Investigation record
  const investigationDoc = new Investigation({
    caseId: caseDoc._id,
    status: "active",
    discoveredClues: [],
    hintsUsed: [],
    score: 0
  });

  await investigationDoc.save();

  // 4. Return sanitized public representation
  return caseDoc.toPublicCase(investigationDoc);
};

export const getCaseById = async (caseId) => {
  const caseDoc = await Case.findById(caseId);
  if (!caseDoc) {
    const error = new Error("This mystery could not be found.");
    error.statusCode = 404;
    error.code = "CASE_NOT_FOUND";
    throw error;
  }

  const investigationDoc = await Investigation.findOne({ caseId: caseDoc._id }).sort({ createdAt: -1 });

  return caseDoc.toPublicCase(investigationDoc);
};

export const discoverClue = async (caseId, clueId) => {
  const caseDoc = await Case.findById(caseId);
  if (!caseDoc) {
    const error = new Error("This mystery could not be found.");
    error.statusCode = 404;
    error.code = "CASE_NOT_FOUND";
    throw error;
  }

  const investigationDoc = await Investigation.findOne({ caseId: caseDoc._id, status: "active" });
  if (!investigationDoc) {
    const error = new Error("This investigation is not active or has already been completed.");
    error.statusCode = 409;
    error.code = "INVESTIGATION_INACTIVE";
    throw error;
  }

  const clue = caseDoc.clues.find((c) => c.clueId === clueId);
  if (!clue) {
    const error = new Error("The requested clue does not exist.");
    error.statusCode = 404;
    error.code = "CLUE_NOT_FOUND";
    throw error;
  }

  const isAlreadyDiscovered = investigationDoc.discoveredClues.includes(clueId);
  let pointsAwarded = 0;

  if (!isAlreadyDiscovered) {
    investigationDoc.discoveredClues.push(clueId);
    pointsAwarded = 5;
    investigationDoc.score = calculateCurrentScore({
      discoveredCluesCount: investigationDoc.discoveredClues.length,
      hintsUsedCount: investigationDoc.hintsUsed.length
    });
    await investigationDoc.save();
  }

  return {
    clueId,
    discovered: true,
    pointsAwarded,
    score: investigationDoc.score,
    discoveredClues: investigationDoc.discoveredClues.length,
    clueDetails: {
      title: clue.title,
      description: clue.description,
      discoveryText: clue.discoveryText,
      importance: clue.importance,
      relatedSuspects: clue.relatedSuspects
    }
  };
};

export const requestHint = async (caseId) => {
  const caseDoc = await Case.findById(caseId);
  if (!caseDoc) {
    const error = new Error("This mystery could not be found.");
    error.statusCode = 404;
    error.code = "CASE_NOT_FOUND";
    throw error;
  }

  const investigationDoc = await Investigation.findOne({ caseId: caseDoc._id, status: "active" });
  if (!investigationDoc) {
    const error = new Error("This investigation is not active or has already been completed.");
    error.statusCode = 409;
    error.code = "INVESTIGATION_INACTIVE";
    throw error;
  }

  const maxHints = caseDoc.difficulty === "easy" ? 2 : 3;
  const currentHintsUsed = investigationDoc.hintsUsed.length;

  if (currentHintsUsed >= maxHints) {
    const error = new Error("You have used all available hints.");
    error.statusCode = 409;
    error.code = "HINT_LIMIT_REACHED";
    throw error;
  }

  const nextLevel = currentHintsUsed + 1;
  const hintItem = caseDoc.hints.find((h) => h.level === nextLevel) || caseDoc.hints[currentHintsUsed];

  if (!hintItem) {
    const error = new Error("No further hints available for this case.");
    error.statusCode = 404;
    error.code = "NO_HINT_AVAILABLE";
    throw error;
  }

  // Atomically append hint level and update score
  investigationDoc.hintsUsed.push(nextLevel);
  investigationDoc.score = calculateCurrentScore({
    discoveredCluesCount: investigationDoc.discoveredClues.length,
    hintsUsedCount: investigationDoc.hintsUsed.length
  });

  await investigationDoc.save();

  return {
    hintLevel: nextLevel,
    hint: hintItem.content,
    pointsDeducted: 10,
    score: investigationDoc.score,
    hintsRemaining: Math.max(0, maxHints - investigationDoc.hintsUsed.length)
  };
};

export const submitAccusation = async (caseId, suspectId, reasoning = "") => {
  const caseDoc = await Case.findById(caseId);
  if (!caseDoc) {
    const error = new Error("This mystery could not be found.");
    error.statusCode = 404;
    error.code = "CASE_NOT_FOUND";
    throw error;
  }

  const investigationDoc = await Investigation.findOne({ caseId: caseDoc._id, status: "active" });
  if (!investigationDoc) {
    const error = new Error("This investigation has already been completed.");
    error.statusCode = 409;
    error.code = "CASE_ALREADY_COMPLETED";
    throw error;
  }

  // Validate suspect belongs to this case
  const accusedSuspect = caseDoc.suspects.find((s) => s.suspectId === suspectId);
  if (!accusedSuspect) {
    const error = new Error("Please select a valid suspect.");
    error.statusCode = 400;
    error.code = "INVALID_SUSPECT";
    throw error;
  }

  const isCorrect = suspectId === caseDoc.solution.culpritId;

  // Calculate final score using backend scoring engine
  const scoreBreakdown = calculateScore({
    difficulty: caseDoc.difficulty,
    isCorrect,
    discoveredCluesCount: investigationDoc.discoveredClues.length,
    hintsUsedCount: investigationDoc.hintsUsed.length
  });

  // Complete investigation atomically
  investigationDoc.status = "completed";
  investigationDoc.accusation = {
    suspectId,
    reasoning,
    submittedAt: new Date(),
    isCorrect
  };
  investigationDoc.scoreBreakdown = scoreBreakdown;
  investigationDoc.score = scoreBreakdown.finalScore;
  investigationDoc.completedAt = new Date();

  await investigationDoc.save();

  return {
    caseId: caseDoc._id.toString(),
    investigationStatus: "completed",
    isCorrect,
    score: scoreBreakdown.finalScore,
    resultUrl: `/investigation/${caseDoc._id}/results`
  };
};

export const getCaseResult = async (caseId) => {
  const caseDoc = await Case.findById(caseId);
  if (!caseDoc) {
    const error = new Error("This mystery could not be found.");
    error.statusCode = 404;
    error.code = "CASE_NOT_FOUND";
    throw error;
  }

  const investigationDoc = await Investigation.findOne({ caseId: caseDoc._id });
  if (!investigationDoc || investigationDoc.status !== "completed") {
    const error = new Error("Investigation result is not available until accusation is submitted.");
    error.statusCode = 409;
    error.code = "CASE_NOT_COMPLETED";
    throw error;
  }

  const culpritSuspect = caseDoc.suspects.find((s) => s.suspectId === caseDoc.solution.culpritId);
  const selectedSuspect = caseDoc.suspects.find((s) => s.suspectId === investigationDoc.accusation.suspectId);

  // Critical clues with full explanations now revealed
  const criticalClues = caseDoc.clues
    .filter((c) => caseDoc.solution.criticalClueIds.includes(c.clueId))
    .map((c) => ({
      clueId: c.clueId,
      title: c.title,
      description: c.description,
      discoveryText: c.discoveryText,
      solutionExplanation: c.solutionExplanation
    }));

  return {
    caseId: caseDoc._id.toString(),
    title: caseDoc.title,
    difficulty: caseDoc.difficulty,
    verdict: investigationDoc.accusation.isCorrect ? "correct" : "incorrect",
    selectedSuspect: {
      suspectId: selectedSuspect?.suspectId,
      name: selectedSuspect?.name,
      avatarUrl: selectedSuspect?.avatarUrl
    },
    culprit: {
      suspectId: culpritSuspect?.suspectId,
      name: culpritSuspect?.name,
      occupation: culpritSuspect?.occupation,
      relationship: culpritSuspect?.relationship,
      avatarUrl: culpritSuspect?.avatarUrl
    },
    motive: caseDoc.solution.motive,
    method: caseDoc.solution.method,
    explanation: caseDoc.solution.explanation,
    criticalClues,
    redHerringExplanations: caseDoc.solution.redHerringExplanations || [],
    timeline: caseDoc.timeline,
    scoreBreakdown: investigationDoc.scoreBreakdown,
    finalScore: investigationDoc.score
  };
};
