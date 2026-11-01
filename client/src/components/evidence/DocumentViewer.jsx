import React from "react";
import { FileText, Stamp, Award, ShieldAlert } from "lucide-react";

export const DocumentViewer = ({ evidence }) => {
  const content = evidence.content || {};
  const docTitle = content.title || evidence.title || "CONFIDENTIAL POLICE RECORD";
  const source = content.source || "Metropolitan Forensics Department";
  const timestamp = content.timestamp || evidence.timestamp || "Official Record";
  const textBody =
    typeof content === "string"
      ? content
      : content.content || content.findings || evidence.description || "No readable content found.";

  return (
    <div className="rounded-xl border border-detective-border bg-[#161a23] p-6 shadow-2xl relative overflow-hidden font-sans">
      {/* Background Watermark Stamp */}
      <div className="absolute right-4 top-8 -rotate-12 border-4 border-red-900/20 text-red-900/20 font-display font-black text-4xl sm:text-6xl px-4 py-2 pointer-events-none select-none tracking-widest uppercase">
        CONFIDENTIAL
      </div>

      {/* Official Document Header */}
      <div className="border-b-2 border-detective-border pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-detective-accent/20 border border-detective-accent/40 text-detective-accent">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-white tracking-wide">
              {docTitle}
            </h3>
            <p className="text-xs text-detective-muted font-mono">{source}</p>
          </div>
        </div>
        <div className="text-right font-mono text-xs text-detective-muted">
          <div>DOCUMENT ID: {evidence.evidenceId}</div>
          <div className="text-detective-accent">{timestamp}</div>
        </div>
      </div>

      {/* Document Content Box */}
      <div className="bg-[#0e1117] rounded-lg p-5 border border-detective-border/80 font-mono text-sm leading-relaxed text-zinc-300 whitespace-pre-line shadow-inner max-h-[380px] overflow-y-auto">
        {textBody}
      </div>

      {/* Official Sign-off Seal */}
      <div className="mt-6 pt-4 border-t border-detective-border/60 flex items-center justify-between text-xs text-detective-muted font-mono">
        <div className="flex items-center space-x-2">
          <Stamp className="w-4 h-4 text-emerald-400" />
          <span>VERIFIED CASE EVIDENCE ITEM #{evidence.evidenceId}</span>
        </div>
        <div className="text-zinc-500">CHAIN OF CUSTODY SECURED</div>
      </div>
    </div>
  );
};

export default DocumentViewer;
