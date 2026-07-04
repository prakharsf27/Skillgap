"use client";

import React from "react";
import Sidebar from "./Sidebar";

export default function DashboardLayout({
  children,
  hideSidebar = false,
  noPadding = false,
}: {
  children: React.ReactNode;
  hideSidebar?: boolean;
  noPadding?: boolean;
}) {
  return (
    <div className="min-h-screen bg-[#08080F] text-[#EEEEFF]">
      {!hideSidebar && <Sidebar />}
      <div className={hideSidebar ? "pt-0 w-full" : "lg:pl-64 pt-16 lg:pt-0"}>
        <main className={`min-h-screen ${
          hideSidebar 
            ? noPadding 
              ? "w-full max-w-none" 
              : "py-8 px-6 w-full max-w-none"
            : "py-8 px-6 max-w-7xl mx-auto"
        }`}>
          {children}
        </main>
      </div>
    </div>
  );
}
