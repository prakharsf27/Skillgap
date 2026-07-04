"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Users, Award, Activity, BarChart2, ShieldCheck, 
  Settings, Key, AlertTriangle, ChevronRight, Check, X,
  FileText, ShieldAlert, Cpu, Sparkles, MessageSquare, Terminal
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip
} from "recharts";
import DashboardLayout from "@/components/DashboardLayout";
import { GlassCard, GradientText, SectionLabel } from "@/components/shared";

const activeData = [
  { name: "Mon", users: 120 },
  { name: "Tue", users: 150 },
  { name: "Wed", users: 180 },
  { name: "Thu", users: 220 },
  { name: "Fri", users: 280 },
  { name: "Sat", users: 190 },
  { name: "Sun", users: 140 },
];

interface QuestionSubmission {
  id: number;
  title: string;
  category: "DSA" | "Scenario";
  difficulty: string;
  draft: string;
  aiScore: number;
  aiComment: string;
  adminScore?: number;
  adminComment?: string;
}

interface SubmissionState {
  status: "pending" | "published" | "approved";
  userName: string;
  email: string;
  date: string;
  questions: QuestionSubmission[];
  scores: {
    dsa: number;
    system: number;
    readability: number;
    efficiency: number;
    total: number;
  };
  adminComments?: string;
}

export default function AdminPanel() {
  const [submission, setSubmission] = useState<SubmissionState | null>(null);
  const [selectedQuestionIdx, setSelectedQuestionIdx] = useState<number>(0);
  const [adminComments, setAdminComments] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [totalOverrideScore, setTotalOverrideScore] = useState<number>(78);

  // Load submissions from localStorage
  useEffect(() => {
    const raw = localStorage.getItem("skillgap_dsa_submission");
    if (raw) {
      const parsed = JSON.parse(raw) as SubmissionState;
      setSubmission(parsed);
      setAdminComments(parsed.adminComments || "");
      setTotalOverrideScore(parsed.scores.total);
    }
  }, []);

  const handleApprove = () => {
    if (!submission) return;

    const updated: SubmissionState = {
      ...submission,
      status: "approved",
      adminComments: adminComments || "Report verified. Baseline DSA constraints approved.",
      scores: {
        ...submission.scores,
        total: totalOverrideScore
      }
    };

    localStorage.setItem("skillgap_dsa_submission", JSON.stringify(updated));
    setSubmission(updated);
    setShowDetailModal(false);
    
    // Trigger desktop dialog info
    alert(`Assessment report for ${submission.userName} successfully approved and published!`);
  };

  const handleQuestionScoreOverride = (idx: number, score: number) => {
    if (!submission) return;
    const updatedQuestions = [...submission.questions];
    updatedQuestions[idx] = {
      ...updatedQuestions[idx],
      adminScore: score
    };
    
    // Recalculate average total score override placeholder
    const totalAvg = Math.round(
      updatedQuestions.reduce((acc, q) => acc + (q.adminScore !== undefined ? q.adminScore : q.aiScore), 0) / 10
    );

    setSubmission({
      ...submission,
      questions: updatedQuestions
    });
    setTotalOverrideScore(totalAvg);
  };

  const adminStats = [
    { label: "Total Users", value: "4,200", icon: Users, color: "#6366F1" },
    { label: "Assessments Run", value: "8,920", icon: Award, color: "#8B5CF6" },
    { label: "Average Platform Score", value: "72.4%", icon: Activity, color: "#60A5FA" },
    { label: "Job Matches Generated", value: "12,450", icon: BarChart2, color: "#34D399" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Admin <GradientText>Dashboard</GradientText>
            </h1>
            <p className="text-white/45 text-sm mt-1.5 leading-relaxed">
              Platform administration controls, evaluations approval queue, and analytics metrics.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/8 text-xs font-semibold text-white/70 hover:bg-white/5 cursor-pointer"
          >
            User Dashboard
            <ChevronRight size={13} />
          </Link>
        </div>

        {/* Admin Quick Metrics row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {adminStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <GlassCard key={stat.label} className="p-5 flex flex-col justify-between" glow={stat.color}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] text-white/40 uppercase tracking-wide">{stat.label}</span>
                  <Icon size={16} style={{ color: stat.color }} />
                </div>
                <div className="text-2xl font-black text-white font-mono">{stat.value}</div>
              </GlassCard>
            );
          })}
        </div>

        {/* ====================================================
            PAGE 10: CODING REPORT APPROVALS QUEUE
            ==================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Pending review queues */}
          <div className="lg:col-span-8 space-y-6">
            <GlassCard className="p-6" glow="#F59E0B">
              <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                <ShieldAlert size={15} className="text-amber-400 animate-pulse" />
                Coding Evaluations Review Queue
              </h3>

              {submission ? (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/22 flex items-center justify-center text-amber-400 mt-0.5">
                        <FileText size={16} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{submission.userName}</h4>
                        <p className="text-[10px] text-white/40 mt-1 flex items-center gap-3">
                          <span>{submission.email}</span>
                          <span className="w-1 h-1 rounded-full bg-white/15" />
                          <span>Submitted: {submission.date}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-auto">
                      <div className="text-right">
                        <span className="text-[9px] text-white/35 uppercase">Review status</span>
                        <div className={`text-xs font-bold font-mono mt-0.5 
                          ${submission.status === "pending" ? "text-amber-400" : "text-emerald-400"}`}
                        >
                          {submission.status === "pending" ? "Awaiting Review" : "Published"}
                        </div>
                      </div>

                      <button
                        onClick={() => setShowDetailModal(true)}
                        className="px-4 py-2.5 rounded-xl border border-[#6366F1]/20 bg-[#6366F1]/10 hover:bg-[#6366F1]/15 text-indigo-300 text-xs font-semibold cursor-pointer"
                      >
                        Inspect Submission
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-white/20 border border-dashed border-white/5 rounded-xl">
                  No submissions in review queue. Take the coding assessment to register submissions!
                </div>
              )}
            </GlassCard>

            {/* Active Users Chart */}
            <GlassCard className="p-6" glow="#6366F1">
              <h3 className="text-white font-bold text-sm mb-5">Active User Sessions (Weekly)</h3>
              <div style={{ height: 200 }} className="w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activeData} margin={{ left: -20 }}>
                    <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} stroke="rgba(255,255,255,0.05)" />
                    <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} stroke="rgba(255,255,255,0.05)" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0E0E1C", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px" }}
                      itemStyle={{ color: "#ffffff", fontSize: 11 }}
                      labelStyle={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}
                    />
                    <Line type="monotone" dataKey="users" stroke="#6366F1" strokeWidth={2.5} dot={{ fill: "#6366F1" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>

          {/* Right: Administrative settings */}
          <div className="lg:col-span-4 space-y-6">
            <GlassCard className="p-6" glow="#8B5CF6">
              <h3 className="text-white font-bold text-sm mb-4">Management Controls</h3>
              <div className="space-y-3">
                {[
                  "Manage Coding Questions Pool",
                  "Configure Learning Path Milestones",
                  "Verify Academic Institution Links",
                  "Review Platform Flag Logs",
                ].map((act) => (
                  <button
                    key={act}
                    onClick={() => alert(`Starting: ${act}`)}
                    className="w-full p-3 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-all text-xs font-semibold text-white/60 hover:text-white flex items-center justify-between cursor-pointer"
                  >
                    {act}
                    <ChevronRight size={13} className="text-white/20" />
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>

        </div>
      </div>

      {/* ====================================================
          PAGE 10 (SUB): DETAILED CANDIDATE SOLUTIONS OVERRIDE PANEL
          ==================================================== */}
      {showDetailModal && submission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div onClick={() => setShowDetailModal(false)} className="absolute inset-0 bg-black/70 backdrop-blur-xs" />
          
          <div className="max-w-5xl w-full h-[90vh] relative z-10 flex flex-col">
            <GlassCard className="p-6 flex flex-col h-full overflow-hidden" glow="#6366F1" style={{ background: "rgba(10, 10, 20, 0.95)" }}>
              
              {/* Modal Header */}
              <div className="flex justify-between items-start border-b border-white/5 pb-4 mb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Reviewing Coding Solutions - {submission.userName}</h3>
                  <p className="text-xs text-white/40 mt-1">Check answers, override AI scores, and publish report</p>
                </div>
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="p-1 rounded bg-white/5 text-white/50 hover:text-white cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Split Content Panels */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-5 overflow-hidden">
                
                {/* Left Panel: Question selector and Code Viewer */}
                <div className="md:col-span-8 flex flex-col overflow-hidden">
                  {/* Selectors tabs */}
                  <div className="flex gap-1.5 overflow-x-auto pb-2 border-b border-white/5 scrollbar-thin">
                    {submission.questions.map((q, idx) => (
                      <button
                        key={q.id}
                        onClick={() => setSelectedQuestionIdx(idx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono flex-shrink-0 cursor-pointer transition-all
                          ${selectedQuestionIdx === idx 
                            ? "bg-indigo-500 text-white" 
                            : "bg-white/3 border border-white/5 text-white/55 hover:bg-white/5"}`}
                      >
                        Q{q.id} ({q.category})
                      </button>
                    ))}
                  </div>

                  {/* Submission detail content view */}
                  <div className="flex-1 overflow-y-auto mt-4 pr-1 space-y-4 max-h-[400px] scrollbar-thin">
                    <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-2.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-white font-mono">
                          Q{submission.questions[selectedQuestionIdx].id}. {submission.questions[selectedQuestionIdx].title}
                        </span>
                        <span className="text-[10px] text-white/35 font-bold uppercase">
                          AI auto-score: {submission.questions[selectedQuestionIdx].aiScore}%
                        </span>
                      </div>
                      <p className="text-[11px] text-indigo-300 italic">
                        AI comment: "{submission.questions[selectedQuestionIdx].aiComment}"
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-[10px] text-white/30 uppercase tracking-widest font-bold font-mono">Candidate Draft Response</div>
                      <div className="p-4 rounded-xl bg-black border border-white/5 font-mono text-xs text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                        {submission.questions[selectedQuestionIdx].draft || "// Blank / No response submitted"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel: Grading controller inputs */}
                <div className="md:col-span-4 flex flex-col justify-between border-l border-white/5 pl-5">
                  <div className="space-y-5">
                    <div>
                      <h4 className="text-white font-semibold text-xs">Evaluation Score Override</h4>
                      <p className="text-[10px] text-white/30 mt-0.5 font-semibold">Alter question marks or report cards</p>
                    </div>

                    {/* Score inputs */}
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[9px] text-white/40 uppercase font-bold">Current Question score (%)</label>
                        <input
                          type="number"
                          max={100}
                          min={0}
                          value={submission.questions[selectedQuestionIdx].adminScore !== undefined ? submission.questions[selectedQuestionIdx].adminScore : submission.questions[selectedQuestionIdx].aiScore}
                          onChange={(e) => handleQuestionScoreOverride(selectedQuestionIdx, parseInt(e.target.value) || 0)}
                          className="w-full px-3.5 py-2.5 rounded-xl text-xs outline-none border border-white/8 bg-white/4 text-white font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] text-white/40 uppercase font-bold">Total Assessment Score (%)</label>
                        <input
                          type="number"
                          max={100}
                          min={0}
                          value={totalOverrideScore}
                          onChange={(e) => setTotalOverrideScore(parseInt(e.target.value) || 0)}
                          className="w-full px-3.5 py-2.5 rounded-xl text-xs outline-none border border-white/8 bg-white/4 text-white font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] text-white/40 uppercase font-bold">Reviewer Comments</label>
                        <textarea
                          placeholder="Write feedback comments for the candidate..."
                          value={adminComments}
                          onChange={(e) => setAdminComments(e.target.value)}
                          className="w-full min-h-[90px] p-3 rounded-xl text-xs outline-none border border-white/8 bg-white/4 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="mt-8 pt-4 border-t border-white/5 space-y-2.5">
                    <button
                      onClick={handleApprove}
                      className="w-full py-3 rounded-xl text-xs font-bold text-white cursor-pointer transition-all hover:opacity-95 text-center flex items-center justify-center gap-1.5"
                      style={{ background: "linear-gradient(135deg, #22C55E, #10B981)" }}
                    >
                      <Check size={14} />
                      Approve & Publish Report
                    </button>
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="w-full py-3 border border-white/8 rounded-xl text-xs font-semibold text-white/50 hover:bg-white/5 cursor-pointer text-center"
                    >
                      Close / Reject
                    </button>
                  </div>
                </div>

              </div>

            </GlassCard>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
