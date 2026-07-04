"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, ArrowRight, AlertCircle, CheckCircle2, Brain } from "lucide-react";
import { GlassCard, GradientText } from "@/components/shared";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    // Mock API recovery request
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg("We've sent a recovery link to your inbox. Please check your email.");
    }, 1200);
  };

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
            Reset <GradientText>Password</GradientText>
          </h1>
          <p className="text-white/45 text-xs mt-2 leading-relaxed">
            Enter your account email below and we will send you a password recovery link.
          </p>
        </div>

        <GlassCard className="p-8" glow="#6366F1" style={{ background: "rgba(10, 10, 20, 0.85)" }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/60">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none border border-white/8 bg-white/4 text-white placeholder:text-white/25 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-2.5 p-3 rounded-xl border border-red-500/20 bg-red-500/8 text-red-300 text-xs"
                >
                  <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-2.5 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/8 text-emerald-300 text-xs animate-pulse"
                >
                  <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" />
                  <span>{successMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-95 cursor-pointer disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                boxShadow: "0 0 32px rgba(99, 102, 241, 0.35)",
              }}
            >
              {loading ? (
                "Sending..."
              ) : (
                <>
                  Send Recovery Link
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-center">
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-xs text-white/55 hover:text-white transition-colors"
            >
              <ArrowLeft size={13} />
              Return to login
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
