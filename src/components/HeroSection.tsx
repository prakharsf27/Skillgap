"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Zap, ArrowRight, Play, CheckCircle2, TrendingUp, Award } from "lucide-react";
import { GlassCard, GradientText } from "./shared";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Mesh background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          style={{
            position: "absolute",
            top: "-10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "90vw",
            height: "75vh",
            background:
              "radial-gradient(ellipse at center, rgba(99, 102, 241, 0.14) 0%, rgba(139, 92, 246, 0.07) 45%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            left: "5%",
            width: "360px",
            height: "360px",
            background: "radial-gradient(circle, rgba(96, 165, 250, 0.06) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.025) 1px, transparent 1px)`,
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Left Side */}
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/10"
            >
              <Zap size={11} className="text-[#A5B4FC]" />
              <span className="text-xs font-semibold text-[#A5B4FC]">
                AI-Powered · 100% Free Assessment
              </span>
            </div>

            <h1
              className="font-bold leading-[1.07] tracking-tight"
              style={{ fontSize: "clamp(2.4rem, 5.5vw, 3.75rem)" }}
            >
              <span className="text-white">Discover Your Industry </span>
              <GradientText>Skill Gaps</GradientText>
              <br />
              <span className="text-white">Before Recruiters Do</span>
            </h1>

            <p
              className="leading-relaxed max-w-lg text-white/50 text-[1.0625rem]"
            >
              AI-powered assessments analyze your coding skills, projects, certifications, and resume to identify exactly what is holding you back from landing your dream job.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/login?tab=signup"
                className="group flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-sm text-white transition-all duration-300 hover:opacity-90 cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                  boxShadow: "0 0 44px rgba(99, 102, 241, 0.45)",
                }}
              >
                Start Free Assessment
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <button
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-medium text-sm transition-all hover:border-white/20 cursor-pointer border border-white/10 bg-white/5 text-white/70"
              >
                <Play size={13} fill="currentColor" />
                Watch Demo
              </button>
            </div>

            <div className="flex flex-wrap gap-5 pt-1">
              {["4,200+ Students Assessed", "94% Accuracy Rate", "50+ Universities"].map((s) => (
                <div key={s} className="flex items-center gap-1.5 text-xs text-white/35">
                  <CheckCircle2 size={11} className="text-[#A5B4FC]" />
                  {s}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Side: Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.95, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <GlassCard className="p-7" glow="#6366F1" style={{ background: "rgba(10, 10, 20, 0.85)" }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-sm font-semibold text-white mb-0.5">Your Skill Report</div>
                  <div className="text-xs text-white/35">Rahul Sharma · CSE 2024</div>
                </div>
                <div
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold border border-indigo-500/30 bg-indigo-500/15 text-[#A5B4FC]"
                >
                  AI Generated
                </div>
              </div>

              {/* Overall readiness score */}
              <div
                className="flex items-center gap-5 mb-6 p-4 rounded-xl border border-indigo-500/15 bg-indigo-500/5"
              >
                <div className="relative w-16 h-16 flex-shrink-0">
                  <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
                    <circle cx="32" cy="32" r="27" fill="none" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="6" />
                    <circle
                      cx="32"
                      cy="32"
                      r="27"
                      fill="none"
                      stroke="url(#heroGrad)"
                      strokeWidth="6"
                      strokeDasharray={`${0.72 * 2 * Math.PI * 27} ${2 * Math.PI * 27}`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366F1" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">72%</span>
                  </div>
                </div>
                <div>
                  <div className="text-white font-semibold mb-1">Job Readiness Score</div>
                  <div className="text-xs text-white/40">
                    28% away from your target role
                  </div>
                </div>
              </div>

              {/* Subscores */}
              <div className="space-y-3.5 mb-5">
                {[
                  { label: "Coding Skills", score: 80, color: "#6366F1" },
                  { label: "Project Quality", score: 70, color: "#8B5CF6" },
                  { label: "Resume Match", score: 65, color: "#60A5FA" },
                  { label: "Certifications", score: 60, color: "#34D399" },
                ].map(({ label, score, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-white/60">{label}</span>
                      <span
                        className="font-mono font-semibold"
                        style={{ color, fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {score}%
                      </span>
                    </div>
                    <div className="h-[3px] rounded-full bg-white/5">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${color}, ${color}77)` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.7 }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Missing skills */}
              <div>
                <div className="text-[11px] mb-2.5 text-white/30">
                  Missing Skills
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {["System Design", "Docker", "AWS", "Testing", "GraphQL"].map((s) => (
                    <span
                      key={s}
                      className="text-[11px] px-2 py-0.5 rounded-md border border-red-500/20 bg-red-500/10 text-red-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* Floating badges */}
            <div
              className="absolute -top-4 -right-3 px-3 py-2 rounded-xl backdrop-blur-xl text-xs font-medium border border-indigo-500/30 bg-black/90 text-[#A5B4FC]"
            >
              <div className="flex items-center gap-1.5">
                <TrendingUp size={10} />
                React — High Demand
              </div>
            </div>
            <div
              className="absolute -bottom-4 -left-3 px-3 py-2 rounded-xl backdrop-blur-xl text-xs font-medium border border-purple-500/30 bg-black/90 text-[#C4B5FD]"
            >
              <div className="flex items-center gap-1.5">
                <Award size={10} />
                Top 15% in DSA
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[10px] tracking-widest uppercase text-white/20">
          Scroll
        </span>
        <div
          className="w-px h-10 bg-gradient-to-b from-indigo-500/50 to-transparent"
        />
      </div>
    </section>
  );
}
