"use client";

import { motion } from "framer-motion";
import { GlassCard, GradientText, SectionLabel } from "./shared";

export default function JobRoleMatching() {
  const roles = [
    {
      title: "Frontend Developer",
      match: 82,
      color: "#6366F1",
      missing: ["Testing", "Accessibility"],
      suggestion: "Add a polished design-system project to your portfolio",
    },
    {
      title: "Backend Developer",
      match: 74,
      color: "#8B5CF6",
      missing: ["System Design", "Docker"],
      suggestion: "Complete a microservices architecture mini-project",
    },
    {
      title: "Full Stack Developer",
      match: 77,
      color: "#60A5FA",
      missing: ["AWS", "CI/CD"],
      suggestion: "Deploy a full project with cloud infrastructure",
    },
    {
      title: "Data Analyst",
      match: 55,
      color: "#F59E0B",
      missing: ["SQL", "Python", "Stats"],
      suggestion: "Take a structured data analysis certification",
    },
  ];

  return (
    <section className="py-28 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">
          <SectionLabel>Role Matching</SectionLabel>
          <h2
            className="font-bold text-white mb-4"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}
          >
            Find the Roles <GradientText>You Are Actually Ready For</GradientText>
          </h2>
          <p className="max-w-lg mx-auto mb-14 text-white/44 leading-relaxed">
            Stop applying blindly. Know your match percentage for every role before you click Apply.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {roles.map(({ title, match, color, missing, suggestion }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-6 h-full flex flex-col" glow={color}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-white">{title}</span>
                </div>
                <div
                  className="text-3xl font-black mb-1 bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${color}, ${color}99)`,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {match}%
                </div>
                <div className="text-xs mb-4 text-white/30">Match Score</div>

                <div className="h-1.5 rounded-full mb-5 bg-white/6">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${match}%` }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    viewport={{ once: true }}
                  />
                </div>

                <div className="mb-5">
                  <div className="text-[11px] mb-2 text-white/30">Skills to gain</div>
                  <div className="flex flex-wrap gap-1.5">
                    {missing.map((m) => (
                      <span
                        key={m}
                        className="text-[10px] px-1.5 py-0.5 rounded border border-red-500/16 bg-red-500/8 text-red-300"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  className="mt-auto p-3 rounded-xl text-xs leading-relaxed border"
                  style={{
                    backgroundColor: `${color}07`,
                    borderColor: `${color}18`,
                    color: "rgba(255, 255, 255, 0.44)",
                  }}
                >
                  {suggestion}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
