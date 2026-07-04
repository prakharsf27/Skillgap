"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Award, CheckCircle2, Clock, Cpu, ArrowRight, ShieldCheck, 
  Zap, AlertTriangle, Lock, User, Calendar, FileText, ChevronRight,
  Download, Share2, Sparkles, Star, ShieldAlert
} from "lucide-react";
import { 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip
} from "recharts";
import DashboardLayout from "@/components/DashboardLayout";
import { GlassCard, GradientText, SectionLabel } from "@/components/shared";

interface EvaluationMetrics {
  correctness: number;
  readability: number;
  optimization: number;
  reasoning: number;
}

interface SubmissionState {
  status: "pending" | "published" | "approved";
  userName: string;
  email: string;
  date: string;
  evaluatedAt?: string;
  questions: Array<{
    id: string | number;
    title: string;
    category: "DSA" | "Scenario";
    difficulty: string;
    draft: string;
    metrics?: EvaluationMetrics;
    aiScore: number;
    aiComment: string;
    strongPoints?: string[];
    improvements?: string[];
    timeComplexity?: string;
    spaceComplexity?: string;
    isCorrect?: boolean;
    adminScore?: number;
    adminComment?: string;
  }>;
  summary?: {
    dsaAvg: number;
    scenarioAvg: number;
    overallAvg: number;
  };
  scores: {
    dsa: number;
    system: number;
    readability: number;
    efficiency: number;
    total: number;
  };
  adminComments?: string;
}

export default function CodingResults() {
  const [submission, setSubmission] = useState<SubmissionState | null>(null);

  // Load state from local storage or set default mock
  useEffect(() => {
    const raw = localStorage.getItem("skillgap_dsa_submission");
    if (raw) {
      setSubmission(JSON.parse(raw));
    } else {
      // Setup a default initial mock state for previewing the locking screen
      const defaultState: SubmissionState = {
        status: "pending",
        userName: "Rahul Sharma",
        email: "rahul@alliance.edu.in",
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        questions: Array.from({ length: 10 }).map((_, i) => ({
          id: i + 1,
          title: i < 5 ? "DSA Challenge" : "System Scenario",
          category: i < 5 ? "DSA" : "Scenario",
          difficulty: i < 2 ? "Easy" : i < 4 ? "Medium" : "Hard",
          draft: "Sample code draft saved in local storage...",
          aiScore: i < 5 ? 80 : 70,
          aiComment: "Automatic AI logic parser score confirmation."
        })),
        scores: {
          dsa: 80,
          system: 70,
          readability: 82,
          efficiency: 75,
          total: 76
        }
      };
      localStorage.setItem("skillgap_dsa_submission", JSON.stringify(defaultState));
      setSubmission(defaultState);
    }
  }, []);

  // Sync state changes on click triggers
  const refreshState = () => {
    const raw = localStorage.getItem("skillgap_dsa_submission");
    if (raw) setSubmission(JSON.parse(raw));
  };

  if (!submission) {
    return (
      <DashboardLayout>
        <div className="text-center text-white/50 py-12">Loading assessment reports...</div>
      </DashboardLayout>
    );
  }

  const isPending = submission.status === "pending";

  // Compute aggregated metrics from real Gemini evaluations
  const allMetrics = submission.questions
    .filter(q => q.metrics)
    .map(q => q.metrics!);

  const avgMetric = (key: keyof EvaluationMetrics) =>
    allMetrics.length
      ? Math.round(allMetrics.reduce((s, m) => s + m[key], 0) / allMetrics.length)
      : submission.scores[key === "correctness" ? "dsa" : key === "optimization" ? "efficiency" : key === "readability" ? "readability" : "system"];

  // Chart data — prefer real structured metrics, fall back to legacy scores
  const radarData = [
    { subject: "Correctness", score: avgMetric("correctness") || submission.scores.dsa },
    { subject: "Systems Design", score: submission.scores.system },
    { subject: "Readability", score: avgMetric("readability") || submission.scores.readability },
    { subject: "Optimization", score: avgMetric("optimization") || submission.scores.efficiency },
    { subject: "Reasoning", score: avgMetric("reasoning") || Math.round((submission.scores.dsa + submission.scores.system) / 2) },
  ];

  const breakdownData = [
    { name: "DSA Score", score: submission.scores.dsa || submission.summary?.dsaAvg || 0, color: "#6366F1" },
    { name: "Problem Solving", score: submission.scores.system || submission.summary?.scenarioAvg || 0, color: "#8B5CF6" },
    { name: "Code Quality", score: avgMetric("readability") || submission.scores.readability, color: "#34D399" },
    { name: "Efficiency", score: avgMetric("optimization") || submission.scores.efficiency, color: "#60A5FA" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        
        {/* ====================================================
            PAGE 8: AI EVALUATION PENDING / REPORT LOCKED SCREEN
            ==================================================== */}
        {isPending ? (
          <div className="space-y-8 max-w-3xl mx-auto py-4">
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/22 flex items-center justify-center text-amber-400 mx-auto animate-pulse">
                <Lock size={24} />
              </div>
              
              <SectionLabel>Assessment Locked</SectionLabel>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1">
                Report Awaiting <GradientText>Admin Review</GradientText>
              </h1>
              <p className="text-white/45 text-sm max-w-lg mx-auto leading-relaxed mt-2">
                Gemini AI has parsed your answers and submitted them to the grading queue. An administrator must verify and approve the scores before they are visible.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <GlassCard className="p-6 space-y-4" glow="#6366F1">
                <h3 className="text-white font-bold text-xs">Submission Metadata</h3>
                <div className="space-y-3.5 text-xs font-mono">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-white/30">Candidate Name:</span>
                    <span className="text-white/80">{submission.userName}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-white/30">Email:</span>
                    <span className="text-white/80">{submission.email}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-white/30">Questions Submitted:</span>
                    <span className="text-indigo-400 font-bold">10 / 10 Complete</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/30">Date Time:</span>
                    <span className="text-white/80">{submission.date}</span>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6 flex flex-col justify-between" glow="#F59E0B">
                <div className="space-y-3">
                  <h3 className="text-white font-bold text-xs flex items-center gap-1.5">
                    <ShieldAlert size={14} className="text-amber-500" />
                    Demo Instructions Notice
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed">
                    To approve this report, click the <strong>Admin Panel</strong> in the left sidebar, locate the pending evaluation queue, override/confirm the metrics, and click <strong>Approve & Publish</strong>.
                  </p>
                </div>
                
                <button
                  onClick={refreshState}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold text-indigo-300 border border-[#6366F1]/20 bg-[#6366F1]/10 hover:bg-[#6366F1]/15 transition-all cursor-pointer mt-4"
                >
                  Refresh Status
                </button>
              </GlassCard>
            </div>

            {/* Simulated Pending stages logs */}
            <GlassCard className="p-6 space-y-4">
              <h4 className="text-xs font-semibold text-white/75">Review Checklist Queue</h4>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between text-[#34D399] font-medium">
                  <span className="flex items-center gap-2">✔ Gemini AI Scoring Matrix</span>
                  <span>Completed</span>
                </div>
                <div className="flex items-center justify-between text-[#34D399] font-medium">
                  <span className="flex items-center gap-2">✔ Plagiarism Check Checks</span>
                  <span>Completed</span>
                </div>
                <div className="flex items-center justify-between text-amber-400 animate-pulse font-medium">
                  <span className="flex items-center gap-2">⌛ Administrator Verification Review</span>
                  <span>Awaiting Review</span>
                </div>
              </div>
            </GlassCard>
          </div>
        ) : (
          /* ====================================================
              PAGE 9: CODING ASSESSMENT REPORT PAGE
              ==================================================== */
          <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <SectionLabel>Approved Assessment Report</SectionLabel>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1">
                  Overall Coding <GradientText>Performance Card</GradientText>
                </h1>
                <p className="text-white/45 text-sm mt-1.5 leading-relaxed">
                  Calculated skill indices compared against standard industry benchmarks.
                </p>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => alert("Report downloaded successfully!")}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/8 text-xs font-semibold text-white/70 hover:bg-white/5 cursor-pointer"
                >
                  <Download size={13} />
                  Download PDF
                </button>
                <button 
                  onClick={() => alert("Share link copied to clipboard!")}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/8 text-xs font-semibold text-white/70 hover:bg-white/5 cursor-pointer"
                >
                  <Share2 size={13} />
                  Share Report
                </button>
              </div>
            </div>

            {/* Approved Badge alerts */}
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-xs text-emerald-400 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={16} />
                <span>
                  <strong>Approved by Admin:</strong> This coding report has been reviewed, certified, and officially published.
                </span>
              </div>
              {submission.adminComments && (
                <span className="italic text-[10px] text-emerald-400/80">
                  Reviewer: "{submission.adminComments}"
                </span>
              )}
            </div>

            {/* Outer bento grid summary */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Box 1: Radar Chart */}
              <GlassCard className="p-6 lg:col-span-5 flex flex-col justify-between" glow="#6366F1">
                <div>
                  <h3 className="text-white font-bold text-xs">Skill Radar Profile</h3>
                  <p className="text-[10px] text-white/30 mt-0.5">Automated visual dimension benchmarks</p>
                </div>
                
                <div style={{ height: 240 }} className="w-full flex items-center justify-center my-4">
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
                        stroke="#8B5CF6"
                        fill="#8B5CF6"
                        fillOpacity={0.18}
                        strokeWidth={1.5}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="text-center text-[10px] text-white/35">
                  Overall Index Benchmark Rating: <span className="text-[#A5B4FC] font-semibold">Ready for Scale Roles</span>.
                </div>
              </GlassCard>

              {/* Box 2: Total score details */}
              <GlassCard className="p-6 lg:col-span-7 flex flex-col justify-between" glow="#8B5CF6">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-white font-bold text-xs">Performance Index</h3>
                      <p className="text-[10px] text-white/30 mt-0.5">Calculated scoring metrics</p>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-[9px] text-white/30 uppercase tracking-widest font-semibold">Total Grade</span>
                      <div className="text-3xl font-black text-white font-mono">{submission.scores.total}%</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {breakdownData.map((item) => (
                      <div key={item.name} className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-white/60">{item.name}</span>
                          <span className="font-bold" style={{ color: item.color }}>{item.score}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${item.score}%`, backgroundColor: item.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4 mt-6 flex justify-between items-center text-[10px] text-white/40">
                  <span>Plagiarism rating: Valid 100%</span>
                  <span>Time taken: 42 minutes 15 seconds</span>
                </div>
              </GlassCard>

            </div>

            {/* Strengths & Weaknesses row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard className="p-6" glow="#34D399">
                <h3 className="text-white font-bold text-xs mb-4 flex items-center gap-1.5">
                  <Zap size={14} className="text-emerald-400" />
                  Identified Strengths
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2.5 text-xs text-white/60">
                    <CheckCircle2 size={13} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Clean syntax structure, properly leveraged map complexity O(1).</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-white/60">
                    <CheckCircle2 size={13} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Outstanding logical reasoning in designing rate limiter gateway tokens configurations.</span>
                  </li>
                </ul>
              </GlassCard>

              <GlassCard className="p-6" glow="#EF4444">
                <h3 className="text-white font-bold text-xs mb-4 flex items-center gap-1.5">
                  <AlertTriangle size={14} className="text-red-400" />
                  Critical Weaknesses
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2.5 text-xs text-white/60">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                    <span>Bypassed constraints checks regarding integer overflow validation bounds in DSA 5.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-white/60">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                    <span>Failed to configure Redis fallback locks commands inside duplicate swipes payments.</span>
                  </li>
                </ul>
              </GlassCard>
            </div>

            {/* Question-wise summary list */}
            <GlassCard className="p-6">
              <h3 className="text-white font-bold text-xs mb-4">Question-Wise Submissions Review</h3>
              <div className="space-y-3">
                {submission.questions.map((q) => (
                  <div key={q.id} className="p-3.5 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white font-mono">Q{q.id}. {q.title}</span>
                        <span className="text-[8px] uppercase px-1.5 py-0.2 rounded border border-white/8 text-white/40">{q.category}</span>
                      </div>
                      <p className="text-[10px] text-white/40 mt-1 leading-relaxed">{q.aiComment}</p>
                    </div>
                    
                    <div className="flex items-center gap-4 self-end sm:self-auto">
                      <div className="text-right">
                        <span className="text-[8px] text-white/35 uppercase">Grade Score</span>
                        <div className="text-xs font-bold text-indigo-400 font-mono">
                          {q.adminScore !== undefined ? q.adminScore : q.aiScore}%
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-white/20" />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Suggested action plans */}
            <GlassCard className="p-6" glow="#8B5CF6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <h3 className="font-bold text-white text-sm">Recommended Action Plan</h3>
                  <p className="text-xs text-white/44 mt-1 leading-relaxed">
                    Based on your logic complexity scores, review the growth roadmap milestones targeting microservices caching networks and AWS infrastructure deployments.
                  </p>
                </div>
                <Link
                  href="/learning-path"
                  className="px-5 py-3 rounded-xl font-bold text-xs text-white transition-all hover:opacity-90 cursor-pointer flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
                >
                  View Learning Roadmap
                  <ArrowRight size={13} className="ml-2" />
                </Link>
              </div>
            </GlassCard>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
