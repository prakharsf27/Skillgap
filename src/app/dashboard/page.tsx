"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  TrendingUp, Award, Clock, ArrowRight, CheckCircle2, 
  AlertTriangle, BookOpen, ChevronRight, Briefcase 
} from "lucide-react";
import { 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip 
} from "recharts";
import DashboardLayout from "@/components/DashboardLayout";
import { GlassCard, GradientText } from "@/components/shared";

const radarData = [
  { subject: "Coding", score: 80 },
  { subject: "DSA", score: 75 },
  { subject: "Projects", score: 70 },
  { subject: "Resume", score: 65 },
  { subject: "Sys Design", score: 40 },
  { subject: "Certs", score: 60 },
];

const progressData = [
  { name: "Week 1", score: 55 },
  { name: "Week 2", score: 58 },
  { name: "Week 3", score: 64 },
  { name: "Week 4", score: 72 },
];

export default function UserDashboard() {
  const readinessMetrics = [
    { label: "Coding Skills", score: 80, color: "#6366F1" },
    { label: "Project Quality", score: 70, color: "#8B5CF6" },
    { label: "Resume Match", score: 65, color: "#60A5FA" },
    { label: "Certifications", score: 60, color: "#34D399" },
  ];

  const recentActivities = [
    { type: "assessment", title: "DSA Coding Test", date: "2 days ago", score: "80%", status: "completed" },
    { type: "resume", title: "Resume Upload", date: "4 days ago", score: "65%", status: "completed" },
    { type: "project", title: "E-Commerce Project Upload", date: "1 week ago", score: "70%", status: "completed" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Welcome back, <GradientText>Rahul</GradientText>
            </h1>
            <p className="text-white/45 text-sm mt-1">
              Here is your readiness summary for your target track: <span className="text-white font-semibold">Full Stack Developer</span>.
            </p>
          </div>
          <Link
            href="/assessments"
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs text-white transition-all hover:opacity-90 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
              boxShadow: "0 0 24px rgba(99, 102, 241, 0.25)",
            }}
          >
            Start Assessment
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Box 1: Overall Readiness circle */}
          <GlassCard className="p-6 md:col-span-4 flex flex-col justify-between" glow="#6366F1">
            <div>
              <h3 className="text-white font-semibold text-sm mb-1">Overall Job Readiness</h3>
              <p className="text-xs text-white/30 mb-6">Combined performance indexes</p>
            </div>
            <div className="relative w-36 h-36 mx-auto flex items-center justify-center my-4">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  strokeWidth="8"
                  stroke="url(#dashGrad)"
                  strokeDasharray={`${0.72 * 2 * Math.PI * 44} ${2 * Math.PI * 44}`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="dashGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white">72%</span>
                <span className="text-[10px] text-white/40">Readiness</span>
              </div>
            </div>
            <div className="text-center text-xs text-white/45 mt-4">
              Top <span className="text-[#A5B4FC] font-semibold">34%</span> of applicants in this role
            </div>
          </GlassCard>

          {/* Box 2: Skill Gap Meter */}
          <GlassCard className="p-6 md:col-span-8 flex flex-col justify-between" glow="#8B5CF6">
            <div>
              <h3 className="text-white font-semibold text-sm mb-1">Assessment Progress</h3>
              <p className="text-xs text-white/30 mb-6">Individual dimensions performance breakdown</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-4">
              {readinessMetrics.map(({ label, score, color }) => (
                <div key={label} className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/60">{label}</span>
                    <span className="font-semibold" style={{ color }}>{score}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${color}, ${color}77)` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-white/5 pt-4 mt-4 flex items-center justify-between text-xs">
              <span className="text-white/40">Next evaluation: Project Interview</span>
              <Link href="/assessments" className="text-[#A5B4FC] hover:underline flex items-center gap-1">
                Go to Hub <ChevronRight size={12} />
              </Link>
            </div>
          </GlassCard>

          {/* Box 3: Radar Chart */}
          <GlassCard className="p-6 md:col-span-6" glow="#60A5FA">
            <h3 className="text-white font-semibold text-sm mb-5">Skill Radar Comparison</h3>
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

          {/* Box 4: Progress Line Graph */}
          <GlassCard className="p-6 md:col-span-6" glow="#34D399">
            <h3 className="text-white font-semibold text-sm mb-5">Readiness Trends</h3>
            <div style={{ height: 260 }} className="w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progressData} margin={{ left: -20, top: 10 }}>
                  <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} stroke="rgba(255,255,255,0.05)" />
                  <YAxis domain={[0, 100]} tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} stroke="rgba(255,255,255,0.05)" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0E0E1C", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px" }}
                    itemStyle={{ color: "#ffffff", fontSize: 11 }}
                    labelStyle={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#8B5CF6"
                    fill="url(#progressGrad)"
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="progressGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Box 5: Recommended Action Items */}
          <GlassCard className="p-6 md:col-span-7 flex flex-col justify-between" glow="#F59E0B">
            <div>
              <h3 className="text-white font-semibold text-sm mb-1">Recommended Actions</h3>
              <p className="text-xs text-white/30 mb-6">Targeted recommendations to close critical gaps</p>
            </div>
            <div className="space-y-3.5 my-4">
              {[
                { title: "System Design basics module", desc: "Gain 15 readiness points", tag: "Docker & AWS", color: "#EF4444" },
                { title: "Review time complexities on DSA test", desc: "Optimize standard sorting algorithms", tag: "DSA", color: "#6366F1" },
                { title: "Refactor E-Commerce API endpoints", desc: "Build mock database repository test coverage", tag: "Projects", color: "#8B5CF6" },
              ].map((act) => (
                <div
                  key={act.title}
                  className="p-3.5 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: act.color }} />
                    <div>
                      <div className="text-xs font-semibold text-white">{act.title}</div>
                      <div className="text-[10px] text-white/40 mt-0.5">{act.desc}</div>
                    </div>
                  </div>
                  <span
                    className="text-[9px] font-semibold px-2 py-0.5 rounded-md border"
                    style={{
                      borderColor: `${act.color}25`,
                      backgroundColor: `${act.color}08`,
                      color: act.color,
                    }}
                  >
                    {act.tag}
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="/learning-path"
              className="text-xs font-semibold text-[#A5B4FC] hover:underline inline-flex items-center gap-1.5 mt-4 self-start"
            >
              View Full Roadmap
              <ArrowRight size={13} />
            </Link>
          </GlassCard>

          {/* Box 6: Recent Activity & Jobs */}
          <GlassCard className="p-6 md:col-span-5 flex flex-col justify-between" glow="#34D399">
            <div>
              <h3 className="text-white font-semibold text-sm mb-1">Recent Activity</h3>
              <p className="text-xs text-white/30 mb-6">Platform events checklist log</p>
            </div>
            <div className="space-y-4 my-4">
              {recentActivities.map((act) => (
                <div key={act.title} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={13} className="text-indigo-400" />
                    <div>
                      <div className="text-white font-medium">{act.title}</div>
                      <div className="text-[10px] text-white/30 mt-0.5">{act.date}</div>
                    </div>
                  </div>
                  <div className="font-mono text-[11px] font-semibold text-white/60">{act.score}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-white/5 pt-4 mt-4 flex items-center justify-between text-xs text-white/40">
              <span className="flex items-center gap-1">
                <Briefcase size={12} />
                Job matches: 4 roles
              </span>
              <Link href="/readiness" className="text-[#A5B4FC] hover:underline">
                Review matches
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
