"use client";

import { motion } from "framer-motion";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { GlassCard, GradientText, SectionLabel } from "./shared";

const radarData = [
  { subject: "Coding", score: 80 },
  { subject: "DSA", score: 75 },
  { subject: "Projects", score: 70 },
  { subject: "Resume", score: 65 },
  { subject: "Sys Design", score: 40 },
  { subject: "Certs", score: 60 },
];

export default function SampleReport() {
  return (
    <section id="report" className="py-28 relative">
      <div
        className="absolute inset-y-0 left-0 right-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(99, 102, 241, 0.07) 0%, transparent 60%)",
        }}
      />
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">
          <SectionLabel>Sample Report</SectionLabel>
          <h2
            className="font-bold text-white mb-4"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}
          >
            Get a <GradientText>Personalized Skill Gap Report</GradientText>
          </h2>
          <p className="max-w-lg mx-auto mb-14 text-white/44 leading-relaxed">
            A comprehensive breakdown across every dimension that matters to recruiters — generated in 60 seconds.
          </p>
        </div>

        <GlassCard className="p-8 md:p-12" glow="#6366F1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left side */}
            <div className="space-y-7">
              <div
                className="flex items-center gap-5 p-5 rounded-2xl border border-indigo-500/18 bg-indigo-500/8"
              >
                <div className="relative w-20 h-20 flex-shrink-0">
                  <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                    <circle cx="40" cy="40" r="33" fill="none" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="7" />
                    <circle
                      cx="40"
                      cy="40"
                      r="33"
                      fill="none"
                      strokeWidth="7"
                      stroke="url(#repGrad)"
                      strokeDasharray={`${0.72 * 2 * Math.PI * 33} ${2 * Math.PI * 33}`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="repGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366F1" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-white">72%</span>
                    <span className="text-[9px] text-white/40">Overall</span>
                  </div>
                </div>
                <div>
                  <div className="text-white font-bold text-lg mb-1">Job Readiness Score</div>
                  <div className="text-sm text-white/44">
                    {"You're in the"} <span className="text-[#A5B4FC]">top 34%</span> of applicants in your domain
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Coding Skills", score: 80, color: "#6366F1" },
                  { label: "Project Quality", score: 70, color: "#8B5CF6" },
                  { label: "Resume Match", score: 65, color: "#60A5FA" },
                  { label: "Certifications", score: 60, color: "#34D399" },
                ].map(({ label, score, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/62">{label}</span>
                      <span
                        className="font-semibold text-[0.8125rem]"
                        style={{ color, fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {score}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-white/6">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${color}, ${color}77)` }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${score}%` }}
                        transition={{ duration: 1.0, ease: "easeOut" }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <div className="text-sm font-medium text-white mb-3">Skills to Bridge</div>
                <div className="flex flex-wrap gap-2">
                  {["System Design", "Docker", "AWS", "Testing", "GraphQL", "Redis"].map((s) => (
                    <span
                      key={s}
                      className="text-xs px-2.5 py-1 rounded-lg border border-red-500/18 bg-red-500/8 text-red-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side: Radar Chart */}
            <div>
              <div className="text-sm font-medium text-white mb-5 text-center">
                Skill Radar vs. Industry Benchmark
              </div>
              <div style={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255, 255, 255, 0.07)" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: "rgba(255, 255, 255, 0.42)", fontSize: 11, fontFamily: "Inter, sans-serif" }}
                    />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#6366F1"
                      fill="#6366F1"
                      fillOpacity={0.18}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div
                className="mt-5 p-4 rounded-xl border border-emerald-500/14 bg-emerald-500/6"
              >
                <div className="text-xs font-semibold mb-2 text-emerald-300">
                  Top Recommended Action
                </div>
                <div className="text-sm text-white/50">
                  Complete the System Design fundamentals module and build one distributed project to gain 15 readiness points instantly.
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
