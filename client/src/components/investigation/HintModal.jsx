import React, { useState } from "react";
import { X, HelpCircle, AlertTriangle, Lightbulb, Sparkles } from "lucide-react";
import api from "../../services/api";
import { useInvestigationStore } from "../../store/investigationStore";

export const HintModal = ({ caseId, onClose }) => {
  const { currentCase, hintsUsed, hintsAvailable, applyHint } = useInvestigationStore();
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState(null);

  // Filter revealed hints from caseData
  const revealedHints =
    currentCase?.hints?.filter((h) => hintsUsed.includes(h.level)) || [];

  const handleConfirmRequest = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.requestHint(caseId);
      if (res.success) {
        applyHint(
          res.data.hintLevel,
          res.data.pointsDeducted,
          res.data.hintsRemaining,
          res.data.score
        );
        setShowConfirmation(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to request hint. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-detective-surface border border-detective-border rounded-2xl shadow-2xl overflow-hidden font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-detective-border bg-detective-surface2">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-600/40 text-amber-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">
                Progressive Hint System
              </h3>
              <p className="text-xs text-detective-muted font-mono">
                {hintsAvailable} of {currentCase?.difficulty === "easy" ? 2 : 3} hints remaining
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-detective-muted hover:text-white hover:bg-detective-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-700/60 text-xs text-red-200">
              {error}
            </div>
          )}

          {/* List of previously revealed hints */}
          {revealedHints.length === 0 ? (
            <div className="text-center py-6 text-detective-muted">
              <HelpCircle className="w-8 h-8 mx-auto text-detective-border mb-2" />
              <p className="text-sm">No hints requested yet for this case.</p>
              <p className="text-xs text-zinc-500 mt-1">
                Hints guide your investigation without directly revealing the culprit.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {revealedHints.map((hint) => (
                <div
                  key={hint.level}
                  className="p-3.5 rounded-xl bg-[#12161f] border border-amber-900/40 text-xs text-amber-200 font-mono space-y-1"
                >
                  <div className="font-bold text-amber-400 uppercase tracking-wider text-[10px]">
                    Hint Level {hint.level}:
                  </div>
                  <p className="leading-relaxed text-zinc-200 font-sans text-sm">
                    {hint.content}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Confirmation Warning Dialog */}
          {showConfirmation && (
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-600/50 space-y-3 animate-fadeIn">
              <div className="flex items-start space-x-2.5 text-xs text-amber-300">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-300">PENALTY WARNING: </span>
                  Consuming this hint will permanently deduct{" "}
                  <span className="font-bold underline text-white">10 points</span> from your
                  investigation score. Are you sure you wish to proceed?
                </div>
              </div>
              <div className="flex items-center justify-end space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowConfirmation(false)}
                  className="px-3 py-1.5 rounded-lg bg-detective-surface hover:bg-detective-surface2 text-xs font-mono text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRequest}
                  disabled={loading}
                  className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs font-mono shadow-md disabled:opacity-50"
                >
                  {loading ? "Unlocking..." : "Confirm & Deduct 10 Pts"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-detective-border bg-detective-surface2 flex items-center justify-between">
          <div className="text-xs font-mono text-detective-muted">
            Cost: <span className="text-red-400 font-bold">-10 points</span>
          </div>

          {!showConfirmation && (
            <button
              onClick={() => setShowConfirmation(true)}
              disabled={hintsAvailable <= 0}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs font-mono shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Lightbulb className="w-4 h-4" />
              <span>
                {hintsAvailable > 0
                  ? `Request Hint Level ${hintsUsed.length + 1}`
                  : "All Hints Used"}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HintModal;
