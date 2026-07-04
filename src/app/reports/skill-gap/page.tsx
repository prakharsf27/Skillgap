"use client";

import React from "react";
import Link from "next/link";
import { 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer 
} from "recharts";
import { 
  Download, Share2, ShieldCheck, CheckCircle2, 
  Activity, AlertTriangle, ArrowRight, Zap 
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { GlassCard, GradientText, SectionLabel } from "@/components/shared";

const radarData = [
  { subject: "Coding", score: 80 },
  { subject: "DSA", score: 75 },
  { subject: "Projects", score: 70 },
  { subject: "Resume", score: 65 },
  { subject: "Sys Design", score: 40 },
  { subject: "Certs", score: 60 },
];

export default function SkillGapReport() {
  const breakdown = [
    { label: "Coding Score", score: 80, color: "#6366F1" },
    { label: "Project Score", score: 70, color: "#8B5CF6" },
    { label: "Certification Score", score: 60, color: "#60A5FA" },
    { label: "Resume Score", score: 65, color: "#34D399" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Skill Gap <GradientText>Report</GradientText>
            </h1>
            <p className="text-white/45 text-sm mt-1">
              Personalized roadmap benchmarks compared against senior engineer criteria.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => alert("Report downloaded successfully!")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/8 text-xs font-semibold text-white/70 hover:bg-white/5 cursor-pointer"
            >
              <Download size={13} />
              Download PDF
            </button>
            <button
              onClick={() => alert("Report share link copied to clipboard!")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/8 text-xs font-semibold text-white/70 hover:bg-white/5 cursor-pointer"
            >
              <Share2 size={13} />
              Share Report
            </button>
          </div>
        </div>

        {/* Outer Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Overall Readiness & Scores */}
          <div className="lg:col-span-5 space-y-6">
            <GlassCard className="p-6 flex items-center gap-5" glow="#6366F1">
              <div className="relative w-20 h-20 flex-shrink-0">
                <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                  <circle cx="40" cy="40" r="33" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="7" />
                  <circle
                    cx="40"
                    cy="40"
                    r="33"
                    fill="none"
                    strokeWidth="7"
                    stroke="url(#finalGrad)"
                    strokeDasharray={`${0.72 * 2 * Math.PI * 33} ${2 * Math.PI * 33}`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="finalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366F1" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-white">72%</span>
                  <span className="text-[9px] text-white/40">Overall</span>
                </div>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Readiness Match</h3>
                <p className="text-xs text-white/40 mt-1 leading-relaxed">
                  You are <span className="text-indigo-400 font-semibold">28% away</span> from candidate benchmark standards.
                </p>
              </div>
            </GlassCard>

            {/* Score Breakdown progress indicators */}
            <GlassCard className="p-6 space-y-5">
              <h3 className="text-white font-semibold text-sm">Performance Index</h3>
              <div className="space-y-4">
                {breakdown.map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-white/60">{item.label}</span>
                      <span className="font-semibold" style={{ color: item.color }}>{item.score}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${item.score}%`, backgroundColor: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Missing Skills card */}
            <GlassCard className="p-6" glow="#EF4444">
              <h3 className="text-white font-semibold text-sm mb-4">Critical Missing Skills</h3>
              <div className="flex flex-wrap gap-2">
                {["System Design", "Docker", "AWS", "Testing", "GraphQL", "Redis"].map((s) => (
                  <span
                    key={s}
                    className="text-xs px-2.5 py-1 rounded-lg border border-red-500/18 bg-red-500/8 text-red-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Right: Radar Chart & Growth details */}
          <div className="lg:col-span-7 space-y-6">
            <GlassCard className="p-6 flex flex-col justify-between" glow="#6366F1">
              <h3 className="text-white font-semibold text-sm mb-4 text-center">Skill Mapping Benchmarks</h3>
              <div style={{ height: 260 }} className="w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255, 255, 255, 0.05)" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10, fontFamily: "Inter" }}
                    />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#6366F1"
                      fill="#6366F1"
                      fillOpacity={0.15}
                      strokeWidth={1.5}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <GlassCard className="p-5" glow="#34D399">
                <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-1.5">
                  <Zap size={13} className="text-emerald-400" />
                  Top Strengths
                </h4>
                <ul className="space-y-2 text-xs text-white/50">
                  <li>· DSA & algorithm layout checks</li>
                  <li>· Core programming syntax logic</li>
                  <li>· Component state optimizations</li>
                </ul>
              </GlassCard>

              <GlassCard className="p-5" glow="#EF4444">
                <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-1.5">
                  <AlertTriangle size={13} className="text-red-400" />
                  Top Weaknesses
                </h4>
                <ul className="space-y-2 text-xs text-white/50">
                  <li>· Container virtualization configurations</li>
                  <li>· Inter-process caching protocols</li>
                  <li>· Application security parameters</li>
                </ul>
              </GlassCard>
            </div>

            {/* Suggested path link */}
            <GlassCard className="p-6" glow="#8B5CF6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h4 className="font-bold text-white text-sm">Review Recommended Growth Plan</h4>
                  <p className="text-xs text-white/44 mt-1 leading-relaxed">
                    AI generated milestone-based course tracks, certification routes, and portfolio practice code items.
                  </p>
                </div>
                <Link
                  href="/learning-path"
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-white transition-all hover:opacity-90 cursor-pointer flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
                >
                  Start Roadmap
                  <ArrowRight size={13} className="ml-2" />
                </Link>
              </div>
            </GlassCard>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
