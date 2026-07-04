"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  FolderGit2, Plus, Github, Globe, Cpu, 
  ArrowRight, ShieldCheck, Trash2, Upload, AlertCircle 
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { GlassCard, GradientText, SectionLabel } from "@/components/shared";

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

export default function ProjectAssessment() {
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  // Load projects from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("skillgap_projects");
    if (saved) {
      try {
        setProjects(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to parse projects:", err);
      }
    } else {
      const defaultProject: Project = {
        id: "p1",
        name: "E-Commerce Microservices",
        desc: "Distributed backend architecture utilizing NestJS gateways, Redis caching layers, PostgreSQL storage, and Docker orchestration.",
        github: "https://github.com/rahul/ecommerce-backend",
        live: "https://ecommerce-demo.dev",
        tech: ["NestJS", "Redis", "PostgreSQL", "Docker"],
        challenges: "Handling cache sync failures during concurrent transactions spikes.",
        score: "78%",
        status: "completed",
      };
      setProjects([defaultProject]);
      localStorage.setItem("skillgap_projects", JSON.stringify([defaultProject]));
    }
  }, []);

  const saveProjectsToStorage = (updatedProjects: Project[]) => {
    setProjects(updatedProjects);
    localStorage.setItem("skillgap_projects", JSON.stringify(updatedProjects));
  };

  // Form states
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [github, setGithub] = useState("");
  const [live, setLive] = useState("");
  const [techInput, setTechInput] = useState("");
  const [challenges, setChallenges] = useState("");
  const [fileUploaded, setFileUploaded] = useState(false);

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !desc || !github) return;

    const newProject: Project = {
      id: `p${Date.now()}`,
      name,
      desc,
      github,
      live: live || "#",
      tech: techInput ? techInput.split(",").map(t => t.trim()) : ["React", "NodeJS"],
      challenges,
      score: "Not evaluated",
      status: "pending",
    };

    saveProjectsToStorage([newProject, ...projects]);
    setShowAddForm(false);
    
    // Clear form
    setName("");
    setDesc("");
    setGithub("");
    setLive("");
    setTechInput("");
    setChallenges("");
    setFileUploaded(false);
  };

  const deleteProject = (id: string) => {
    saveProjectsToStorage(projects.filter(p => p.id !== id));
  };

  const handleStartInterview = (project: Project) => {
    localStorage.setItem("skillgap_selected_project", JSON.stringify(project));
    router.push("/assessments/projects/interview");
  };

  const handleViewReport = (project: Project) => {
    localStorage.setItem("skillgap_selected_project", JSON.stringify(project));
    router.push("/assessments/projects/report");
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Project <GradientText>Assessment</GradientText>
            </h1>
            <p className="text-white/45 text-sm mt-1">
              Add your source code projects and complete mock interviews with AI.
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs text-white transition-all hover:opacity-90 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
              boxShadow: "0 0 24px rgba(99, 102, 241, 0.25)",
            }}
          >
            <Plus size={14} />
            Add Project
          </button>
        </div>

        {/* Add Project Form (Expands inline) */}
        {showAddForm && (
          <GlassCard className="p-6 md:p-8" glow="#6366F1">
            <h3 className="text-white font-bold text-base mb-6">Enter Project Details</h3>
            <form onSubmit={handleAddProject} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/60">Project Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chat Application API"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none border border-white/8 bg-white/4 text-white focus:border-indigo-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/60">Tech Stack (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. NextJS, Tailwind, Prisma, PostgreSQL"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none border border-white/8 bg-white/4 text-white focus:border-indigo-500/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/60">Description *</label>
                <textarea
                  required
                  placeholder="Summarize your project functionality, backend structures, and scope..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full min-h-[90px] p-4 rounded-xl text-sm outline-none border border-white/8 bg-white/4 text-white focus:border-indigo-500/50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/60">GitHub Repository Link *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://github.com/..."
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none border border-white/8 bg-white/4 text-white focus:border-indigo-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/60">Live Deployment URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={live}
                    onChange={(e) => setLive(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none border border-white/8 bg-white/4 text-white focus:border-indigo-500/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/60">What major challenges did you face?</label>
                <textarea
                  placeholder="Explain race conditions, data inconsistencies, deployment conflicts..."
                  value={challenges}
                  onChange={(e) => setChallenges(e.target.value)}
                  className="w-full min-h-[90px] p-4 rounded-xl text-sm outline-none border border-white/8 bg-white/4 text-white focus:border-indigo-500/50"
                />
              </div>

              {/* Architecture Diagram Upload Box */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/60">Architecture Diagram Upload</label>
                <div 
                  onClick={() => setFileUploaded(true)}
                  className="border border-dashed border-white/10 rounded-xl p-6 text-center cursor-pointer hover:bg-white/[0.01] transition-all"
                >
                  <Upload className="mx-auto mb-2 text-white/30" size={18} />
                  <div className="text-xs text-white/60">
                    {fileUploaded ? "architecture_diagram.png uploaded!" : "Drag & drop architecture diagrams or click to browse (PNG, PDF)"}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white/50 border border-white/8 hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white cursor-pointer"
                  style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
                >
                  Add to List
                </button>
              </div>
            </form>
          </GlassCard>
        )}

        {/* Project Cards List */}
        <div className="space-y-5">
          {projects.map((project) => (
            <GlassCard key={project.id} className="p-6 md:p-8" glow="#8B5CF6">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="space-y-4 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-bold text-white">{project.name}</h3>
                    <div className="flex gap-1.5">
                      {project.tech.map((t) => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/8 text-white/50 font-semibold">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-white/50 leading-relaxed max-w-2xl">{project.desc}</p>

                  <div className="flex flex-wrap gap-4 text-xs">
                    <a href={project.github} className="flex items-center gap-1.5 text-[#A5B4FC] hover:underline" target="_blank" rel="noreferrer">
                      <Github size={13} />
                      Source Code
                    </a>
                    {project.live !== "#" && (
                      <a href={project.live} className="flex items-center gap-1.5 text-[#C4B5FD] hover:underline" target="_blank" rel="noreferrer">
                        <Globe size={13} />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex flex-row md:flex-col justify-between md:items-end w-full md:w-auto border-t md:border-t-0 border-white/5 pt-4 md:pt-0 gap-4">
                  <div className="text-right">
                    <span className="text-[10px] text-white/35 uppercase tracking-wide">Project Score</span>
                    <div className="text-lg font-black text-white">{project.score}</div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="p-2.5 rounded-xl border border-red-500/15 bg-red-500/5 hover:bg-red-500/10 text-red-400 cursor-pointer transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                    <button
                      onClick={() => project.status === "completed" ? handleViewReport(project) : handleStartInterview(project)}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs text-white transition-all hover:opacity-90 cursor-pointer border border-indigo-500/30"
                      style={{
                        background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.1))",
                      }}
                    >
                      {project.status === "completed" ? "Review Evaluation Report" : "Start AI Interview"}
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
