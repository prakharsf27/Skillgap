"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Code, Database, Brain, Sparkles, School, Cpu, BarChart3, Settings } from "lucide-react";
import { GlassCard, GradientText, SectionLabel } from "@/components/shared";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Onboarding States
  const [selectedRole, setSelectedRole] = useState("");
  const [currentYear, setCurrentYear] = useState("");
  const [college, setCollege] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("");
  const [preparing, setPreparing] = useState(false);

  const roles = [
    { id: "frontend", title: "Frontend Developer", desc: "React, CSS, UI, Accessibility", icon: Code, color: "#6366F1" },
    { id: "backend", title: "Backend Developer", desc: "NodeJS, SQL, System Design", icon: Database, color: "#8B5CF6" },
    { id: "fullstack", title: "Full Stack Developer", desc: "Next.js, Cloud, Databases", icon: Cpu, color: "#60A5FA" },
    { id: "ai_ml", title: "AI/ML Engineer", desc: "Python, PyTorch, Model Ops", icon: Brain, color: "#34D399" },
    { id: "data_analyst", title: "Data Analyst", desc: "SQL, Stats, Tableau, BI", icon: BarChart3, color: "#F59E0B" },
  ];

  const years = [
    { label: "1st Year", value: "1" },
    { label: "2nd Year", value: "2" },
    { label: "3rd Year", value: "3" },
    { label: "4th Year", value: "4" },
    { label: "Graduate / Postgrad", value: "grad" },
  ];

  const skillOptions = [
    "React", "TypeScript", "Node.js", "Python", "SQL", "Docker", "AWS", 
    "System Design", "GraphQL", "Next.js", "Java", "C++", "Tailwind CSS", 
    "Git", "MongoDB", "Kubernetes", "Data Structures", "Algorithms"
  ];

  const difficulties = [
    { value: "easy", label: "Entry Level", desc: "Fundamental syntaxes, basic functions, simple loops." },
    { value: "medium", label: "Associate", desc: "Standard data structures, API integrations, error management." },
    { value: "hard", label: "Advanced", desc: "System architectures, complex DSA, scaling limits." }
  ];

  const languages = ["JavaScript", "TypeScript", "Python", "Java", "C++", "Go"];

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleNext = () => {
    if (step === 1 && !selectedRole) return;
    if (step === 2 && (!currentYear || !college)) return;
    if (step === 4 && (!difficulty || !preferredLanguage)) return;

    if (step < 4) {
      setStep(step + 1);
    } else {
      setPreparing(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2500);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="relative min-h-screen bg-[#08080F] text-[#EEEEFF] flex items-center justify-center overflow-hidden font-sans">
      {/* Mesh Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          style={{
            position: "absolute",
            top: "-10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "80vw",
            height: "70vh",
            background: "radial-gradient(ellipse at center, rgba(139,92,246,0.08) 0%, rgba(99,102,241,0.04) 45%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="max-w-3xl mx-auto px-6 w-full py-12 relative z-10">
        {/* Stepper Progress Bar */}
        {!preparing && (
          <div className="flex items-center justify-between mb-8 max-w-md mx-auto">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center flex-1 last:flex-none">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-semibold border transition-all duration-300"
                  style={{
                    backgroundColor: step === num ? "#6366F1" : step > num ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.03)",
                    borderColor: step >= num ? "#6366F1" : "rgba(255,255,255,0.1)",
                    color: step >= num ? "#ffffff" : "rgba(255,255,255,0.3)",
                  }}
                >
                  {step > num ? <Check size={14} /> : num}
                </div>
                {num < 4 && (
                  <div
                    className="flex-1 h-px mx-3 transition-all duration-500"
                    style={{
                      backgroundColor: step > num ? "#6366F1" : "rgba(255,255,255,0.08)",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {preparing ? (
            <motion.div
              key="preparing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center space-y-6"
            >
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500/10 border-t-indigo-500 animate-spin" />
                <Sparkles className="text-[#A5B4FC] animate-pulse" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white">Configuring Assessment Engine</h2>
              <p className="text-white/44 max-w-sm mx-auto leading-relaxed text-sm">
                AI is compiling adaptive coding questions and target benchmarks tailored specifically to your target role:{" "}
                <span className="text-white font-semibold">{roles.find(r => r.id === selectedRole)?.title}</span>.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard className="p-8 md:p-10" glow="#6366F1" style={{ background: "rgba(10, 10, 20, 0.85)" }}>
                {/* Step 1: Target Role */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <SectionLabel>Step 1 of 4</SectionLabel>
                      <h2 className="text-2xl font-bold text-white mt-1">What role are you targeting?</h2>
                      <p className="text-white/45 text-sm mt-1">We will customize coding and interview modules for this track.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      {roles.map((role) => {
                        const Icon = role.icon;
                        const isSelected = selectedRole === role.id;
                        return (
                          <div
                            key={role.id}
                            onClick={() => setSelectedRole(role.id)}
                            className="p-5 rounded-2xl border text-left cursor-pointer transition-all duration-300 flex items-start gap-4"
                            style={{
                              backgroundColor: isSelected ? `${role.color}14` : "rgba(255,255,255,0.03)",
                              borderColor: isSelected ? role.color : "rgba(255,255,255,0.07)",
                            }}
                          >
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center border"
                              style={{
                                backgroundColor: isSelected ? `${role.color}20` : "rgba(255,255,255,0.03)",
                                borderColor: isSelected ? role.color : "rgba(255,255,255,0.1)",
                              }}
                            >
                              <Icon size={18} style={{ color: isSelected ? role.color : "rgba(255,255,255,0.5)" }} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-white text-sm">{role.title}</h3>
                              <p className="text-xs text-white/40 mt-1 leading-relaxed">{role.desc}</p>
                            </div>
                            {isSelected && (
                              <div
                                className="w-5 h-5 rounded-full flex items-center justify-center text-white ml-auto flex-shrink-0"
                                style={{ backgroundColor: role.color }}
                              >
                                <Check size={11} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 2: Academic Profile */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <SectionLabel>Step 2 of 4</SectionLabel>
                      <h2 className="text-2xl font-bold text-white mt-1">Tell us about your college</h2>
                      <p className="text-white/45 text-sm mt-1">We compare your profiles with your peer university graduates.</p>
                    </div>

                    <div className="space-y-6 pt-4">
                      {/* Current Year Selection */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-white/60">Current Academic Year</label>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                          {years.map((y) => {
                            const isSelected = currentYear === y.value;
                            return (
                              <button
                                key={y.value}
                                type="button"
                                onClick={() => setCurrentYear(y.value)}
                                className="py-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all duration-300"
                                style={{
                                  backgroundColor: isSelected ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.03)",
                                  borderColor: isSelected ? "#6366F1" : "rgba(255,255,255,0.07)",
                                  color: isSelected ? "#A5B4FC" : "rgba(255,255,255,0.5)",
                                }}
                              >
                                {y.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* College Name Input */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-white/60">College / University Name</label>
                        <div className="relative">
                          <School size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                          <input
                            type="text"
                            placeholder="e.g. Alliance University"
                            value={college}
                            onChange={(e) => setCollege(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none border border-white/8 bg-white/4 text-white placeholder:text-white/25 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Technical Skills */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <SectionLabel>Step 3 of 4</SectionLabel>
                      <h2 className="text-2xl font-bold text-white mt-1">Select your skills</h2>
                      <p className="text-white/45 text-sm mt-1">Select your current core programming capabilities.</p>
                    </div>

                    <div className="pt-4 space-y-4">
                      <div className="flex flex-wrap gap-2 justify-center max-h-[200px] overflow-y-auto p-1 scrollbar-thin">
                        {skillOptions.map((skill) => {
                          const isSelected = selectedSkills.includes(skill);
                          return (
                            <button
                              key={skill}
                              type="button"
                              onClick={() => toggleSkill(skill)}
                              className="px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer"
                              style={{
                                backgroundColor: isSelected ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.02)",
                                borderColor: isSelected ? "#6366F1" : "rgba(255,255,255,0.06)",
                                color: isSelected ? "#A5B4FC" : "rgba(255,255,255,0.45)",
                              }}
                            >
                              {skill}
                            </button>
                          );
                        })}
                      </div>
                      <div className="text-center text-xs text-white/30">
                        {selectedSkills.length} skills selected
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Assessment Preferences */}
                {step === 4 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <SectionLabel>Step 4 of 4</SectionLabel>
                      <h2 className="text-2xl font-bold text-white mt-1">Assessment Preferences</h2>
                      <p className="text-white/45 text-sm mt-1">Configure your primary testing configurations.</p>
                    </div>

                    <div className="space-y-6 pt-4">
                      {/* Difficulty Selection */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-white/60">Preferred Difficulty</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {difficulties.map((d) => {
                            const isSelected = difficulty === d.value;
                            return (
                              <button
                                key={d.value}
                                type="button"
                                onClick={() => setDifficulty(d.value)}
                                className="p-4 rounded-xl border text-left cursor-pointer transition-all duration-300"
                                style={{
                                  backgroundColor: isSelected ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.02)",
                                  borderColor: isSelected ? "#6366F1" : "rgba(255,255,255,0.07)",
                                }}
                              >
                                <div className="font-semibold text-xs text-white">{d.label}</div>
                                <div className="text-[10px] text-white/40 mt-1 leading-relaxed">{d.desc}</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Language Selection */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-white/60">Preferred Language</label>
                        <div className="flex flex-wrap gap-2">
                          {languages.map((l) => {
                            const isSelected = preferredLanguage === l;
                            return (
                              <button
                                key={l}
                                type="button"
                                onClick={() => setPreferredLanguage(l)}
                                className="px-4 py-2 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer"
                                style={{
                                  backgroundColor: isSelected ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.02)",
                                  borderColor: isSelected ? "#6366F1" : "rgba(255,255,255,0.06)",
                                  color: isSelected ? "#A5B4FC" : "rgba(255,255,255,0.45)",
                                }}
                              >
                                {l}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={step === 1}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent text-white/60 cursor-pointer"
                  >
                    <ArrowLeft size={14} />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={
                      (step === 1 && !selectedRole) ||
                      (step === 2 && (!currentYear || !college)) ||
                      (step === 4 && (!difficulty || !preferredLanguage))
                    }
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40 cursor-pointer"
                    style={{
                      background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                    }}
                  >
                    {step === 4 ? "Complete Profiling" : "Continue"}
                    <ArrowRight size={14} />
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
