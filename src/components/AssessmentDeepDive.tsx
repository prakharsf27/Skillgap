"use client";

import { motion } from "framer-motion";
import { Code2, Brain, FolderGit2, ScanText, CheckCircle2 } from "lucide-react";
import { GlassCard, GradientText, SectionLabel } from "./shared";

export default function AssessmentDeepDive() {
  const features = [
    {
      icon: Code2,
      color: "#6366F1",
      title: "Coding Intelligence",
      desc: "Adaptive challenges evaluate your programming depth beyond syntax — we measure how you think.",
      checks: ["DSA fundamentals", "Logic & reasoning", "Code quality", "Time complexity"],
    },
    {
      icon: Brain,
      color: "#8B5CF6",
      title: "Problem Solving Intelligence",
      desc: "Engineering judgment and systems thinking — the soft-technical skills that distinguish seniors from juniors.",
      checks: ["System thinking", "Decision making", "Engineering judgment", "Architectural reasoning"],
    },
    {
      icon: FolderGit2,
      color: "#60A5FA",
      title: "Project Intelligence",
      desc: "Your GitHub projects reveal actual maturity. We read architecture, tech choices, and README depth.",
      checks: ["Architecture depth", "Tech stack knowledge", "Real-world applicability", "Code organisation"],
    },
    {
      icon: ScanText,
      color: "#34D399",
      title: "Resume Intelligence",
      desc: "AI cross-references your resume against 1,000+ real job descriptions to surface blind spots instantly.",
      checks: ["Skill extraction", "ATS score", "Job role compatibility", "Keyword gap analysis"],
    },
  ];

  return (
    <section className="py-28 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">
          <SectionLabel>AI Evaluation Engine</SectionLabel>
          <h2
            className="font-bold text-white mb-4"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}
          >
            What Our AI <GradientText>Evaluates</GradientText>
          </h2>
          <p className="max-w-lg mx-auto mb-14 text-white/44 leading-relaxed">
            Four dimensions of intelligence — assessed in one unified 12-minute session.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map(({ icon: Icon, color, title, desc, checks }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-8 h-full" glow={color}>
                <div className="flex items-start gap-5">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border"
                    style={{
                      backgroundColor: `${color}12`,
                      borderColor: `${color}26`,
                    }}
                  >
                    <Icon size={22} style={{ color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
                    <p className="text-sm leading-relaxed mb-5 text-white/44">{desc}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {checks.map((c) => (
                        <div key={c} className="flex items-center gap-2 text-xs text-white/54">
                          <CheckCircle2 size={11} style={{ color }} className="flex-shrink-0" />
                          {c}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
