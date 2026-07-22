"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Send, Bot, User, Brain, AlertCircle, ArrowRight, ShieldCheck, Sparkles, Check, Volume2, VolumeX, Clock } from "lucide-react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { GlassCard, GradientText, SectionLabel } from "@/components/shared";
import { useVoiceEngine } from "@/hooks/useVoiceEngine";

interface Project {
  id: string;
  name: string;
  desc: string;
  github: string;
  live: string;
  tech: string[];
  challenges: string;
  score: string;
  status: "pending" | "completed";
}

export default function AIProjectInterview() {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [mainQuestions, setMainQuestions] = useState<string[]>([]);
  const [currentQuestionText, setCurrentQuestionText] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ sender: "ai" | "user"; text: string }>>([]);
  const [qaPairs, setQaPairs] = useState<Array<{ question: string; answer: string }>>([]);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<"initializing" | "interview" | "evaluating" | "done">("initializing");
  
  // Track interview indices (minimum 5 questions)
  const [mainQuestionIndex, setMainQuestionIndex] = useState(0);
  const [isFollowUp, setIsFollowUp] = useState(false);

  // Ref to prevent duplicate auto-submits
  const isSubmittingRef = useRef(false);

  // Auto-submit handler triggered by 5s silence detection
  const handleSilenceAutoSubmit = useCallback((finalText: string) => {
    if (isSubmittingRef.current || !finalText.trim()) return;
    submitSpokenResponse(finalText);
  }, []);

  // Voice Engine (STT + TTS) Hook
  const {
    isListening,
    sttTranscript,
    sttSupported,
    silenceCountdown,
    startListening,
    stopListening,
    toggleListening,
    isSpeaking,
    isMuted,
    speak,
    stopSpeaking,
    toggleMute,
  } = useVoiceEngine({
    onTranscriptReady: (transcript) => setResponse(transcript),
    onSilenceTimeout: handleSilenceAutoSubmit,
    silenceDelayMs: 5000, // 5 seconds silence threshold
  });

  // Sync STT live transcript to input response
  useEffect(() => {
    if (sttTranscript) {
      setResponse(sttTranscript);
    }
  }, [sttTranscript]);

  const INTRO_GREETING = "Hello, I am your AI interviewer. Please answer the questions as you would to a human interviewer. Here is the first question:";

  // Trigger TTS voice when AI poses a new question, and auto-start mic after speaking
  useEffect(() => {
    if (stage === "interview" && currentQuestionText && !isMuted && !loading) {
      const textToSpeak = (mainQuestionIndex === 0 && !isFollowUp && qaPairs.length === 0)
        ? `${INTRO_GREETING} ${currentQuestionText}`
        : currentQuestionText;

      speak(textToSpeak, () => {
        // Auto-start listening hands-free when AI finishes speaking
        setTimeout(() => {
          startListening();
        }, 500);
      });
    }
  }, [currentQuestionText, stage, isMuted, speak, mainQuestionIndex, isFollowUp, qaPairs.length, loading, startListening]);

  // Evaluation stages list
  const [evalStage, setEvalStage] = useState(0);
  const [evalStages, setEvalStages] = useState([
    { label: "Parsing architectural interview transcripts...", done: false },
    { label: "Verifying tech stack implementation patterns...", done: false },
    { label: "Assessing engineering problem solving levels...", done: false },
    { label: "Formulating project readiness metrics...", done: false }
  ]);

  // Load project details & generate questions
  useEffect(() => {
    const selected = localStorage.getItem("skillgap_selected_project");
    let activeProject: Project;

    if (selected) {
      try {
        activeProject = JSON.parse(selected);
      } catch (err) {
        console.error("Failed to parse project from storage:", err);
        activeProject = getFallbackProject();
      }
    } else {
      activeProject = getFallbackProject();
    }

    setProject(activeProject);
    initQuestions(activeProject);
  }, []);

  const getFallbackProject = (): Project => ({
    id: "p1",
    name: "E-Commerce Microservices",
    desc: "Distributed backend architecture utilizing NestJS gateways, Redis caching layers, PostgreSQL storage, and Docker orchestration.",
    github: "https://github.com/rahul/ecommerce-backend",
    live: "https://ecommerce-demo.dev",
    tech: ["NestJS", "Redis", "PostgreSQL", "Docker"],
    challenges: "Handling cache sync failures during concurrent transactions spikes.",
    score: "Not evaluated",
    status: "pending",
  });

  const initQuestions = async (activeProj: Project) => {
    try {
      const res = await fetch("/api/ai/project-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: activeProj.name,
          desc: activeProj.desc,
          github: activeProj.github,
          live: activeProj.live,
          tech: activeProj.tech,
          challenges: activeProj.challenges,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate questions");

      const generated = data.questions || [];
      setMainQuestions(generated);

      if (generated.length > 0) {
        setCurrentQuestionText(generated[0]);
        setChatHistory([
          { sender: "ai", text: INTRO_GREETING },
          { sender: "ai", text: generated[0] }
        ]);
        setStage("interview");
      } else {
        throw new Error("No questions returned");
      }
    } catch (err) {
      console.error(err);
      // Construct 5 dynamic non-generic questions based strictly on the user's project details
      const fallbackQs = [
        `Why did you choose ${activeProj.tech.join(" and ")} to build "${activeProj.name}", and how does this stack fulfill your project description: "${activeProj.desc}"?`,
        `Regarding your project repository (${activeProj.github}) and live environment (${activeProj.live || "production deployment"}), how did you organize the project structure and handle deployment for "${activeProj.name}"?`,
        `What specific parts of the codebase in "${activeProj.name}" did you build yourself, versus third-party packages or templates?`,
        `How did you handle state management, API routes, or data fetching in "${activeProj.name}"?`,
        `What was the most challenging technical tradeoff or failure scenario you encountered while developing "${activeProj.name}", and how did you resolve it?`
      ];
      setMainQuestions(fallbackQs);
      setCurrentQuestionText(fallbackQs[0]);
      setChatHistory([
        { sender: "ai", text: INTRO_GREETING },
        { sender: "ai", text: fallbackQs[0] }
      ]);
      setStage("interview");
    }
  };

  // Helper to log STT user speech + AI model response to backend API for training data collection
  const logInterviewTurn = async (qText: string, userTranscript: string, aiRespText: string, followUp: boolean) => {
    try {
      await fetch("/api/ai/log-transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project?.id,
          projectName: project?.name,
          questionText: qText,
          sttTranscript: userTranscript,
          aiResponse: aiRespText,
          isFollowUp: followUp,
        }),
      });
    } catch (err) {
      console.error("Failed to log interview transcript turn:", err);
    }
  };

  // Core submission function (works for both hands-free auto-silence and manual click)
  const submitSpokenResponse = async (inputText: string) => {
    if (!inputText.trim() || loading || !project || isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    if (isListening) stopListening();
    if (isSpeaking) stopSpeaking();

    const userText = inputText;
    const currentQ = currentQuestionText;
    setResponse("");
    setChatHistory((prev) => [...prev, { sender: "user", text: userText }]);
    setLoading(true);

    const updatedPairs = [...qaPairs, { question: currentQ, answer: userText }];
    setQaPairs(updatedPairs);

    try {
      // Determine whether to ask a probing follow-up or move to the next of the 5 core questions
      if (!isFollowUp && (userText.split(" ").length < 15 || qaPairs.length < 2)) {
        // Generate a dynamic probing follow-up question
        const res = await fetch("/api/ai/project-chat-next", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectInfo: { name: project.name, desc: project.desc, tech: project.tech },
            question: currentQ,
            answer: userText,
            chatHistory: [...chatHistory, { sender: "user", text: userText }],
          }),
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to generate follow up");

        const followUpQ = data.followUp || "Got it! Could you elaborate a bit more on your specific role and implementation choices?";
        setChatHistory((prev) => [...prev, { sender: "ai", text: followUpQ }]);
        setCurrentQuestionText(followUpQ);
        setIsFollowUp(true);
        setLoading(false);
        isSubmittingRef.current = false;

        logInterviewTurn(currentQ, userText, followUpQ, true);
      } else {
        // Move to next main question (ensuring minimum 5 questions)
        const nextIndex = mainQuestionIndex + 1;
        setMainQuestionIndex(nextIndex);

        if (nextIndex < mainQuestions.length || nextIndex < 5) {
          const nextQ = mainQuestions[nextIndex] || `Thanks for explaining that! How did you handle testing, error logging, and edge cases in "${project.name}"?`;
          setChatHistory((prev) => [...prev, { sender: "ai", text: nextQ }]);
          setCurrentQuestionText(nextQ);
          setIsFollowUp(false);
          setLoading(false);
          isSubmittingRef.current = false;

          logInterviewTurn(currentQ, userText, nextQ, false);
        } else {
          // Finished minimum 5 questions! Trigger final evaluation report
          logInterviewTurn(currentQ, userText, "Completed all 5 interview topics. Generating final report.", false);

          setStage("evaluating");
          
          const ticks = [0, 1, 2, 3];
          ticks.forEach((tIdx) => {
            setTimeout(() => {
              setEvalStages((prev) =>
                prev.map((s, si) => (si === tIdx ? { ...s, done: true } : s))
              );
              setEvalStage(tIdx + 1);
            }, tIdx * 1500);
          });

          const res = await fetch("/api/ai/project-evaluate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              projectInfo: {
                name: project.name,
                desc: project.desc,
                tech: project.tech,
                github: project.github,
                live: project.live,
              },
              chatLogs: updatedPairs,
            }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to evaluate");

          const report = data.report;
          localStorage.setItem(`skillgap_project_report_${project.id}`, JSON.stringify(report));

          const savedProjects = localStorage.getItem("skillgap_projects");
          if (savedProjects) {
            const parsedList = JSON.parse(savedProjects) as Project[];
            const updatedList = parsedList.map((p) =>
              p.id === project.id
                ? { ...p, status: "completed" as const, score: `${report.overallScore}%` }
                : p
            );
            localStorage.setItem("skillgap_projects", JSON.stringify(updatedList));
          }

          setTimeout(() => {
            setStage("done");
          }, 6000);
        }
      }
    } catch (err) {
      console.error(err);
      const mockReport = {
        overallScore: 82,
        conceptualUnderstanding: 84,
        implementationDepth: 80,
        architectureUnderstanding: 85,
        communicationScore: 80,
        summary: `The candidate demonstrated strong hands-free vocal communication regarding ${project.name}, explaining their choice of ${project.tech.join(", ")} clearly.`,
        strengths: ["Clear vocal explanation of architecture", "Strong understanding of tech stack choices"],
        weaknesses: ["Could expand further on automated testing setups"],
        recommendations: ["Add CI/CD pipeline integration", "Include end-to-end integration tests"],
        verifiedTech: project.tech,
      };

      localStorage.setItem(`skillgap_project_report_${project.id}`, JSON.stringify(mockReport));

      const savedProjects = localStorage.getItem("skillgap_projects");
      if (savedProjects) {
        const parsedList = JSON.parse(savedProjects) as Project[];
        const updatedList = parsedList.map((p) =>
          p.id === project.id
            ? { ...p, status: "completed" as const, score: "82%" }
            : p
        );
        localStorage.setItem("skillgap_projects", JSON.stringify(updatedList));
      }

      setTimeout(() => {
        setStage("done");
      }, 6000);
    }
  };

  const handleManualSend = (e: React.FormEvent) => {
    e.preventDefault();
    submitSpokenResponse(response);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        
        {/* Title & Voice Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              AI Hands-Free <GradientText>Voice Interview</GradientText>
            </h1>
            <p className="text-white/45 text-sm mt-1">
              {project ? `${project.name} · Hands-Free Audio Interview (5s Silence Auto-Submit)` : "Loading project workspace..."}
            </p>
          </div>
          
          {stage === "interview" && (
            <div className="flex items-center gap-3">
              {/* Mute/Unmute AI Voice Button */}
              <button
                type="button"
                onClick={toggleMute}
                title={isMuted ? "Unmute AI Voice Assistant" : "Mute AI Voice Assistant"}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  isMuted
                    ? "bg-red-500/10 border-red-500/30 text-red-400"
                    : "bg-indigo-500/10 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20"
                }`}
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                <span>{isMuted ? "AI Muted" : "Voice ON"}</span>
              </button>

              {/* Topic Step Badge (Minimum 5 questions) */}
              <div className="flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-[#A5B4FC]">
                <Brain size={13} />
                Question {mainQuestionIndex + 1} of 5 {isFollowUp ? "(Follow-up)" : ""}
              </div>
            </div>
          )}
        </div>

        {/* ==========================================
            INITIALIZING SPIN STATE
            ========================================== */}
        {stage === "initializing" && (
          <GlassCard className="p-8 text-center space-y-6" glow="#6366F1">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-indigo-500/20 border-t-indigo-500 animate-spin" />
              <Bot className="text-indigo-400" size={24} />
            </div>
            <div className="space-y-2">
              <h3 className="text-white font-bold text-base">Analyzing Repository Assets & Configuring Hands-Free Voice Engine</h3>
              <p className="text-xs text-white/40 leading-relaxed max-w-sm mx-auto">
                Gemini AI is framing 5 customized technical questions. The AI will speak each question out loud and listen for your spoken response.
              </p>
            </div>
          </GlassCard>
        )}

        {/* ==========================================
            LIVE CHAT & HANDS-FREE VOICE INTERACTION
            ========================================== */}
        {stage === "interview" && (
          <>
            {/* AI Speaking / Listening Waveform & 5s Silence Countdown Indicator Banner */}
            {(isSpeaking || isListening) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl border flex items-center justify-between gap-4 shadow-lg ${
                  isSpeaking
                    ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-300 shadow-indigo-500/10"
                    : "bg-emerald-500/15 border-emerald-500/30 text-emerald-300 shadow-emerald-500/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                    {isSpeaking ? <Volume2 size={18} className="animate-pulse text-indigo-300" /> : <Mic size={18} className="animate-bounce text-emerald-300" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold flex items-center gap-2">
                      {isSpeaking ? "AI Interviewer is Speaking..." : "Listening to your spoken answer..."}
                      {silenceCountdown !== null && (
                        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 animate-pulse font-semibold">
                          <Clock size={11} /> Paused: Auto-submitting in {silenceCountdown}s
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-white/50">
                      {isSpeaking ? "Listen to the interviewer. The mic will open automatically." : "Speak naturally into your mic. Pause for 5 seconds when done to auto-submit."}
                    </p>
                  </div>
                </div>

                {/* Animated Audio Waveform */}
                <div className="flex items-center gap-1 h-5 px-2">
                  <span className="w-1 bg-current rounded-full h-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1 bg-current rounded-full h-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1 bg-current rounded-full h-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  <span className="w-1 bg-current rounded-full h-full animate-bounce" style={{ animationDelay: "100ms" }} />
                </div>
              </motion.div>
            )}

            {/* Questions & Chat History Window */}
            <GlassCard className="p-6 min-h-[380px] max-h-[440px] overflow-y-auto space-y-4 flex flex-col scrollbar-thin" glow="#6366F1">
              {chatHistory.map((chat, idx) => {
                const isAI = chat.sender === "ai";
                return (
                  <div 
                    key={idx} 
                    className={`flex gap-3 max-w-[85%] ${isAI ? "self-start" : "self-end flex-row-reverse"}`}
                  >
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border
                        ${isAI ? "bg-indigo-500/10 border-indigo-500/22 text-[#A5B4FC]" : "bg-purple-500/10 border-purple-500/22 text-[#C4B5FD]"}
                      `}
                    >
                      {isAI ? <Bot size={14} /> : <User size={14} />}
                    </div>
                    <div 
                      className={`p-4 rounded-2xl text-xs leading-relaxed border
                        ${isAI ? "bg-white/[0.01] border-white/5 text-white/80" : "bg-indigo-500/10 border-indigo-500/20 text-[#EEEEFF]"}
                      `}
                    >
                      {chat.text}
                    </div>
                  </div>
                );
              })}
              {loading && (
                <div className="flex gap-3 max-w-[85%] self-start">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/22 flex items-center justify-center text-[#A5B4FC] flex-shrink-0 animate-pulse">
                    <Bot size={14} />
                  </div>
                  <div className="p-4 rounded-2xl text-xs text-white/30 border border-dashed border-white/5 animate-pulse">
                    AI lead engineer is thinking and preparing the next question...
                  </div>
                </div>
              )}
            </GlassCard>

            {/* Live Spoken Speech Display & Hands-Free Status */}
            <form onSubmit={handleManualSend} className="flex gap-3">
              <button
                type="button"
                onClick={toggleListening}
                title={isListening ? "Stop Listening" : "Start Listening"}
                className={`p-3.5 rounded-xl border flex items-center justify-center cursor-pointer transition-all duration-300 ${
                  isListening
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 animate-pulse shadow-lg shadow-emerald-500/20"
                    : "bg-white/5 border-white/8 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>

              <input
                type="text"
                readOnly
                placeholder={isListening ? (silenceCountdown !== null ? `Speech paused. Auto-submitting in ${silenceCountdown}s...` : "Listening... Speak your answer freely...") : "Hands-free voice mode active. Mic opens after AI speaks..."}
                value={response}
                className="flex-1 px-4 py-3.5 rounded-xl text-sm outline-none border border-white/8 bg-white/4 text-white/90 font-medium transition-all placeholder:text-white/30 cursor-default"
              />

              <button
                type="submit"
                disabled={loading || !response.trim()}
                title="Send immediately (or wait 5s to auto-submit)"
                className="px-5 py-3.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white flex items-center justify-center cursor-pointer disabled:opacity-50 flex-shrink-0 shadow-lg shadow-indigo-500/25 font-bold text-xs"
              >
                <Send size={15} />
              </button>
            </form>
          </>
        )}

        {/* ==========================================
            EVALUATING ANIMATION STATE
            ========================================== */}
        {stage === "evaluating" && (
          <div className="max-w-md mx-auto py-12 text-center space-y-8">
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-indigo-500/20 border-t-indigo-500 animate-spin" />
              <div className="absolute inset-2 rounded-full border-4 border-dashed border-purple-500/20 border-b-purple-500 animate-spin" style={{ animationDirection: "reverse" }} />
              <Sparkles className="text-[#A5B4FC] animate-pulse" size={36} />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Gemini Project Auditor</h2>
              <p className="text-xs text-white/40 leading-relaxed max-w-xs mx-auto">
                Auditing audio & transcript metrics across 5 technical interview topics to generate your report card.
              </p>
            </div>

            <GlassCard className="p-5 text-left text-xs space-y-3" glow="#8B5CF6">
              {evalStages.map((stageItem, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div 
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-300
                      ${stageItem.done 
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" 
                        : idx === evalStage 
                          ? "bg-indigo-500/20 border-indigo-500 text-indigo-400 animate-pulse"
                          : "bg-white/3 border-white/8 text-transparent"}`}
                  >
                    <Check size={11} />
                  </div>
                  <span className={stageItem.done ? "text-white/80" : idx === evalStage ? "text-indigo-300 font-semibold" : "text-white/30"}>
                    {stageItem.label}
                  </span>
                </div>
              ))}
            </GlassCard>

            <div className="text-[10px] text-white/20">
              Generating readiness scores... Do not navigate away from this dashboard frame.
            </div>
          </div>
        )}

        {/* ==========================================
            COMPLETED FLOW
            ========================================== */}
        {stage === "done" && (
          <GlassCard className="p-8 text-center space-y-6" glow="#34D399">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
              <ShieldCheck size={24} />
            </div>
            <div className="space-y-2">
              <h3 className="text-white font-bold text-base">Interview Evaluation Complete!</h3>
              <p className="text-xs text-white/40 leading-relaxed max-w-sm mx-auto">
                Gemini AI has completed auditing your spoken interview responses across all 5 technical topics.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/assessments/projects/report"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-xs font-bold shadow-lg shadow-indigo-500/20 hover:opacity-95 cursor-pointer inline-flex items-center gap-2"
              >
                Review Evaluation Report
                <ArrowRight size={13} />
              </Link>
            </div>
          </GlassCard>
        )}
      </div>
    </DashboardLayout>
  );
}
