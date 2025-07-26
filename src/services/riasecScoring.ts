import fs from "fs";
import path from "path";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { generateRiasecInterpretations, RiasecCategoryScore } from "./riasecInterpretation";

// Question Type
export type RiasecQuestion = {
  id: string;
  category:
    | "Realistic"
    | "Investigative"
    | "Artistic"
    | "Social"
    | "Enterprising"
    | "Conventional";
  text: string;
};

// User Responses
export type UserResponses = { [questionId: string]: number };
export type AssessmentType = "free" | "paid";

export interface RiasecResult {
  categoryScores: { [type: string]: number };
  questionsUsed: string[];
  interpretation?: any; // Single interpretation object
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

  allQuestions.forEach((q) => {
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

// Convert category scores to format needed for interpretation
function convertToCategoryScores(categoryScores: { [category: string]: number }): RiasecCategoryScore[] {
  const maxScore = 5; // RIASEC uses 1-5 scale
  return Object.entries(categoryScores).map(([category, score]) => ({
    category,
    score: Math.round(score * 10) / 10, // Round to 1 decimal
    maxScore,
    percentage: Math.round((score / maxScore) * 100)
  }));
}

// Example main usage
export async function getRiasecResult(
  userResponses: UserResponses, 
  assessmentType: AssessmentType = "free",
  userContext?: { age?: number; gender?: string; currentGrade?: string; }
): Promise<RiasecResult> {
  const allQuestions = await fetchRiasecQuestions();
  const selectedQuestions = selectQuestions(allQuestions, assessmentType);
  const categoryScores = scoreRiasec(selectedQuestions, userResponses);
  
  // Convert scores for interpretation
  const categoryScoresForInterpretation: RiasecCategoryScore[] = Object.entries(categoryScores).map(([category, score]) => ({
    category,
    score
  }));
  
  // Generate single comprehensive interpretation
  const interpretation = await generateRiasecInterpretations(categoryScoresForInterpretation, userContext);
  
  return { 
    categoryScores, 
    questionsUsed: selectedQuestions.map((q) => q.id), 
    interpretation 
  };
}
