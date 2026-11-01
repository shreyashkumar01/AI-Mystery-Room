import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  Award,
  Sparkles,
  RotateCcw,
  Clock,
  Key,
  ShieldAlert,
  HelpCircle,
  FileText
} from "lucide-react";
import confetti from "canvas-confetti";
import api from "../services/api";

export const Results = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.getCaseResult(id);
        if (res.success && res.data) {
          setResult(res.data);
          if (res.data.verdict === "correct") {
            // Trigger victory confetti burst
            confetti({
              particleCount: 120,
              spread: 70,
              origin: { y: 0.6 }
            });
          }
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load case resolution. The case may still be active."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-detective-border border-t-detective-accent animate-spin" />
        <p className="font-mono text-xs text-detective-muted">
          Unsealing master case resolution and calculating final scores...
        </p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-detective-accent mx-auto" />
        <h2 className="text-xl font-bold text-white">Results Unavailable</h2>
        <p className="text-sm text-detective-muted">{error}</p>
        <Link
          to={`/investigation/${id}`}
          className="inline-block px-4 py-2 rounded-lg bg-detective-accent text-white font-mono text-xs"
        >
          Return to Investigation
        </Link>
      </div>
    );
  }

  const isCorrect = result.verdict === "correct";
  const culprit = result.culprit || {};
  const breakdown = result.scoreBreakdown || {};

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 font-sans">
      {/* Verdict Banner (spec.md Section C7) */}
      <div
        className={`rounded-2xl border p-8 text-center space-y-3 relative overflow-hidden shadow-2xl ${
          isCorrect
            ? "border-emerald-600/70 bg-gradient-to-b from-emerald-950/40 to-[#0e1613]"
            : "border-red-700/70 bg-gradient-to-b from-red-950/40 to-[#160e10]"
        }`}
      >
        <div className="inline-flex p-3 rounded-2xl bg-black/40 border border-white/10 mb-2">
          {isCorrect ? (
            <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
          ) : (
            <XCircle className="w-12 h-12 text-red-500" />
          )}
        </div>

        <h1 className="font-display font-black text-3xl sm:text-5xl text-white">
          {isCorrect ? "CASE SOLVED!" : "CASE NOT SOLVED"}
        </h1>

        <p className="text-sm sm:text-base text-zinc-300 max-w-xl mx-auto leading-relaxed">
          {isCorrect
            ? "Brilliant deduction, Detective. You accurately identified the culprit and reconstructed the chain of events."
            : "The evidence reveals a different perpetrator. Review the master breakdown below to see where the clues pointed."}
        </p>

        {/* Accused vs Actual */}
        <div className="inline-flex flex-wrap items-center justify-center gap-3 pt-3 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-zinc-300">
            YOUR ACCUSATION:{" "}
            <span className="font-bold text-white">
              {result.selectedSuspect?.name || "None"}
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-zinc-300">
            ACTUAL CULPRIT:{" "}
            <span className="font-bold text-detective-accent">
              {culprit.name}
            </span>
          </div>
        </div>
      </div>

      {/* Authoritative Score Breakdown Card (spec.md Section E9) */}
      <div className="rounded-xl border border-detective-border bg-detective-surface p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-detective-border/80">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <h3 className="font-mono text-xs uppercase tracking-wider text-white font-bold">
              Official Detective Performance Score
            </h3>
          </div>
          <span className="text-xs font-mono text-detective-muted">
            Difficulty: {result.difficulty?.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-lg bg-detective-bg border border-detective-border/60">
            <div className="text-[10px] font-mono text-detective-muted uppercase">
              Base Accusation
            </div>
            <div className="text-lg font-bold text-white mt-1">
              {breakdown.basePoints || 0} PTS
            </div>
            <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
              {isCorrect ? "Correct Verdict" : "0 Base (Incorrect)"}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-detective-bg border border-detective-border/60">
            <div className="text-[10px] font-mono text-emerald-400 uppercase">
              Clues Discovered
            </div>
            <div className="text-lg font-bold text-emerald-400 mt-1">
              +{breakdown.cluePoints || 0} PTS
            </div>
            <div className="text-[10px] text-zinc-500 font-mono mt-0.5">+5 per clue</div>
          </div>

          <div className="p-3 rounded-lg bg-detective-bg border border-detective-border/60">
            <div className="text-[10px] font-mono text-red-400 uppercase">
              Hint Penalties
            </div>
            <div className="text-lg font-bold text-red-400 mt-1">
              -{breakdown.hintPenalty || 0} PTS
            </div>
            <div className="text-[10px] text-zinc-500 font-mono mt-0.5">-10 per hint</div>
          </div>

          <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-600/50">
            <div className="text-[10px] font-mono text-emerald-300 uppercase font-bold">
              Final Total Score
            </div>
            <div className="text-2xl font-black text-emerald-400 mt-0.5">
              {result.finalScore || 0}
            </div>
            <div className="text-[10px] text-emerald-500/80 font-mono mt-0.5">
              Verified by Core
            </div>
          </div>
        </div>
      </div>

      {/* Culprit Dossier & Motive Card */}
      <div className="rounded-xl border border-detective-border bg-detective-surface p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-detective-border/80">
          <img
            src={
              culprit.avatarUrl ||
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80"
            }
            alt={culprit.name}
            className="w-24 h-24 rounded-xl object-cover border-2 border-red-700 shadow-lg flex-shrink-0"
          />
          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <div className="inline-block px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 text-[10px] font-mono uppercase font-bold">
              PERPETRATOR IDENTIFIED
            </div>
            <h3 className="text-2xl font-bold text-white">{culprit.name}</h3>
            <p className="text-xs text-detective-muted font-mono">
              {culprit.occupation} &bull; {culprit.relationship}
            </p>
          </div>
        </div>

        {/* Motive & Method */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-detective-bg border border-detective-border/80 space-y-1.5">
            <h4 className="font-mono text-xs uppercase tracking-wider text-detective-accent font-bold">
              Crime Motive
            </h4>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              {result.motive}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-detective-bg border border-detective-border/80 space-y-1.5">
            <h4 className="font-mono text-xs uppercase tracking-wider text-amber-400 font-bold">
              Execution Method
            </h4>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              {result.method}
            </p>
          </div>
        </div>

        {/* Full Detective Case Explanation */}
        <div className="p-5 rounded-xl bg-[#0f121a] border border-blue-900/40 space-y-2">
          <h4 className="font-mono text-xs uppercase tracking-wider text-blue-400 font-bold flex items-center gap-1.5">
            <FileText className="w-4 h-4" />
            <span>Master Case Reconstruction</span>
          </h4>
          <p className="text-xs text-zinc-200 leading-relaxed font-sans whitespace-pre-line">
            {result.explanation}
          </p>
        </div>
      </div>

      {/* Critical Clues Analysis */}
      {result.criticalClues && result.criticalClues.length > 0 && (
        <div className="rounded-xl border border-detective-border bg-detective-surface p-6 shadow-xl space-y-4">
          <h3 className="font-mono text-xs uppercase tracking-wider text-white font-bold flex items-center gap-1.5">
            <Key className="w-4 h-4 text-emerald-400" />
            <span>Critical Clues Corroboration</span>
          </h3>

          <div className="space-y-3">
            {result.criticalClues.map((clue) => (
              <div
                key={clue.clueId}
                className="p-3.5 rounded-lg bg-detective-bg border border-detective-border/70 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-white">{clue.title}</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    CRITICAL EVIDENCE
                  </span>
                </div>
                <p className="text-xs text-zinc-300">{clue.description}</p>
                {clue.solutionExplanation && (
                  <div className="text-xs text-emerald-300 font-mono pt-1">
                    🔍 {clue.solutionExplanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Red Herrings Explained */}
      {result.redHerringExplanations && result.redHerringExplanations.length > 0 && (
        <div className="rounded-xl border border-detective-border bg-detective-surface p-6 shadow-xl space-y-3">
          <h4 className="font-mono text-xs uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4" />
            <span>Red Herrings & Innocent Suspects Explained</span>
          </h4>
          <ul className="space-y-2 text-xs text-zinc-300 list-disc list-inside">
            {result.redHerringExplanations.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Footer: Create Another Mystery */}
      <div className="text-center pt-4">
        <Link
          to="/create"
          className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-detective-accent hover:bg-detective-accent-hover text-white font-mono font-bold text-sm shadow-xl shadow-detective-accent/30 hover:shadow-detective-accent/50 transition-all group"
        >
          <RotateCcw className="w-4 h-4 group-hover:-rotate-90 transition-transform" />
          <span>INVESTIGATE ANOTHER MYSTERY</span>
        </Link>
      </div>
    </div>
  );
};

export default Results;
