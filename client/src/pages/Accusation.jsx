import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AlertOctagon, ArrowLeft, CheckCircle2, ShieldAlert, Sparkles, Scale } from "lucide-react";
import api from "../services/api";
import { useInvestigationStore } from "../store/investigationStore";
import SuspectCard from "../components/suspects/SuspectCard";
import SuspectModal from "../components/suspects/SuspectModal";

export const Accusation = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { currentCase, setCase } = useInvestigationStore();
  const [selectedSuspectId, setSelectedSuspectId] = useState(null);
  const [reasoning, setReasoning] = useState("");
  const [inspectedSuspect, setInspectedSuspect] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const res = await api.getCase(id);
        if (res.success && res.data) {
          setCase(res.data);
          if (res.data.status === "completed" || res.data.investigation?.status === "completed") {
            navigate(`/investigation/${id}/results`);
          }
        }
      } catch (err) {
        setError("Failed to load case data.");
      }
    };

    if (!currentCase || currentCase.caseId !== id) {
      fetchCase();
    }
  }, [id]);

  if (!currentCase) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-detective-border border-t-detective-accent animate-spin" />
        <p className="font-mono text-xs text-detective-muted">Loading accusation room...</p>
      </div>
    );
  }

  const selectedSuspect = currentCase.suspects?.find((s) => s.suspectId === selectedSuspectId);

  const handleConfirmSubmit = async () => {
    if (!selectedSuspectId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await api.submitAccusation(id, selectedSuspectId, reasoning);
      if (res.success) {
        navigate(`/investigation/${id}/results`);
      } else {
        setError(res.message || "Failed to submit accusation.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error submitting accusation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 font-sans">
      {/* Return link */}
      <div>
        <Link
          to={`/investigation/${id}`}
          className="inline-flex items-center space-x-2 text-xs font-mono text-detective-muted hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO INVESTIGATION WORKSPACE</span>
        </Link>
      </div>

      {/* Accusation Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-950/60 border border-red-700/60 text-red-400 text-xs font-mono uppercase">
          <Scale className="w-3.5 h-3.5" />
          <span>Formal Indictment Chamber</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-white">
          Make Final Accusation
        </h1>
        <p className="text-xs text-detective-muted font-sans leading-relaxed">
          Case: <span className="text-white font-bold">{currentCase.title}</span>. Select the individual you hold responsible for the crime based on evidence and motive.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-700/60 text-xs text-red-200 text-center">
          {error}
        </div>
      )}

      {/* Suspect Selection Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-xs uppercase tracking-wider text-white font-bold">
            Select Culprit (Choose Exactly One)
          </h3>
          {selectedSuspect && (
            <span className="font-mono text-xs text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Selected: {selectedSuspect.name}</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentCase.suspects?.map((suspect) => (
            <SuspectCard
              key={suspect.suspectId}
              suspect={suspect}
              selectable={true}
              isSelected={selectedSuspectId === suspect.suspectId}
              onSelect={(suspectId) => setSelectedSuspectId(suspectId)}
              onInspect={(s) => setInspectedSuspect(s)}
            />
          ))}
        </div>
      </div>

      {/* Investigative Reasoning Textarea */}
      <div className="rounded-xl border border-detective-border bg-detective-surface p-6 space-y-3">
        <div className="flex items-center justify-between">
          <label className="font-mono text-xs uppercase tracking-wider text-white font-bold block">
            Detective Reasoning & Deductive Logic (Optional)
          </label>
          <span className="text-xs font-mono text-detective-muted">
            {reasoning.length}/1000 chars
          </span>
        </div>
        <textarea
          rows={4}
          maxLength={1000}
          value={reasoning}
          onChange={(e) => setReasoning(e.target.value)}
          placeholder="Detail which specific evidence contradicted this suspect's alibi, timeline inconsistencies, or forensic clues that sealed their guilt..."
          className="w-full rounded-xl bg-detective-bg border border-detective-border focus:border-detective-accent text-white p-4 text-xs font-sans placeholder-zinc-500 transition-all outline-none resize-none"
        />
      </div>

      {/* Submit Accusation Trigger */}
      <div className="text-center pt-2">
        <button
          type="button"
          disabled={!selectedSuspectId}
          onClick={() => setShowConfirmModal(true)}
          className="w-full sm:w-auto px-10 py-4 rounded-xl bg-detective-accent hover:bg-detective-accent-hover text-white font-mono font-bold text-sm shadow-xl shadow-detective-accent/30 hover:shadow-detective-accent/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          SUBMIT FORMAL CHARGES
        </button>
      </div>

      {/* Irreversible Confirmation Modal (spec.md Section C6) */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-detective-surface border-2 border-red-700/80 rounded-2xl shadow-2xl p-6 text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-red-950 border border-red-600 flex items-center justify-center mx-auto text-red-400">
              <AlertOctagon className="w-8 h-8 animate-pulse" />
            </div>

            <div>
              <h3 className="font-display font-black text-xl text-white">
                Confirm Final Accusation?
              </h3>
              <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                You are formally accusing{" "}
                <span className="text-white font-bold underline">
                  {selectedSuspect?.name}
                </span>{" "}
                as the sole perpetrator of the crime.
              </p>
              <p className="text-[11px] text-red-400 font-mono mt-2 bg-red-950/40 p-2 rounded border border-red-900/40">
                ⚠️ This decision is final and irreversible. The case will be locked and the true solution will be revealed.
              </p>
            </div>

            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-5 py-2.5 rounded-lg bg-detective-bg hover:bg-zinc-800 border border-detective-border text-xs font-mono text-zinc-300"
              >
                Go Back & Review
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleConfirmSubmit}
                className="px-6 py-2.5 rounded-lg bg-detective-accent hover:bg-detective-accent-hover text-white font-mono font-bold text-xs shadow-lg shadow-detective-accent/30 disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Final Accusation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspect Dossier Modal */}
      {inspectedSuspect && (
        <SuspectModal
          suspect={inspectedSuspect}
          onClose={() => setInspectedSuspect(null)}
        />
      )}
    </div>
  );
};

export default Accusation;
