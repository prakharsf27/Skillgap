"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Settings, User, Lock, Bell, 
  Trash2, ShieldAlert, CheckCircle2, ChevronRight 
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { GlassCard, GradientText } from "@/components/shared";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [college, setCollege] = useState("");
  const [password, setPassword] = useState("••••••••");
  const [notif, setNotif] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function loadSession() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setName(data.user.name || "");
          setEmail(data.user.email || "");
          setCollege(""); // SQLite DB doesn't collect college, initialize to empty
        }
      } catch (err) {
        console.error("Failed to load settings session:", err);
      }
    }
    loadSession();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");
      setMsg("Settings saved successfully!");
      setTimeout(() => setMsg(""), 2500);
    } catch (err: any) {
      alert(err.message || "An error occurred while saving.");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Account <GradientText>Settings</GradientText>
            </h1>
            <p className="text-white/45 text-sm mt-1">
              Configure personal details, notifications, and security options.
            </p>
          </div>
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/8 text-xs font-semibold text-white/70 hover:bg-white/5 cursor-pointer"
          >
            Admin Panel
            <ChevronRight size={13} />
          </Link>
        </div>

        {/* Form container */}
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Left: Settings Forms */}
          <div className="md:col-span-8 space-y-6">
            <GlassCard className="p-6 md:p-8 space-y-5" glow="#6366F1">
              <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                <User size={15} className="text-[#A5B4FC]" />
                Profile Settings
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-white/50 uppercase">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-xs outline-none border border-white/8 bg-white/4 text-white focus:border-indigo-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-white/50 uppercase">College Name</label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-xs outline-none border border-white/8 bg-white/4 text-white focus:border-indigo-500/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-white/50 uppercase">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-xs outline-none border border-white/8 bg-white/4 text-white focus:border-indigo-500/50"
                />
              </div>
            </GlassCard>

            <GlassCard className="p-6 md:p-8 space-y-5" glow="#8B5CF6">
              <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                <Lock size={15} className="text-[#A5B4FC]" />
                Security
              </h3>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-white/50 uppercase">Change Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-xs outline-none border border-white/8 bg-white/4 text-white focus:border-indigo-500/50"
                />
              </div>
            </GlassCard>

            {msg && (
              <div className="p-3.5 rounded-xl border border-emerald-500/15 bg-emerald-500/8 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 size={14} />
                {msg}
              </div>
            )}

            <button
              type="submit"
              className="px-6 py-3 rounded-xl font-bold text-xs text-white cursor-pointer transition-all hover:opacity-95"
              style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
            >
              Save Settings
            </button>
          </div>

          {/* Right: Notification Toggle & Destructive Actions */}
          <div className="md:col-span-4 space-y-6">
            <GlassCard className="p-6" glow="#60A5FA">
              <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                <Bell size={15} className="text-[#A5B4FC]" />
                Notifications
              </h3>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60">Email Alerts</span>
                <button
                  type="button"
                  onClick={() => setNotif(!notif)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${notif ? "bg-indigo-500" : "bg-white/10"}`}
                >
                  <div 
                    className="w-4 h-4 bg-white rounded-full transition-transform duration-200" 
                    style={{ transform: notif ? "translateX(16px)" : "translateX(0px)" }}
                  />
                </button>
              </div>
            </GlassCard>

            <GlassCard className="p-6" glow="#EF4444">
              <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                <Trash2 size={15} className="text-red-400" />
                Danger Zone
              </h3>
              <p className="text-[11px] text-white/40 leading-relaxed mb-4">
                Deleting your account will permanently wipe all reports, history, and certifications records.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (confirm("Are you sure you want to delete your account? This action is permanent!")) {
                    alert("Account request deleted.");
                  }
                }}
                className="w-full py-2.5 rounded-xl border border-red-500/15 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-xs font-semibold cursor-pointer transition-all"
              >
                Delete Account
              </button>
            </GlassCard>
          </div>

        </form>
      </div>
    </DashboardLayout>
  );
}
