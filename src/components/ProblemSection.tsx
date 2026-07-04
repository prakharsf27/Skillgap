"use client";

import { motion } from "framer-motion";
import { AlertTriangle, BarChart2, FileText } from "lucide-react";
import { GlassCard, SectionLabel } from "./shared";

export default function ProblemSection() {
  const cards = [
    {
      icon: AlertTriangle,
      color: "#F59E0B",
      title: "Lack of Industry-Relevant Skills",
      desc: "Students learn theory but miss practical industry expectations — the hidden bar that most curricula never reveal.",
    },
    {
      icon: BarChart2,
      color: "#6366F1",
      title: "No Visibility Into Skill Gaps",
      desc: "Most students have no data on what employers actually need. They graduate blind, applying without a strategy.",
    },
    {
      icon: FileText,
      color: "#EF4444",
      title: "Weak Resume & Interview Readiness",
      desc: "Even skilled candidates fail due to poor presentation, ATS mismatches, and no structured interview preparation.",
    },
  ];

  return (
    <section id="features" className="py-28 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">
          <SectionLabel>The Problem</SectionLabel>
          <h2
            className="font-bold text-white mb-4"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}
          >
            Why Students Struggle to Get Hired
          </h2>
          <p className="max-w-xl mx-auto mb-14 text-white/45 leading-relaxed">
            The hiring gap is real — and it starts long before the interview room.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {cards.map(({ icon: Icon, color, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-7 h-full" glow={color}>
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 border"
                  style={{
                    backgroundColor: `${color}12`,
                    borderColor: `${color}24`,
                  }}
                >
                  <Icon size={20} style={{ color }} />
                </div>
                <h3 className="text-white font-semibold mb-3 text-base">{title}</h3>
                <p className="text-sm leading-relaxed text-white/50">{desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <GlassCard className="p-10" glow="#6366F1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {[
                { stat: "70%", desc: "of graduates are not industry-ready on their first job application" },
                { stat: "83%", desc: "of students don't know which specific skills to improve before applying" },
                { stat: "6/10", desc: "resumes are rejected due to missing or poorly presented technical skills" },
              ].map(({ stat, desc }) => (
                <div key={stat}>
                  <div
                    className="text-4xl font-black mb-3 bg-gradient-to-r from-indigo-300 to-[#C4B5FD] bg-clip-text text-transparent"
                  >
                    {stat}
                  </div>
                  <p className="text-sm text-white/45 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
