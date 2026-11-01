/**
 * Authoritative Scoring Engine (spec.md Section E9)
 * 
 * Rules:
 * Easy: 100 base points
 * Medium: 150 base points
 * Hard: 200 base points
 * +5 points per unique discovered clue
 * -10 points per hint consumed
 * Minimum final score: 0
 * Incorrect accusation gets 0 base points
 */

export const BASE_POINTS = {
  easy: 100,
  medium: 150,
  hard: 200
};

export const CLUE_POINT_VALUE = 5;
export const HINT_PENALTY_VALUE = 10;

export const calculateScore = ({
  difficulty,
  isCorrect,
  discoveredCluesCount = 0,
  hintsUsedCount = 0
}) => {
  const normDifficulty = (difficulty || "medium").toLowerCase();
  const basePoints = isCorrect ? BASE_POINTS[normDifficulty] || 150 : 0;
  const cluePoints = Math.max(0, discoveredCluesCount) * CLUE_POINT_VALUE;
  const hintPenalty = Math.max(0, hintsUsedCount) * HINT_PENALTY_VALUE;

  const finalScore = Math.max(0, basePoints + cluePoints - hintPenalty);

  return {
    basePoints,
    cluePoints,
    hintPenalty,
    finalScore
  };
};

export const calculateCurrentScore = ({ discoveredCluesCount = 0, hintsUsedCount = 0 }) => {
  const cluePoints = Math.max(0, discoveredCluesCount) * CLUE_POINT_VALUE;
  const hintPenalty = Math.max(0, hintsUsedCount) * HINT_PENALTY_VALUE;
  return Math.max(0, cluePoints - hintPenalty);
};
