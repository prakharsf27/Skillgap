"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Award, Radar, Map, Briefcase, 
  History, Settings, ShieldAlert, LogOut, Menu, X, Brain,
  Sun, Moon
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    // Sync initial theme
    const currentTheme = document.documentElement.classList.contains("light") ? "light" : "dark";
    setTheme(currentTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    if (nextTheme === "light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setTheme(nextTheme);
  };

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Assessments", href: "/assessments", icon: Award },
    { label: "Reports", href: "/reports/skill-gap", icon: Radar },
    { label: "Learning Path", href: "/learning-path", icon: Map },
    { label: "Job Readiness", href: "/readiness", icon: Briefcase },
    { label: "History", href: "/history", icon: History },
    { label: "Settings", href: "/settings", icon: Settings },
    { label: "Admin Panel", href: "/admin", icon: ShieldAlert },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0B0B19]/90 backdrop-blur-md border-b border-white/5 z-40 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain size={18} className="text-[#6366F1]" />
          <span className="font-bold text-sm text-white">SkillGap AI</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white/70 hover:text-white cursor-pointer"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-[#08080F] border-r border-white/5 z-50 transform lg:transform-none lg:opacity-100 transition-all duration-300 flex flex-col pt-6 pb-8 px-4
          ${mobileOpen ? "translate-x-0 opacity-100" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Branding Logo */}
        <div className="flex items-center gap-2.5 px-3 mb-8">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center">
            <Brain size={16} className="text-white" />
          </div>
          <span className="font-bold text-white text-sm tracking-tight">SkillGap AI</span>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer
                  ${isActive 
                    ? "bg-indigo-500/10 border border-indigo-500/20 text-[#A5B4FC]" 
                    : "text-white/40 border border-transparent hover:text-white/80 hover:bg-white/[0.02]"}
                `}
              >
                <Icon size={16} className={isActive ? "text-[#A5B4FC]" : "text-white/40"} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Theme Toggler Button */}
        <div className="px-3 mb-4">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold border border-white/5 bg-white/[0.02] text-white/50 hover:text-white hover:bg-white/[0.04] transition-all cursor-pointer"
            title="Toggle color theme"
          >
            <span className="flex items-center gap-2">
              {theme === "dark" ? <Moon size={14} className="text-[#A5B4FC]" /> : <Sun size={14} className="text-amber-500" />}
              <span>Theme</span>
            </span>
            <span className="text-[10px] opacity-60 uppercase font-mono tracking-wider">{theme}</span>
          </button>
        </div>

        {/* User Footer Profile */}
        <div className="border-t border-white/5 pt-6 px-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
              RS
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Rahul Sharma</div>
              <div className="text-[10px] text-white/40">CSE 2024</div>
            </div>
          </div>
          <Link
            href="/login"
            className="text-white/30 hover:text-red-400 cursor-pointer transition-colors"
          >
            <LogOut size={16} />
          </Link>
        </div>
      </aside>

      {/* Overlay for Mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs lg:hidden z-45"
        />
      )}
    </>
  );
}
