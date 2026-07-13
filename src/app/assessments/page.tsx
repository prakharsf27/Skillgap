"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Code2, FolderGit2, Award, FileText, 
  ArrowRight, Clock, CheckCircle2, AlertCircle 
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { GlassCard, GradientText } from "@/components/shared";

export default function AssessmentHub() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [certsScore, setCertsScore] = useState(0);
  const [certsCount, setCertsCount] = useState(0);
  const [projectsScore, setProjectsScore] = useState(0);
  const [projectsCount, setProjectsCount] = useState(0);

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
      // Load certifications
      const savedCerts = localStorage.getItem("skillgap_certifications");
      if (savedCerts) {
        try {
          const parsed = JSON.parse(savedCerts);
          setCertsCount(parsed.length);
          if (parsed.length) {
            const avg = Math.round(
              parsed.reduce((acc: number, cur: any) => acc + (cur.relevanceScore || 0), 0) / parsed.length
            );
            setCertsScore(avg);
          }
        } catch {}
      }

      // Load projects
      const savedProjects = localStorage.getItem("skillgap_projects");
      if (savedProjects) {
        try {
          const parsed = JSON.parse(savedProjects);
          setCertsCount(parsed.length);
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
            setProjectsCount(parsed.length);
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
          <p className="text-white/60 text-sm">Loading assessments hub...</p>
        </div>
      </div>
    );
  }

  // Calculate dimension metrics from DB
  const dsaAssessments = user?.assessments?.filter((a: any) => a.category === "DSA") || [];
  const scenarioAssessments = user?.assessments?.filter((a: any) => a.category === "Scenario") || [];
  const latestResume = user?.resumes?.[0];

  const codingScore = dsaAssessments.length || scenarioAssessments.length
    ? Math.round(
        [...dsaAssessments, ...scenarioAssessments].reduce((acc: number, cur: any) => acc + cur.score, 0) /
        (dsaAssessments.length + scenarioAssessments.length)
      )
    : 0;

  const resumeScore = latestResume ? latestResume.atsScore : 0;

  // Determine card attributes dynamically
  const isCodingCompleted = dsaAssessments.length > 0 || scenarioAssessments.length > 0;
  const isResumeCompleted = !!latestResume;
  const isCertsCompleted = certsCount > 0;
  const isProjectsCompleted = projectsScore > 0;

  const cards = [
    {
      id: "coding",
      title: "Coding Assessment",
      desc: "Solve adaptive DSA algorithmic challenges and scenario-based coding prompts.",
      icon: Code2,
      time: "45 mins",
      score: `${codingScore}%`,
      status: isCodingCompleted ? "Completed" : "Not Started",
      statusColor: isCodingCompleted ? "#34D399" : "#6B7280",
      href: "/assessments/coding",
      actionLabel: isCodingCompleted ? "Review Test Results" : "Start Coding Test",
    },
    {
      id: "projects",
      title: "Project Assessment",
      desc: "Analyze project source repositories, architecture depth, and complete AI interviews.",
      icon: FolderGit2,
      time: "30 mins",
      score: `${projectsScore}%`,
      status: isProjectsCompleted ? "Completed" : "Not Started",
      statusColor: isProjectsCompleted ? "#34D399" : "#6B7280",
      href: "/assessments/projects",
      actionLabel: isProjectsCompleted ? "Review Report" : "Start Evaluation",
    },
    {
      id: "certifications",
      title: "Certification Assessment",
      desc: "Verify credential relevance, weigh courses against live requirements, and review recommendations.",
      icon: Award,
      time: "15 mins",
      score: `${certsScore}%`,
      status: isCertsCompleted ? "Verified" : "Not Added",
      statusColor: isCertsCompleted ? "#60A5FA" : "#6B7280",
      href: "/assessments/certifications",
      actionLabel: isCertsCompleted ? "Add More Certificates" : "Add Certificate",
    },
    {
      id: "resume",
      title: "Resume Analysis",
      desc: "Scan structural parameters, match resume keywords with JDs, and check ATS compatibility.",
      icon: FileText,
      time: "10 mins",
      score: `${resumeScore}%`,
      status: isResumeCompleted ? "Analyzed" : "Not Uploaded",
      statusColor: isResumeCompleted ? "#34D399" : "#6B7280",
      href: "/assessments/resume",
      actionLabel: isResumeCompleted ? "Upload New Resume" : "Upload Resume",
    },
  ];

  const allPhasesDone = isCodingCompleted && isResumeCompleted && isCertsCompleted && isProjectsCompleted;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Assessments <GradientText>Hub</GradientText>
          </h1>
          <p className="text-white/45 text-sm mt-1">
            Complete the 4 core assessment phases to generate your Skill Gap Report.
          </p>
        </div>

        {/* Dynamic Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <GlassCard key={card.id} className="p-6 md:p-8 flex flex-col justify-between" glow={card.statusColor}>
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center border"
                      style={{
                        backgroundColor: `${card.statusColor}08`,
                        borderColor: `${card.statusColor}22`,
                      }}
                    >
                      <Icon size={22} style={{ color: card.statusColor }} />
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1.5 text-white/40">
                        <Clock size={12} />
                        {card.time}
                      </div>
                      <span
                        className="font-semibold px-2.5 py-0.5 rounded-full border text-[10px]"
                        style={{
                          backgroundColor: `${card.statusColor}10`,
                          borderColor: `${card.statusColor}25`,
                          color: card.statusColor,
                        }}
                      >
                        {card.status}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed mb-6">{card.desc}</p>
                </div>

                <div className="border-t border-white/5 pt-5 flex items-center justify-between mt-auto">
                  <div>
                    <div className="text-[10px] text-white/30 uppercase tracking-widest">Dimension Score</div>
                    <div className="text-lg font-bold text-white mt-0.5">{card.score}</div>
                  </div>
                  <Link
                    href={card.href}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-white transition-all hover:opacity-90 cursor-pointer border"
                    style={{
                      background: `linear-gradient(135deg, ${card.statusColor}18, ${card.statusColor}06)`,
                      borderColor: `${card.statusColor}30`,
                    }}
                  >
                    {card.actionLabel}
                    <ArrowRight size={13} style={{ color: card.statusColor }} />
                  </Link>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Global Summary Card */}
        {allPhasesDone && (
          <GlassCard className="p-6 md:p-8 border-indigo-500/10" glow="#6366F1">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/22 flex items-center justify-center text-indigo-400 mt-0.5 flex-shrink-0">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">All Initial Phases Completed</h3>
                  <p className="text-sm text-white/44 max-w-xl mt-1 leading-relaxed">
                    Your baseline evaluation metrics are fully calculated. You can access the full Skill Gap report below to check role benchmarks and recommended learning tracks.
                  </p>
                </div>
              </div>
              <Link
                href="/reports/skill-gap"
                className="px-6 py-3 rounded-xl font-bold text-xs text-white transition-all hover:opacity-90 cursor-pointer flex items-center justify-center flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                  boxShadow: "0 0 24px rgba(99, 102, 241, 0.35)",
                }}
              >
                View Skill Gap Report
              </Link>
            </div>
          </GlassCard>
        )}
      </div>
    </DashboardLayout>
  );
}
