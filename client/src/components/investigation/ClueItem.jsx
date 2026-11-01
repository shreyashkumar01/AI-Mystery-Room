import React, { useState } from "react";
import { Search, CheckCircle2, AlertTriangle, Sparkles, Lock } from "lucide-react";
import api from "../../services/api";
import { useInvestigationStore } from "../../store/investigationStore";

export const ClueItem = ({ clue, caseId }) => {
  const { markClueDiscovered } = useInvestigationStore();
  const [loading, setLoading] = useState(false);
  const [discoveryNotification, setDiscoveryNotification] = useState(null);

  const handleDiscover = async () => {
    if (clue.isDiscovered || loading) return;
    try {
      setLoading(true);
      const res = await api.discoverClue(caseId, clue.clueId);
      if (res.success) {
        markClueDiscovered(clue.clueId, res.data.pointsAwarded, res.data.score);
        setDiscoveryNotification(
          res.data.pointsAwarded > 0
            ? "Clue discovered! +5 points."
            : "Clue already on record."
        );
        setTimeout(() => setDiscoveryNotification(null), 4000);
      }
    } catch (err) {
      console.error("Clue discovery failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const getImportanceBadge = (importance) => {
    switch (importance) {
      case "critical":
        return "bg-red-950 text-red-400 border-red-800/50";
      case "misleading":
        return "bg-amber-950 text-amber-400 border-amber-800/50";
      default:
        return "bg-blue-950 text-blue-400 border-blue-800/50";
    }
  };

  return (
    <div
      className={`rounded-xl border p-4 transition-all duration-200 relative overflow-hidden ${
        clue.isDiscovered
          ? "border-emerald-700/50 bg-[#0f1715] shadow-lg shadow-emerald-950/20"
          : "border-detective-border/80 bg-detective-surface hover:border-detective-border"
      }`}
    >
      {/* Discovery Alert Toast */}
      {discoveryNotification && (
        <div className="absolute top-2 right-2 z-20 bg-emerald-600 text-white font-mono text-[11px] px-2.5 py-1 rounded shadow-md animate-bounce flex items-center space-x-1">
          <Sparkles className="w-3 h-3" />
          <span>{discoveryNotification}</span>
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-[10px] text-detective-muted bg-detective-bg px-1.5 py-0.5 rounded border border-detective-border/50">
              {clue.clueId}
            </span>
            <span
              className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border ${getImportanceBadge(
                clue.importance
              )}`}
            >
              {clue.importance || "Supporting"}
            </span>
            {clue.isDiscovered && (
              <span className="flex items-center space-x-1 text-[10px] text-emerald-400 font-mono">
                <CheckCircle2 className="w-3 h-3" />
                <span>DISCOVERED (+5 pts)</span>
              </span>
            )}
          </div>

          <h5 className="font-semibold text-sm text-white mt-1.5">{clue.title}</h5>

          <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
            {clue.description}
          </p>

          {clue.isDiscovered && clue.discoveryText && (
            <div className="mt-2.5 p-2 rounded bg-emerald-950/40 border border-emerald-800/30 text-xs text-emerald-200 font-mono">
              💡 {clue.discoveryText}
            </div>
          )}
        </div>

        {/* Discovery Action Button */}
        {!clue.isDiscovered ? (
          <button
            onClick={handleDiscover}
            disabled={loading}
            className="flex-shrink-0 flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-detective-accent hover:bg-detective-accent-hover text-white text-xs font-mono shadow-md transition-all duration-150 disabled:opacity-50"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{loading ? "Examining..." : "Discover Clue"}</span>
          </button>
        ) : (
          <div className="flex-shrink-0 p-2 rounded-lg bg-emerald-950/80 border border-emerald-600/40 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ClueItem;
