import React from "react";
import { X, ShieldAlert, Clock, Quote, AlertCircle } from "lucide-react";

export const SuspectModal = ({ suspect, onClose }) => {
  if (!suspect) return null;

  const avatar =
    suspect.avatarUrl ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-detective-surface border border-detective-border rounded-2xl shadow-2xl overflow-hidden font-sans">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-detective-border bg-detective-surface2">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-xs text-detective-accent bg-detective-accent/10 border border-detective-accent/30 px-2 py-0.5 rounded">
              FILE: {suspect.suspectId}
            </span>
            <h3 className="font-display font-bold text-lg text-white">
              Suspect Dossier: {suspect.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-detective-muted hover:text-white hover:bg-detective-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Profile Overview */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <img
              src={avatar}
              alt={suspect.name}
              className="w-28 h-28 rounded-xl object-cover border-2 border-detective-border shadow-lg flex-shrink-0"
            />
            <div className="space-y-1.5 text-center sm:text-left flex-1">
              <h4 className="text-xl font-bold text-white">{suspect.name}</h4>
              <p className="text-sm text-detective-accent font-medium">
                {suspect.occupation} &bull; {suspect.relationship}
              </p>
              {suspect.age && (
                <p className="text-xs text-detective-muted font-mono">Age: {suspect.age}</p>
              )}
              <p className="text-xs text-zinc-300 leading-relaxed pt-1">
                {suspect.background}
              </p>
            </div>
          </div>

          {/* Official Statement */}
          <div className="p-4 rounded-xl bg-detective-bg border border-detective-border/80 relative">
            <div className="flex items-center space-x-2 text-xs font-mono text-detective-accent uppercase tracking-wider mb-2">
              <Quote className="w-4 h-4" />
              <span>Official Sworn Statement to Investigators</span>
            </div>
            <p className="text-sm italic text-zinc-200 leading-relaxed">
              "{suspect.statement}"
            </p>
          </div>

          {/* Alibi Section */}
          <div className="p-4 rounded-xl bg-[#11151e] border border-blue-900/30">
            <div className="flex items-center space-x-2 text-xs font-mono text-blue-400 uppercase tracking-wider mb-1.5">
              <Clock className="w-4 h-4" />
              <span>Claimed Alibi During Incident Window</span>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {suspect.alibi}
            </p>
          </div>

          {/* Known Motive / Suspicion */}
          <div className="p-4 rounded-xl bg-[#1b1214] border border-red-900/40">
            <div className="flex items-center space-x-2 text-xs font-mono text-detective-accent uppercase tracking-wider mb-1.5">
              <AlertCircle className="w-4 h-4 text-detective-accent" />
              <span>Investigative Focus & Potential Motive</span>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {suspect.motive}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-detective-border bg-detective-surface2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-detective-border hover:bg-zinc-700 text-white text-xs font-mono transition-colors"
          >
            CLOSE DOSSIER
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuspectModal;
