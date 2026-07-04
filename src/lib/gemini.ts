/**
 * Gemini AI Service — Server-side utility
 * Handles all AI calls with retry logic, prompt templates, and structured parsing
 */
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// ─── Retry wrapper ────────────────────────────────────────────────────────────

async function callGemini<T>(prompt: string, retries = 3): Promise<T> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const raw = result.response.text().trim();
      // Strip markdown fences if Gemini wraps output
      const cleaned = raw
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
      return JSON.parse(cleaned) as T;
    } catch (err) {
      if (attempt === retries - 1) {
        console.error("[Gemini] Failed after", retries, "attempts:", err);
        throw new Error("AI service unavailable. Please try again.");
      }
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
  throw new Error("Unreachable");
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DSAQuestion {
  title: string;
  description: string;
  difficulty: "Easy" | "Easy-Medium" | "Medium" | "Medium-Hard" | "Hard";
  difficultyColor: string;
  timeEst: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  examples: Array<{ input: string; output: string; explanation?: string }>;
  hint: string;
  defaultCode: string;
}

export interface ScenarioQuestion {
  title: string;
  description: string;
  difficulty: "Easy" | "Easy-Medium" | "Medium" | "Medium-Hard" | "Hard";
  difficultyColor: string;
  timeEst: string;
  hint: string;
}

export interface CodingEvaluation {
  correctness: number;    // 0-100: Does the solution solve the problem?
  readability: number;    // 0-100: Code quality, naming, structure
  optimization: number;   // 0-100: Time/space complexity
  reasoning: number;      // 0-100: Algorithmic thinking shown
  finalScore: number;     // Weighted: (correctness*0.5 + readability*0.15 + optimization*0.25 + reasoning*0.10)
  timeComplexity: string; // e.g. "O(n)"
  spaceComplexity: string;
  isCorrect: boolean;
  feedback: string;
  strongPoints: string[];
  improvements: string[];
}

export interface ScenarioEvaluation {
  correctness: number;    // Problem understanding
  readability: number;    // Clarity of explanation
  optimization: number;   // Architecture quality
  reasoning: number;      // Engineering depth
  finalScore: number;
  feedback: string;
  strongPoints: string[];
  improvements: string[];
}

export interface ResumeAnalysis {
  skills: string[];
  experience: Array<{ company: string; role: string; duration: string; description: string }>;
  projects: Array<{ name: string; tech: string[]; description: string }>;
  education: Array<{ institution: string; degree: string; year: string }>;
  certifications: Array<{ name: string; provider: string; year: string }>;
  atsScore: number;
  feedback: string;
  missingKeywords: string[];
}

export interface JobMatchResult {
  matchScore: number;
  readinessScore: number;
  requiredSkills: string[];
  preferredSkills: string[];
  missingSkills: string[];
  missingTech: string[];
  recommendations: string;
  strengthAreas: string[];
}

// ─── DSA Question Generator ───────────────────────────────────────────────────

const DIFFICULTY_COLORS: Record<string, string> = {
  "Easy": "#22C55E",
  "Easy-Medium": "#10B981",
  "Medium": "#3B82F6",
  "Medium-Hard": "#8B5CF6",
  "Hard": "#EF4444",
};

export async function generateDsaQuestions(language: string): Promise<DSAQuestion[]> {
  const prompt = `
You are a senior competitive programming problem setter. Generate exactly 5 original DSA coding questions in strict JSON format.

Language context: ${language}
Difficulties (in exact order): Easy, Easy-Medium, Medium, Medium-Hard, Hard

Rules:
- Questions must be completely original and solvable
- Each harder question must build on more complex algorithms
- Easy: Arrays, basic loops
- Easy-Medium: Hash maps, two pointers
- Medium: Sliding window, binary search
- Medium-Hard: Trees, dynamic programming basics
- Hard: Complex DP, graphs, advanced data structures

Return ONLY a JSON array (no markdown, no explanation), each item:
{
  "title": "Problem Title",
  "description": "Clear problem statement with context",
  "difficulty": "Easy|Easy-Medium|Medium|Medium-Hard|Hard",
  "timeEst": "10 mins",
  "inputFormat": "Description of input",
  "outputFormat": "Description of expected output",
  "constraints": ["constraint 1", "constraint 2"],
  "examples": [{"input": "...", "output": "...", "explanation": "..."}],
  "hint": "Algorithmic hint without giving away the solution",
  "defaultCode": "function solve() {\\n  // Write your solution here\\n}"
}`;

  const questions = await callGemini<DSAQuestion[]>(prompt);
  return questions.map((q) => ({
    ...q,
    difficultyColor: DIFFICULTY_COLORS[q.difficulty] ?? "#6366F1",
  }));
}

// ─── Scenario Question Generator ─────────────────────────────────────────────

export async function generateScenarioQuestions(targetRole?: string): Promise<ScenarioQuestion[]> {
  const prompt = `
You are a senior engineering interviewer. Generate exactly 5 real-world engineering scenario questions.
${targetRole ? `Target role context: ${targetRole}` : ""}
Difficulties in order: Easy, Easy-Medium, Medium, Medium-Hard, Hard

Each scenario should test:
- Easy: Basic system concepts (e.g., caching, simple queues)
- Easy-Medium: API design, basic scalability
- Medium: Distributed systems patterns
- Medium-Hard: Complex architecture decisions
- Hard: Large-scale system design with trade-offs

Return ONLY a JSON array:
[{
  "title": "Scenario Title",
  "description": "A detailed engineering problem requiring a written architectural solution (2-4 paragraphs long)",
  "difficulty": "Easy|Easy-Medium|Medium|Medium-Hard|Hard",
  "timeEst": "15 mins",
  "hint": "Hint pointing toward key patterns without giving the answer"
}]`;

  const questions = await callGemini<ScenarioQuestion[]>(prompt);
  return questions.map((q) => ({
    ...q,
    difficultyColor: DIFFICULTY_COLORS[q.difficulty] ?? "#6366F1",
  }));
}

// ─── Scoring Engine ───────────────────────────────────────────────────────────

function computeFinalScore(metrics: {
  correctness: number;
  readability: number;
  optimization: number;
  reasoning: number;
}): number {
  // Weighted formula:
  // Correctness   = 50% (does it work?)
  // Optimization  = 25% (is it efficient?)
  // Readability   = 15% (is it clean?)
  // Reasoning     = 10% (shows understanding?)
  const weighted =
    metrics.correctness * 0.50 +
    metrics.optimization * 0.25 +
    metrics.readability * 0.15 +
    metrics.reasoning * 0.10;
  return Math.round(weighted);
}

// ─── Coding Evaluator ─────────────────────────────────────────────────────────

export async function evaluateCodingAnswer(
  question: { title: string; description: string; difficulty: string },
  code: string,
  language: string
): Promise<CodingEvaluation> {
  const prompt = `
You are an expert code reviewer and DSA evaluator. Evaluate this ${language} solution.

PROBLEM: ${question.title}
DIFFICULTY: ${question.difficulty}
DESCRIPTION:
${question.description}

STUDENT'S CODE:
\`\`\`${language}
${code || "// No code submitted"}
\`\`\`

Evaluate on these 4 dimensions (0-100 each):

1. correctness: Does the code correctly solve the problem? Does logic handle edge cases?
2. readability: Variable naming, code structure, comments, clarity
3. optimization: Time complexity, space complexity, algorithmic efficiency
4. reasoning: Shows clear algorithmic thinking, uses appropriate data structures

Return ONLY a JSON object (no markdown):
{
  "correctness": <0-100>,
  "readability": <0-100>,
  "optimization": <0-100>,
  "reasoning": <0-100>,
  "timeComplexity": "O(?)",
  "spaceComplexity": "O(?)",
  "isCorrect": <true|false>,
  "feedback": "2-3 sentences of constructive overall feedback",
  "strongPoints": ["point 1", "point 2"],
  "improvements": ["improvement 1", "improvement 2"]
}

If no code was submitted, return all scores as 0 with appropriate feedback.`;

  const metrics = await callGemini<Omit<CodingEvaluation, "finalScore">>(prompt);
  return {
    ...metrics,
    finalScore: computeFinalScore(metrics),
  };
}

// ─── Scenario Evaluator ───────────────────────────────────────────────────────

export async function evaluateScenarioAnswer(
  question: { title: string; description: string },
  answer: string
): Promise<ScenarioEvaluation> {
  const prompt = `
You are a senior engineering interviewer evaluating a system design response.

QUESTION: ${question.title}
SCENARIO:
${question.description}

CANDIDATE'S ANSWER:
${answer || "No answer submitted."}

Evaluate on 4 dimensions (0-100 each):

1. correctness: Does the answer address the core engineering problem?
2. readability: Is the explanation clear, structured, and well-communicated?
3. optimization: Does the solution consider performance, scalability, and trade-offs?
4. reasoning: Does the candidate show deep engineering thinking and justification?

Return ONLY a JSON object:
{
  "correctness": <0-100>,
  "readability": <0-100>,
  "optimization": <0-100>,
  "reasoning": <0-100>,
  "feedback": "2-3 sentences of constructive feedback",
  "strongPoints": ["strength 1", "strength 2"],
  "improvements": ["area 1", "area 2"]
}`;

  const metrics = await callGemini<Omit<ScenarioEvaluation, "finalScore">>(prompt);
  return {
    ...metrics,
    finalScore: computeFinalScore(metrics),
  };
}

// ─── Resume Analyzer ──────────────────────────────────────────────────────────

export async function analyzeResume(resumeText: string): Promise<ResumeAnalysis> {
  const prompt = `
Extract structured data from this resume and return ONLY a JSON object:

RESUME TEXT:
${resumeText}

Return:
{
  "skills": ["skill1", "skill2"],
  "experience": [{"company": "...", "role": "...", "duration": "...", "description": "..."}],
  "projects": [{"name": "...", "tech": ["..."], "description": "..."}],
  "education": [{"institution": "...", "degree": "...", "year": "..."}],
  "certifications": [{"name": "...", "provider": "...", "year": "..."}],
  "atsScore": <0-100>,
  "feedback": "ATS optimization feedback",
  "missingKeywords": ["keyword1", "keyword2"]
}`;

  return callGemini<ResumeAnalysis>(prompt);
}

// ─── Job Matcher ──────────────────────────────────────────────────────────────

export async function matchJobDescription(
  jobDescription: string,
  userProfile: { skills: string[]; projects: string[]; certifications: string[] }
): Promise<JobMatchResult> {
  const prompt = `
Match this job description against the candidate profile. Return ONLY JSON.

JOB DESCRIPTION:
${jobDescription}

CANDIDATE:
Skills: ${userProfile.skills.join(", ")}
Projects Tech: ${userProfile.projects.join(" | ")}
Certifications: ${userProfile.certifications.join(", ")}

Return:
{
  "matchScore": <0-100>,
  "readinessScore": <0-100>,
  "requiredSkills": ["..."],
  "preferredSkills": ["..."],
  "missingSkills": ["..."],
  "missingTech": ["..."],
  "strengthAreas": ["..."],
  "recommendations": "3-4 sentences on what to improve"
}`;

  return callGemini<JobMatchResult>(prompt);
}

// ─── Project Interrogator ─────────────────────────────────────────────────────

export interface ProjectQuestionResponse {
  questions: string[];
}

export interface ProjectEvaluationReport {
  overallScore: number;
  conceptualUnderstanding: number;
  implementationDepth: number;
  architectureUnderstanding: number;
  communicationScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  verifiedTech: string[];
}

export async function generateProjectQuestions(projectInfo: {
  name: string;
  desc: string;
  github: string;
  live?: string;
  tech: string[];
  challenges?: string;
}): Promise<string[]> {
  const prompt = `
You are a senior tech architect conducting a project technical review.
Analyze the following candidate project submission and generate exactly 3 highly specific, challenging technical questions.
These questions should interrogate the codebase structure, technology choices, implementation strategy, and listed challenges.
Do not generate generic questions. Make them highly contextualized to the project details.

PROJECT DETAILS:
Name: ${projectInfo.name}
Description: ${projectInfo.desc}
GitHub Repo: ${projectInfo.github}
Live URL: ${projectInfo.live || "N/A"}
Tech Stack: ${projectInfo.tech.join(", ")}
Challenges Highlighted: ${projectInfo.challenges || "None declared"}

Return ONLY a JSON object:
{
  "questions": [
    "Contextual Question 1 (highly specific to tech stack or github details)",
    "Contextual Question 2 (focusing on system structure or database layer)",
    "Contextual Question 3 (focusing on robustness, error handling, or the declared challenges)"
  ]
}`;

  const res = await callGemini<ProjectQuestionResponse>(prompt);
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
You are a senior tech architect. You are interviewing a candidate about their project: ${projectInfo.name}.
Here is the chat history:
${historyText}

The candidate just answered your question:
Question: ${question}
Answer: ${answer}

Generate a concise, direct follow-up question (1-2 sentences) interrogating their specific answer.
Identify gaps in their explanation, call out assumptions, or ask how they would handle an edge case related to their answer.
If their answer was blank or extremely brief, ask them to expand on the implementation specifics.

Return ONLY a JSON object:
{
  "followUp": "Your follow up question text here."
}`;

  const res = await callGemini<{ followUp: string }>(prompt);
  return res.followUp;
}

export async function evaluateProjectInterview(
  projectInfo: { name: string; desc: string; tech: string[]; github: string; live?: string },
  chatLogs: Array<{ question: string; answer: string }>
): Promise<ProjectEvaluationReport> {
  const chatText = chatLogs
    .map((log, i) => `Turn ${i + 1}:\nQuestion: ${log.question}\nAnswer: ${log.answer}`)
    .join("\n\n");

  const prompt = `
You are an expert technical interviewer. Evaluate this candidate's project interview transcript.
Assess how well the user knows their project, the technologies used, and the backend architectural trade-offs.

PROJECT CONTEXT:
Name: ${projectInfo.name}
Description: ${projectInfo.desc}
Tech Stack: ${projectInfo.tech.join(", ")}
GitHub: ${projectInfo.github}
Live URL: ${projectInfo.live || "N/A"}

INTERVIEW TRANSCRIPT:
${chatText}

Evaluate on:
1. conceptualUnderstanding (0-100): Depth of knowledge in algorithms, patterns, and protocols used.
2. implementationDepth (0-100): Knowledge of setup configurations, libraries, and code layout details.
3. architectureUnderstanding (0-100): System design, databases, connection pools, scaling capabilities.
4. communicationScore (0-100): Clarity, directness, and completeness of technical explanations.

Compute overallScore as: (conceptualUnderstanding * 0.3 + implementationDepth * 0.3 + architectureUnderstanding * 0.3 + communicationScore * 0.1)

Return ONLY a JSON object:
{
  "overallScore": <0-100>,
  "conceptualUnderstanding": <0-100>,
  "implementationDepth": <0-100>,
  "architectureUnderstanding": <0-100>,
  "communicationScore": <0-100>,
  "summary": "2-3 sentences summarizing their level of expertise and project involvement.",
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "recommendations": ["reconciliation/improvement step 1", "reconciliation/improvement step 2"],
  "verifiedTech": ["tech1", "tech2" (tech elements that the user demonstrated strong knowledge of)]
}`;

  return callGemini<ProjectEvaluationReport>(prompt);
}

