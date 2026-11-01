import { describe, it, expect } from "vitest";
import { validateGeneratedMystery } from "../src/validators/case.validator.js";
import { generateDynamicOfflineCase } from "../src/services/gemini.service.js";

describe("AI Output Validation Specification Tests (spec.md Section F5 & E7)", () => {
  it("Validates Easy Mystery structure (exact 3 suspects, 5 clues, 2 hints)", () => {
    const easyCase = generateDynamicOfflineCase("A test premise about a robbery in a museum", "easy");
    const validated = validateGeneratedMystery(easyCase, "easy");
    expect(validated.suspects.length).toBe(3);
    expect(validated.clues.length).toBe(5);
    expect(validated.hints.length).toBe(2);
    expect(validated.solution.culpritId).toBe(validated.suspects[0].suspectId);
  });

  it("Validates Medium Mystery structure (exact 4 suspects, 7 clues, 3 hints)", () => {
    const mediumCase = generateDynamicOfflineCase("A test premise about a corporate espionage event", "medium");
    const validated = validateGeneratedMystery(mediumCase, "medium");
    expect(validated.suspects.length).toBe(4);
    expect(validated.clues.length).toBe(7);
    expect(validated.hints.length).toBe(3);
  });

  it("Validates Hard Mystery structure (exact 5 suspects, 9 clues, 3 hints)", () => {
    const hardCase = generateDynamicOfflineCase("A test premise about a locked room mystery in a manor", "hard");
    const validated = validateGeneratedMystery(hardCase, "hard");
    expect(validated.suspects.length).toBe(5);
    expect(validated.clues.length).toBe(9);
    expect(validated.hints.length).toBe(3);
  });

  it("Rejects mystery if suspect count does not match difficulty", () => {
    const invalidCase = generateDynamicOfflineCase("A test premise", "easy");
    // Change to require medium (4 suspects) but case has 3
    expect(() => validateGeneratedMystery(invalidCase, "medium")).toThrow();
  });

  it("Rejects mystery if culprit does not exist in suspect list", () => {
    const invalidCase = generateDynamicOfflineCase("A test premise", "easy");
    invalidCase.solution.culpritId = "NON_EXISTENT_SUSPECT";
    expect(() => validateGeneratedMystery(invalidCase, "easy")).toThrow(/Culprit ID/);
  });
});
