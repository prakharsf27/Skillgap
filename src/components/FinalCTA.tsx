import React from "react";
import Link from "next/link";
import { GradientText, SectionLabel } from "./shared";

export default function FinalCTA() {
  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div
          className="relative rounded-3xl overflow-hidden p-12 md:p-20 text-center border border-indigo-500/22"
          style={{
            background:
              "linear-gradient(135deg, rgba(99, 102, 241, 0.14) 0%, rgba(139, 92, 246, 0.14) 50%, rgba(96, 165, 250, 0.1) 100%)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(circle at 50% 110%, rgba(99, 102, 241, 0.22) 0%, transparent 60%)",
            }}
          />
          <div
            className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent"
          />

          <div className="relative z-10 space-y-6">
            <SectionLabel>Get Started Free</SectionLabel>
            <h2
              className="font-bold text-white leading-tight"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              Stop Guessing.
              <br />
              <GradientText>Start Improving.</GradientText>
            </h2>
            <p className="max-w-md mx-auto text-white/48 leading-relaxed">
              Discover your skill gaps and become industry-ready with AI. Free forever. No credit card required.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/login?tab=signup"
                className="px-9 py-4 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 cursor-pointer flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                  boxShadow: "0 0 60px rgba(99, 102, 241, 0.55)",
                }}
              >
                Start Free Assessment
              </Link>
              <button
                className="px-7 py-4 rounded-xl font-medium text-sm transition-all hover:border-white/20 cursor-pointer border border-white/10 bg-white/5 text-white/68"
              >
                View Sample Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
