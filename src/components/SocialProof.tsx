"use client";

import { motion } from "framer-motion";
import { Users, Award, CheckCircle2, TrendingUp, Star } from "lucide-react";
import { GlassCard, GradientText, SectionLabel } from "./shared";

export default function SocialProof() {
  const testimonials = [
    {
      name: "Ananya Sharma",
      role: "SDE-1 @ Flipkart",
      avatar: "AS",
      color: "#6366F1",
      text: "SkillGap AI told me exactly what was missing. I focused on System Design and Docker for 6 weeks, then got my offer. The roadmap was spot on.",
    },
    {
      name: "Rohan Verma",
      role: "Frontend Engineer @ Razorpay",
      avatar: "RV",
      color: "#8B5CF6",
      text: "I had 7 rejections before using this. The AI found that my resume wasn't ATS-optimised and my DSA was weak. Fixed both. Got placed in 3 weeks.",
    },
    {
      name: "Priya Menon",
      role: "Full Stack Dev @ Zepto",
      avatar: "PM",
      color: "#60A5FA",
      text: "The job role matching was eye-opening. I was applying for Data roles but I was actually 82% matched to Frontend Dev. Pivoted and got an offer fast.",
    },
  ];

  return (
    <section className="py-28 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">
          <SectionLabel>Success Stories</SectionLabel>
          <h2
            className="font-bold text-white mb-14"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}
          >
            Built for <GradientText>Future Engineers</GradientText>
          </h2>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: Users, value: "4,200+", label: "Students Assessed", color: "#6366F1" },
            { icon: Award, value: "300+", label: "Placements Tracked", color: "#8B5CF6" },
            { icon: CheckCircle2, value: "94%", label: "Accuracy Rate", color: "#60A5FA" },
            { icon: TrendingUp, value: "50+", label: "University Partners", color: "#34D399" },
          ].map(({ icon: Icon, value, label, color }) => (
            <GlassCard key={label} className="p-5 text-center" glow={color}>
              <Icon size={18} className="mx-auto mb-3" style={{ color }} />
              <div className="text-2xl font-bold text-white mb-1">{value}</div>
              <div className="text-xs text-white/35">{label}</div>
            </GlassCard>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map(({ name, role, avatar, color, text }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <GlassCard className="p-7 h-full flex flex-col" glow={color}>
                <div className="flex items-center gap-0.5 mb-5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={13} fill="#F59E0B" stroke="none" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed flex-1 mb-6 text-white/58">
                  &ldquo;{text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}
                  >
                    {avatar}
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold">{name}</div>
                    <div className="text-xs text-white/32">{role}</div>
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
