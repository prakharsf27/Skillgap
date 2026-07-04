/**
 * Groq AI Service — Server-side utility
 * Handles all Groq AI calls for coding assessments, syntax checking, and certification verification
 */
import { Groq } from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const DEFAULT_MODEL = "llama-3.3-70b-versatile";

// ─── Retry wrapper ────────────────────────────────────────────────────────────

async function callGroq<T>(prompt: string, jsonMode = true, retries = 3): Promise<T> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await groq.chat.completions.create({
        model: DEFAULT_MODEL,
        messages: [
          {
            role: "system",
            content: jsonMode
              ? "You are a helpful assistant designed to output structured JSON data only. Always wrap your responses in valid JSON."
              : "You are a technical assistant.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: jsonMode ? { type: "json_object" } : undefined,
        temperature: 0.1,
      });

      const raw = response.choices[0]?.message?.content?.trim() || "";
      if (!jsonMode) {
        return raw as unknown as T;
      }

      const cleaned = raw
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
      return JSON.parse(cleaned) as T;
    } catch (err) {
      if (attempt === retries - 1) {
        console.error("[Groq] Failed after", retries, "attempts:", err);
        throw new Error("Groq AI service unavailable. Please try again.");
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

export interface CodingEvaluation {
  correctness: number;    // 0-100: Does the solution solve the problem?
  readability: number;    // 0-100: Code quality, naming, structure
  optimization: number;   // 0-100: Time/space complexity
  reasoning: number;      // 0-100: Algorithmic thinking shown
  finalScore: number;     // Weighted score
  timeComplexity: string; // e.g. "O(n)"
  spaceComplexity: string;
  isCorrect: boolean;
  feedback: string;
  strongPoints: string[];
  improvements: string[];
}

export interface SyntaxCheckResult {
  isValid: boolean;
  errors: Array<{
    line?: number;
    column?: number;
    message: string;
    severity: "error" | "warning";
  }>;
}

export interface CertificationVerification {
  isVerified: boolean;
  credibilityScore: number; // 0-100 score on validity/weight
  relevanceScore: number;   // 0-100 score on industry alignment
  mappedSkills: string[];
  marketValue: "Low" | "Medium" | "High" | "Extremely High";
  skillsLearned: string[];
  feedback: string;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  "Easy": "#22C55E",
  "Easy-Medium": "#10B981",
  "Medium": "#3B82F6",
  "Medium-Hard": "#8B5CF6",
  "Hard": "#EF4444",
};

// ─── Generate Coding Questions ────────────────────────────────────────────────

export async function generateDsaQuestions(language: string): Promise<DSAQuestion[]> {
  const prompt = `
Generate exactly 5 original coding questions in strict JSON format.
Language context: ${language}
Difficulties in order: Easy, Easy-Medium, Medium, Medium-Hard, Hard

Rules:
- Easy: Arrays, basic iteration (e.g. Find Max, Reverse String)
- Easy-Medium: Hash maps, basic strings (e.g. Two Sum, Valid Anagram)
- Medium: Sliding window, 2-pointers (e.g. Longest Substring Without Repeating Characters)
- Medium-Hard: Trees, dynamic programming basics (e.g. Binary Tree Level Order, House Robber)
- Hard: Graph algorithms, advanced DP, or complex matrices (e.g. Number of Islands, Merge k Sorted Lists)

Return a JSON object containing a "questions" key with an array of exactly 5 questions:
{
  "questions": [
    {
      "title": "Problem Title",
      "description": "Clear problem statement with detailed inputs",
      "difficulty": "Easy|Easy-Medium|Medium|Medium-Hard|Hard",
      "timeEst": "15 mins",
      "inputFormat": "Description of input",
      "outputFormat": "Description of expected output",
      "constraints": ["constraint 1", "constraint 2"],
      "examples": [{"input": "...", "output": "...", "explanation": "..."}],
      "hint": "Algorithmic hint without giving away the solution",
      "defaultCode": "function solve() {\\n  // Write your solution here\\n}"
    }
  ]
}`;

  const res = await callGroq<{ questions: DSAQuestion[] }>(prompt);
  return (res.questions || []).map((q) => ({
    ...q,
    difficultyColor: DIFFICULTY_COLORS[q.difficulty] ?? "#6366F1",
  }));
}

// ─── Evaluate Coding Answer ───────────────────────────────────────────────────

function computeFinalScore(metrics: {
  correctness: number;
  readability: number;
  optimization: number;
  reasoning: number;
}): number {
  const weighted =
    metrics.correctness * 0.50 +
    metrics.optimization * 0.25 +
    metrics.readability * 0.15 +
    metrics.reasoning * 0.10;
  return Math.round(weighted);
}

export async function evaluateCodingAnswer(
  question: { title: string; description: string; difficulty: string },
  code: string,
  language: string
): Promise<CodingEvaluation> {
  const prompt = `
Evaluate the following code submission against the problem details.

PROBLEM TITLE: ${question.title}
DIFFICULTY: ${question.difficulty}
PROBLEM DESCRIPTION:
${question.description}

STUDENT SUBMISSION (${language}):
\`\`\`${language}
${code || "// No code submitted"}
\`\`\`

Evaluate on:
1. correctness (0-100): Does the solution solve the problem? Does it handle edge cases?
2. readability (0-100): Code layout, clean naming, comments, style.
3. optimization (0-100): Time and space complexity.
4. reasoning (0-100): Algorithmic choices.

Return ONLY a JSON object:
{
  "correctness": <0-100>,
  "readability": <0-100>,
  "optimization": <0-100>,
  "reasoning": <0-100>,
  "timeComplexity": "O(?)",
  "spaceComplexity": "O(?)",
  "isCorrect": <true|false>,
  "feedback": "2-3 sentences of overall constructive feedback",
  "strongPoints": ["point 1", "point 2"],
  "improvements": ["improvement 1", "improvement 2"]
}`;

  const metrics = await callGroq<Omit<CodingEvaluation, "finalScore">>(prompt);
  return {
    ...metrics,
    finalScore: computeFinalScore(metrics),
  };
}

// ─── Real-Time Syntax Checker ───────────────────────────────────────────────

export async function checkSyntax(code: string, language: string): Promise<SyntaxCheckResult> {
  if (!code || code.trim().length === 0) {
    return { isValid: true, errors: [] };
  }

  const prompt = `
Perform a strict static code evaluation and syntax checking on the following code.
Programming Language: ${language}

CODE TO CHECK:
\`\`\`${language}
${code}
\`\`\`

Analyze for syntax errors, unclosed brackets, incorrect types, invalid keywords, compiler/interpreter barriers, and logical bugs that would prevent execution.

Return ONLY a JSON object of type:
{
  "isValid": <true|false>,
  "errors": [
    {
      "line": <line_number_if_applicable>,
      "column": <column_number_if_applicable>,
      "message": "Detailed compiler-like error message",
      "severity": "error|warning"
    }
  ]
}`;

  return callGroq<SyntaxCheckResult>(prompt);
}

// ─── Certification Verification & Evaluation ──────────────────────────────────

export async function verifyCertification(
  certName: string,
  provider: string,
  year: string,
  skillsLearnedInput?: string
): Promise<CertificationVerification> {
  const prompt = `
Verify and evaluate the validity and industry value of the following course/certification.
You must verify whether this is a real, recognized certification or course. Analyze its typical content, complexity, and industry recognition.
Do not output fake credentials; evaluate based on realistic industry standards.

CERTIFICATE/COURSE NAME: ${certName}
ISSUING PROVIDER: ${provider}
YEAR OF COMPLETION: ${year}
${skillsLearnedInput ? `DECLARED SKILLS LEARNED: ${skillsLearnedInput}` : ""}

Return ONLY a JSON object:
{
  "isVerified": <true|false (is this a recognized, authentic provider/course?)>,
  "credibilityScore": <0-100 (reputation of provider & difficulty of certification)>,
  "relevanceScore": <0-100 (market demand and value to modern software engineering roles)>,
  "mappedSkills": ["skill1", "skill2" (standardized skills validated by this cert)],
  "marketValue": "Low|Medium|High|Extremely High",
  "skillsLearned": ["skill1", "skill2" (topics covered in this curriculum)],
  "feedback": "A professional 2-3 sentence summary evaluating the value of this certification, its real relevance, and how to augment it."
}`;

  return callGroq<CertificationVerification>(prompt);
}
