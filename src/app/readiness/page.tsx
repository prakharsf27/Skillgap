"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Briefcase, ArrowRight, ShieldCheck, ChevronRight, Activity } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { GlassCard, GradientText, SectionLabel } from "@/components/shared";

export default function JobReadiness() {
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
          <p className="text-white/60 text-sm">Evaluating job readiness match...</p>
        </div>
      </div>
    );
  }

  // Calculate dimension metrics from DB
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

  // Extract skills from resume
  let userSkills: string[] = [];
  if (latestResume) {
    try {
      const parsed = JSON.parse(latestResume.skills);
      if (Array.isArray(parsed)) {
        userSkills = parsed.map((s: string) => s.toLowerCase());
      }
    } catch {
      if (typeof latestResume.skills === "string") {
        userSkills = latestResume.skills.split(",").map((s: string) => s.trim().toLowerCase()).filter(Boolean);
      }
    }
  }

  // Dynamic skill matching logic
  const checkSkills = (targetList: string[]) => {
    // If no resume uploaded, all are missing
    if (!latestResume) {
      return { acquired: [], missing: targetList };
    }
    const acquired = targetList.filter(t => 
      userSkills.some(us => us.includes(t.toLowerCase()) || t.toLowerCase().includes(us))
    );
    const missing = targetList.filter(t => !acquired.includes(t));
    return { acquired, missing };
  };

  // Define developer profiles
  const feSkills = checkSkills(["React", "TypeScript", "Tailwind CSS", "HTML", "CSS"]);
  const beSkills = checkSkills(["Node.js", "SQL", "Git", "System Design", "Docker"]);
  const fsSkills = checkSkills(["Next.js", "TypeScript", "SQL", "AWS", "CI/CD"]);
  const aiSkills = checkSkills(["Python", "Algorithms", "PyTorch", "Model Ops", "Pandas"]);

  // Calculate readiness match percentage based on dynamic test scores
  const getMatchScore = (weightResume: number, weightSys: number, weightDsa: number) => {
    const calculated = Math.round(
      resumeScore * weightResume + sysDesignScore * weightSys + dsaScore * weightDsa
    );
    // If no evaluations taken, default to 0%
    return calculated;
  };

  const getStatusText = (score: number) => {
    if (score >= 75) return "Ready to Apply";
    if (score >= 50) return "Needs Skill Bridging";
    return "Critical Gaps";
  };

  const feScore = getMatchScore(0.6, 0.1, 0.3);
  const beScore = getMatchScore(0.4, 0.3, 0.3);
  const fsScore = getMatchScore(0.5, 0.2, 0.3);
  const aiScore = getMatchScore(0.3, 0.2, 0.5);

  const roles = [
    {
      title: "Frontend Developer",
      match: feScore,
      color: "#6366F1",
      required: feSkills.acquired.length ? feSkills.acquired : ["React", "HTML/CSS"],
      missing: feSkills.missing,
      status: getStatusText(feScore),
    },
    {
      title: "Backend Developer",
      match: beScore,
      color: "#8B5CF6",
      required: beSkills.acquired.length ? beSkills.acquired : ["Node.js", "SQL"],
      missing: beSkills.missing,
      status: getStatusText(beScore),
    },
    {
      title: "Full Stack Developer",
      match: fsScore,
      color: "#60A5FA",
      required: fsSkills.acquired.length ? fsSkills.acquired : ["Next.js", "JS/TS"],
      missing: fsSkills.missing,
      status: getStatusText(fsScore),
    },
    {
      title: "AI Engineer",
      match: aiScore,
      color: "#F59E0B",
      required: aiSkills.acquired.length ? aiSkills.acquired : ["Python", "Algorithms"],
      missing: aiSkills.missing,
      status: getStatusText(aiScore),
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
                      {r.missing.length === 0 ? (
                        <span className="text-[10px] text-white/30 italic">None</span>
                      ) : (
                        r.missing.map(s => (
                          <span key={s} className="px-1.5 py-0.5 rounded border border-red-500/16 bg-red-500/8 text-red-300 text-[10px]">
                            {s}
                          </span>
                        ))
                      )}
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
