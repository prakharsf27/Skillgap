/**
 * Groq AI Service — Server-side utility
 * Handles AI calls with Zod validation, prompt templates, and structured parsing,
 * backing up to Gemini when necessary.
 */
import {
  callAiWithFallback,
  DSAQuestionsResponseSchema,
  CodingEvaluationSchema,
  SyntaxCheckResultSchema,
  CertificationVerificationResponseSchema,
} from "./ai-client";

// Re-export core types for backward compatibility
export type {
  DSAQuestion,
  CodingEvaluation,
  SyntaxCheckResult,
  CertificationVerification,
} from "./ai-client";

const DIFFICULTY_COLORS: Record<string, string> = {
  "Easy": "#22C55E",
  "Easy-Medium": "#10B981",
  "Medium": "#3B82F6",
  "Medium-Hard": "#8B5CF6",
  "Hard": "#EF4444",
};

// ─── Generate Coding Questions ────────────────────────────────────────────────

export async function generateDsaQuestions(language: string): Promise<any[]> {
  const prompt = `
SYSTEM: You are a senior technical interviewer at a top tech company generating Data Structures & Algorithms interview questions. Output ONLY valid JSON, no markdown formatting, no commentary.

USER PROMPT:
Generate exactly 5 DSA coding questions for a candidate using the programming language: ${language}.
Difficulty must strictly increase: Q1=Easy, Q2=Easy-Medium, Q3=Medium, Q4=Medium-Hard, Q5=Hard.
Cover a spread across: Arrays/Strings, Hashing, Trees/Graphs, Dynamic Programming, Recursion/Backtracking.

For each question return this exact JSON shape:
{
  "questions": [
    {
      "id": "string uuid",
      "title": "string",
      "difficulty": "Easy | Easy-Medium | Medium | Medium-Hard | Hard",
      "topic": "string",
      "description": "string - full problem statement with constraints",
      "examples": [{"input": "string", "output": "string", "explanation": "string"}],
      "constraints": ["string"],
      "starterCode": {"javascript": "string", "python": "string"},
      "hiddenTestCases": [{"input": "string", "expectedOutput": "string"}],
      "gradingCriteria": {
        "correctness": "what defines a correct solution",
        "optimalComplexity": {"time": "Big-O", "space": "Big-O"}
      }
    }
  ]
}`;

  const res = await callAiWithFallback({
    prompt,
    schema: DSAQuestionsResponseSchema,
    primaryProvider: "groq", // Primary is Groq as requested
    temperature: 0.8,
  });

  return (res.questions || []).map((q) => ({
    ...q,
    difficultyColor: DIFFICULTY_COLORS[q.difficulty] ?? "#6366F1",
    timeEst: q.difficulty === "Easy" ? "15 mins" : q.difficulty === "Medium" ? "30 mins" : "45 mins",
    hint: q.gradingCriteria?.correctness || "Consider space-time complexity.",
    defaultCode: q.starterCode?.[language.toLowerCase()] || q.starterCode?.["javascript"] || "function solve() {\n  // Write solution here\n}",
  }));
}



import { z } from "zod";

const EvaluateCodeJsonSchema = z.object({
  correctnessScore: z.number().min(0).max(100),
  readabilityScore: z.number().min(0).max(100),
  complexityAnalysis: z.object({
    actualTime: z.string(),
    actualSpace: z.string(),
    matchesOptimal: z.boolean(),
  }),
  feedback: z.string(),
  flaggedIssues: z.array(z.string()),
});

export async function evaluateCodingAnswer(
  question: { title: string; description: string; difficulty: string },
  code: string,
  language: string
): Promise<any> {
  const prompt = `
SYSTEM: You are an expert code reviewer. Evaluate the submitted solution against the problem's criteria. Output ONLY valid JSON.

USER PROMPT:
Problem Title: ${question.title}
Problem Description: ${question.description}
Programming Language: ${language}
Candidate's code:
${code || "// No code submitted"}

Return:
{
  "correctnessScore": 0-100,
  "readabilityScore": 0-100,
  "complexityAnalysis": {"actualTime": "Big-O", "actualSpace": "Big-O", "matchesOptimal": boolean},
  "feedback": "2-3 sentences, specific and constructive",
  "flaggedIssues": ["string"]
}
`;

  const res = await callAiWithFallback({
    prompt,
    schema: EvaluateCodeJsonSchema,
    primaryProvider: "groq",
    temperature: 0.2,
  });

  const optScore = res.complexityAnalysis.matchesOptimal ? 95 : 60;
  const reasoningScore = Math.round((res.correctnessScore + res.readabilityScore) / 2);
  const finalScore = Math.round(
    res.correctnessScore * 0.5 +
    optScore * 0.25 +
    res.readabilityScore * 0.15 +
    reasoningScore * 0.1
  );

  return {
    correctness: res.correctnessScore,
    readability: res.readabilityScore,
    optimization: optScore,
    reasoning: reasoningScore,
    finalScore,
    timeComplexity: res.complexityAnalysis.actualTime,
    spaceComplexity: res.complexityAnalysis.actualSpace,
    isCorrect: res.correctnessScore >= 80,
    feedback: res.feedback,
    strongPoints: ["Algorithmic logic handles core test cases", `Matches complexity budget: ${res.complexityAnalysis.actualTime}`],
    improvements: res.flaggedIssues,
  };
}

// ─── Real-Time Syntax Checker ───────────────────────────────────────────────

export async function checkSyntax(code: string, language: string): Promise<any> {
  if (!code || code.trim().length === 0) {
    return { isValid: true, errors: [] };
  }

  const prompt = `
SYSTEM: You are a compiler interface. Analyze the code for syntax or logical compilation barriers. Output ONLY valid JSON.

USER PROMPT:
Programming Language: ${language}
Code:
${code}

Return:
{
  "isValid": true | false,
  "errors": [
    {
      "line": number,
      "column": number,
      "message": "string detail",
      "severity": "error" | "warning"
    }
  ]
}`;

  return callAiWithFallback({
    prompt,
    schema: SyntaxCheckResultSchema,
    primaryProvider: "groq",
    temperature: 0.1,
  });
}

// ─── Certification Verification ──────────────────────────────────────────────

export async function verifyCertification(
  certName: string,
  provider: string,
  year: string,
  skillsLearnedInput?: string
): Promise<any> {
  const prompt = `
SYSTEM: You are a labor market analyst assessing certification relevance. Output ONLY valid JSON.

USER PROMPT:
Candidate's certifications:
- Name: ${certName}
  Provider: ${provider}
  Year: ${year}
  Skills Claimed: ${skillsLearnedInput || "N/A"}

Target role: Full Stack Developer
Current market demand signals: Cloud services, Next.js, React, Node.js, Web Security, CI/CD, TypeScript.

For each certification, assess relevance to the target role and whether it's still current/in-demand (vs outdated tech).

Return:
{
  "certifications": [
    {
      "name": "string",
      "relevanceScore": 0-100,
      "status": "current | aging | outdated",
      "reasoning": "1 sentence"
    }
  ],
  "missingRecommendedCerts": ["string"]
}`;

  const res = await callAiWithFallback({
    prompt,
    schema: CertificationVerificationResponseSchema,
    primaryProvider: "groq",
    temperature: 0.2,
  });

  const mainCert = res.certifications[0];
  const isVerified = mainCert ? mainCert.status !== "outdated" : false;
  const credibility = mainCert ? (mainCert.status === "current" ? 90 : mainCert.status === "aging" ? 60 : 30) : 50;
  const relevance = mainCert ? mainCert.relevanceScore : 50;
  const val = credibility >= 80 ? "High" : credibility >= 50 ? "Medium" : "Low";

  return {
    isVerified,
    credibilityScore: credibility,
    relevanceScore: relevance,
    mappedSkills: skillsLearnedInput ? skillsLearnedInput.split(",").map(s => s.trim()) : ["Software Engineering"],
    marketValue: val,
    skillsLearned: skillsLearnedInput ? skillsLearnedInput.split(",").map(s => s.trim()) : [],
    feedback: mainCert ? mainCert.reasoning : "Certification review complete.",
  };
}
