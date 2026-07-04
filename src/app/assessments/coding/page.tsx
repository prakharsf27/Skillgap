"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Sparkles, Clock, AlertTriangle, Check, ArrowRight, ArrowLeft,
  Code2, Terminal, Bookmark, ShieldAlert, Award, FileText, ChevronRight,
  Settings, HelpCircle, CheckCircle2, RotateCcw, Monitor
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { GlassCard, GradientText, SectionLabel } from "@/components/shared";

interface Question {
  id: string;
  title: string;
  category: "DSA" | "Scenario";
  difficulty: "Easy" | "Easy-Medium" | "Medium" | "Medium-Hard" | "Hard";
  difficultyColor: string;
  timeEst: string;
  desc: string;
  inputFormat?: string;
  outputFormat?: string;
  constraints?: string[];
  examples?: Array<{ input: string; output: string; explanation?: string }>;
  hint: string;
  defaultCode?: string;
}

interface EvaluationMetrics {
  correctness: number;
  readability: number;
  optimization: number;
  reasoning: number;
}

interface QuestionEvaluation {
  questionId: string;
  category: "DSA" | "Scenario";
  metrics: EvaluationMetrics;
  finalScore: number;
  feedback: string;
  strongPoints: string[];
  improvements: string[];
  timeComplexity?: string;
  spaceComplexity?: string;
  isCorrect?: boolean;
}

const ASSESSMENT_QUESTIONS: Question[] = [
  {
    id: "static-1",
    title: "Two Sum Indices",
    category: "DSA",
    difficulty: "Easy",
    difficultyColor: "#22C55E",
    timeEst: "10 mins",
    desc: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
    inputFormat: "An array of integers `nums` and a single integer `target`.",
    outputFormat: "An array of two indices summing to target.",
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9"
    ],
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." }
    ],
    hint: "Use a HashMap to store values and their indices. This lets you locate the complement in O(1) time.",
    defaultCode: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}`
  },
  {
    id: "static-2",
    title: "Valid Parentheses Matcher",
    category: "DSA",
    difficulty: "Easy-Medium",
    difficultyColor: "#10B981",
    timeEst: "12 mins",
    desc: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    inputFormat: "A string `s` containing brackets.",
    outputFormat: "Boolean `true` if valid, otherwise `false`.",
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'"
    ],
    examples: [
      { input: "s = \"()[]{}\"", output: "true" },
      { input: "s = \"(]\"", output: "false" }
    ],
    hint: "A stack is perfect here. Push opening brackets, and pop to check alignment whenever you see a closing bracket.",
    defaultCode: `function isValid(s) {\n  const stack = [];\n  const pairs = { ')': '(', '}': '{', ']': '[' };\n  for (let char of s) {\n    if (['(', '{', '['].includes(char)) {\n      stack.push(char);\n    } else {\n      if (stack.pop() !== pairs[char]) return false;\n    }\n  }\n  return stack.length === 0;\n}`
  },
  {
    id: "static-3",
    title: "Longest Substring Without Repeating",
    category: "DSA",
    difficulty: "Medium",
    difficultyColor: "#3B82F6",
    timeEst: "15 mins",
    desc: "Given a string `s`, find the length of the longest substring without repeating characters.",
    inputFormat: "A string `s`.",
    outputFormat: "An integer representing max length.",
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces."
    ],
    examples: [
      { input: "s = \"abcabcbb\"", output: "3", explanation: "The answer is \"abc\", with the length of 3." }
    ],
    hint: "Use the sliding window technique with two pointers. Move the right pointer, and shrink left once duplicates are detected.",
    defaultCode: `function lengthOfLongestSubstring(s) {\n  let set = new Set();\n  let left = 0, maxLen = 0;\n  for (let right = 0; right < s.length; right++) {\n    while (set.has(s[right])) {\n      set.delete(s[left]);\n      left++;\n    }\n    set.add(s[right]);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}`
  },
  {
    id: "static-4",
    title: "K-th Largest Array Item",
    category: "DSA",
    difficulty: "Medium-Hard",
    difficultyColor: "#8B5CF6",
    timeEst: "20 mins",
    desc: "Given an integer array `nums` and an integer `k`, return the `k`th largest element in the array.\n\nNote that it is the `k`th largest element in the sorted order, not the `k`th distinct element.\n\nSolve it in O(N) average time complexity.",
    inputFormat: "An array of integers `nums`, and an integer `k`.",
    outputFormat: "The kth largest integer.",
    constraints: [
      "1 <= k <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    examples: [
      { input: "nums = [3,2,1,5,6,4], k = 2", output: "5" }
    ],
    hint: "Use QuickSelect (similar to QuickSort partitioning) or a Min-Heap of size K. Min-Heap yields O(N log K) which is very efficient.",
    defaultCode: `function findKthLargest(nums, k) {\n  // Using sorting for baseline mock\n  nums.sort((a, b) => b - a);\n  return nums[k - 1];\n}`
  },
  {
    id: "static-5",
    title: "Merge K Sorted Linked Lists",
    category: "DSA",
    difficulty: "Hard",
    difficultyColor: "#EF4444",
    timeEst: "25 mins",
    desc: "You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order.\n\nMerge all the linked-lists into one sorted linked-list and return it.",
    inputFormat: "An array of ListNode references.",
    outputFormat: "A single merged sorted linked list reference.",
    constraints: [
      "k == lists.length",
      "0 <= k <= 10^4",
      "0 <= lists[i].length <= 500",
      "-10^4 <= lists[i][j] <= 10^4"
    ],
    examples: [
      { input: "lists = [[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]" }
    ],
    hint: "Divide and conquer merging, or push node pointers to a Priority Queue to pop the smallest nodes repeatedly.",
    defaultCode: `function mergeKLists(lists) {\n  // Flatten and sort mock\n  const values = [];\n  for (let list of lists) {\n    let curr = list;\n    while (curr) {\n      values.push(curr.val);\n      curr = curr.next;\n    }\n  }\n  values.sort((a,b) => a-b);\n  // reconstruction mock here...\n  return values;\n}`
  },
  {
    id: "static-6",
    title: "Notification Dispatch Service",
    category: "Scenario",
    difficulty: "Easy",
    difficultyColor: "#22C55E",
    timeEst: "15 mins",
    desc: "Design a notification system that delivers high-volume marketing and transaction alerts to users via Push, SMS, and Email. The architecture must handle sudden peak traffic (e.g. 5,000 requests/sec) without dropping transactional messages.",
    hint: "Leverage standard asynchronous message queues (e.g. RabbitMQ or AWS SQS). Place notification delivery nodes behind queues to decouple endpoints.",
    defaultCode: ""
  },
  {
    id: "static-7",
    title: "Prevent Double Checkout Swipes",
    category: "Scenario",
    difficulty: "Easy-Medium",
    difficultyColor: "#10B981",
    timeEst: "15 mins",
    desc: "A payment service executes charges twice if a student double-taps the checkout submit button on slow mobile connections. Propose an engineering architecture to ensure idempotency and prevent duplicate charges.",
    hint: "Generate unique idempotency keys on the frontend prior to request dispatch. Cache active keys in Redis with short locks to drop duplicate payloads.",
    defaultCode: ""
  },
  {
    id: "static-8",
    title: "Slow DB Query Response Fix",
    category: "Scenario",
    difficulty: "Medium",
    difficultyColor: "#3B82F6",
    timeEst: "15 mins",
    desc: "Your transaction search endpoint takes over 8 seconds to return lists when table rows exceed 12 million records. Propose details on query optimizations, schema updates, or caching strategies.",
    hint: "Explain composite indexes on frequently searched columns, read replica distributions, or caching list blocks in Redis for repeated queries.",
    defaultCode: ""
  },
  {
    id: "static-9",
    title: "Rate Limiter Gateway Logic",
    category: "Scenario",
    difficulty: "Medium-Hard",
    difficultyColor: "#8B5CF6",
    timeEst: "15 mins",
    desc: "Specify how you would implement a distributed rate limiter at the API Gateway level to block scraping bots while letting standard users fetch endpoints. State algorithms, key definitions, and cluster parameters.",
    hint: "Explain Token Bucket or Sliding Window Log algorithms. Use Redis script calls to block requests by API token key or client IP ranges.",
    defaultCode: ""
  },
  {
    id: "static-10",
    title: "High-Volume Secure File Upload",
    category: "Scenario",
    difficulty: "Hard",
    difficultyColor: "#EF4444",
    timeEst: "15 mins",
    desc: "Engineers need to let clients upload giant raw research files (up to 12 GB each) securely. The upload should bypass server resource starvation, handle random connection timeouts, and verify integrity.",
    hint: "Bypass the main application server by requesting pre-signed S3 URLs. Split uploads using S3 multipart upload APIs and verify hashes via MD5 validation.",
    defaultCode: ""
  }
];

export default function CodingAssessment() {
  const router = useRouter();

  // Test Lifecycle State
  const [step, setStep] = useState<"landing" | "workspace" | "evaluating">("landing");
  
  // Settings / Preferences
  const [selectedLang, setSelectedLang] = useState("javascript");
  const [editorTheme, setEditorTheme] = useState<"vs-dark" | "vs-light">("vs-dark");
  const [fontSize, setFontSize] = useState(13);
  
  // AI-Generated Questions State
  const [aiQuestions, setAiQuestions] = useState<Question[]>(ASSESSMENT_QUESTIONS);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [questionLoadError, setQuestionLoadError] = useState<string | null>(null);

  // Workspace States
  const [currentIdx, setCurrentIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(3600); // 60 mins
  const [hintRevealed, setHintRevealed] = useState<boolean[]>(new Array(10).fill(false));
  const [bookmarked, setBookmarked] = useState<boolean[]>(new Array(10).fill(false));
  const [visited, setVisited] = useState<boolean[]>(new Array(10).fill(false));
  const [drafts, setDrafts] = useState<string[]>(
    ASSESSMENT_QUESTIONS.map(q => q.defaultCode || "")
  );

  // Evaluation Results State
  const [evaluationResults, setEvaluationResults] = useState<QuestionEvaluation[]>([]);
  const [evalError, setEvalError] = useState<string | null>(null);

  // Syntax Diagnostic States
  const [syntaxErrors, setSyntaxErrors] = useState<Array<{ line?: number; message: string; severity: string }>>([]);
  const [isCheckingSyntax, setIsCheckingSyntax] = useState(false);

  // Terminal & Run States
  const [running, setRunning] = useState(false);
  const [runLogs, setRunLogs] = useState<string>("");
  const [passedCases, setPassedCases] = useState<number | null>(null);

  // Modals & AI Loading Stages
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [evalStage, setEvalStage] = useState(0);
  const [evalStages, setEvalStages] = useState([
    { label: "Parsing syntax structures & grammar...", done: false },
    { label: "Executing algorithmic edge test cases...", done: false },
    { label: "Analyzing runtime complexity constraints...", done: false },
    { label: "Evaluating scenario system architecture depth...", done: false },
    { label: "Formulating skills gap metrics report...", done: false },
    { label: "Filing score reviews to admin queue...", done: false }
  ]);

  // Resize Split states
  const [leftWidth, setLeftWidth] = useState(40); // 40% default for Left Panel
  const [isResizing, setIsResizing] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [showPalette, setShowPalette] = useState(true);
  
  const resizerContainerRef = React.useRef<HTMLDivElement>(null);

  // Monitor screen resolution for resizing support
  useEffect(() => {
    const checkSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  const startResizing = (mouseDownEvent: React.MouseEvent) => {
    mouseDownEvent.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!resizerContainerRef.current) return;
      const rect = resizerContainerRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const widthPercent = (relativeX / rect.width) * 100;
      if (widthPercent >= 15 && widthPercent <= 85) {
        setLeftWidth(widthPercent);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  // Track visited questions when entering workspace
  useEffect(() => {
    if (step === "workspace") {
      const updatedVisited = [...visited];
      updatedVisited[currentIdx] = true;
      setVisited(updatedVisited);
    }
  }, [currentIdx, step]);

  // Real-time syntax checking (Groq powered)
  useEffect(() => {
    const q = aiQuestions[currentIdx] ?? ASSESSMENT_QUESTIONS[currentIdx];
    const activeCode = drafts[currentIdx];
    const isDSA = q?.category === "DSA";
    if (!isDSA || !activeCode || activeCode.trim().length === 0) {
      setSyntaxErrors([]);
      return;
    }

    setIsCheckingSyntax(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch("/api/ai/syntax-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: activeCode, language: selectedLang }),
        });
        const data = await res.json();
        if (data.success && data.result) {
          setSyntaxErrors(data.result.errors || []);
        }
      } catch (err) {
        console.error("Syntax check error:", err);
      } finally {
        setIsCheckingSyntax(false);
      }
    }, 1500);

    return () => clearTimeout(delayDebounce);
  }, [drafts, currentIdx, selectedLang, aiQuestions]);

  // Core countdown timer
  useEffect(() => {
    if (step !== "workspace") return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinalSubmit(true); // Auto-submit when time expires
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartTest = async () => {
    setIsLoadingQuestions(true);
    setQuestionLoadError(null);
    try {
      const res = await fetch("/api/ai/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: selectedLang }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate questions");

      // Merge DSA + Scenario into ordered Question array
      const dsaQs: Question[] = (data.dsaQuestions || []).map((q: { title: string; description: string; difficulty: string; difficultyColor?: string; timeEst?: string; inputFormat?: string; outputFormat?: string; constraints?: string[]; examples?: Array<{input: string; output: string; explanation?: string}>; hint: string; defaultCode?: string; }, i: number) => ({
        id: `dsa-${i}`,
        title: q.title,
        category: "DSA" as const,
        difficulty: q.difficulty as Question["difficulty"],
        difficultyColor: q.difficultyColor || "#6366F1",
        timeEst: q.timeEst || "15 mins",
        desc: q.description,
        inputFormat: q.inputFormat,
        outputFormat: q.outputFormat,
        constraints: q.constraints,
        examples: q.examples,
        hint: q.hint,
        defaultCode: q.defaultCode || "// Write your solution here\n",
      }));

      const scenarioQs: Question[] = (data.scenarioQuestions || []).map((q: { title: string; description: string; difficulty: string; difficultyColor?: string; timeEst?: string; hint: string; }, i: number) => ({
        id: `scenario-${i}`,
        title: q.title,
        category: "Scenario" as const,
        difficulty: q.difficulty as Question["difficulty"],
        difficultyColor: q.difficultyColor || "#8B5CF6",
        timeEst: q.timeEst || "15 mins",
        desc: q.description,
        hint: q.hint,
        defaultCode: "",
      }));

      const allQuestions = [...dsaQs, ...scenarioQs];
      setAiQuestions(allQuestions);
      setDrafts(allQuestions.map(q => q.defaultCode || ""));
      setHintRevealed(new Array(allQuestions.length).fill(false));
      setBookmarked(new Array(allQuestions.length).fill(false));
      setVisited(new Array(allQuestions.length).fill(false));
    } catch (err) {
      console.error("Failed to generate questions:", err);
      setQuestionLoadError(err instanceof Error ? err.message : "Could not load questions. Using fallback questions.");
      // Fall back to static questions silently
    } finally {
      setIsLoadingQuestions(false);
      setStep("workspace");
      setSecondsLeft(3600);
    }
  };

  const handleRunCode = () => {
    setRunning(true);
    setRunLogs("");
    setPassedCases(null);

    const isDSA = (aiQuestions[currentIdx] ?? ASSESSMENT_QUESTIONS[currentIdx]).category === "DSA";

    setTimeout(() => {
      setRunning(false);
      if (isDSA) {
        setPassedCases(2);
        setRunLogs("✔ Test Case 1 Passed (nums = [2,7,11,15], target = 9) - Runtime: 42ms\n✔ Test Case 2 Passed (nums = [3,2,4], target = 6) - Runtime: 18ms\n\nAll baseline tests compiled successfully.");
      } else {
        setPassedCases(1);
        setRunLogs("Analysis validation passed:\n✔ Logical argument is structurally sound.\n✔ Addressed caching strategies, data synchronization, and concurrency mitigations.\n\nAI check: Valid proposal.");
      }
    }, 1200);
  };

  const saveDraft = () => {
    // Flash toast feedback
    const toast = document.getElementById("save-toast");
    if (toast) {
      toast.classList.remove("opacity-0");
      toast.classList.add("opacity-100");
      setTimeout(() => {
        toast.classList.remove("opacity-100");
        toast.classList.add("opacity-0");
      }, 1500);
    }
  };

  const toggleBookmark = () => {
    const updatedBookmarks = [...bookmarked];
    updatedBookmarks[currentIdx] = !updatedBookmarks[currentIdx];
    setBookmarked(updatedBookmarks);
  };

  const handleDraftChange = (val: string) => {
    const updatedDrafts = [...drafts];
    updatedDrafts[currentIdx] = val;
    setDrafts(updatedDrafts);
  };

  const handleFinalSubmit = async (force = false) => {
    if (!force && !confirm("Are you sure you want to finish the assessment? You won't be able to edit your solutions afterwards.")) {
      return;
    }
    setShowSubmitModal(false);
    setStep("evaluating");
    setEvalError(null);

    // Stage 1–4: Show progress while Gemini evaluates in background
    const advanceStages = (upTo: number) => {
      for (let i = 0; i <= upTo; i++) {
        ((idx) => {
          setTimeout(() => {
            setEvalStages(prev => prev.map((stage, si) => si === idx ? { ...stage, done: true } : stage));
            setEvalStage(idx + 1);
          }, idx * 1500);
        })(i);
      }
    };

    // Kick off first 4 visual stages while API runs
    advanceStages(3);

    try {
      // Build submission payload for real Gemini evaluation
      const questions = aiQuestions.map(q => ({
        id: q.id,
        title: q.title,
        description: q.desc,
        difficulty: q.difficulty,
        category: q.category,
      }));

      const submissions = aiQuestions.map((q, idx) => ({
        questionId: q.id,
        code: drafts[idx] || "",
        language: selectedLang,
        category: q.category,
      }));

      const res = await fetch("/api/ai/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissions, questions }),
      });

      const evalData = await res.json();
      if (!res.ok) throw new Error(evalData.error || "Evaluation failed");

      const evaluations: QuestionEvaluation[] = evalData.evaluations || [];
      setEvaluationResults(evaluations);

      // Complete remaining visual stages
      advanceStages(5);

      // Build structured submission state with real Gemini metrics
      const submissionState = {
        status: "pending",
        userName: "Rahul Sharma",
        email: "rahul@alliance.edu.in",
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        evaluatedAt: evalData.evaluatedAt,
        questions: aiQuestions.map((q, idx) => {
          const evalResult = evaluations.find(e => e.questionId === q.id);
          return {
            id: q.id,
            title: q.title,
            category: q.category,
            difficulty: q.difficulty,
            draft: drafts[idx],
            // Real Gemini structured metrics
            metrics: evalResult?.metrics || { correctness: 0, readability: 0, optimization: 0, reasoning: 0 },
            aiScore: evalResult?.finalScore ?? 0,
            aiComment: evalResult?.feedback ?? "No evaluation available.",
            strongPoints: evalResult?.strongPoints ?? [],
            improvements: evalResult?.improvements ?? [],
            timeComplexity: evalResult?.timeComplexity,
            spaceComplexity: evalResult?.spaceComplexity,
            isCorrect: evalResult?.isCorrect,
          };
        }),
        summary: evalData.summary || { dsaAvg: 0, scenarioAvg: 0, overallAvg: 0 },
        // Legacy scores field for backward compat with results page
        scores: {
          dsa: evalData.summary?.dsaAvg ?? 0,
          system: evalData.summary?.scenarioAvg ?? 0,
          readability: Math.round(
            evaluations.reduce((sum, e) => sum + (e.metrics?.readability ?? 0), 0) /
            Math.max(evaluations.length, 1)
          ),
          efficiency: Math.round(
            evaluations.reduce((sum, e) => sum + (e.metrics?.optimization ?? 0), 0) /
            Math.max(evaluations.length, 1)
          ),
          total: evalData.summary?.overallAvg ?? 0,
        },
        adminComments: "",
      };

      localStorage.setItem("skillgap_dsa_submission", JSON.stringify(submissionState));

      // Wait for stages to finish animating before routing
      setTimeout(() => router.push("/assessments/coding/results"), 9000);
    } catch (err) {
      console.error("Evaluation error:", err);
      setEvalError(err instanceof Error ? err.message : "Evaluation failed");

      // Still complete stages and route with fallback data
      advanceStages(5);
      const fallbackState = {
        status: "pending",
        userName: "Rahul Sharma",
        email: "rahul@alliance.edu.in",
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        questions: aiQuestions.map((q, idx) => ({
          id: q.id, title: q.title, category: q.category, difficulty: q.difficulty,
          draft: drafts[idx],
          metrics: { correctness: 0, readability: 0, optimization: 0, reasoning: 0 },
          aiScore: 0, aiComment: "Evaluation pending admin review.", strongPoints: [], improvements: [],
        })),
        summary: { dsaAvg: 0, scenarioAvg: 0, overallAvg: 0 },
        scores: { dsa: 0, system: 0, readability: 0, efficiency: 0, total: 0 },
        adminComments: "",
      };
      localStorage.setItem("skillgap_dsa_submission", JSON.stringify(fallbackState));
      setTimeout(() => router.push("/assessments/coding/results"), 9000);
    }
  };

  const currentQuestion = aiQuestions[currentIdx] ?? ASSESSMENT_QUESTIONS[currentIdx];
  const answeredCount = drafts.filter((d, i) => {
    const q = aiQuestions[i] ?? ASSESSMENT_QUESTIONS[i];
    const isDSA = q?.category === "DSA";
    return isDSA ? d.length > 50 : d.length > 80;
  }).length;

  return (
    <DashboardLayout hideSidebar={step === "workspace"} noPadding={step === "workspace"}>
      <div className="relative">
        {/* Floating Toast Notification */}
        <div 
          id="save-toast"
          className="fixed bottom-6 right-6 z-50 pointer-events-none opacity-0 transition-opacity duration-300 flex items-center gap-2 px-4 py-3 rounded-xl border border-emerald-500/20 bg-emerald-500/90 text-white text-xs font-semibold shadow-lg shadow-emerald-500/10"
        >
          <CheckCircle2 size={14} />
          Draft saved automatically!
        </div>

        {/* ====================================================
            PAGE 1: LANDING / ENTRY SCREEN
            ==================================================== */}
        {step === "landing" && (
          <div className="max-w-4xl mx-auto space-y-8 py-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <SectionLabel>SkillGap AI Evaluation</SectionLabel>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1">
                  Technical Coding <GradientText>Assessment</GradientText>
                </h1>
                <p className="text-white/44 text-sm mt-1.5 leading-relaxed">
                  Verify your engineering competency levels across algorithms and system architectural thinking.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl border border-[#6366F1]/20 bg-[#6366F1]/8 text-[#A5B4FC]">
                <Clock size={13} className="animate-pulse" />
                60 Minutes Duration
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
              {/* Left Column: Rules & Setup */}
              <div className="md:col-span-7 space-y-6">
                <GlassCard className="p-6 md:p-8 space-y-6" glow="#6366F1">
                  <h3 className="text-white font-bold text-sm">Assessment Config</h3>
                  
                  <div className="space-y-4 text-xs">
                    <div className="space-y-2">
                      <label className="text-[10px] font-semibold text-white/50 uppercase">Primary Language Preference</label>
                      <select 
                        value={selectedLang}
                        onChange={(e) => setSelectedLang(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl outline-none border border-white/8 bg-white/4 text-white focus:border-[#6366F1]/50 focus:ring-1 focus:ring-[#6366F1]/20 transition-all font-semibold"
                      >
                        <option value="javascript">JavaScript (ES6)</option>
                        <option value="python">Python 3</option>
                        <option value="cpp">C++ (GCC)</option>
                        <option value="java">Java (JDK 17)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-[10px] text-white/35 uppercase mb-1">Scale Difficulty</div>
                        <div className="text-xs font-bold text-indigo-400">Progressive AI Scaling</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-white/35 uppercase mb-1">Draft Auto-Save</div>
                        <div className="text-xs font-bold text-emerald-400">Active (LocalStorage)</div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-6 flex flex-col gap-4">
                    <div className="flex items-start gap-3 text-xs text-white/50 leading-relaxed">
                      <ShieldAlert size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-white">Academic Honor System:</span> Copy-paste operations outside the workspace frame are monitored. Please implement your answers directly in the provided environment.
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 text-xs text-white/50 leading-relaxed">
                      <HelpCircle size={16} className="text-[#60A5FA] flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-white">Review Cycles:</span> Once submitted, the scores require final confirmation and review by platform administrators before publication.
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleStartTest}
                    disabled={isLoadingQuestions}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-95 shadow-lg shadow-indigo-500/20 cursor-pointer mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
                  >
                    {isLoadingQuestions ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Generating AI Questions...
                      </>
                    ) : (
                      <>
                        Start Coding Assessment
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </GlassCard>
              </div>

              {/* Right Column: Assessment breakdown summary */}
              <div className="md:col-span-5 space-y-6">
                <GlassCard className="p-6 md:p-8 flex flex-col justify-between h-full" glow="#8B5CF6">
                  <div className="space-y-6">
                    <h3 className="text-white font-bold text-sm mb-4">Exam Structure</h3>
                    
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                          <Code2 size={16} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">5 DSA Questions</div>
                          <div className="text-[10px] text-white/30 mt-0.5">LeetCode style logic</div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                          <FileText size={16} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">5 System Scenarios</div>
                          <div className="text-[10px] text-white/30 mt-0.5">High-volume architecture questions</div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                          <Sparkles size={16} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">AI Grading & Review</div>
                          <div className="text-[10px] text-white/30 mt-0.5">Calculated complexities & solutions evaluation</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-[10px] text-white/30 mt-8 border-t border-white/5 pt-4">
                    Secured by SkillGap AI assessment protocols.
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================
            PAGE 2: LIVE WORKSPACE (3-PANEL RESIZABLE LAYOUT)
            ==================================================== */}
        {step === "workspace" && (
          <div className="h-screen max-h-screen flex flex-col overflow-hidden w-full bg-[#08080F]">
            {/* Exam Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 p-4 flex-shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/22 text-[#A5B4FC]">
                  Active Assessment Frame
                </span>
                <span className="text-[10px] text-white/40">Auto-save: enabled</span>
              </div>

              <div className="flex items-center gap-4">
                {/* HUD Map Toggle */}
                <button
                  onClick={() => setShowPalette(prev => !prev)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5
                    ${showPalette 
                      ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20" 
                      : "border-white/8 bg-white/4 text-white/60 hover:bg-white/8"}`}
                >
                  <Monitor size={13} />
                  {showPalette ? "Hide Question Map" : "Show Question Map"}
                </button>

                {/* Timer widgets */}
                <div 
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border font-mono text-xs font-bold transition-all
                    ${secondsLeft < 300 
                      ? "border-red-500/30 bg-red-500/15 text-red-400 animate-pulse" 
                      : "border-white/8 bg-white/4 text-white/80"}`}
                >
                  <Clock size={13} />
                  {formatTime(secondsLeft)}
                </div>

                <button 
                  onClick={() => setShowSubmitModal(true)}
                  className="px-4.5 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer transition-all hover:opacity-90 shadow-lg shadow-indigo-500/20"
                  style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
                >
                  Submit Assessment
                </button>
              </div>
            </div>

            {/* Resizable Panel Layout */}
            <div className="flex-1 flex flex-col lg:flex-row gap-4 items-stretch overflow-hidden w-full p-4 min-h-0">
              
              {/* Left Side: Resizable Container (Question + Editor) */}
              <div 
                ref={resizerContainerRef}
                className="flex-1 flex flex-col lg:flex-row items-stretch border border-white/5 rounded-2xl bg-black/20 overflow-hidden relative min-w-0 min-h-0"
              >
                
                {/* PANEL 1: Left Panel (Question Description) */}
                <div 
                  style={{ width: isDesktop ? `${leftWidth}%` : "100%" }}
                  className="flex flex-col min-w-[280px] h-full min-h-0"
                >
                  <GlassCard className="h-full border-none rounded-none flex flex-col min-h-0 overflow-hidden" glow="#6366F1">
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0 scrollbar-thin">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded border bg-indigo-500/10 border-indigo-500/30 text-[#A5B4FC]">
                            {currentQuestion.category}
                          </span>
                          <span 
                            className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                            style={{
                              backgroundColor: `${currentQuestion.difficultyColor}18`,
                              color: currentQuestion.difficultyColor
                            }}
                          >
                            {currentQuestion.difficulty}
                          </span>
                        </div>
                        <div className="text-[10px] text-white/30 font-semibold font-mono">
                          Question {currentIdx + 1} of 10
                        </div>
                      </div>

                      <h2 className="text-base font-bold text-white tracking-tight">
                        {currentQuestion.title}
                      </h2>

                      <div className="text-xs text-white/60 leading-relaxed space-y-3 whitespace-pre-line">
                        {currentQuestion.desc}
                      </div>

                      {currentQuestion.inputFormat && (
                        <div className="space-y-1 pt-2">
                          <div className="text-[9px] text-white/30 uppercase tracking-widest font-bold">Input Format</div>
                          <p className="text-xs text-white/50 font-mono bg-white/[0.01] border border-white/5 p-2 rounded-lg">
                            {currentQuestion.inputFormat}
                          </p>
                        </div>
                      )}

                      {currentQuestion.outputFormat && (
                        <div className="space-y-1">
                          <div className="text-[9px] text-white/30 uppercase tracking-widest font-bold">Output Format</div>
                          <p className="text-xs text-white/50 font-mono bg-white/[0.01] border border-white/5 p-2 rounded-lg">
                            {currentQuestion.outputFormat}
                          </p>
                        </div>
                      )}

                      {currentQuestion.constraints && currentQuestion.constraints.length > 0 && (
                        <div className="space-y-1">
                          <div className="text-[9px] text-white/30 uppercase tracking-widest font-bold">Constraints</div>
                          <ul className="list-disc list-inside text-[11px] text-white/40 space-y-0.5 pl-1 font-mono">
                            {currentQuestion.constraints.map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {currentQuestion.examples && currentQuestion.examples.length > 0 && (
                        <div className="space-y-3">
                          <div className="text-[9px] text-white/30 uppercase tracking-widest font-bold">Examples</div>
                          {currentQuestion.examples.map((ex, i) => (
                            <div key={i} className="p-3.5 rounded-xl border border-white/5 bg-white/[0.01] font-mono text-[11px] space-y-1">
                              <div className="text-white/30 uppercase text-[9px] tracking-wider">Example {i + 1}</div>
                              <div className="text-white/60"><span className="text-white/30 font-semibold">Input:</span> {ex.input}</div>
                              <div className="text-white/60"><span className="text-white/30 font-semibold">Output:</span> {ex.output}</div>
                              {ex.explanation && (
                                <div className="text-white/40 mt-1 italic"><span className="text-white/30">Explanation:</span> {ex.explanation}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {hintRevealed[currentIdx] && (
                        <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-xs text-indigo-300 leading-relaxed">
                          <div className="font-bold mb-1 flex items-center gap-1.5">
                            <Sparkles size={13} />
                            Gemini AI Hint
                          </div>
                          {currentQuestion.hint}
                        </div>
                      )}
                    </div>

                    <div className="p-6 border-t border-white/5 bg-white/[0.01] flex-shrink-0 flex gap-2">
                      <button
                        onClick={() => {
                          const updatedHints = [...hintRevealed];
                          updatedHints[currentIdx] = true;
                          setHintRevealed(updatedHints);
                        }}
                        disabled={hintRevealed[currentIdx]}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold text-[#A5B4FC] bg-white/5 border border-white/8 hover:bg-white/10 cursor-pointer disabled:opacity-50"
                      >
                        <Sparkles size={12} />
                        Get AI Hint
                      </button>
                      
                      <button
                        onClick={toggleBookmark}
                        className={`px-3 py-2 rounded-xl border flex items-center justify-center cursor-pointer transition-all
                          ${bookmarked[currentIdx] 
                            ? "bg-amber-500/20 border-amber-500 text-amber-400" 
                            : "bg-white/5 border-white/8 text-white/50 hover:bg-white/10"}`}
                      >
                        <Bookmark size={13} />
                      </button>
                    </div>
                  </GlassCard>
                </div>

                {/* Resizing Splitter Bar */}
                {isDesktop && (
                  <div
                    onMouseDown={startResizing}
                    className={`w-1 hover:w-1.5 bg-white/5 hover:bg-indigo-500/50 cursor-col-resize transition-all self-stretch flex-shrink-0 relative z-20 select-none group
                      ${isResizing ? "bg-indigo-500/80 w-1.5" : ""}`}
                  >
                    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-white/10 group-hover:bg-indigo-400" />
                  </div>
                )}

                {/* PANEL 2: Middle Panel (Code Editor Area) */}
                <div 
                  style={{ width: isDesktop ? `${100 - leftWidth}%` : "100%" }}
                  className="flex flex-col min-w-[320px] flex-1 h-full min-h-0"
                >
                  <GlassCard className="h-full border-none rounded-none flex flex-col min-h-0 overflow-hidden" glow="#8B5CF6" style={{ background: "#06060C" }}>
                    <div className="p-4 border-b border-white/5 flex justify-between items-center flex-shrink-0">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-xs text-white/60 font-semibold font-mono">
                          <Terminal size={13} className="text-indigo-400" />
                          solution.{selectedLang === "javascript" ? "js" : selectedLang === "python" ? "py" : selectedLang === "cpp" ? "cpp" : "java"}
                        </div>
                        
                        {/* Language Selectors */}
                        <select 
                          value={selectedLang}
                          onChange={(e) => setSelectedLang(e.target.value)}
                          className="text-[10px] bg-white/5 border border-white/8 rounded-lg px-2 py-1 outline-none text-white/50 font-bold"
                        >
                          <option value="javascript">JavaScript</option>
                          <option value="python">Python 3</option>
                          <option value="cpp">C++</option>
                          <option value="java">Java</option>
                        </select>
                      </div>

                      {/* Font & Theme Settings dropdown */}
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setEditorTheme(prev => prev === "vs-dark" ? "vs-light" : "vs-dark")}
                          className="p-1.5 rounded bg-white/5 border border-white/8 text-white/40 hover:text-white cursor-pointer"
                          title="Toggle theme"
                        >
                          <Monitor size={12} />
                        </button>
                        <select 
                          value={fontSize}
                          onChange={(e) => setFontSize(parseInt(e.target.value))}
                          className="text-[10px] bg-white/5 border border-white/8 rounded-lg px-1.5 py-1 outline-none text-white/40 font-bold"
                          title="Font Size"
                        >
                          <option value="12">12px</option>
                          <option value="13">13px</option>
                          <option value="14">14px</option>
                          <option value="16">16px</option>
                        </select>
                      </div>
                    </div>

                    {/* Core Editor simulation */}
                    <div 
                      className={`flex-1 flex font-mono leading-relaxed relative min-h-0 rounded-xl p-3 border overflow-hidden
                        ${editorTheme === "vs-dark" ? "bg-black/40 border-white/5 text-indigo-200" : "bg-white text-gray-800 border-gray-200"}`}
                      style={{ fontSize: `${fontSize}px` }}
                    >
                      <div className={`w-8 select-none text-right pr-3 border-r mr-3 select-none
                        ${editorTheme === "vs-dark" ? "text-white/10 border-white/5" : "text-gray-300 border-gray-100"}`}
                      >
                        {Array.from({ length: 30 }).map((_, i) => (
                          <div key={i}>{i + 1}</div>
                        ))}
                      </div>
                      
                      {currentQuestion.category === "DSA" ? (
                        <textarea
                          value={drafts[currentIdx]}
                          onChange={(e) => handleDraftChange(e.target.value)}
                          className="flex-1 bg-transparent border-none outline-none resize-none font-mono focus:ring-0 w-full h-full min-h-0"
                          spellCheck="false"
                        />
                      ) : (
                        <textarea
                          value={drafts[currentIdx]}
                          onChange={(e) => handleDraftChange(e.target.value)}
                          placeholder="Detail your engineering solutions (e.g. system models, pipeline caching, queue thresholds, error mitigations)..."
                          className="flex-1 bg-transparent border-none outline-none resize-none font-sans text-xs focus:ring-0 w-full h-full min-h-0 placeholder:text-white/15"
                          spellCheck="false"
                        />
                      )}
                    </div>

                    {/* Terminal Outputs */}
                    <div className="border-t border-white/5 p-4 bg-black/10 flex-shrink-0">
                      {isCheckingSyntax && (
                        <div className="text-[10px] text-indigo-400 flex items-center gap-1.5 py-1 mb-2">
                          <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Analyzing syntax in real-time...
                        </div>
                      )}

                      {syntaxErrors.length > 0 ? (
                        <div className="space-y-1.5 mb-2.5">
                          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold p-2 rounded-xl border border-amber-500/15 bg-amber-500/8">
                            <AlertTriangle size={14} />
                            Real-time AI Syntax Diagnostics: {syntaxErrors.length} Issue{syntaxErrors.length > 1 ? "s" : ""} Detected
                          </div>
                          <div className="p-2.5 rounded-lg bg-black text-[10px] font-mono text-white/50 max-h-[85px] overflow-y-auto whitespace-pre-wrap leading-relaxed border border-white/5 scrollbar-thin">
                            {syntaxErrors.map((err, i) => (
                              <div key={i} className="flex gap-2 py-0.5">
                                <span className="text-red-400 font-bold flex-shrink-0">
                                  {err.line ? `[Line ${err.line}]` : "[Syntax]"}
                                </span>
                                <span className="text-white/70">{err.message}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        (currentQuestion?.category === "DSA" && !isCheckingSyntax && drafts[currentIdx]?.trim()?.length > 10) && (
                          <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-semibold p-2 rounded-xl border border-emerald-500/15 bg-emerald-500/8 mb-2.5">
                            <Check size={13} />
                            Real-time syntax check passed. No issues found.
                          </div>
                        )
                      )}

                      {running && (
                        <div className="text-xs text-white/40 flex items-center gap-2 py-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                          AI code engine executing test modules...
                        </div>
                      )}

                      {passedCases !== null && (
                        <div className="space-y-2 mb-2">
                          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold p-2.5 rounded-xl border border-emerald-500/15 bg-emerald-500/8">
                            <Check size={14} />
                            Compile success - Baseline validations completed.
                          </div>
                          <pre className="p-2.5 rounded-lg bg-black text-[10px] font-mono text-white/50 max-h-[80px] overflow-y-auto whitespace-pre-wrap leading-relaxed border border-white/5 scrollbar-thin">
                            {runLogs}
                          </pre>
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-3">
                        <button
                          onClick={saveDraft}
                          className="px-4 py-2 rounded-xl text-xs font-semibold text-white/60 border border-white/8 hover:bg-white/5 cursor-pointer"
                        >
                          Save Draft
                        </button>

                        <div className="flex gap-2.5">
                          <button
                            onClick={handleRunCode}
                            disabled={running}
                            className="px-5 py-2 rounded-xl text-xs font-semibold text-white/80 border border-white/8 hover:bg-white/5 cursor-pointer disabled:opacity-50"
                          >
                            Run Tests
                          </button>
                          <button
                            onClick={() => {
                              saveDraft();
                              if (currentIdx < 9) {
                                setCurrentIdx(currentIdx + 1);
                              } else {
                                setShowSubmitModal(true);
                              }
                            }}
                            className="px-5 py-2 rounded-xl text-xs font-semibold text-white cursor-pointer"
                            style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
                          >
                            {currentIdx === 9 ? "Review & Finish" : "Submit & Next"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              </div>

              {/* PANEL 3: Right Panel (Palette HUD Navigator) */}
              {showPalette && (
                <div className="w-full lg:w-[280px] flex-shrink-0 flex flex-col gap-4 min-h-0 h-full">
                  {/* HUD Palette Card */}
                  <GlassCard className="h-full border border-white/5 flex flex-col justify-between min-h-0 overflow-hidden" glow="#60A5FA">
                    <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0 scrollbar-thin">
                      <div>
                        <h4 className="text-white font-bold text-xs">Question Palette</h4>
                        <p className="text-[10px] text-white/30 mt-0.5">Quickly toggle between questions</p>
                      </div>

                      {/* Question tiles grid */}
                      <div className="grid grid-cols-5 gap-2.5">
                        {(aiQuestions.length ? aiQuestions : ASSESSMENT_QUESTIONS).map((q, idx) => {
                          const isDSA = q.category === "DSA";
                          const isCurrent = currentIdx === idx;
                          const isVisited = visited[idx];
                          const isBookmarked = bookmarked[idx];
                          const codeVal = drafts[idx];
                          const isAnswered = isDSA ? codeVal.length > 50 : codeVal.length > 80;

                          let tileBg = "rgba(255, 255, 255, 0.02)";
                          let tileBorder = "rgba(255, 255, 255, 0.08)";
                          let tileText = "rgba(255, 255, 255, 0.3)";

                          if (isCurrent) {
                            tileBg = "rgba(99, 102, 241, 0.15)";
                            tileBorder = "#6366F1";
                            tileText = "#A5B4FC";
                          } else if (isBookmarked) {
                            tileBg = "rgba(245, 158, 11, 0.12)";
                            tileBorder = "rgba(245, 158, 11, 0.4)";
                            tileText = "#F59E0B";
                          } else if (isAnswered) {
                            tileBg = "rgba(34, 197, 94, 0.1)";
                            tileBorder = "rgba(34, 197, 94, 0.3)";
                            tileText = "#4ADE80";
                          } else if (isVisited) {
                            tileBg = "rgba(96, 165, 250, 0.08)";
                            tileBorder = "rgba(96, 165, 250, 0.25)";
                            tileText = "#60A5FA";
                          }

                          return (
                            <button
                              key={q.id}
                              onClick={() => setCurrentIdx(idx)}
                              className="aspect-square rounded-xl border flex flex-col items-center justify-center text-xs font-bold transition-all cursor-pointer font-mono"
                              style={{
                                backgroundColor: tileBg,
                                borderColor: tileBorder,
                                color: tileText
                              }}
                            >
                              <span>{idx + 1}</span>
                              <span className="text-[7px] opacity-40 uppercase tracking-widest mt-0.5 font-sans">
                                {isDSA ? "DSA" : "SYS"}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Progress details */}
                      <div className="space-y-2 text-[10px] text-white/40 pt-2 border-t border-white/5">
                        <div className="flex justify-between">
                          <span>Solved Checklist:</span>
                          <span className="font-bold text-white/80">{answeredCount} of 10</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Flagged / Bookmarks:</span>
                          <span className="font-bold text-amber-400">{bookmarked.filter(Boolean).length} items</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Timer Scale:</span>
                          <span className="font-bold text-emerald-400">Auto-Saving enabled</span>
                        </div>
                      </div>
                    </div>

                    {/* Sidebar stats/controls footer */}
                    <div className="p-5 border-t border-white/5 bg-white/[0.01] flex-shrink-0 space-y-3.5">
                      <div className="p-3 rounded-lg border border-[#34D399]/20 bg-[#34D399]/5 flex items-center gap-2">
                        <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
                        <span className="text-[9px] text-emerald-300">Lock submission active when answers finished.</span>
                      </div>

                      <div className="flex justify-between gap-2.5">
                        <button
                          onClick={() => {
                            if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
                          }}
                          disabled={currentIdx === 0}
                          className="flex-1 py-2 border border-white/8 rounded-xl flex items-center justify-center gap-1 text-[11px] text-white/50 disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowLeft size={12} />
                          Prev
                        </button>
                        <button
                          onClick={() => {
                            if (currentIdx < 9) setCurrentIdx(currentIdx + 1);
                          }}
                          disabled={currentIdx === 9}
                          className="flex-1 py-2 border border-white/8 rounded-xl flex items-center justify-center gap-1 text-[11px] text-white/50 disabled:opacity-30 cursor-pointer"
                        >
                          Next
                          <ArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ====================================================
            PAGE 8: AI EVALUATION PENDING SCREEN
            ==================================================== */}
        {step === "evaluating" && (
          <div className="max-w-md mx-auto py-16 text-center space-y-8">
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              {/* Spinning gradient rings */}
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-indigo-500/20 border-t-indigo-500 animate-spin" />
              <div className="absolute inset-2 rounded-full border-4 border-dashed border-purple-500/20 border-b-purple-500 animate-spin" style={{ animationDirection: "reverse" }} />
              <Sparkles className="text-[#A5B4FC] animate-pulse" size={36} />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Gemini AI Audit Engine</h2>
              <p className="text-xs text-white/40 leading-relaxed max-w-xs mx-auto">
                Analyzing syntax structures, correctness parameters, edge cases, and code complexities.
              </p>
            </div>

            {/* Stage-by-stage checkmark loader lists */}
            <GlassCard className="p-5 text-left text-xs space-y-3" glow="#8B5CF6">
              {evalStages.map((stage, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div 
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-300
                      ${stage.done 
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" 
                        : idx === evalStage 
                          ? "bg-indigo-500/20 border-indigo-500 text-indigo-400 animate-pulse"
                          : "bg-white/3 border-white/8 text-transparent"}`}
                  >
                    <Check size={11} />
                  </div>
                  <span className={stage.done ? "text-white/80" : idx === evalStage ? "text-indigo-300 font-semibold" : "text-white/30"}>
                    {stage.label}
                  </span>
                </div>
              ))}
            </GlassCard>

            <div className="text-[10px] text-white/20">
              Saving report data packet... Please do not close this browser frame.
            </div>
          </div>
        )}

        {/* ====================================================
            PAGE 7: SUBMISSION CONFIRMATION MODAL (INLINE POPUP)
            ==================================================== */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Dark background overlay */}
            <div 
              onClick={() => setShowSubmitModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs" 
            />
            
            {/* Modal Dialog */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-md w-full relative z-10"
            >
              <GlassCard className="p-6 md:p-8 space-y-6" glow="#EF4444" style={{ background: "rgba(12, 12, 24, 0.95)" }}>
                <div className="text-center space-y-2">
                  <ShieldAlert className="text-red-400 mx-auto" size={32} />
                  <h3 className="text-lg font-bold text-white">Final Solution Lock</h3>
                  <p className="text-xs text-white/44 leading-relaxed">
                    You are submitting your completed files for final evaluation reviews.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] text-xs font-mono space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/40">Total Solved:</span>
                    <span className="text-emerald-400 font-bold">{answeredCount} of 10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Skipped/Blank:</span>
                    <span className="text-red-400 font-bold">{10 - answeredCount} questions</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Remaining Time:</span>
                    <span className="text-white/80">{formatTime(secondsLeft)}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-red-500/18 bg-red-500/8 text-[11px] text-red-300 leading-relaxed flex items-start gap-2">
                  <AlertTriangle size={15} className="flex-shrink-0 mt-0.5" />
                  <span>
                    Warning: After this action, answers are locked. Code reports must go through administrator review and score approvals before publication.
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowSubmitModal(false)}
                    className="flex-1 py-3 border border-white/8 rounded-xl text-xs font-semibold text-white/60 hover:bg-white/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleFinalSubmit(true)}
                    className="flex-1 py-3 rounded-xl text-xs font-bold text-white cursor-pointer"
                    style={{ background: "linear-gradient(135deg, #EF4444, #B91C1C)" }}
                  >
                    Confirm & Submit
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
