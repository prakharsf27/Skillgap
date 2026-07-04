"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Code2, FolderGit2, Award, ScanText, CheckCircle2 } from "lucide-react";
import { GlassCard, GradientText, SectionLabel } from "./shared";

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      n: "01",
      title: "Coding Assessment",
      icon: Code2,
      color: "#6366F1",
      features: ["DSA evaluation", "Algorithmic thinking", "Code quality & efficiency", "Time-boxed challenges"],
      detail:
        "You'll tackle adaptive DSA problems calibrated to your level. Our AI scores not just correctness but code quality, efficiency, and how you approach edge cases.",
    },
    {
      n: "02",
      title: "Project Evaluation",
      icon: FolderGit2,
      color: "#8B5CF6",
      features: ["Project depth analysis", "Technology stack review", "AI mock interview", "Architecture assessment"],
      detail:
        "Submit your GitHub profile. The AI reads your repos, evaluates architecture decisions, tech stack depth, and asks targeted follow-up questions.",
    },
    {
      n: "03",
      title: "Certification Analysis",
      icon: Award,
      color: "#60A5FA",
      features: ["Certification relevance score", "Learning quality assessment", "Skill validation", "Industry signal rating"],
      detail:
        "Not all certifications are equal. We weigh yours against employer signal data to show exactly how much they matter for your target roles.",
    },
    {
      n: "04",
      title: "Resume Intelligence",
      icon: ScanText,
      color: "#34D399",
      features: ["Resume parsing & scoring", "JD comparison", "ATS optimisation", "Keyword gap analysis"],
      detail:
        "Upload your resume. AI parses it against 1,000+ live job descriptions, scores ATS compatibility, and surfaces the exact keywords you're missing.",
    },
  ];

  const active = steps[activeStep];

  return (
    <section id="how-it-works" className="py-28 relative">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 pointer-events-none bg-gradient-to-b from-transparent via-indigo-500/30 to-transparent"
      />
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">
          <SectionLabel>How It Works</SectionLabel>
          <h2
            className="font-bold text-white mb-14"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}
          >
            AI-Powered <GradientText>4-Step Skill Evaluation</GradientText>
          </h2>
        </div>

        {/* Step selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {steps.map(({ n, title, color }, i) => (
            <button
              key={n}
              onClick={() => setActiveStep(i)}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer border"
              style={{
                backgroundColor: activeStep === i ? `${color}18` : "rgba(255, 255, 255, 0.03)",
                borderColor: activeStep === i ? `${color}40` : "rgba(255, 255, 255, 0.07)",
                color: activeStep === i ? color : "rgba(255, 255, 255, 0.45)",
              }}
            >
              <span
                className="text-xs font-mono"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: activeStep === i ? color : "rgba(255, 255, 255, 0.25)",
                }}
              >
                {n}
              </span>
              {title}
            </button>
          ))}
        </div>

        {/* Active step detail */}
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <GlassCard className="p-8 md:p-12" glow={active.color}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border"
                  style={{
                    background: `linear-gradient(135deg, ${active.color}20, ${active.color}38)`,
                    borderColor: `${active.color}40`,
                  }}
                >
                  <active.icon size={24} style={{ color: active.color }} />
                </div>
                <div
                  className="text-xs font-mono mb-2"
                  style={{ color: active.color, fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Step {active.n}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{active.title}</h3>
                <p className="leading-relaxed mb-6 text-white/50 text-[0.9375rem]">
                  {active.detail}
                </p>
              </div>
              <div className="space-y-3">
                {active.features.map((f) => (
                  <div
                    key={f}
                    className="flex items-center gap-3 p-3.5 rounded-xl border"
                    style={{
                      backgroundColor: `${active.color}08`,
                      borderColor: `${active.color}18`,
                    }}
                  >
                    <CheckCircle2 size={14} style={{ color: active.color }} className="flex-shrink-0" />
                    <span className="text-sm text-white/60">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
