"use client";

import { useState, useEffect } from "react";
import { Menu, X, Brain } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const navLinks = [
    { label: "How It Works", id: "how-it-works" },
    { label: "Features", id: "features" },
    { label: "Report", id: "report" },
    { label: "Pricing", id: "pricing" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(8, 8, 15, 0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(99, 102, 241, 0.12)" : "1px solid transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
          >
            <Brain size={16} className="text-white" />
          </div>
          <span className="font-bold text-white text-sm tracking-tight">
            SkillGap <span style={{ color: "#A5B4FC" }}>AI</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-7">
          {navLinks.map(({ label, id }) => (
            <button
              key={label}
              onClick={() => scrollTo(id)}
              className="text-sm transition-colors duration-200 hover:text-white cursor-pointer"
              style={{ color: "rgba(255, 255, 255, 0.48)" }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login?tab=login"
            className="text-sm transition-colors cursor-pointer text-white/45 hover:text-white"
          >
            Log in
          </Link>
          <Link
            href="/login?tab=signup"
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 cursor-pointer flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
              boxShadow: "0 0 20px rgba(99, 102, 241, 0.35)",
            }}
          >
            Start Free
          </Link>
        </div>

        <button
          className="md:hidden transition-colors cursor-pointer"
          style={{ color: "rgba(255, 255, 255, 0.6)" }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <div
          className="md:hidden"
          style={{
            background: "rgba(8, 8, 15, 0.97)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <div className="px-6 py-5 space-y-4">
            {navLinks.map(({ label, id }) => (
              <button
                key={label}
                onClick={() => scrollTo(id)}
                className="block text-sm w-full text-left cursor-pointer"
                style={{ color: "rgba(255, 255, 255, 0.6)" }}
              >
                {label}
              </button>
            ))}
            <Link
              href="/login?tab=signup"
              className="w-full py-3 rounded-xl text-sm font-semibold text-white cursor-pointer block text-center"
              style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
            >
              Start Free Assessment
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
