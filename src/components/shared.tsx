import React from "react";

export function GlassCard({
  children,
  className = "",
  glow = "",
  style = {},
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  return (
    <div
      className={`backdrop-blur-xl rounded-2xl ${className}`}
      style={{
        background: "rgba(99, 102, 241, 0.04)",
        border: "1px solid rgba(255, 255, 255, 0.07)",
        boxShadow: glow
          ? `0 0 40px ${glow}14, inset 0 1px 0 rgba(255, 255, 255, 0.06)`
          : "inset 0 1px 0 rgba(255, 255, 255, 0.06)",
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function GradientText({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={className}
      style={{
        background: "linear-gradient(135deg, #A5B4FC 0%, #C4B5FD 50%, #93C5FD 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {children}
    </span>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
      style={{
        background: "rgba(99, 102, 241, 0.1)",
        border: "1px solid rgba(99, 102, 241, 0.22)",
      }}
    >
      <div className="w-1.5 h-1.5 rounded-full bg-[#6366F1]" />
      <span
        className="text-[11px] font-semibold tracking-widest uppercase text-[#A5B4FC]"
      >
        {children}
      </span>
    </div>
  );
}
