import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Shield, AlertTriangle, ArrowRight, RefreshCw, Wand2, CheckCircle2 } from "lucide-react";
import api from "../services/api";
import { useInvestigationStore } from "../store/investigationStore";

const PRESETS = [
  {
    title: "Mansion Gala Murder",
    text: "A wealthy tech entrepreneur is found poisoned in his private study during an exclusive charity gala at his coastal estate. Five associates were present, and each holds a deep financial grudge."
  },
  {
    title: "Art Gallery Heist",
    text: "A priceless Renaissance manuscript vanishes from a high-security vault during a midnight thunderstorm. The biometric alarm was disabled from within, leaving four museum staff under intense suspicion."
  },
  {
    title: "Locked Lab Sabotage",
    text: "The lead researcher at a cryogenic genetics facility is found unconscious with critical formula backups erased. All doors were card-locked, and only three scientists had clearance."
  }
];

const LOADING_MESSAGES = [
  "Analyzing your mystery premise...",
  "Creating suspects and their motives...",
  "Constructing the incident timeline...",
  "Generating digital evidence and CCTV records...",
  "Running structural & logical validation...",
  "Preparing your investigation room..."
];

export const CreateMystery = () => {
  const navigate = useNavigate();
  const { setCase } = useInvestigationStore();

  const [premise, setPremise] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState(null);

  // Cycle loading messages during mystery generation
  useEffect(() => {
    let interval;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < LOADING_MESSAGES.length - 1 ? prev + 1 : prev));
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = premise.trim();
    if (trimmed.length < 20) {
      setError("Mystery premise must be at least 20 characters long.");
      return;
    }
    if (trimmed.length > 2000) {
      setError("Mystery premise cannot exceed 2000 characters.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await api.generateMystery(trimmed, difficulty);
      if (res.success && res.data) {
        setCase(res.data);
        navigate(`/investigation/${res.data.caseId}`);
      } else {
        setError(res.message || "Failed to generate mystery. Please try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to generate your mystery at this time. Please check your connection and retry."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Page Title */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-detective-accent/10 border border-detective-accent/30 text-detective-accent text-xs font-mono uppercase mb-3">
          <Wand2 className="w-3.5 h-3.5" />
          <span>Case Creator</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-white">
          Create Your Mystery
        </h1>
        <p className="text-sm text-detective-muted mt-2 font-sans">
          Provide any premise or incident. Gemini will craft suspects, motives, CCTV logs, and a hidden culprit.
        </p>
      </div>

      {/* Main Creation Card */}
      <div className="rounded-2xl border border-detective-border bg-detective-surface p-6 sm:p-8 shadow-2xl relative">
        {loading ? (
          /* Animated Detective Loading View (spec.md Section C4) */
          <div className="py-16 text-center space-y-6">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-detective-border" />
              <div className="absolute inset-0 rounded-full border-4 border-detective-accent border-t-transparent animate-spin" />
              <div className="absolute inset-3 rounded-full bg-detective-bg flex items-center justify-center text-detective-accent">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
            </div>

            <div>
              <h3 className="font-display font-bold text-xl text-white">
                Building Your Mystery...
              </h3>
              <p className="text-sm font-mono text-detective-accent mt-2 animate-fadeIn min-h-[24px]">
                {LOADING_MESSAGES[loadingStep]}
              </p>
              <p className="text-xs text-detective-muted mt-3">
                Gemini is synthesizing logical clues, suspect alibis, and timestamped digital evidence.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-4 rounded-xl bg-red-950/60 border border-red-700/60 flex items-start space-x-3 text-xs text-red-200">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Generation Error: </span>
                  {error}
                </div>
              </div>
            )}

            {/* Premise Input */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="premise"
                  className="block text-sm font-bold text-white uppercase tracking-wider font-mono"
                >
                  Describe Your Mystery Premise
                </label>
                <span
                  className={`text-xs font-mono ${
                    premise.length < 20 || premise.length > 2000
                      ? "text-amber-400"
                      : "text-detective-muted"
                  }`}
                >
                  {premise.length}/2000 chars (min 20)
                </span>
              </div>

              <textarea
                id="premise"
                rows={5}
                value={premise}
                onChange={(e) => setPremise(e.target.value)}
                placeholder="Describe a crime, suspicious incident, disappearance, theft, or mysterious event you want to investigate..."
                className="w-full rounded-xl bg-detective-bg border border-detective-border focus:border-detective-accent focus:ring-1 focus:ring-detective-accent text-white p-4 text-sm font-sans placeholder-zinc-500 transition-all outline-none resize-none"
              />

              {/* Inspiration Presets */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-mono text-detective-muted block">
                  Or pick a scenario preset for inspiration:
                </span>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPremise(preset.text)}
                      className="px-3 py-1.5 rounded-lg bg-detective-surface2 hover:bg-zinc-800 border border-detective-border/80 text-xs text-zinc-300 hover:text-white transition-all text-left"
                    >
                      💡 {preset.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Difficulty Selector */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-white uppercase tracking-wider font-mono">
                Select Investigation Difficulty
              </label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Easy */}
                <div
                  onClick={() => setDifficulty("easy")}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    difficulty === "easy"
                      ? "border-emerald-500 bg-emerald-950/25 shadow-lg shadow-emerald-950/40"
                      : "border-detective-border bg-detective-bg hover:border-zinc-600"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display font-bold text-base text-emerald-400">
                      Easy
                    </span>
                    <span className="text-xs font-mono text-zinc-400">100 Base Pts</span>
                  </div>
                  <ul className="text-xs text-zinc-300 space-y-1 font-mono">
                    <li>&bull; 3 Suspects</li>
                    <li>&bull; 5 Clues</li>
                    <li>&bull; 2 Progressive Hints</li>
                  </ul>
                  <p className="text-[11px] text-zinc-400 mt-2 font-sans">
                    Straightforward clues and direct motive connections.
                  </p>
                </div>

                {/* Medium */}
                <div
                  onClick={() => setDifficulty("medium")}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    difficulty === "medium"
                      ? "border-amber-500 bg-amber-950/25 shadow-lg shadow-amber-950/40"
                      : "border-detective-border bg-detective-bg hover:border-zinc-600"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display font-bold text-base text-amber-400">
                      Medium
                    </span>
                    <span className="text-xs font-mono text-zinc-400">150 Base Pts</span>
                  </div>
                  <ul className="text-xs text-zinc-300 space-y-1 font-mono">
                    <li>&bull; 4 Suspects</li>
                    <li>&bull; 7 Clues</li>
                    <li>&bull; 3 Progressive Hints</li>
                  </ul>
                  <p className="text-[11px] text-zinc-400 mt-2 font-sans">
                    Balanced investigation with subtle red herrings.
                  </p>
                </div>

                {/* Hard */}
                <div
                  onClick={() => setDifficulty("hard")}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    difficulty === "hard"
                      ? "border-detective-accent bg-red-950/25 shadow-lg shadow-red-950/40"
                      : "border-detective-border bg-detective-bg hover:border-zinc-600"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display font-bold text-base text-red-400">
                      Hard
                    </span>
                    <span className="text-xs font-mono text-zinc-400">200 Base Pts</span>
                  </div>
                  <ul className="text-xs text-zinc-300 space-y-1 font-mono">
                    <li>&bull; 5 Suspects</li>
                    <li>&bull; 9 Clues</li>
                    <li>&bull; 3 Progressive Hints</li>
                  </ul>
                  <p className="text-[11px] text-zinc-400 mt-2 font-sans">
                    Complex timelines, deceptive alibis, and layered digital evidence.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={premise.trim().length < 20 || loading}
                className="w-full py-4 rounded-xl bg-detective-accent hover:bg-detective-accent-hover text-white font-bold text-base shadow-xl shadow-detective-accent/30 hover:shadow-detective-accent/50 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <Sparkles className="w-5 h-5 text-red-200 group-hover:rotate-12 transition-transform" />
                <span>Generate Mystery Case</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateMystery;
