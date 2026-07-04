"use client";

import React from "react";
import Link from "next/link";
import { 
  BookOpen, Award, CheckCircle2, ChevronRight, 
  Target, Lightbulb, FolderGit2, Sparkles 
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { GlassCard, GradientText, SectionLabel } from "@/components/shared";

export default function LearningPath() {
  const milestones = [
    {
      title: "Current Position",
      desc: "Baseline readiness: 72%. Technical core logic is competent; scaling gaps verified.",
      icon: Target,
      color: "#6366F1",
      completed: true,
    },
    {
      title: "Step 1: System Design Fundamentals",
      desc: "Course: Scale Distributed Node Systems (Coursera). Close caching and load balancing concepts.",
      icon: BookOpen,
      color: "#8B5CF6",
      completed: true,
    },
    {
      title: "Step 2: Build Containerized Projects",
      desc: "Practice Project: Dockerize transaction APIs and deploy cluster proxies with Redis.",
      icon: FolderGit2,
      color: "#60A5FA",
      completed: false,
    },
    {
      title: "Step 3: Earn AWS Developer Associate",
      desc: "Verify credential relevance, weigh course against live cloud architectures.",
      icon: Award,
      color: "#F59E0B",
      completed: false,
    },
    {
      title: "Step 4: Target Job Role Application",
      desc: "Apply with 85%+ readiness matching. Review personalized JDs alignment.",
      icon: Lightbulb,
      color: "#34D399",
      completed: false,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Personalized <GradientText>Roadmap</GradientText>
            </h1>
            <p className="text-white/45 text-sm mt-1">
              Step-by-step career readiness growth plan formulated for your profile.
            </p>
          </div>
          <Link
            href="/readiness"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/8 text-xs font-semibold text-white/70 hover:bg-white/5 cursor-pointer"
          >
            Job Readiness
            <ChevronRight size={13} />
          </Link>
        </div>

        {/* Outer Split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Interactive Timeline */}
          <div className="lg:col-span-7 space-y-6 relative">
            <div className="absolute left-[1.625rem] top-8 bottom-8 w-px bg-gradient-to-b from-[#6366F1] via-[#8B5CF6] to-[#34D399]" />
            
            <div className="space-y-6">
              {milestones.map((m, idx) => {
                const Icon = m.icon;
                return (
                  <div key={m.title} className="flex gap-5 relative z-10">
                    <div className="flex-shrink-0 pt-3">
                      <div 
                        className="w-10 h-10 rounded-2xl flex items-center justify-center border transition-all duration-300"
                        style={{
                          backgroundColor: m.completed ? `${m.color}20` : "rgba(255, 255, 255, 0.03)",
                          borderColor: m.completed ? m.color : "rgba(255, 255, 255, 0.15)",
                        }}
                      >
                        <Icon size={16} style={{ color: m.completed ? m.color : "rgba(255, 255, 255, 0.3)" }} />
                      </div>
                    </div>
                    
                    <GlassCard className="flex-1 p-5" glow={m.completed ? m.color : ""}>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white text-xs">{m.title}</h4>
                        {m.completed && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full border border-indigo-500/30 bg-indigo-500/15 text-[#A5B4FC]">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/44 leading-relaxed">{m.desc}</p>
                    </GlassCard>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Practice & Course Cards */}
          <div className="lg:col-span-5 space-y-6">
            <GlassCard className="p-6" glow="#6366F1">
              <h3 className="text-white font-bold text-sm mb-4">Practice Challenges</h3>
              <div className="space-y-3">
                {[
                  { name: "LRU Cache Implementation", diff: "Medium", tag: "Design" },
                  { name: "Design Rate Limiter Gateway", diff: "Hard", tag: "Scale" },
                  { name: "Binary Tree Level Traversal", diff: "Medium", tag: "DSA" },
                ].map(p => (
                  <div key={p.name} className="p-3 rounded-xl border border-white/5 bg-white/[0.01] flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-white">{p.name}</div>
                      <div className="text-[10px] text-white/30 mt-0.5">{p.tag}</div>
                    </div>
                    <span className="text-[10px] font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                      {p.diff}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-6" glow="#34D399">
              <h3 className="text-white font-bold text-sm mb-4">Recommended Courses</h3>
              <div className="space-y-3">
                {[
                  { name: "Docker & Kubernetes Basics", prov: "Coursera", time: "12 hours" },
                  { name: "System Design for Beginners", prov: "Educative", time: "18 hours" },
                ].map(c => (
                  <div key={c.name} className="p-3.5 rounded-xl border border-white/5 bg-white/[0.01] flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-white">{c.name}</div>
                      <div className="text-[10px] text-white/40 mt-0.5">{c.prov} · {c.time}</div>
                    </div>
                    <ChevronRight size={13} className="text-white/30" />
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
