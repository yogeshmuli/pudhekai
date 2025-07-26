import fs from "fs";
import path from "path";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { generateHexacoInterpretations, HexacoTraitScore } from "./hexacoInterpretation";

export type HexacoQuestion = {
  id: string;
  trait: string;
  facet?: string;
  reverse?: boolean;
  text: string;
};

export type UserResponses = { [questionId: string]: number };

export type AssessmentType = "free" | "paid";

export interface HexacoResult {
  traitScores: { [trait: string]: number };
  questionsUsed: string[];
  interpretation?: any; // Single interpretation object
}

// Load questions from JSON file (sync for simplicity)
function loadQuestions(): HexacoQuestion[] {
  try {
    const jsonPath = path.join(process.cwd(), "src/data/hexaco_questions.json");
    console.log("Loading questions from:", jsonPath);
    const data = fs.readFileSync(jsonPath, "utf8");
    return JSON.parse(data) as HexacoQuestion[];
  } catch (err) {
    console.error("Failed to load questions:", err);
    throw err;
  }
}

// Utility: select N questions per trait
function selectQuestions(
  allQuestions: HexacoQuestion[],
  assessmentType: AssessmentType
): HexacoQuestion[] {
  const nPerTrait = assessmentType === "free" ? 4 : 10;
  const grouped: { [trait: string]: HexacoQuestion[] } = {};

  // Group by trait
  allQuestions.forEach((q) => {
    grouped[q.trait] = grouped[q.trait] || [];
    grouped[q.trait].push(q);
  });

  // Select N per trait
  let selected: HexacoQuestion[] = [];
  for (const trait in grouped) {
    selected = selected.concat(grouped[trait].slice(0, nPerTrait));
  }
  return selected;
}

// Scoring logic (same as before)
function scoreHexaco(
  questions: HexacoQuestion[],
  responses: UserResponses
): { [trait: string]: number } {
  const traitScores: { [trait: string]: number } = {};
  const traitCounts: { [trait: string]: number } = {};

  for (const q of questions) {
    const answer = responses[q.id];
    if (answer === undefined) continue;
    const scored = q.reverse ? 6 - answer : answer;
    traitScores[q.trait] = (traitScores[q.trait] || 0) + scored;
    traitCounts[q.trait] = (traitCounts[q.trait] || 0) + 1;
  }
  // Average per trait
  for (const trait in traitScores) {
    traitScores[trait] = traitScores[trait] / traitCounts[trait];
  }
  return traitScores;
}

// Helper to fetch questions from Firestore
async function fetchHexacoQuestions(): Promise<HexacoQuestion[]> {
  const colRef = collection(db, "questions_hexaco");
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as HexacoQuestion[];
}

// Convert trait scores to format needed for interpretation
function convertToTraitScores(traitScores: { [trait: string]: number }): HexacoTraitScore[] {
  const maxScore = 5; // HEXACO uses 1-5 scale
  return Object.entries(traitScores).map(([trait, score]) => ({
    trait,
    score: Math.round(score * 10) / 10, // Round to 1 decimal
    maxScore,
    percentage: Math.round((score / maxScore) * 100)
  }));
}

// Example usage in an API handler:
export async function getHexacoResult(
  userResponses: UserResponses,
  assessmentType: AssessmentType = "free",
  userContext?: {
    age?: number;
    gender?: string;
    currentGrade?: string;
  }
): Promise<HexacoResult> {
  const allQuestions = await fetchHexacoQuestions();
  const selectedQuestions = selectQuestions(allQuestions, assessmentType);
  const traitScores = scoreHexaco(selectedQuestions, userResponses);
  
  // Convert scores for interpretation
  const traitScoresForInterpretation: HexacoTraitScore[] = Object.entries(traitScores).map(([trait, score]) => ({
    trait,
    score
  }));
  
  // Generate single comprehensive interpretation
  const interpretation = await generateHexacoInterpretations(traitScoresForInterpretation, userContext);
  
  return { 
    traitScores, 
    questionsUsed: selectedQuestions.map((q) => q.id), 
    interpretation 
  };
}
