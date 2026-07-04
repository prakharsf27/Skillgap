"use client";

import { motion } from "framer-motion";
import { Target, BookOpen, FolderGit2, Award, Lightbulb } from "lucide-react";
import { GlassCard, GradientText, SectionLabel } from "./shared";

export default function LearningRoadmap() {
  const milestones = [
    {
      icon: Target,
      label: "Current Skill Level",
      desc: "Baseline score assessed across all dimensions",
      color: "#6366F1",
      active: true,
    },
    {
      icon: BookOpen,
      label: "Recommended Courses",
      desc: "Curated from top platforms based on your specific gaps",
      color: "#8B5CF6",
      active: true,
    },
    {
      icon: FolderGit2,
      label: "Projects to Build",
      desc: "Hands-on projects that close the most critical skill gaps",
      color: "#60A5FA",
      active: false,
    },
    {
      icon: Award,
      label: "Certifications to Earn",
      desc: "High-signal credentials that recruiters actually value",
      color: "#F59E0B",
      active: false,
    },
    {
      icon: Lightbulb,
      label: "Target Job Role",
      desc: "Apply with confidence — 85%+ match guaranteed",
      color: "#34D399",
      active: false,
    },
  ];

  return (
    <section className="py-28 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">
          <SectionLabel>Growth Plan</SectionLabel>
          <h2
            className="font-bold text-white mb-4"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}
          >
            Your Personalized <GradientText>Learning Roadmap</GradientText>
          </h2>
          <p className="max-w-lg mx-auto mb-14 text-white/44 leading-relaxed">
            A step-by-step growth plan generated uniquely for your skill profile. No guesswork.
          </p>
        </div>

        <div className="max-w-2xl mx-auto relative">
          <div
            className="absolute left-[1.625rem] top-8 bottom-8 w-px"
            style={{
              background: "linear-gradient(to bottom, #6366F1, #8B5CF6, #60A5FA, #F59E0B, #34D399)",
            }}
          />

          <div className="space-y-5">
            {milestones.map(({ icon: Icon, label, desc, color, active }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex gap-6"
              >
                <div className="flex-shrink-0 pt-5 relative z-10">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center border"
                    style={{
                      background: active
                        ? `linear-gradient(135deg, ${color}28, ${color}48)`
                        : "rgba(255, 255, 255, 0.03)",
                      borderColor: active ? `${color}50` : "rgba(255, 255, 255, 0.22)",
                    }}
                  >
                    <Icon size={17} style={{ color: active ? color : "rgba(255, 255, 255, 0.25)" }} />
                  </div>
                </div>

                <GlassCard className="flex-1 p-5" glow={active ? color : ""}>
                  <div className="flex items-center gap-3 mb-1.5">
                    <h3 className="text-white font-semibold text-sm">{label}</h3>
                    {active && (
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-medium border"
                        style={{
                          backgroundColor: `${color}16`,
                          borderColor: `${color}30`,
                          color,
                        }}
                      >
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/44 leading-relaxed">{desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
