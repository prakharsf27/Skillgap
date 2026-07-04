"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, CheckCircle2, ArrowRight, Brain } from "lucide-react";
import { GlassCard, GradientText } from "@/components/shared";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVerifying(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#08080F] text-[#EEEEFF] flex items-center justify-center overflow-hidden font-sans">
      {/* Background Hero Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-[0.35]" 
        style={{ backgroundImage: "url('/login-hero.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#08080F] via-transparent to-[#08080F]/85 z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-black/20 z-0 pointer-events-none" />

      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          style={{
            position: "absolute",
            top: "-15%",
            right: "-10%",
            width: "60vw",
            height: "60vh",
            background: "radial-gradient(circle, rgba(139,92,246,0.11) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-15%",
            left: "-10%",
            width: "60vw",
            height: "60vh",
            background: "radial-gradient(circle, rgba(99,102,241,0.11) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="max-w-md w-full px-6 relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center transition-transform group-hover:rotate-6"
            >
              <Brain size={16} className="text-white" />
            </div>
            <span className="font-bold text-white text-sm tracking-tight">
              SkillGap <span style={{ color: "#A5B4FC" }}>AI</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Email <GradientText>Verification</GradientText>
          </h1>
        </div>

        <GlassCard className="p-8 text-center" glow={verifying ? "#8B5CF6" : "#34D399"} style={{ background: "rgba(10, 10, 20, 0.85)" }}>
          {verifying ? (
            <div className="space-y-6 py-4">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500/10 border-t-indigo-500 animate-spin" />
                <Mail className="text-white/40 animate-pulse" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Verifying credentials...</h3>
                <p className="text-xs text-white/40 mt-1 leading-relaxed">
                  Securing authorization tokens and checking email patterns.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 py-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/22 flex items-center justify-center text-emerald-400 mx-auto"
              >
                <CheckCircle2 size={32} />
              </motion.div>
              <div>
                <h3 className="font-bold text-white text-base">Email Verified Successfully!</h3>
                <p className="text-xs text-white/40 mt-1.5 leading-relaxed">
                  Your university profile <span className="text-[#A5B4FC] font-semibold">rahul@alliance.edu.in</span> is verified.
                </p>
              </div>

              <Link
                href="/onboarding"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-95 cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                  boxShadow: "0 0 32px rgba(99, 102, 241, 0.35)",
                }}
              >
                Continue to Onboarding
                <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
