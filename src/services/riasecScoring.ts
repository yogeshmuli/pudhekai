import fs from "fs";
import path from "path";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

// Question Type
export type RiasecQuestion = {
  id: string;
  category: "Realistic" | "Investigative" | "Artistic" | "Social" | "Enterprising" | "Conventional";
  text: string;
};

// User Responses
export type UserResponses = { [id: string]: number };

// Load Questions from JSON
function loadQuestions(): RiasecQuestion[] {
  try {
    const jsonPath = path.join(process.cwd(), "src/data/riasec_questions.json");
    console.log("Loading RIASEC questions from:", jsonPath);
    const data = fs.readFileSync(jsonPath, "utf8");
    return JSON.parse(data) as RiasecQuestion[];
  } catch (err) {
    console.error("Failed to load RIASEC questions:", err);
    throw err;
  }
}

// Helper to fetch questions from Firestore
async function fetchRiasecQuestions(): Promise<RiasecQuestion[]> {
  const colRef = collection(db, "questions_riasec");
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as RiasecQuestion[];
}

// Select N questions per category (for free/paid version)
function selectQuestions(
  allQuestions: RiasecQuestion[],
  assessmentType: "free" | "paid"
): RiasecQuestion[] {
  const nPerCategory = assessmentType === "free" ? 2 : 5;
  const grouped: { [category: string]: RiasecQuestion[] } = {};

  allQuestions.forEach(q => {
    grouped[q.category] = grouped[q.category] || [];
    grouped[q.category].push(q);
  });

  let selected: RiasecQuestion[] = [];
  for (const category in grouped) {
    selected = selected.concat(grouped[category].slice(0, nPerCategory));
  }
  return selected;
}

// Scoring function
function scoreRiasec(
  questions: RiasecQuestion[],
  responses: UserResponses
): { [category: string]: number } {
  const scores: { [category: string]: number } = {};
  const counts: { [category: string]: number } = {};

  for (const q of questions) {
    const answer = responses[q.id];
    if (answer === undefined) continue;
    scores[q.category] = (scores[q.category] || 0) + answer;
    counts[q.category] = (counts[q.category] || 0) + 1;
  }
  // Average per category
  for (const category in scores) {
    scores[category] = scores[category] / counts[category];
  }
  return scores;
}

// Example main usage
export async function getRiasecResult(
  userResponses: UserResponses,
  assessmentType: "free" | "paid" = "free"
) {
  const allQuestions = await fetchRiasecQuestions();
  const selectedQuestions = selectQuestions(allQuestions, assessmentType);
  const categoryScores = scoreRiasec(selectedQuestions, userResponses);
  return { categoryScores, questionsUsed: selectedQuestions.map(q => q.id) };
}