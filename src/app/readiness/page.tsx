"use client";

import React from "react";
import Link from "next/link";
import { Briefcase, ArrowRight, ShieldCheck, ChevronRight, Activity } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { GlassCard, GradientText, SectionLabel } from "@/components/shared";

export default function JobReadiness() {
  const roles = [
    {
      title: "Frontend Developer",
      match: 82,
      color: "#6366F1",
      required: ["React", "TypeScript", "Tailwind CSS"],
      missing: ["Testing", "Accessibility"],
      status: "Ready to Apply",
    },
    {
      title: "Backend Developer",
      match: 74,
      color: "#8B5CF6",
      required: ["Node.js", "SQL", "Git"],
      missing: ["System Design", "Docker"],
      status: "Needs Skill Bridging",
    },
    {
      title: "Full Stack Developer",
      match: 77,
      color: "#60A5FA",
      required: ["Next.js", "TypeScript", "SQL"],
      missing: ["AWS", "CI/CD"],
      status: "Ready to Apply",
    },
    {
      title: "AI Engineer",
      match: 55,
      color: "#F59E0B",
      required: ["Python", "Algorithms"],
      missing: ["PyTorch", "Model Ops"],
      status: "Critical Gaps",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Job <GradientText>Readiness</GradientText>
            </h1>
            <p className="text-white/45 text-sm mt-1">
              Know your match score across core engineering domains before you apply.
            </p>
          </div>
          <Link
            href="/history"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/8 text-xs font-semibold text-white/70 hover:bg-white/5 cursor-pointer"
          >
            Report History
            <ChevronRight size={13} />
          </Link>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {roles.map((r) => (
            <GlassCard key={r.title} className="p-6 md:p-8 flex flex-col justify-between" glow={r.color}>
              <div>
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white">{r.title}</h3>
                    <div className="text-[10px] text-white/30 mt-0.5">Target Track Matching</div>
                  </div>
                  <span
                    className="text-[9px] font-semibold px-2.5 py-0.5 rounded-md border"
                    style={{
                      borderColor: r.match >= 75 ? "rgba(52,211,153,0.3)" : "rgba(245,158,11,0.3)",
                      backgroundColor: r.match >= 75 ? "rgba(52,211,153,0.08)" : "rgba(245,158,11,0.08)",
                      color: r.match >= 75 ? "#34D399" : "#F59E0B",
                    }}
                  >
                    {r.status}
                  </span>
                </div>

                {/* Score bar */}
                <div className="flex items-baseline gap-2 mb-2">
                  <div
                    className="text-4xl font-black bg-clip-text text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${r.color}, ${r.color}99)`,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {r.match}%
                  </div>
                  <span className="text-[10px] text-white/35 uppercase">Readiness match</span>
                </div>

                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mb-6">
                  <div className="h-full rounded-full" style={{ width: `${r.match}%`, backgroundColor: r.color }} />
                </div>

                {/* Details layout */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="text-white/30 uppercase text-[9px] tracking-wide mb-1.5">Acquired Skills</div>
                    <div className="flex flex-wrap gap-1">
                      {r.required.map(s => (
                        <span key={s} className="px-1.5 py-0.5 rounded bg-white/5 border border-white/8 text-white/50 text-[10px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/30 uppercase text-[9px] tracking-wide mb-1.5">Missing Skills</div>
                    <div className="flex flex-wrap gap-1">
                      {r.missing.map(s => (
                        <span key={s} className="px-1.5 py-0.5 rounded border border-red-500/16 bg-red-500/8 text-red-300 text-[10px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/5 pt-5 mt-6 flex justify-between items-center text-xs">
                <span className="text-white/40">Benchmarked against junior standard</span>
                <Link
                  href="/assessments/jd-matching"
                  className="text-[#A5B4FC] hover:underline inline-flex items-center gap-1.5 font-semibold"
                >
                  Verify JDs alignment
                  <ArrowRight size={13} />
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
