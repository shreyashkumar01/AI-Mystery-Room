import React, { useState } from "react";
import { Image as ImageIcon, ZoomIn, Info, MapPin, Clock } from "lucide-react";

export const ImageViewer = ({ evidence }) => {
  const content = evidence.content || {};
  const [isZoomed, setIsZoomed] = useState(false);

  const imageUrl =
    evidence.mediaUrl ||
    content.mediaUrl ||
    "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80";

  const location = content.location || "Crime Scene Perimeter";
  const findings = content.findings || evidence.description || "Forensic image captured at scene.";

  return (
    <div className="flex flex-col rounded-xl border border-detective-border bg-[#161a23] overflow-hidden shadow-2xl">
      {/* Top Header */}
      <div className="px-5 py-3 border-b border-detective-border bg-[#12161f] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ImageIcon className="w-4 h-4 text-detective-accent" />
          <h4 className="text-sm font-semibold text-white">{evidence.title}</h4>
        </div>
        <div className="flex items-center space-x-3 text-xs font-mono text-detective-muted">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{evidence.timestamp || "22:45"}</span>
          </span>
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-detective-surface hover:bg-detective-surface2 text-zinc-200 transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5 text-detective-accent" />
            <span>{isZoomed ? "NORMAL" : "ZOOM"}</span>
          </button>
        </div>
      </div>

      {/* Image Viewport */}
      <div
        className={`relative w-full bg-black flex items-center justify-center overflow-hidden transition-all duration-300 ${
          isZoomed ? "h-[500px]" : "h-[360px]"
        }`}
      >
        <img
          src={imageUrl}
          alt={evidence.title}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isZoomed ? "scale-125 cursor-zoom-out" : "cursor-zoom-in"
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        />
        <div className="absolute bottom-3 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded border border-white/20 text-xs font-mono text-zinc-300 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-detective-accent" />
          <span>{location}</span>
        </div>
      </div>

      {/* Findings & Notes */}
      <div className="p-4 bg-[#0e1117] border-t border-detective-border">
        <div className="flex items-start space-x-2 text-xs text-zinc-300">
          <Info className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white font-mono uppercase tracking-wide">
              Forensic Findings:{" "}
            </span>
            <span className="leading-relaxed">{findings}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;
