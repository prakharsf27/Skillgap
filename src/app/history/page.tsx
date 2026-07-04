"use client";

import React from "react";
import Link from "next/link";
import { 
  History, Calendar, Download, ChevronRight, 
  CheckCircle, ArrowRight, ShieldCheck 
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { GlassCard, GradientText } from "@/components/shared";

export default function ReportHistory() {
  const historyEntries = [
    { id: "h1", date: "June 2026", role: "Full Stack Developer", score: "72%", type: "Skill Gap Analysis", verified: true },
    { id: "h2", date: "May 2026", role: "Frontend Developer", score: "68%", type: "Baseline Assessment", verified: true },
    { id: "h3", date: "April 2026", role: "Backend Developer", score: "60%", type: "Initial Scans", verified: true },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Report <GradientText>History</GradientText>
            </h1>
            <p className="text-white/45 text-sm mt-1">
              Access previous evaluation audits and track performance gains.
            </p>
          </div>
          <Link
            href="/settings"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/8 text-xs font-semibold text-white/70 hover:bg-white/5 cursor-pointer"
          >
            Settings
            <ChevronRight size={13} />
          </Link>
        </div>

        {/* History Entries list */}
        <GlassCard className="p-6 md:p-8">
          <div className="space-y-4">
            {historyEntries.map((entry) => (
              <div 
                key={entry.id} 
                className="p-4 rounded-2xl border border-white/5 bg-white/[0.01] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:bg-white/[0.02]"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/22 flex items-center justify-center text-indigo-400 mt-0.5 flex-shrink-0">
                    <History size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">{entry.role}</h3>
                    <p className="text-xs text-white/40 mt-1 flex items-center gap-3">
                      <span>{entry.type}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {entry.date}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                  <div className="text-right sm:text-left">
                    <div className="text-[10px] text-white/30 uppercase">Score</div>
                    <div className="text-sm font-bold text-white mt-0.5">{entry.score}</div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => alert("Report downloaded successfully!")}
                      className="p-2.5 rounded-xl border border-white/8 bg-white/4 hover:bg-white/8 text-white/60 cursor-pointer transition-colors"
                      title="Download PDF"
                    >
                      <Download size={13} />
                    </button>
                    <Link
                      href="/reports/skill-gap"
                      className="flex items-center gap-1 px-3.5 py-2.5 rounded-xl border border-white/8 text-xs font-semibold text-white/70 hover:bg-white/5 cursor-pointer"
                    >
                      View Report
                      <ChevronRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Growth verification block */}
        <GlassCard className="p-6 text-center border-indigo-500/10" glow="#6366F1">
          <div className="max-w-md mx-auto space-y-4">
            <ShieldCheck size={28} className="text-indigo-400 mx-auto" />
            <h3 className="font-bold text-white text-base">Readiness growth: +12% since initial scan</h3>
            <p className="text-xs text-white/45 leading-relaxed">
              Completing the DSA algorithm checks and E-Commerce repository interview boosted your baseline readiness index from 60% to 72%.
            </p>
            <Link
              href="/learning-path"
              className="text-xs font-semibold text-[#A5B4FC] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              Continue roadmap milestones
              <ArrowRight size={13} />
            </Link>
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
