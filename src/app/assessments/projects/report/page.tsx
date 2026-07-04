"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  FolderGit2, Award, ArrowRight, ShieldCheck, 
  Settings, CheckCircle2, ChevronRight, Activity, XCircle
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { GlassCard, GradientText, SectionLabel } from "@/components/shared";

interface Project {
  id: string;
  name: string;
  desc: string;
  github: string;
  live: string;
  tech: string[];
  challenges: string;
  score: string;
  status: "pending" | "completed";
}

interface ProjectEvaluationReport {
  overallScore: number;
  conceptualUnderstanding: number;
  implementationDepth: number;
  architectureUnderstanding: number;
  communicationScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  verifiedTech: string[];
}

export default function ProjectReport() {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [report, setReport] = useState<ProjectEvaluationReport | null>(null);

  useEffect(() => {
    const selected = localStorage.getItem("skillgap_selected_project");
    if (selected) {
      try {
        const p = JSON.parse(selected) as Project;
        setProject(p);
        
        const repSaved = localStorage.getItem(`skillgap_project_report_${p.id}`);
        if (repSaved) {
          setReport(JSON.parse(repSaved));
        } else {
          // Check if it was p1 (default microservices) and initialize standard metrics
          if (p.id === "p1") {
            const defaultReport: ProjectEvaluationReport = {
              overallScore: 78,
              conceptualUnderstanding: 80,
              implementationDepth: 75,
              architectureUnderstanding: 82,
              communicationScore: 70,
              summary: "The candidate demonstrates strong command of their deployment files and architecture concepts, with moderate gaps in error propagation.",
              strengths: [
                "Clean understanding of gateway microservice patterns",
                "Strong database query optimizations using composite index logic"
              ],
              weaknesses: [
                "Unclear load-balancer threshold rules under high peak spikes",
                "Missing modular retry failover logic for cached nodes"
              ],
              recommendations: [
                "Implement Redis Cluster failover commands to handles intermittent query drops.",
                "Upgrade gateway controllers with express-rate-limiting parameters.",
                "Document NestJS microservice bootstrap files inside a clean README.md configuration."
              ],
              verifiedTech: p.tech,
            };
            setReport(defaultReport);
            localStorage.setItem(`skillgap_project_report_${p.id}`, JSON.stringify(defaultReport));
          }
        }
      } catch (err) {
        console.error("Failed to parse project evaluation data", err);
      }
    }
  }, []);

  if (!project) {
    return (
      <DashboardLayout>
        <GlassCard className="p-8 text-center space-y-4" glow="#EF4444">
          <p className="text-white/60 text-sm">No project selected. Please visit the Projects Hub to view results.</p>
          <Link href="/assessments/projects" className="px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs inline-block">
            Go to Projects Hub
          </Link>
        </GlassCard>
      </DashboardLayout>
    );
  }

  const scores = report ? [
    { label: "Conceptual Understanding", score: report.conceptualUnderstanding, color: "#6366F1", desc: "Measures understanding of algorithms, database scaling, and microservice protocols." },
    { label: "Implementation Depth", score: report.implementationDepth, color: "#8B5CF6", desc: "Measures correct tech stack usage, modularity, and environment config files." },
    { label: "Architecture Understanding", score: report.architectureUnderstanding, color: "#60A5FA", desc: "Measures routing setups, concurrency locks, caching buffers, and schemas." },
    { label: "Communication Score", score: report.communicationScore, color: "#34D399", desc: "Measures dialogue clarity, detail depth, and tech explanation coherence during interview." },
  ] : [];

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Project <GradientText>Evaluation Report</GradientText>
            </h1>
            <p className="text-white/45 text-sm mt-1">
              Technical Audit of: <span className="text-indigo-400 font-semibold">{project.name}</span>
            </p>
          </div>
          <Link
            href="/assessments/projects"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/8 text-xs font-semibold text-white/70 hover:bg-white/5 cursor-pointer"
          >
            Projects Hub
            <ChevronRight size={13} />
          </Link>
        </div>

        {report ? (
          <>
            {/* Overview Bento Card */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Box 1: Overall Score */}
              <GlassCard className="p-6 md:col-span-4 flex flex-col justify-between" glow="#8B5CF6">
                <div>
                  <div className="text-[10px] text-white/30 uppercase tracking-widest font-semibold">Overall Project Score</div>
                  <div className="text-5xl font-black text-white mt-2">{report.overallScore}%</div>
                </div>
                <div className="text-xs text-[#C4B5FD] font-medium mt-4 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  Verified Project Competency
                </div>
              </GlassCard>

              {/* Box 2: Quick Specs */}
              <GlassCard className="p-6 md:col-span-8 flex flex-col justify-between" glow="#6366F1">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="text-white/35">Project Checked</div>
                    <div className="text-sm font-bold text-white mt-1">{project.name}</div>
                  </div>
                  <div>
                    <div className="text-white/35">Verified Tech stacks</div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {report.verifiedTech && report.verifiedTech.length > 0 ? (
                        report.verifiedTech.map(t => (
                          <span key={t} className="px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[9px] text-indigo-300 font-semibold">
                            {t}
                          </span>
                        ))
                      ) : (
                        <span className="text-white/40">None validated</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/35">AI Assessment Mode</div>
                    <div className="text-sm font-semibold text-emerald-400 mt-1">Interrogative Dialog Flow</div>
                  </div>
                  <div>
                    <div className="text-white/35">Source Repository</div>
                    <a href={project.github} className="text-sm font-semibold text-[#A5B4FC] hover:underline mt-1 block truncate" target="_blank" rel="noreferrer">
                      {project.github.replace("https://github.com/", "")}
                    </a>
                  </div>
                </div>
                <div className="text-[10px] text-white/30 border-t border-white/5 pt-3 mt-4">
                  Assessment completed via dynamic Gemini AI project interrogation.
                </div>
              </GlassCard>
            </div>

            {/* Assessment Summary Narrative */}
            <GlassCard className="p-6" glow="#6366F1">
              <h3 className="text-white font-bold text-xs mb-2 uppercase tracking-wide text-white/40">AI Analysis Summary</h3>
              <p className="text-xs text-white/70 leading-relaxed font-medium">{report.summary}</p>
            </GlassCard>

            {/* Detailed score parameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {scores.map((s) => (
                <GlassCard key={s.label} className="p-6" glow={s.color}>
                  <div className="flex justify-between items-center text-sm font-semibold text-white mb-2">
                    <span>{s.label}</span>
                    <span style={{ color: s.color }}>{s.score}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mb-4">
                    <div className="h-full rounded-full" style={{ width: `${s.score}%`, backgroundColor: s.color }} />
                  </div>
                  <p className="text-xs text-white/45 leading-relaxed">{s.desc}</p>
                </GlassCard>
              ))}
            </div>

            {/* Strengths & Weaknesses (Split Panel) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <GlassCard className="p-6" glow="#34D399">
                <h3 className="text-emerald-400 font-bold text-sm mb-4 flex items-center gap-1.5">
                  <CheckCircle2 size={15} />
                  Demonstrated Strengths
                </h3>
                <ul className="space-y-2.5">
                  {report.strengths.map((str, idx) => (
                    <li key={idx} className="text-xs text-white/70 flex items-start gap-2 leading-relaxed">
                      <span className="text-emerald-500 font-bold mt-0.5">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>

              <GlassCard className="p-6" glow="#EF4444">
                <h3 className="text-red-400 font-bold text-sm mb-4 flex items-center gap-1.5">
                  <XCircle size={15} />
                  Identified Knowledge Gaps
                </h3>
                <ul className="space-y-2.5">
                  {report.weaknesses.map((weak, idx) => (
                    <li key={idx} className="text-xs text-white/70 flex items-start gap-2 leading-relaxed">
                      <span className="text-red-500 font-bold mt-0.5">•</span>
                      <span>{weak}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>

            {/* Recommendations */}
            <GlassCard className="p-6" glow="#F59E0B">
              <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                <Activity size={15} className="text-[#A5B4FC]" />
                Actionable Improvement Suggestions
              </h3>
              <ul className="space-y-3">
                {report.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-white/60">
                    <CheckCircle2 size={13} className="text-[#A5B4FC] mt-0.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </>
        ) : (
          <GlassCard className="p-8 text-center space-y-4" glow="#6366F1">
            <p className="text-white/60 text-sm">No report generated yet. Please complete the AI technical interview first.</p>
            <button
              onClick={() => router.push(`/assessments/projects/interview`)}
              className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold shadow-lg inline-flex items-center gap-1.5"
            >
              Start AI Interview
              <ArrowRight size={13} />
            </button>
          </GlassCard>
        )}

        {/* Bottom CTA */}
        <div className="flex justify-end gap-3">
          <Link
            href="/assessments/certifications"
            className="px-6 py-3.5 rounded-xl font-bold text-xs text-white transition-all hover:opacity-90 cursor-pointer flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
            }}
          >
            Start Certification Assessment
            <ArrowRight size={13} className="ml-2" />
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
