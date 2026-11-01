import React from "react";
import { Link } from "react-router-dom";
import { Search, Brain, Shield, FileSearch, Sparkles, ChevronRight, Lock, Eye, AlertOctagon } from "lucide-react";

export const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Ambient Detective Glow Background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-red-950/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-detective-accent/10 border border-detective-accent/30 text-detective-accent text-xs font-mono tracking-widest uppercase mb-6 animate-pulseSlow">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Detective Room &bull; Powered by Google Gemini</span>
          </div>

          {/* Heading */}
          <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Every Mystery Has a <span className="text-detective-accent underline decoration-red-900/50">Secret</span>.
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-lg sm:text-xl text-detective-muted max-w-2xl mx-auto font-sans leading-relaxed">
            Step into the shoes of a lead investigator. Enter any custom mystery premise, interrogate AI-generated suspects, examine surveillance CCTV, decipher encrypted chats, and find the real culprit.
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/create"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-detective-accent hover:bg-detective-accent-hover text-white font-bold text-base shadow-xl shadow-detective-accent/25 hover:shadow-detective-accent/40 transition-all duration-200 flex items-center justify-center space-x-2.5 group"
            >
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Start Investigation</span>
              <ChevronRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-detective-surface hover:bg-detective-surface2 border border-detective-border text-zinc-300 hover:text-white font-medium text-sm transition-all duration-200"
            >
              How It Works
            </a>
          </div>

          {/* Case Preview Card Mockup */}
          <div className="mt-16 relative max-w-4xl mx-auto rounded-2xl border border-detective-border/80 bg-detective-surface/60 backdrop-blur-xl p-6 shadow-2xl overflow-hidden text-left">
            <div className="flex items-center justify-between pb-4 border-b border-detective-border/60">
              <div className="flex items-center space-x-2 text-xs font-mono text-detective-muted">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                <span className="text-zinc-300 font-bold">CASE STATUS: ACTIVE INVESTIGATION</span>
              </div>
              <span className="text-xs font-mono text-detective-accent border border-detective-accent/30 bg-detective-accent/10 px-2 py-0.5 rounded">
                DIFFICULTY: HARD (5 Suspects &bull; 9 Clues)
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono text-zinc-400">
              <div className="p-3 rounded-lg bg-detective-bg border border-detective-border/50">
                <div className="text-detective-accent font-bold mb-1">INCIDENT SCENARIO</div>
                <div className="line-clamp-2 font-sans text-zinc-300 text-xs">
                  A high-tech research facility lockdown leaves the chief geneticist dead inside an airtight lab...
                </div>
              </div>
              <div className="p-3 rounded-lg bg-detective-bg border border-detective-border/50">
                <div className="text-emerald-400 font-bold mb-1">DIGITAL EVIDENCE FOUND</div>
                <div className="line-clamp-2 font-sans text-zinc-300 text-xs">
                  CCTV camera glitch, encrypted biometric override log, shattered chemical flask.
                </div>
              </div>
              <div className="p-3 rounded-lg bg-detective-bg border border-detective-border/50">
                <div className="text-amber-400 font-bold mb-1">YOUR OBJECTIVE</div>
                <div className="line-clamp-2 font-sans text-zinc-300 text-xs">
                  Reconstruct the timeline, uncover alibi contradictions, and identify the single true culprit.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 border-t border-detective-border/60 bg-detective-surface/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
              The Detective Protocol
            </h2>
            <p className="mt-3 text-sm text-detective-muted font-sans">
              AI Mystery Room isn't a multiple-choice quiz. It's a genuine evidence-driven investigative sandbox.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="rounded-2xl border border-detective-border bg-detective-surface p-6 relative group hover:border-detective-accent/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-detective-accent/15 border border-detective-accent/30 flex items-center justify-center text-detective-accent font-mono font-bold text-lg mb-5">
                01
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">
                Define Any Mystery Premise
              </h3>
              <p className="text-xs text-detective-muted leading-relaxed font-sans">
                Type any murder, heist, espionage, or disappearance scenario. Choose between Easy, Medium, or Hard difficulty.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl border border-detective-border bg-detective-surface p-6 relative group hover:border-detective-accent/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-600/40 flex items-center justify-center text-emerald-400 font-mono font-bold text-lg mb-5">
                02
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">
                Analyze Evidence & Clues
              </h3>
              <p className="text-xs text-detective-muted leading-relaxed font-sans">
                Inspect suspect alibis, surveillance CCTV footage, encrypted WhatsApp chats, and forensic reports to uncover vital clues (+5 pts each).
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl border border-detective-border bg-detective-surface p-6 relative group hover:border-detective-accent/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-600/40 flex items-center justify-center text-red-400 font-mono font-bold text-lg mb-5">
                03
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">
                Make the Final Accusation
              </h3>
              <p className="text-xs text-detective-muted leading-relaxed font-sans">
                Accuse the suspect you believe is guilty. The backend validates your deduction, awards base points, and reveals the full solution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 border-t border-detective-border/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-xl border border-detective-border bg-detective-surface">
              <Brain className="w-6 h-6 text-detective-accent mb-3" />
              <h4 className="font-bold text-sm text-white mb-1">Gemini AI Generation</h4>
              <p className="text-xs text-detective-muted">
                Every case is generated fresh with airtight logical consistency and zero pre-baked solutions.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-detective-border bg-detective-surface">
              <Lock className="w-6 h-6 text-emerald-400 mb-3" />
              <h4 className="font-bold text-sm text-white mb-1">Server-Side Solution Security</h4>
              <p className="text-xs text-detective-muted">
                The real culprit is strictly isolated on the backend. No inspect element cheating possible.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-detective-border bg-detective-surface">
              <Eye className="w-6 h-6 text-amber-400 mb-3" />
              <h4 className="font-bold text-sm text-white mb-1">Interactive Digital Evidence</h4>
              <p className="text-xs text-detective-muted">
                Fictional WhatsApp messaging, simulated CCTV feeds, autopsy documents, and crime scene photos.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-detective-border bg-detective-surface">
              <AlertOctagon className="w-6 h-6 text-red-400 mb-3" />
              <h4 className="font-bold text-sm text-white mb-1">Progressive Hints & Scoring</h4>
              <p className="text-xs text-detective-muted">
                Request hints with calculated score penalties, or solve the case cleanly for the maximum detective score.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
