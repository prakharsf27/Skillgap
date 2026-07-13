"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [certsScore, setCertsScore] = React.useState(0);
  const [projectsScore, setProjectsScore] = React.useState(0);

  React.useEffect(() => {
    async function fetchUser() {
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
    fetchUser();
  }, [router]);

  React.useEffect(() => {
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
          <p className="text-white/60 text-sm">Synchronizing dashboard profile...</p>
        </div>
      </div>
    );
  }

  // Calculate scores dynamically based on user data
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

  const radarData = [
    { subject: "Coding/DSA", score: dsaScore },
    { subject: "Sys Design", score: sysDesignScore },
    { subject: "Projects", score: projectsScore },
    { subject: "Resume ATS", score: resumeScore },
    { subject: "Certs Relevance", score: certsScore },
  ];

  const readinessMetrics = [
    { label: "Coding & DSA Skills", score: dsaScore, color: "#6366F1" },
    { label: "System Design & Scenarios", score: sysDesignScore, color: "#8B5CF6" },
    { label: "Project Quality", score: projectsScore, color: "#60A5FA" },
    { label: "Resume ATS Match", score: resumeScore, color: "#34D399" },
    { label: "Certifications Relevance", score: certsScore, color: "#F59E0B" },
  ];

  // Dynamic Recent Activities
  const recentActivities: any[] = [];
  if (latestResume) {
    recentActivities.push({
      type: "resume",
      title: "Resume Analyzed",
      date: "Active",
      score: `${resumeScore}%`,
    });
  }
  dsaAssessments.forEach((a: any, idx: number) => {
    recentActivities.push({
      type: "assessment",
      title: `DSA: ${a.title}`,
      date: "Completed",
      score: `${a.score}%`,
    });
  });
  scenarioAssessments.forEach((a: any, idx: number) => {
    recentActivities.push({
      type: "assessment",
      title: `Design: ${a.title}`,
      date: "Completed",
      score: `${a.score}%`,
    });
  });

  // Calculate historical graph representation based on real performance progression
  const progressData = [
    { name: "Start", score: 0 },
    { name: "Resume", score: resumeScore },
    { name: "DSA Tests", score: Math.round((resumeScore + dsaScore) / 2) },
    { name: "Current", score: overallReadiness },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Welcome back, <GradientText>{user?.name || "Candidate"}</GradientText>
            </h1>
            <p className="text-white/45 text-sm mt-1">
              Here is your readiness summary for your target track: <span className="text-white font-semibold">{user?.targetTrack || "Full Stack Developer"}</span>.
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
                  strokeDasharray={`${(overallReadiness / 100) * 2 * Math.PI * 44} ${2 * Math.PI * 44}`}
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
                <span className="text-3xl font-black text-white">{overallReadiness}%</span>
                <span className="text-[10px] text-white/40">Readiness</span>
              </div>
            </div>
            <div className="text-center text-xs text-white/45 mt-4">
              Readiness profile is compiled from your actual submissions.
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
              <span className="text-white/40">Keep testing to improve score accuracy</span>
              <Link href="/assessments" className="text-[#A5B4FC] hover:underline flex items-center gap-1">
                Go to Hub <ChevronRight size={12} />
              </Link>
            </div>
          </GlassCard>

          {/* Box 3: Radar Chart */}
          <GlassCard className="p-6 md:col-span-6" glow="#60A5FA">
            <h3 className="text-white font-semibold text-sm mb-5">Skill Radar Comparison</h3>
            <div style={{ height: 260 }} className="w-full flex items-center justify-center">
              {overallReadiness === 0 ? (
                <p className="text-white/30 text-xs">Complete assessments to build your radar</p>
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

          {/* Box 4: Progress Line Graph */}
          <GlassCard className="p-6 md:col-span-6" glow="#34D399">
            <h3 className="text-white font-semibold text-sm mb-5">Readiness Trends</h3>
            <div style={{ height: 260 }} className="w-full flex items-center justify-center">
              {overallReadiness === 0 ? (
                <p className="text-white/30 text-xs">No progression history available yet</p>
              ) : (
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
              )}
            </div>
          </GlassCard>

          {/* Box 5: Recommended Action Items */}
          <GlassCard className="p-6 md:col-span-7 flex flex-col justify-between" glow="#F59E0B">
            <div>
              <h3 className="text-white font-semibold text-sm mb-1">Recommended Actions</h3>
              <p className="text-xs text-white/30 mb-6">Targeted recommendations to close critical gaps</p>
            </div>
            <div className="space-y-3.5 my-4">
              {overallReadiness === 0 ? (
                <div className="text-center py-6 text-white/30 text-xs">
                  Upload your resume or start a test to see tailored recommendations.
                </div>
              ) : (
                [
                  { title: "Review time complexities on DSA test", desc: "Optimize standard algorithms", tag: "DSA", color: "#6366F1" },
                  { title: "Enhance project test coverage", desc: "Build repository code testing", tag: "Projects", color: "#8B5CF6" },
                  { title: "Refactor System design components", desc: "Implement distributed caching tradeoffs", tag: "Sys Design", color: "#34D399" },
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
                ))
              )}
            </div>
            <Link
              href="/learning-path"
              className="text-xs font-semibold text-[#A5B4FC] hover:underline inline-flex items-center gap-1.5 mt-4 self-start"
            >
              View Full Roadmap
              <ArrowRight size={13} />
            </Link>
          </GlassCard>

          {/* Box 6: Recent Activity */}
          <GlassCard className="p-6 md:col-span-5 flex flex-col justify-between" glow="#34D399">
            <div>
              <h3 className="text-white font-semibold text-sm mb-1">Recent Activity</h3>
              <p className="text-xs text-white/30 mb-6">Platform events checklist log</p>
            </div>
            <div className="space-y-4 my-4">
              {recentActivities.length === 0 ? (
                <div className="text-center py-6 text-white/30 text-xs">
                  No recent activities recorded. Complete an assessment to see history!
                </div>
              ) : (
                recentActivities.slice(0, 4).map((act, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={13} className="text-indigo-400" />
                      <div>
                        <div className="text-white font-medium">{act.title}</div>
                        <div className="text-[10px] text-white/30 mt-0.5">{act.date}</div>
                      </div>
                    </div>
                    <div className="font-mono text-[11px] font-semibold text-white/60">{act.score}</div>
                  </div>
                ))
              )}
            </div>
            <div className="border-t border-white/5 pt-4 mt-4 flex items-center justify-between text-xs text-white/40">
              <span className="flex items-center gap-1">
                <Briefcase size={12} />
                Job readiness metrics
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
