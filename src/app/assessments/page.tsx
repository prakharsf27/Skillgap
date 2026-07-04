"use client";

import React from "react";
import Link from "next/link";
import { 
  Code2, FolderGit2, Award, FileText, 
  ArrowRight, Clock, CheckCircle2, AlertCircle 
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { GlassCard, GradientText } from "@/components/shared";

export default function AssessmentHub() {
  const cards = [
    {
      id: "coding",
      title: "Coding Assessment",
      desc: "Solve adaptive DSA algorithmic challenges and scenario-based coding prompts.",
      icon: Code2,
      time: "45 mins",
      score: "80%",
      status: "Completed",
      statusColor: "#34D399",
      href: "/assessments/coding",
      actionLabel: "Review Test Results",
    },
    {
      id: "projects",
      title: "Project Assessment",
      desc: "Analyze project source repositories, architecture depth, and complete AI interviews.",
      icon: FolderGit2,
      time: "30 mins",
      score: "70%",
      status: "In Progress",
      statusColor: "#F59E0B",
      href: "/assessments/projects",
      actionLabel: "Resume Evaluation",
    },
    {
      id: "certifications",
      title: "Certification Assessment",
      desc: "Verify credential relevance, weigh courses against live requirements, and review recommendations.",
      icon: Award,
      time: "15 mins",
      score: "60%",
      status: "Verified",
      statusColor: "#60A5FA",
      href: "/assessments/certifications",
      actionLabel: "Add Certificate",
    },
    {
      id: "resume",
      title: "Resume Analysis",
      desc: "Scan structural parameters, match resume keywords with JDs, and check ATS compatibility.",
      icon: FileText,
      time: "10 mins",
      score: "65%",
      status: "Analyzed",
      statusColor: "#A5B4FC",
      href: "/assessments/resume",
      actionLabel: "Upload Resume",
    },
  ];

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
      </div>
    </DashboardLayout>
  );
}
