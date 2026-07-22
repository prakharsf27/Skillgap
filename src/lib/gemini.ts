/**
 * Gemini AI Service — Server-side utility
 * Handles AI calls with Zod validation, prompt templates, and structured parsing,
 * backing up to Groq when necessary.
 */
import { z } from "zod";
import {
  callAiWithFallback,
  DSAQuestionSchema,
  DSAQuestionsResponseSchema,
  CodingEvaluationSchema,
  ScenarioQuestionsResponseSchema,
  ScenarioEvaluationSchema,
  ResumeAnalysisSchema,
  JobMatchResultSchema,
  ProjectQuestionResponseSchema,
  ProjectFollowUpSchema,
  ProjectEvaluationReportSchema,
} from "./ai-client";

// Re-export core types for backward compatibility
export type {
  DSAQuestion,
  CodingEvaluation,
  ScenarioQuestion,
  ScenarioEvaluation,
  ResumeAnalysis,
  JobMatchResult,
  ProjectEvaluationReport,
} from "./ai-client";

const DIFFICULTY_COLORS: Record<string, string> = {
  "Easy": "#22C55E",
  "Easy-Medium": "#10B981",
  "Medium": "#3B82F6",
  "Medium-Hard": "#8B5CF6",
  "Hard": "#EF4444",
};

// ─── DSA Question Generator (Coding Module) ───────────────────────────────────

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
    primaryProvider: "groq", // Fast/cheap generation
    temperature: 0.8, // More variety
  });

  return (res.questions || []).map((q) => ({
    ...q,
    difficultyColor: DIFFICULTY_COLORS[q.difficulty] ?? "#6366F1",
    timeEst: q.difficulty === "Easy" ? "15 mins" : q.difficulty === "Medium" ? "30 mins" : "45 mins",
    hint: q.gradingCriteria?.correctness || "Consider time complexity optimization.",
    defaultCode: q.starterCode?.[language.toLowerCase()] || q.starterCode?.["javascript"] || "function solve() {\n  // Write solution here\n}",
  }));
}

// ─── Scenario Question Generator ─────────────────────────────────────────────

export async function generateScenarioQuestions(
  targetRole = "Full Stack Developer",
  experienceLevel = "Mid-Senior"
): Promise<any[]> {
  const prompt = `
SYSTEM: You are a staff engineer conducting a system design interview. Output ONLY valid JSON.

USER PROMPT:
Generate exactly 5 scenario-based system design / problem-solving questions appropriate for a ${targetRole} candidate at ${experienceLevel} level.
Questions should test real-world tradeoff thinking (scalability, data modeling, API design, debugging under pressure), not rote DSA.

Return:
{
  "questions": [
    {
      "id": "string",
      "scenario": "string - realistic situation, 3-5 sentences",
      "prompt": "string - the open-ended question",
      "evaluationRubric": {
        "keyPointsExpected": ["string"],
        "redFlags": ["string - answers that indicate poor judgement"]
      }
    }
  ]
}`;

  const res = await callAiWithFallback({
    prompt,
    schema: ScenarioQuestionsResponseSchema,
    primaryProvider: "gemini", // Better reasoning for system design
    temperature: 0.7,
  });

  return (res.questions || []).map((q, i) => {
    const difficulties = ["Easy-Medium", "Medium", "Medium", "Medium-Hard", "Hard"];
    const diff = difficulties[i] || "Medium";
    return {
      id: q.id || `scenario-${i}`,
      title: q.scenario?.split(".")[0] || `System Design Scenario ${i + 1}`,
      description: `${q.scenario}\n\n**Prompt:** ${q.prompt}`,
      difficulty: diff,
      difficultyColor: DIFFICULTY_COLORS[diff] ?? "#8B5CF6",
      timeEst: "15 mins",
      hint: `Expected key aspects: ${q.evaluationRubric?.keyPointsExpected?.slice(0, 2).join(", ") || "tradeoffs"}`,
      evaluationRubric: q.evaluationRubric,
    };
  });
}

// ─── Coding Evaluator ─────────────────────────────────────────────────────────

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

  // Map user's requested grading output to code scoring metrics
  const feedbackSchema = z.object({
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

  const res = await callAiWithFallback({
    prompt,
    schema: feedbackSchema,
    primaryProvider: "groq", // Fast and structured
    temperature: 0.2,
  });

  const optScore = res.complexityAnalysis.matchesOptimal ? 90 : 60;
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
    strongPoints: ["Working solution structure", `Complexity matches expectation: ${res.complexityAnalysis.actualTime}`],
    improvements: res.flaggedIssues,
  };
}

// ─── Scenario Evaluator ───────────────────────────────────────────────────────

export async function evaluateScenarioAnswer(
  question: { title: string; description: string; evaluationRubric?: any },
  answer: string
): Promise<any> {
  const rubricStr = question.evaluationRubric
    ? JSON.stringify(question.evaluationRubric)
    : "Evaluate based on scalability, database selection, API design, and system trade-offs.";

  const prompt = `
SYSTEM: You are a senior engineering interviewer evaluating a system design response. Output ONLY valid JSON.

USER PROMPT:
Question Context: ${question.title}
Scenario: ${question.description}
Candidate's answer: ${answer || "No answer submitted."}
Rubric: ${rubricStr}

Return:
{
  "score": 0-100,
  "strengths": ["string"],
  "gaps": ["string"],
  "feedback": "constructive, 2-3 sentences"
}
`;

  const gradingSchema = z.object({
    score: z.number().min(0).max(100),
    strengths: z.array(z.string()),
    gaps: z.array(z.string()),
    feedback: z.string(),
  });

  const res = await callAiWithFallback({
    prompt,
    schema: gradingSchema,
    primaryProvider: "gemini", // Better context/depth analysis
    temperature: 0.3,
  });

  return {
    correctness: res.score,
    readability: res.score,
    optimization: res.score,
    reasoning: res.score,
    finalScore: res.score,
    feedback: res.feedback,
    strongPoints: res.strengths,
    improvements: res.gaps,
  };
}

// ─── Resume Analyzer ──────────────────────────────────────────────────────────

export async function analyzeResume(resumeText: string): Promise<any> {
  const prompt = `
SYSTEM: You are an expert ATS (Applicant Tracking System) parser. Extract structured details from the resume. Output ONLY valid JSON.

USER PROMPT:
RESUME TEXT:
${resumeText}

Return:
{
  "skills": ["skill1", "skill2"],
  "experience": [{"company": "...", "role": "...", "duration": "...", "description": "..."}],
  "projects": [{"name": "...", "tech": ["..."], "description": "..."}],
  "education": [{"institution": "...", "degree": "...", "year": "..."}],
  "certifications": [{"name": "...", "provider": "...", "year": "..."}],
  "atsScore": 0-100,
  "feedback": "ATS optimization feedback",
  "missingKeywords": ["keyword1", "keyword2"]
}`;

  return callAiWithFallback({
    prompt,
    schema: ResumeAnalysisSchema,
    primaryProvider: "gemini",
    temperature: 0.2,
  });
}

// ─── Job Matcher ──────────────────────────────────────────────────────────────

export async function matchJobDescription(
  jobDescription: string,
  userProfile: { skills: string[]; projects: string[]; certifications: string[] }
): Promise<any> {
  const prompt = `
SYSTEM: You are a professional recruiter matching candidates to positions. Output ONLY valid JSON.

USER PROMPT:
JOB DESCRIPTION:
${jobDescription}

CANDIDATE:
Skills: ${userProfile.skills.join(", ")}
Projects Tech: ${userProfile.projects.join(" | ")}
Certifications: ${userProfile.certifications.join(", ")}

Return:
{
  "matchScore": 0-100,
  "readinessScore": 0-100,
  "requiredSkills": ["..."],
  "preferredSkills": ["..."],
  "missingSkills": ["..."],
  "missingTech": ["..."],
  "strengthAreas": ["..."],
  "recommendations": "3-4 sentences on what to improve"
}`;

  return callAiWithFallback({
    prompt,
    schema: JobMatchResultSchema,
    primaryProvider: "gemini",
    temperature: 0.2,
  });
}

// ─── Project Interrogator ─────────────────────────────────────────────────────

export async function generateProjectQuestions(projectInfo: {
  name: string;
  desc: string;
  github: string;
  live?: string;
  tech: string[];
  challenges?: string;
}): Promise<string[]> {
  const prompt = `
SYSTEM: You are a friendly, experienced Lead Software Engineer conducting a spoken technical conversation about a candidate's real project.
CRITICAL TONE RULES:
- Speak in a natural, warm, human conversational tone. NEVER sound like a rigid textbook or automated scanner.
- Do NOT repeat back candidate text mechanically (e.g. NEVER say "You mentioned 'OK' in response to...").
- Output ONLY valid JSON matching the schema.

USER PROMPT:
PROJECT DETAILS SUBMITTED BY CANDIDATE:
- Project Name: "${projectInfo.name}"
- Description: "${projectInfo.desc}"
- GitHub Repository URL: ${projectInfo.github}
- Live Production URL: ${projectInfo.live || "N/A"}
- Tech Stack: ${projectInfo.tech.join(", ")}
- Highlights & Challenges: ${projectInfo.challenges || "None declared"}

Generate exactly 5 customized technical interview questions written as a human engineering interviewer speaking directly to the candidate:
- Question 1: Ask about why they selected ${projectInfo.tech.join(", ")} to build "${projectInfo.name}" and how it connects to their goals in "${projectInfo.desc}".
- Question 2: Ask how they structured the repository (${projectInfo.github}), component layout, or live environment (${projectInfo.live || "deployment"}).
- Question 3: Ask specifically about their personal contribution to "${projectInfo.name}", what parts of the code they wrote themselves vs libraries used.
- Question 4: Ask about state management, data flow, or API handling inside "${projectInfo.name}".
- Question 5: Ask about the biggest engineering tradeoff, bug fix, or scaling challenge they faced building "${projectInfo.name}".

Return JSON format:
{
  "questions": [
    "Question 1 text...",
    "Question 2 text...",
    "Question 3 text...",
    "Question 4 text...",
    "Question 5 text..."
  ]
}`;

  const res = await callAiWithFallback({
    prompt,
    schema: ProjectQuestionResponseSchema,
    primaryProvider: "gemini",
    temperature: 0.7,
  });

  return res.questions || [];
}

export async function generateProjectFollowUp(
  projectInfo: { name: string; desc: string; tech: string[] },
  question: string,
  answer: string,
  contextHistory: Array<{ sender: "ai" | "user"; text: string }>
): Promise<string> {
  const historyText = contextHistory
    .map((h) => `${h.sender === "ai" ? "Interviewer" : "Candidate"}: ${h.text}`)
    .join("\n");

  const prompt = `
SYSTEM: You are a friendly, encouraging Lead Engineer chatting casually and deeply with a developer candidate.
CRITICAL TONE RULES:
- Speak naturally like a human interviewer (e.g. "Got it!", "Nice!", "That makes total sense.", "Thanks for sharing that!").
- NEVER repeat candidate responses verbatim (e.g. NEVER say "You said OK" or "You mentioned X").
- If candidate's answer was brief or vague, warmly encourage them to explain their specific role and implementation choices.
- Output ONLY valid JSON matching the schema.

USER PROMPT:
Project Context:
Name: ${projectInfo.name}
Description: ${projectInfo.desc}
Tech Stack: ${projectInfo.tech.join(", ")}

Chat History:
${historyText}

Latest Question Asked: ${question}
Candidate Answer: ${answer}

Ask your next probing follow-up question in a natural, human voice.

Return:
{
  "followUp": "Your human follow up question text here."
}`;

  const res = await callAiWithFallback({
    prompt,
    schema: ProjectFollowUpSchema,
    primaryProvider: "gemini",
    temperature: 0.7,
  });

  return res.followUp;
}

export async function evaluateProjectInterview(
  projectInfo: { name: string; desc: string; tech: string[]; github: string; live?: string },
  chatLogs: Array<{ question: string; answer: string }>
): Promise<any> {
  const chatText = chatLogs
    .map((log, i) => `Turn ${i + 1}:\nQuestion: ${log.question}\nAnswer: ${log.answer}`)
    .join("\n\n");

  const prompt = `
SYSTEM: You are evaluating a technical chat interview regarding a candidate's own project. Output ONLY valid JSON.

USER PROMPT:
PROJECT CONTEXT:
Name: ${projectInfo.name}
Description: ${projectInfo.desc}
Tech Stack: ${projectInfo.tech.join(", ")}
GitHub: ${projectInfo.github}

INTERVIEW TRANSCRIPT:
${chatText}

Evaluate on:
1. conceptualUnderstanding (0-100): Depth of knowledge in algorithms, patterns, and protocols used.
2. implementationDepth (0-100): Knowledge of setup configurations, libraries, and code layout details.
3. architectureUnderstanding (0-100): System design, databases, connection pools, scaling capabilities.
4. communicationScore (0-100): Clarity, directness, and completeness of technical explanations.

Return:
{
  "overallScore": 0-100,
  "conceptualUnderstanding": 0-100,
  "implementationDepth": 0-100,
  "architectureUnderstanding": 0-100,
  "communicationScore": 0-100,
  "summary": "2-3 sentences summarizing candidate's depth of knowledge and whether they actually built it.",
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "recommendations": ["reconciliation step 1"],
  "verifiedTech": ["tech1", "tech2"]
}`;

  return callAiWithFallback({
    prompt,
    schema: ProjectEvaluationReportSchema,
    primaryProvider: "gemini",
    temperature: 0.2,
  });
}
