import React from "react";
import { ShieldCheck, Terminal } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-detective-border/60 bg-detective-bg py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-detective-muted gap-4">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-detective-accent" />
          <span>AI Mystery Room &copy; {new Date().getFullYear()} &bull; Powered by Google Gemini</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Detective Network Online</span>
          </span>
          <span className="text-detective-border">|</span>
          <span className="hover:text-detective-text transition-colors">v1.0.0 (Master Spec SSOT)</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
