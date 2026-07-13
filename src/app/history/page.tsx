"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  History, Calendar, Download, ChevronRight, 
  CheckCircle, ArrowRight, ShieldCheck 
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { GlassCard, GradientText } from "@/components/shared";

export default function ReportHistory() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("Session error:", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08080F] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin" />
          <p className="text-white/60 text-sm">Loading historical reports...</p>
        </div>
      </div>
    );
  }

  // Generate dynamic history entries from database
  const dsaAssessments = user?.assessments?.filter((a: any) => a.category === "DSA") || [];
  const scenarioAssessments = user?.assessments?.filter((a: any) => a.category === "Scenario") || [];
  const projectAssessments = user?.assessments?.filter((a: any) => a.category === "Project") || [];
  const latestResume = user?.resumes?.[0];

  const historyEntries: any[] = [];

  // Add resume analysis if present
  if (latestResume) {
    historyEntries.push({
      id: latestResume.id,
      date: new Date(latestResume.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      role: user?.targetTrack || "Candidate Profile",
      score: `${latestResume.atsScore}%`,
      type: "Resume ATS Analysis",
    });
  }

  // Add all other assessments from database
  user?.assessments?.forEach((ast: any) => {
    historyEntries.push({
      id: ast.id,
      date: new Date(ast.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      role: ast.title,
      score: `${ast.score}%`,
      type: ast.category === "DSA" ? "Algorithm Test" : ast.category === "Scenario" ? "System Design Scenario" : "Project Technical Interview",
    });
  });

  // Calculate baseline growth
  // Earliest assessment vs user's current readiness score
  const earliestScore = user?.assessments?.length 
    ? user.assessments[user.assessments.length - 1].score 
    : latestResume?.atsScore || 0;
  const currentScore = user?.readinessScore || 0;
  const growth = currentScore - earliestScore;

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
            {historyEntries.length === 0 ? (
              <div className="text-center py-12 text-white/30 text-sm">
                No history reports found yet. Complete an assessment or upload a resume to generate your first audit report.
              </div>
            ) : (
              historyEntries.map((entry) => (
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
              ))
            )}
          </div>
        </GlassCard>

        {/* Growth verification block */}
        {historyEntries.length > 0 && (
          <GlassCard className="p-6 text-center border-indigo-500/10" glow="#6366F1">
            <div className="max-w-md mx-auto space-y-4">
              <ShieldCheck size={28} className="text-indigo-400 mx-auto" />
              <h3 className="font-bold text-white text-base">
                {growth >= 0 
                  ? `Readiness growth: +${growth}% since initial scan`
                  : `Readiness growth: ${growth}% since initial scan`
                }
              </h3>
              <p className="text-xs text-white/45 leading-relaxed">
                By submitting evaluations and parsing your skills stack, your baseline readiness index changed from {earliestScore}% to {currentScore}%. Keep completing assessments to track further progress!
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
        )}
      </div>
    </DashboardLayout>
  );
}
