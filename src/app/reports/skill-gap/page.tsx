"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer 
} from "recharts";
import { 
  Download, Share2, ShieldCheck, CheckCircle2, 
  Activity, AlertTriangle, ArrowRight, Zap 
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { GlassCard, GradientText, SectionLabel } from "@/components/shared";

export default function SkillGapReport() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [certsScore, setCertsScore] = useState(0);
  const [projectsScore, setProjectsScore] = useState(0);

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

  useEffect(() => {
    if (!user) return;

    if (typeof window !== "undefined") {
      const savedCerts = localStorage.getItem("skillgap_certifications");
      if (savedCerts) {
        try {
          const parsed = JSON.parse(savedCerts);
          if (parsed.length) {
            const avg = Math.round(
              parsed.reduce((acc: number, cur: any) => acc + (cur.relevanceScore || 0), 0) / parsed.length
            );
            setCertsScore(avg);
          }
        } catch {}
      }

      const savedProjects = localStorage.getItem("skillgap_projects");
      if (savedProjects) {
        try {
          const parsed = JSON.parse(savedProjects);
          if (parsed.length) {
            let totalScore = 0;
            let count = 0;
            parsed.forEach((p: any) => {
              const rep = localStorage.getItem(`skillgap_project_report_${p.id}`);
              if (rep) {
                try {
                  const parsedRep = JSON.parse(rep);
                  totalScore += parsedRep.overallScore || 0;
                  count++;
                } catch {}
              }
            });
            if (count > 0) {
              setProjectsScore(Math.round(totalScore / count));
            }
          }
        } catch {}
      }
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08080F] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin" />
          <p className="text-white/60 text-sm">Generating Skill Gap report...</p>
        </div>
      </div>
    );
  }

  // Calculate scores dynamically from user database data
  const dsaAssessments = user?.assessments?.filter((a: any) => a.category === "DSA") || [];
  const scenarioAssessments = user?.assessments?.filter((a: any) => a.category === "Scenario") || [];
  const latestResume = user?.resumes?.[0];

  const dsaScore = dsaAssessments.length
    ? Math.round(dsaAssessments.reduce((acc: number, cur: any) => acc + cur.score, 0) / dsaAssessments.length)
    : 0;

  const sysDesignScore = scenarioAssessments.length
    ? Math.round(scenarioAssessments.reduce((acc: number, cur: any) => acc + cur.score, 0) / scenarioAssessments.length)
    : 0;

  const resumeScore = latestResume ? latestResume.atsScore : 0;

  const overallReadiness = Math.round(
    (dsaScore + sysDesignScore + resumeScore + certsScore + projectsScore) / 5
  );

  const gapPercentage = 100 - overallReadiness;

  const radarData = [
    { subject: "Coding/DSA", score: dsaScore },
    { subject: "Sys Design", score: sysDesignScore },
    { subject: "Projects", score: projectsScore },
    { subject: "Resume ATS", score: resumeScore },
    { subject: "Certs Relevance", score: certsScore },
  ];

  const breakdown = [
    { label: "Coding & DSA Score", score: dsaScore, color: "#6366F1" },
    { label: "Project Architecture Score", score: projectsScore, color: "#8B5CF6" },
    { label: "Certification Value Score", score: certsScore, color: "#60A5FA" },
    { label: "Resume ATS Score", score: resumeScore, color: "#34D399" },
  ];

  // Load missing keywords dynamically from resume DB record
  let missingSkills: string[] = [];
  if (latestResume) {
    try {
      missingSkills = JSON.parse(latestResume.missingKeywords);
    } catch {
      if (typeof latestResume.missingKeywords === "string") {
        missingSkills = latestResume.missingKeywords.split(",").map((s: string) => s.trim()).filter(Boolean);
      }
    }
  }

  // Load strengths and weaknesses dynamically from evaluations
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (resumeScore >= 65) strengths.push("Strong resume structure & layout");
  else if (latestResume) weaknesses.push("Resume formatting & details gap");

  if (dsaScore >= 70) strengths.push("Solid competitive programming & core DSA");
  else if (dsaAssessments.length > 0) weaknesses.push("Algorithmic optimization issues");

  if (sysDesignScore >= 70) strengths.push("Good distributed systems & scaling concept");
  else if (scenarioAssessments.length > 0) weaknesses.push("System trade-offs understanding gap");

  if (projectsScore >= 75) strengths.push("Strong implementation & project architecture");
  else if (projectsScore > 0) weaknesses.push("Modular structure & test coverage gaps");

  // Fallbacks if no data exists yet
  if (strengths.length === 0) strengths.push("Get started by uploading your resume", "Complete DSA test to reveal strengths");
  if (weaknesses.length === 0) weaknesses.push("Upload profile to check missing keywords", "Complete system design test to check gaps");

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
                    strokeDasharray={`${(overallReadiness / 100) * 2 * Math.PI * 33} ${2 * Math.PI * 33}`}
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
                  <span className="text-xl font-bold text-white">{overallReadiness}%</span>
                  <span className="text-[9px] text-white/40">Overall</span>
                </div>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Readiness Match</h3>
                <p className="text-xs text-white/40 mt-1 leading-relaxed">
                  You are <span className="text-indigo-400 font-semibold">{gapPercentage}% away</span> from candidate benchmark standards.
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
                {missingSkills.length === 0 ? (
                  <span className="text-xs text-white/30 italic">No missing skills analyzed. Upload your resume to verify gaps.</span>
                ) : (
                  missingSkills.slice(0, 10).map((s) => (
                    <span
                      key={s}
                      className="text-xs px-2.5 py-1 rounded-lg border border-red-500/18 bg-red-500/8 text-red-300 animate-pulse-slow"
                    >
                      {s}
                    </span>
                  ))
                )}
              </div>
            </GlassCard>
          </div>

          {/* Right: Radar Chart & Growth details */}
          <div className="lg:col-span-7 space-y-6">
            <GlassCard className="p-6 flex flex-col justify-between" glow="#6366F1">
              <h3 className="text-white font-semibold text-sm mb-4 text-center">Skill Mapping Benchmarks</h3>
              <div style={{ height: 260 }} className="w-full flex items-center justify-center">
                {overallReadiness === 0 ? (
                  <p className="text-white/30 text-xs">Run evaluations to populate the benchmarks radar</p>
                ) : (
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
                )}
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
                  {strengths.map((str, idx) => (
                    <li key={idx}>· {str}</li>
                  ))}
                </ul>
              </GlassCard>

              <GlassCard className="p-5" glow="#EF4444">
                <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-1.5">
                  <AlertTriangle size={13} className="text-red-400" />
                  Top Weaknesses
                </h4>
                <ul className="space-y-2 text-xs text-white/50">
                  {weaknesses.map((weak, idx) => (
                    <li key={idx}>· {weak}</li>
                  ))}
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
