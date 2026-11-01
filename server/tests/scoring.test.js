import { describe, it, expect } from "vitest";
import { calculateScore, calculateCurrentScore } from "../src/services/scoring.service.js";

describe("Scoring Engine Specification Tests (spec.md Section F5 & E9)", () => {
  it("Easy: Correct accusation, 5 clues discovered, 1 hint used -> Expected: 115", () => {
    // 100 + (5 * 5) - (10 * 1) = 115
    const result = calculateScore({
      difficulty: "easy",
      isCorrect: true,
      discoveredCluesCount: 5,
      hintsUsedCount: 1
    });
    expect(result.finalScore).toBe(115);
    expect(result.basePoints).toBe(100);
    expect(result.cluePoints).toBe(25);
    expect(result.hintPenalty).toBe(10);
  });

  it("Medium: Correct accusation, 6 clues discovered, 2 hints used -> Expected: 160", () => {
    // 150 + (6 * 5) - (10 * 2) = 160
    const result = calculateScore({
      difficulty: "medium",
      isCorrect: true,
      discoveredCluesCount: 6,
      hintsUsedCount: 2
    });
    expect(result.finalScore).toBe(160);
    expect(result.basePoints).toBe(150);
    expect(result.cluePoints).toBe(30);
    expect(result.hintPenalty).toBe(20);
  });

  it("Hard: Correct accusation, 9 clues discovered, 3 hints used -> Expected: 215", () => {
    // 200 + (9 * 5) - (10 * 3) = 215
    const result = calculateScore({
      difficulty: "hard",
      isCorrect: true,
      discoveredCluesCount: 9,
      hintsUsedCount: 3
    });
    expect(result.finalScore).toBe(215);
    expect(result.basePoints).toBe(200);
    expect(result.cluePoints).toBe(45);
    expect(result.hintPenalty).toBe(30);
  });

  it("Easy: Incorrect accusation, 3 clues discovered, 2 hints used -> Expected: 0 (score floor at 0)", () => {
    // 0 + (3 * 5) - (10 * 2) = -5 -> max(0, -5) = 0
    const result = calculateScore({
      difficulty: "easy",
      isCorrect: false,
      discoveredCluesCount: 3,
      hintsUsedCount: 2
    });
    expect(result.finalScore).toBe(0);
    expect(result.basePoints).toBe(0);
    expect(result.cluePoints).toBe(15);
    expect(result.hintPenalty).toBe(20);
  });

  it("Hard: Incorrect accusation, 9 clues discovered, 1 hint used -> Expected: 35", () => {
    // 0 + (9 * 5) - (10 * 1) = 35
    const result = calculateScore({
      difficulty: "hard",
      isCorrect: false,
      discoveredCluesCount: 9,
      hintsUsedCount: 1
    });
    expect(result.finalScore).toBe(35);
    expect(result.basePoints).toBe(0);
    expect(result.cluePoints).toBe(45);
    expect(result.hintPenalty).toBe(10);
  });

  it("Easy: Correct accusation, 0 clues discovered, 2 hints used -> Expected: 80", () => {
    // 100 + (0 * 5) - (10 * 2) = 80
    const result = calculateScore({
      difficulty: "easy",
      isCorrect: true,
      discoveredCluesCount: 0,
      hintsUsedCount: 2
    });
    expect(result.finalScore).toBe(80);
    expect(result.basePoints).toBe(100);
    expect(result.cluePoints).toBe(0);
    expect(result.hintPenalty).toBe(20);
  });
});
