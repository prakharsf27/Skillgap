import React from "react";

export default function TrustBar() {
  return (
    <div
      className="border-y border-white/5 bg-white/[0.01] py-9"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
          {[
            { value: "4,200+", label: "Students Assessed" },
            { value: "94%", label: "Accuracy Rate" },
            { value: "50+", label: "University Partners" },
            { value: "300+", label: "Placements Tracked" },
            { value: "12 min", label: "Avg. Assessment" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-xl font-bold text-white mb-0.5">{value}</div>
              <div className="text-xs text-white/30">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
