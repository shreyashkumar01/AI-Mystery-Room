import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ShieldAlert, Sparkles, FolderPlus, HelpCircle } from "lucide-react";

export const Navbar = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-detective-border/80 bg-detective-bg/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-lg bg-detective-accent/15 border border-detective-accent/40 flex items-center justify-center text-detective-accent group-hover:scale-105 transition-transform">
            <Search className="w-5 h-5 animate-pulseSlow" />
          </div>
          <div>
            <span className="font-display font-bold text-xl tracking-wider text-detective-text flex items-center gap-1.5">
              AI MYSTERY <span className="text-detective-accent">ROOM</span>
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-detective-muted block -mt-1">
              Gemini Detective Core
            </span>
          </div>
        </Link>

        {/* Navigation Actions */}
        <nav className="flex items-center space-x-3">
          <Link
            to="/create"
            className="flex items-center space-x-2 text-sm font-medium px-4 py-2 rounded-lg bg-detective-accent hover:bg-detective-accent-hover text-white shadow-lg shadow-detective-accent/20 transition-all duration-200"
          >
            <FolderPlus className="w-4 h-4" />
            <span className="hidden sm:inline">New Investigation</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
