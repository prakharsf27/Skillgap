import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkillGap AI - Discover Your Industry Skill Gaps Before Recruiters Do",
  description:
    "AI-powered assessments analyze your coding skills, projects, certifications, and resume to identify exactly what is holding you back from landing your dream job.",
  keywords: [
    "SkillGap AI",
    "Skill gap analysis",
    "Coding assessment",
    "Resume checker",
    "ATS optimization",
    "Engineering placement",
    "DSA test",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'dark';
                  document.documentElement.classList.add(theme);
                } catch (e) {}
              })()
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} bg-background text-foreground antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
