import React from "react";
import { User, Eye, Briefcase, HeartHandshake } from "lucide-react";

export const SuspectCard = ({ suspect, onInspect, isSelected = false, selectable = false, onSelect }) => {
  const avatar =
    suspect.avatarUrl ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80";

  return (
    <div
      onClick={() => {
        if (selectable && onSelect) {
          onSelect(suspect.suspectId);
        }
      }}
      className={`rounded-xl border transition-all duration-200 overflow-hidden group ${
        isSelected
          ? "border-detective-accent bg-detective-accent/10 shadow-lg shadow-detective-accent/20 scale-[1.02]"
          : "border-detective-border/80 bg-detective-surface hover:border-detective-accent/50 hover:bg-detective-surface2"
      } ${selectable ? "cursor-pointer" : ""}`}
    >
      <div className="p-4 flex items-start space-x-3.5">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <img
            src={avatar}
            alt={suspect.name}
            className="w-14 h-14 rounded-lg object-cover border border-detective-border/80 group-hover:border-detective-accent/60 transition-colors"
          />
          <div className="absolute -bottom-1 -right-1 bg-detective-surface border border-detective-border text-[9px] font-mono px-1 rounded text-detective-muted">
            {suspect.suspectId}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white truncate group-hover:text-detective-accent transition-colors">
              {suspect.name}
            </h4>
            {suspect.age && (
              <span className="text-[11px] font-mono text-detective-muted">
                {suspect.age} yrs
              </span>
            )}
          </div>

          <div className="text-xs text-detective-muted flex items-center gap-1.5 mt-0.5 truncate">
            <Briefcase className="w-3 h-3 text-detective-accent/70 flex-shrink-0" />
            <span className="truncate">{suspect.occupation}</span>
          </div>

          <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 mt-0.5 truncate">
            <HeartHandshake className="w-3 h-3 text-detective-accent/70 flex-shrink-0" />
            <span className="truncate">{suspect.relationship}</span>
          </div>
        </div>
      </div>

      {/* Public summary / Action */}
      <div className="px-4 pb-3.5 pt-1 border-t border-detective-border/40 flex items-center justify-between text-xs">
        <p className="text-[11px] text-zinc-400 line-clamp-1 flex-1 pr-2">
          {suspect.publicDescription || suspect.statement}
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onInspect(suspect);
          }}
          className="flex items-center space-x-1 text-detective-accent hover:text-white px-2 py-1 rounded bg-detective-accent/10 hover:bg-detective-accent/30 transition-all font-mono text-[10px]"
        >
          <Eye className="w-3 h-3" />
          <span>DOSSIER</span>
        </button>
      </div>
    </div>
  );
};

export default SuspectCard;
