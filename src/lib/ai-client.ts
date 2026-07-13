/**
 * AI Core Orchestrator Client
 * Provides Zod validation, exponential backoff retries, and Gemini <-> Groq fallback
 */
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Groq } from "groq-sdk";
import { z } from "zod";

// Initialize AI clients
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const geminiModel = genAI ? genAI.getGenerativeModel({ model: "gemini-2.0-flash" }) : null;

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;
const GROQ_DEFAULT_MODEL = "llama-3.3-70b-versatile";

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

export const DSAQuestionSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string(),
  difficulty: z.enum(["Easy", "Easy-Medium", "Medium", "Medium-Hard", "Hard"]),
  topic: z.string().optional(),
  description: z.string(),
  examples: z.array(
    z.object({
      input: z.string(),
      output: z.string(),
      explanation: z.string().optional(),
    })
  ),
  constraints: z.array(z.string()),
  starterCode: z.record(z.string(), z.string()).optional(),
  hiddenTestCases: z.array(
    z.object({
      input: z.string(),
      expectedOutput: z.string(),
    })
  ).optional(),
  gradingCriteria: z.object({
    correctness: z.string().optional(),
    optimalComplexity: z.object({
      time: z.string(),
      space: z.string(),
    }).optional(),
  }).optional(),
});

export const DSAQuestionsResponseSchema = z.object({
  questions: z.array(DSAQuestionSchema),
});

export const CodingEvaluationSchema = z.object({
  correctness: z.number().min(0).max(100),
  readability: z.number().min(0).max(100),
  optimization: z.number().min(0).max(100),
  reasoning: z.number().min(0).max(100),
  finalScore: z.number().optional(),
  timeComplexity: z.string(),
  spaceComplexity: z.string(),
  isCorrect: z.boolean(),
  feedback: z.string(),
  strongPoints: z.array(z.string()),
  improvements: z.array(z.string()),
});

export const ScenarioQuestionSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  difficulty: z.enum(["Easy", "Easy-Medium", "Medium", "Medium-Hard", "Hard"]).optional(),
  timeEst: z.string().optional(),
  hint: z.string().optional(),
  scenario: z.string().optional(),
  prompt: z.string().optional(),
  evaluationRubric: z.object({
    keyPointsExpected: z.array(z.string()),
    redFlags: z.array(z.string()),
  }).optional(),
});

export const ScenarioQuestionsResponseSchema = z.object({
  questions: z.array(ScenarioQuestionSchema),
});

export const ScenarioEvaluationSchema = z.object({
  correctness: z.number().min(0).max(100),
  readability: z.number().min(0).max(100),
  optimization: z.number().min(0).max(100),
  reasoning: z.number().min(0).max(100),
  finalScore: z.number().optional(),
  feedback: z.string(),
  strongPoints: z.array(z.string()),
  improvements: z.array(z.string()),
  // Compatibility mappings
  score: z.number().min(0).max(100).optional(),
  strengths: z.array(z.string()).optional(),
  gaps: z.array(z.string()).optional(),
});

export const ResumeAnalysisSchema = z.object({
  skills: z.array(z.string()),
  experience: z.array(
    z.object({
      company: z.string(),
      role: z.string(),
      duration: z.string(),
      description: z.string(),
    })
  ),
  projects: z.array(
    z.object({
      name: z.string(),
      tech: z.array(z.string()),
      description: z.string(),
    })
  ),
  education: z.array(
    z.object({
      institution: z.string(),
      degree: z.string(),
      year: z.string(),
    })
  ),
  certifications: z.array(
    z.object({
      name: z.string(),
      provider: z.string(),
      year: z.string(),
    })
  ),
  atsScore: z.number().min(0).max(100),
  feedback: z.string(),
  missingKeywords: z.array(z.string()),
});

export const JobMatchResultSchema = z.object({
  matchScore: z.number().min(0).max(100),
  readinessScore: z.number().min(0).max(100),
  requiredSkills: z.array(z.string()),
  preferredSkills: z.array(z.string()),
  missingSkills: z.array(z.string()),
  missingTech: z.array(z.string()),
  strengthAreas: z.array(z.string()),
  recommendations: z.string(),
});

export const ProjectQuestionResponseSchema = z.object({
  questions: z.array(z.string()),
});

export const ProjectFollowUpSchema = z.object({
  followUp: z.string(),
});

export const ProjectEvaluationReportSchema = z.object({
  overallScore: z.number().min(0).max(100),
  conceptualUnderstanding: z.number().min(0).max(100),
  implementationDepth: z.number().min(0).max(100),
  architectureUnderstanding: z.number().min(0).max(100),
  communicationScore: z.number().min(0).max(100),
  summary: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  recommendations: z.array(z.string()),
  verifiedTech: z.array(z.string()),
});

export const SyntaxCheckResultSchema = z.object({
  isValid: z.boolean(),
  errors: z.array(
    z.object({
      line: z.number().optional(),
      column: z.number().optional(),
      message: z.string(),
      severity: z.enum(["error", "warning"]),
    })
  ),
});

export const CertificationVerificationSchema = z.object({
  isVerified: z.boolean(),
  credibilityScore: z.number().min(0).max(100),
  relevanceScore: z.number().min(0).max(100),
  mappedSkills: z.array(z.string()),
  marketValue: z.enum(["Low", "Medium", "High", "Extremely High"]),
  skillsLearned: z.array(z.string()).optional(),
  feedback: z.string(),
});

export const CertificationVerificationResponseSchema = z.object({
  certifications: z.array(
    z.object({
      name: z.string(),
      relevanceScore: z.number().min(0).max(100),
      status: z.enum(["current", "aging", "outdated"]),
      reasoning: z.string(),
    })
  ),
  missingRecommendedCerts: z.array(z.string()),
});

// ─── Core LLM Callers with Retry Logic ────────────────────────────────────────

/**
 * Clean model output of typical markdown JSON wrappers
 */
function cleanJsonOutput(raw: string): string {
  return raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

/**
 * Execute a prompt on Gemini
 */
export async function callGeminiRaw(
  prompt: string,
  temperature = 0.2
): Promise<string> {
  if (!geminiModel) {
    throw new Error("Gemini API Client is not configured. Missing GEMINI_API_KEY.");
  }
  const result = await geminiModel.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature,
    },
  });
  return result.response.text();
}

/**
 * Execute a prompt on Groq
 */
export async function callGroqRaw(
  prompt: string,
  jsonMode = true,
  temperature = 0.2
): Promise<string> {
  if (!groq) {
    throw new Error("Groq API Client is not configured. Missing GROQ_API_KEY.");
  }
  const response = await groq.chat.completions.create({
    model: GROQ_DEFAULT_MODEL,
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
    temperature,
  });

  return response.choices[0]?.message?.content?.trim() || "";
}

/**
 * Retry helper with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  let lastError: any;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      console.warn(`[AI Client] Attempt ${attempt} failed:`, err);
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, delay * Math.pow(2, attempt - 1)));
      }
    }
  }
  throw lastError;
}

/**
 * Central orchestrator with retry and primary-to-secondary fallback support
 */
export async function callAiWithFallback<TSchema extends z.ZodTypeAny>(
  params: {
    prompt: string;
    schema: TSchema;
    primaryProvider: "gemini" | "groq";
    jsonMode?: boolean;
    temperature?: number;
  }
): Promise<z.infer<TSchema>> {
  const { prompt, schema, primaryProvider, jsonMode = true, temperature = 0.2 } = params;

  const providersOrder: Array<"gemini" | "groq"> =
    primaryProvider === "gemini" ? ["gemini", "groq"] : ["groq", "gemini"];

  let lastError: any;

  for (const provider of providersOrder) {
    try {
      const result = await retryWithBackoff(async () => {
        let raw = "";
        if (provider === "gemini") {
          raw = await callGeminiRaw(prompt, temperature);
        } else {
          raw = await callGroqRaw(prompt, jsonMode, temperature);
        }

        if (!jsonMode) {
          return raw as unknown as z.infer<TSchema>;
        }

        const cleaned = cleanJsonOutput(raw);
        const parsed = JSON.parse(cleaned);

        // Zod validation
        const validated = schema.safeParse(parsed);
        if (!validated.success) {
          console.error(`[AI Client] Schema validation error on provider ${provider}:`, validated.error.format());
          throw new Error("Validation mismatch against expected Zod Schema.");
        }
        return validated.data;
      });

      return result;
    } catch (err) {
      console.error(`[AI Client] Provider ${provider} failed or invalid schema:`, err);
      lastError = err;
    }
  }

  throw new Error(`[AI Client Orchestrator] All AI providers failed. Last error: ${lastError?.message || lastError}`);
}

export type DSAQuestion = z.infer<typeof DSAQuestionSchema>;
export type CodingEvaluation = z.infer<typeof CodingEvaluationSchema>;
export type ScenarioQuestion = z.infer<typeof ScenarioQuestionSchema>;
export type ScenarioEvaluation = z.infer<typeof ScenarioEvaluationSchema>;
export type ResumeAnalysis = z.infer<typeof ResumeAnalysisSchema>;
export type JobMatchResult = z.infer<typeof JobMatchResultSchema>;
export type ProjectEvaluationReport = z.infer<typeof ProjectEvaluationReportSchema>;
export type SyntaxCheckResult = z.infer<typeof SyntaxCheckResultSchema>;
export type CertificationVerification = z.infer<typeof CertificationVerificationSchema>;

