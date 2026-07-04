import React from "react";
import { Brain } from "lucide-react";

export default function Footer() {
  const cols = [
    { title: "Product", links: ["How It Works", "Features", "Pricing", "Sample Report", "API"] },
    { title: "Company", links: ["About", "Blog", "Careers", "Press", "Contact"] },
    { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy"] },
  ];

  return (
    <footer className="border-t border-white/5 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-14">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
              >
                <Brain size={16} className="text-white" />
              </div>
              <span className="font-bold text-white tracking-tight">SkillGap AI</span>
            </div>
            <p className="text-sm leading-relaxed mb-6 text-white/38">
              Helping engineering students bridge the gap between academics and industry expectations through AI-driven skill analysis.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-3.5 py-2.5 rounded-xl text-sm outline-none placeholder:text-white/20 border border-white/8 bg-white/4 text-[#EEEEFF]"
              />
              <button
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white flex-shrink-0 cursor-pointer"
                style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
              >
                Subscribe
              </button>
            </div>
          </div>

          {cols.map(({ title, links }) => (
            <div key={title}>
              <div className="text-white font-semibold text-sm mb-5">{title}</div>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm transition-colors duration-200 hover:text-white text-white/36"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5"
        >
          <p className="text-xs text-white/18">
            © 2024 SkillGap AI · All rights reserved
          </p>
          <div className="flex items-center gap-5">
            {["Twitter", "LinkedIn", "GitHub", "Discord"].map((s) => (
              <a
                key={s}
                href="#"
                className="text-xs transition-colors hover:text-white text-white/28"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
