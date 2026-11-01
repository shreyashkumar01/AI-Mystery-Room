import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Search,
  Users,
  Film,
  MessageSquare,
  FileText,
  Image as ImageIcon,
  Lightbulb,
  AlertOctagon,
  Award,
  ChevronRight,
  Clock,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  FolderOpen
} from "lucide-react";
import api from "../services/api";
import { useInvestigationStore } from "../store/investigationStore";
import SuspectCard from "../components/suspects/SuspectCard";
import SuspectModal from "../components/suspects/SuspectModal";
import ChatViewer from "../components/evidence/ChatViewer";
import CCTVViewer from "../components/evidence/CCTVViewer";
import DocumentViewer from "../components/evidence/DocumentViewer";
import ImageViewer from "../components/evidence/ImageViewer";
import ClueItem from "../components/investigation/ClueItem";
import HintModal from "../components/investigation/HintModal";

export const InvestigationRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    currentCase,
    setCase,
    selectedEvidenceId,
    setSelectedEvidenceId,
    discoveredClueIds,
    score,
    hintsAvailable,
    loading,
    setLoading
  } = useInvestigationStore();

  const [inspectedSuspect, setInspectedSuspect] = useState(null);
  const [hintModalOpen, setHintModalOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState("evidence"); // 'suspects', 'evidence', 'tools'
  const [error, setError] = useState(null);

  // Load case if not already present or if switching cases
  useEffect(() => {
    const fetchCase = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.getCase(id);
        if (res.success && res.data) {
          setCase(res.data);
          // If case is already completed, redirect to results
          if (res.data.status === "completed" || res.data.investigation?.status === "completed") {
            navigate(`/investigation/${id}/results`);
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load investigation room.");
      } finally {
        setLoading(false);
      }
    };

    if (!currentCase || currentCase.caseId !== id) {
      fetchCase();
    }
  }, [id]);

  if (loading || !currentCase) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-detective-border border-t-detective-accent animate-spin" />
        <p className="font-mono text-xs text-detective-muted">
          Loading investigation room secure evidence locker...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertOctagon className="w-12 h-12 text-detective-accent mx-auto" />
        <h2 className="text-xl font-bold text-white">Investigation Error</h2>
        <p className="text-sm text-detective-muted">{error}</p>
        <Link
          to="/create"
          className="inline-block px-4 py-2 rounded-lg bg-detective-accent text-white font-mono text-xs"
        >
          Start New Investigation
        </Link>
      </div>
    );
  }

  // Selected Evidence Item
  const activeEvidence =
    currentCase.evidence?.find((e) => e.evidenceId === selectedEvidenceId) ||
    currentCase.evidence?.[0];

  // Associated clues for selected evidence
  const associatedClues =
    currentCase.clues?.filter(
      (c) => c.evidenceId === activeEvidence?.evidenceId || !c.evidenceId
    ) || [];

  // Investigation completion percentage
  const totalClues = currentCase.clues?.length || 1;
  const discoveredCount = discoveredClueIds.length;
  const progressPercent = Math.min(100, Math.round((discoveredCount / totalClues) * 100));

  const renderEvidenceViewer = (evidence) => {
    if (!evidence) {
      return (
        <div className="p-12 text-center text-detective-muted font-mono text-xs bg-detective-surface rounded-xl border border-detective-border">
          No evidence item selected.
        </div>
      );
    }
    switch (evidence.type) {
      case "CHAT":
        return <ChatViewer evidence={evidence} />;
      case "CCTV":
        return <CCTVViewer evidence={evidence} />;
      case "DOCUMENT":
      case "WITNESS":
        return <DocumentViewer evidence={evidence} />;
      case "IMAGE":
        return <ImageViewer evidence={evidence} />;
      default:
        return <DocumentViewer evidence={evidence} />;
    }
  };

  const getEvidenceTypeIcon = (type) => {
    switch (type) {
      case "CHAT":
        return <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />;
      case "CCTV":
        return <Film className="w-3.5 h-3.5 text-red-400" />;
      case "IMAGE":
        return <ImageIcon className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Investigation Header Bar */}
      <div className="rounded-xl border border-detective-border bg-detective-surface p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-mono text-xs uppercase tracking-wider text-emerald-400">
              Active Case Room
            </span>
            <span className="text-zinc-600">&bull;</span>
            <span className="font-mono text-xs uppercase bg-detective-bg border border-detective-border px-2 py-0.5 rounded text-zinc-300">
              Difficulty: {currentCase.difficulty}
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl text-white">
            {currentCase.title}
          </h1>
        </div>

        {/* Live Score & Accusation Button */}
        <div className="flex items-center space-x-3">
          <div className="px-3.5 py-1.5 rounded-lg bg-detective-bg border border-detective-border font-mono text-right">
            <div className="text-[10px] text-detective-muted uppercase tracking-wider">
              Investigation Score
            </div>
            <div className="text-base font-bold text-emerald-400">
              {score} PTS
            </div>
          </div>

          <Link
            to={`/investigation/${currentCase.caseId}/accuse`}
            className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-detective-accent hover:bg-detective-accent-hover text-white font-bold text-sm shadow-xl shadow-detective-accent/25 hover:shadow-detective-accent/40 transition-all font-mono"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>MAKE ACCUSATION</span>
          </Link>
        </div>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="flex lg:hidden rounded-lg bg-detective-surface p-1 border border-detective-border text-xs font-mono">
        <button
          onClick={() => setMobileTab("suspects")}
          className={`flex-1 py-2 rounded-md transition-all ${
            mobileTab === "suspects"
              ? "bg-detective-accent text-white"
              : "text-detective-muted hover:text-white"
          }`}
        >
          Suspects ({currentCase.suspects?.length})
        </button>
        <button
          onClick={() => setMobileTab("evidence")}
          className={`flex-1 py-2 rounded-md transition-all ${
            mobileTab === "evidence"
              ? "bg-detective-accent text-white"
              : "text-detective-muted hover:text-white"
          }`}
        >
          Evidence ({currentCase.evidence?.length})
        </button>
        <button
          onClick={() => setMobileTab("tools")}
          className={`flex-1 py-2 rounded-md transition-all ${
            mobileTab === "tools"
              ? "bg-detective-accent text-white"
              : "text-detective-muted hover:text-white"
          }`}
        >
          Tools & Hints
        </button>
      </div>

      {/* Three-Column Workspace Layout (spec.md Section C5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Suspects & Story (3 cols) */}
        <div
          className={`lg:col-span-3 space-y-5 ${
            mobileTab !== "suspects" ? "hidden lg:block" : ""
          }`}
        >
          {/* Incident Story Card */}
          <div className="rounded-xl border border-detective-border bg-detective-surface p-4 space-y-2">
            <h3 className="font-mono text-xs uppercase tracking-wider text-detective-accent font-bold flex items-center gap-1.5">
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Incident Briefing</span>
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans line-clamp-6 hover:line-clamp-none transition-all">
              {currentCase.story}
            </p>
            {currentCase.victim && (
              <div className="pt-2 border-t border-detective-border/50 text-[11px] font-mono text-zinc-400">
                <span className="text-zinc-200 font-bold">Victim:</span>{" "}
                {currentCase.victim.name} ({currentCase.victim.occupation})
              </div>
            )}
          </div>

          {/* Suspects Dossiers */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-xs uppercase tracking-wider text-white font-bold flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-detective-accent" />
                <span>Suspects ({currentCase.suspects?.length})</span>
              </h3>
              <span className="text-[10px] font-mono text-detective-muted">
                Inspect Alibis
              </span>
            </div>

            <div className="space-y-2.5">
              {currentCase.suspects?.map((suspect) => (
                <SuspectCard
                  key={suspect.suspectId}
                  suspect={suspect}
                  onInspect={(s) => setInspectedSuspect(s)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Evidence Viewers & Associated Clues (6 cols) */}
        <div
          className={`lg:col-span-6 space-y-6 ${
            mobileTab !== "evidence" ? "hidden lg:block" : ""
          }`}
        >
          {/* Evidence Category Selector Tabs */}
          <div className="rounded-xl border border-detective-border bg-detective-surface p-2 flex flex-wrap gap-1.5">
            {currentCase.evidence?.map((item) => {
              const isSelected = item.evidenceId === activeEvidence?.evidenceId;
              return (
                <button
                  key={item.evidenceId}
                  onClick={() => setSelectedEvidenceId(item.evidenceId)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-mono transition-all ${
                    isSelected
                      ? "bg-detective-accent text-white shadow-md font-bold"
                      : "bg-detective-bg hover:bg-zinc-800 text-zinc-400 hover:text-white border border-detective-border/40"
                  }`}
                >
                  {getEvidenceTypeIcon(item.type)}
                  <span className="truncate max-w-[130px]">{item.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Evidence Content Component */}
          <div>{renderEvidenceViewer(activeEvidence)}</div>

          {/* Associated Clues & Discovery Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="font-mono text-xs uppercase tracking-wider text-white font-bold flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-detective-accent" />
                <span>Discoverable Clues in this Item ({associatedClues.length})</span>
              </h4>
              <span className="text-[10px] font-mono text-emerald-400">
                +5 Pts Each
              </span>
            </div>

            <div className="space-y-2.5">
              {associatedClues.map((clue) => (
                <ClueItem key={clue.clueId} clue={clue} caseId={currentCase.caseId} />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Tools, Hints, Progress & Accusation (3 cols) */}
        <div
          className={`lg:col-span-3 space-y-5 ${
            mobileTab !== "tools" ? "hidden lg:block" : ""
          }`}
        >
          {/* Investigation Progress Card */}
          <div className="rounded-xl border border-detective-border bg-detective-surface p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-xs uppercase tracking-wider text-white font-bold flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Case Progress</span>
              </h3>
              <span className="font-mono text-xs font-bold text-emerald-400">
                {progressPercent}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-detective-bg rounded-full h-2.5 border border-detective-border overflow-hidden">
              <div
                className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
              <div className="p-2.5 rounded-lg bg-detective-bg border border-detective-border/60">
                <div className="text-[10px] text-detective-muted">CLUES FOUND</div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {discoveredCount} / {totalClues}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-detective-bg border border-detective-border/60">
                <div className="text-[10px] text-detective-muted">HINTS REMAINING</div>
                <div className="text-sm font-bold text-amber-400 mt-0.5">
                  {hintsAvailable}
                </div>
              </div>
            </div>
          </div>

          {/* Progressive Hint Tool Button */}
          <div className="rounded-xl border border-amber-900/40 bg-amber-950/15 p-5 space-y-3">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-amber-900/40 border border-amber-600/40 text-amber-400 flex-shrink-0">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Need a Lead?</h4>
                <p className="text-xs text-amber-200/80 mt-0.5 leading-relaxed">
                  Request a progressive hint. Be advised: each hint deducts{" "}
                  <span className="font-bold text-red-400">-10 points</span>.
                </p>
              </div>
            </div>

            <button
              onClick={() => setHintModalOpen(true)}
              className="w-full py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-mono font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>HINT CONSOLE ({hintsAvailable} LEFT)</span>
            </button>
          </div>

          {/* Incident Timeline Reconstruction */}
          {currentCase.timeline && currentCase.timeline.length > 0 && (
            <div className="rounded-xl border border-detective-border bg-detective-surface p-4 space-y-3">
              <h4 className="font-mono text-xs uppercase tracking-wider text-white font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>Incident Timeline</span>
              </h4>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {currentCase.timeline.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded bg-detective-bg border border-detective-border/40 text-xs font-mono space-y-0.5"
                  >
                    <div className="text-detective-accent font-bold">{item.time}</div>
                    <div className="text-zinc-300 font-sans text-[11px] leading-tight">
                      {item.event}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Final Accusation CTA */}
          <div className="p-4 rounded-xl border border-detective-accent/40 bg-detective-accent/10 space-y-3 text-center">
            <h4 className="font-display font-bold text-sm text-white">
              Ready to Solve the Case?
            </h4>
            <p className="text-xs text-zinc-300">
              When you've connected the timeline and verified the alibis, make your final accusation.
            </p>
            <Link
              to={`/investigation/${currentCase.caseId}/accuse`}
              className="block w-full py-3 rounded-lg bg-detective-accent hover:bg-detective-accent-hover text-white font-mono font-bold text-xs shadow-lg shadow-detective-accent/30 transition-all"
            >
              ACCUSE THE CULPRIT
            </Link>
          </div>
        </div>
      </div>

      {/* Suspect Modal */}
      {inspectedSuspect && (
        <SuspectModal
          suspect={inspectedSuspect}
          onClose={() => setInspectedSuspect(null)}
        />
      )}

      {/* Progressive Hint Modal */}
      {hintModalOpen && (
        <HintModal
          caseId={currentCase.caseId}
          onClose={() => setHintModalOpen(false)}
        />
      )}
    </div>
  );
};

export default InvestigationRoom;
