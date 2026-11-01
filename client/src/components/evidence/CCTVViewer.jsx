import React, { useState, useEffect } from "react";
import { Camera, Play, Pause, RefreshCw, AlertTriangle, Video, Eye } from "lucide-react";

export const CCTVViewer = ({ evidence }) => {
  const content = evidence.content || {};
  const cameraName = content.cameraName || "CAM-01 (Corridor)";
  const location = content.location || "West Wing Study Corridor";
  const recordingTime = content.recordingTime || evidence.timestamp || "22:00:00 - 22:30:00";
  const observations = content.observations || [];

  const [isPlaying, setIsPlaying] = useState(true);
  const [activeFrameIndex, setActiveFrameIndex] = useState(0);
  const [filterMode, setFilterMode] = useState("nightvision"); // 'nightvision' or 'infrared'

  useEffect(() => {
    let interval;
    if (isPlaying && observations.length > 0) {
      interval = setInterval(() => {
        setActiveFrameIndex((prev) => (prev + 1) % observations.length);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, observations.length]);

  const currentObservation = observations[activeFrameIndex] || {
    time: "22:15:30",
    note: "System running standard security sweep. No anomalies detected."
  };

  return (
    <div className="flex flex-col rounded-xl border border-detective-border bg-[#0B0D12] overflow-hidden shadow-2xl">
      {/* CCTV Monitor Frame */}
      <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden border-b border-detective-border">
        {/* Scanline Overlay */}
        <div className="absolute inset-0 cctv-overlay pointer-events-none z-10" />

        {/* Ambient Dark Security Room Atmosphere */}
        <div
          className={`absolute inset-0 transition-colors duration-500 flex items-center justify-center ${
            filterMode === "nightvision"
              ? "bg-emerald-950/40"
              : "bg-red-950/30"
          }`}
        >
          {/* Simulated Grain & Atmospheric Room Background */}
          <img
            src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1000&auto=format&fit=crop&q=80"
            alt="CCTV Frame"
            className={`w-full h-full object-cover opacity-35 mix-blend-screen filter ${
              filterMode === "nightvision"
                ? "hue-rotate-90 saturate-200"
                : "grayscale contrast-150"
            }`}
          />
        </div>

        {/* Top Watermark Overlays */}
        <div className="absolute top-3 left-4 z-20 flex items-center space-x-3 font-mono text-xs text-white drop-shadow-md">
          <div className="flex items-center space-x-1.5 bg-black/60 px-2 py-1 rounded border border-white/20">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            <span className="font-bold text-red-500 tracking-wider">REC</span>
          </div>
          <span className="text-emerald-400 font-bold">{cameraName}</span>
          <span className="text-zinc-400 hidden sm:inline">&bull; {location}</span>
        </div>

        <div className="absolute top-3 right-4 z-20 font-mono text-xs text-emerald-400 bg-black/60 px-2 py-1 rounded border border-white/20">
          <span>{currentObservation.time} UTC</span>
        </div>

        {/* Center Frame Observation Subtitle */}
        <div className="absolute bottom-12 left-4 right-4 z-20">
          <div className="bg-black/80 backdrop-blur-md border border-emerald-500/40 rounded-lg p-3 text-emerald-300 font-mono text-xs flex items-start space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">EVENT LOG [{currentObservation.time}]:</span>{" "}
              <span>{currentObservation.note}</span>
            </div>
          </div>
        </div>

        {/* CCTV Bottom Controls */}
        <div className="absolute bottom-2 left-4 right-4 z-20 flex items-center justify-between text-xs font-mono text-zinc-300">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center space-x-1"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? "PAUSE FEED" : "RESUME"}</span>
            </button>
            <button
              onClick={() =>
                setFilterMode(filterMode === "nightvision" ? "infrared" : "nightvision")
              }
              className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center space-x-1"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>FILTER: {filterMode.toUpperCase()}</span>
            </button>
          </div>
          <div className="text-[11px] text-zinc-400">
            FRAME {activeFrameIndex + 1} OF {Math.max(1, observations.length)}
          </div>
        </div>
      </div>

      {/* Surveillance Log Breakdown Table */}
      <div className="p-4 bg-[#12161f]">
        <h4 className="text-xs font-mono uppercase tracking-wider text-detective-muted mb-2 flex items-center gap-1.5">
          <Video className="w-3.5 h-3.5 text-detective-accent" />
          <span>Surveillance Timeline Extraction</span>
        </h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          {observations.map((obs, idx) => (
            <div
              key={idx}
              onClick={() => {
                setActiveFrameIndex(idx);
                setIsPlaying(false);
              }}
              className={`p-2 rounded text-xs font-mono cursor-pointer transition-all flex items-start space-x-3 ${
                idx === activeFrameIndex
                  ? "bg-emerald-950/70 border border-emerald-600/60 text-emerald-200"
                  : "bg-detective-surface hover:bg-detective-surface2 text-detective-muted border border-transparent"
              }`}
            >
              <span className="font-bold text-detective-accent flex-shrink-0">
                {obs.time}
              </span>
              <span>{obs.note}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CCTVViewer;
