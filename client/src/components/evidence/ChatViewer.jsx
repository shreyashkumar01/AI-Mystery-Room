import React from "react";
import { MessageSquare, PhoneCall, Video, CheckCheck, Clock } from "lucide-react";

export const ChatViewer = ({ evidence }) => {
  const content = evidence.content || {};
  const participants = content.participants || ["Participant A", "Participant B"];
  const messages = content.messages || [];

  return (
    <div className="flex flex-col h-[520px] rounded-xl border border-detective-border bg-[#0e1117] overflow-hidden shadow-2xl">
      {/* Header bar styled like a secure messaging app */}
      <div className="bg-[#161b24] border-b border-detective-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-emerald-950 border border-emerald-600/50 flex items-center justify-center text-emerald-400 font-bold font-mono">
            {participants[0]?.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-detective-text flex items-center gap-2">
              {participants.join(" & ")}
              <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/40 px-1.5 py-0.5 rounded font-mono">
                ENCRYPTED
              </span>
            </h4>
            <p className="text-xs text-detective-muted flex items-center gap-1">
              <Clock className="w-3 h-3 text-detective-muted" />
              <span>Timestamp: {evidence.timestamp || "Night of Incident"}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-detective-muted">
          <PhoneCall className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
          <Video className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
        </div>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0a0d13]/90 relative">
        <div className="text-center my-2">
          <span className="text-[11px] font-mono text-detective-muted/70 bg-detective-surface px-3 py-1 rounded-full border border-detective-border/50">
            Messages retrieved from extraction forensics
          </span>
        </div>

        {messages.map((msg, index) => {
          const isRight = index % 2 === 1;
          return (
            <div
              key={index}
              className={`flex flex-col ${isRight ? "items-end" : "items-start"} transition-all animate-fadeIn`}
            >
              <div
                className={`max-w-[78%] rounded-2xl px-4 py-2.5 shadow-md relative text-sm ${
                  isRight
                    ? "bg-emerald-900/60 border border-emerald-600/40 text-emerald-100 rounded-br-none"
                    : "bg-detective-surface border border-detective-border text-detective-text rounded-bl-none"
                }`}
              >
                <div className="text-[11px] font-semibold text-detective-accent mb-0.5">
                  {msg.sender}
                </div>
                <p className="leading-relaxed">{msg.text}</p>
                <div className="flex items-center justify-end space-x-1 mt-1 text-[10px] text-detective-muted">
                  <span>{msg.timestamp || "22:15"}</span>
                  <CheckCheck className="w-3 h-3 text-emerald-400" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input bar disabled notice */}
      <div className="bg-[#12161f] border-t border-detective-border px-4 py-2 text-center text-xs text-detective-muted font-mono">
        🔒 Evidence record sealed for court presentation. Chat is read-only.
      </div>
    </div>
  );
};

export default ChatViewer;
