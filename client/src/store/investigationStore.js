import { create } from "zustand";

export const useInvestigationStore = create((set, get) => ({
  currentCase: null,
  discoveredClueIds: [],
  hintsUsed: [],
  score: 0,
  hintsAvailable: 0,
  selectedEvidenceId: null,
  selectedSuspectId: null,
  loading: false,
  error: null,

  setCase: (caseData) => {
    const discovered = caseData.investigation?.discoveredClues || [];
    const hints = caseData.investigation?.hintsUsed || [];
    const currentScore = caseData.investigation?.score || 0;
    const initialEvidenceId = caseData.evidence?.[0]?.evidenceId || null;

    set({
      currentCase: caseData,
      discoveredClueIds: discovered,
      hintsUsed: hints,
      score: currentScore,
      hintsAvailable: caseData.hintsAvailable || 0,
      selectedEvidenceId: initialEvidenceId,
      error: null
    });
  },

  setSelectedEvidenceId: (evidenceId) => set({ selectedEvidenceId: evidenceId }),
  setSelectedSuspectId: (suspectId) => set({ selectedSuspectId: suspectId }),

  markClueDiscovered: (clueId, pointsAwarded = 5, newScore = null) => {
    const { discoveredClueIds, score, currentCase } = get();
    if (!discoveredClueIds.includes(clueId)) {
      const updatedClues = [...discoveredClueIds, clueId];
      const updatedScore = newScore !== null ? newScore : score + pointsAwarded;

      // Update clue discovery status in currentCase
      let updatedCase = currentCase;
      if (currentCase?.clues) {
        updatedCase = {
          ...currentCase,
          clues: currentCase.clues.map((c) =>
            c.clueId === clueId ? { ...c, isDiscovered: true } : c
          )
        };
      }

      set({
        discoveredClueIds: updatedClues,
        score: updatedScore,
        currentCase: updatedCase
      });
    }
  },

  applyHint: (hintLevel, pointsDeducted = 10, hintsRemaining = null, newScore = null) => {
    const { hintsUsed, score, hintsAvailable } = get();
    if (!hintsUsed.includes(hintLevel)) {
      const updatedHints = [...hintsUsed, hintLevel];
      const updatedScore = newScore !== null ? newScore : Math.max(0, score - pointsDeducted);
      const updatedRemaining = hintsRemaining !== null ? hintsRemaining : Math.max(0, hintsAvailable - 1);

      set({
        hintsUsed: updatedHints,
        score: updatedScore,
        hintsAvailable: updatedRemaining
      });
    }
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearCase: () =>
    set({
      currentCase: null,
      discoveredClueIds: [],
      hintsUsed: [],
      score: 0,
      hintsAvailable: 0,
      selectedEvidenceId: null,
      selectedSuspectId: null,
      error: null
    })
}));
