import fs from "fs";
import path from "path";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { generateMIInterpretations, MIScore } from "./miInterpretation";

// For MI, NIH, LearningStyle, Reasoning
export type GenericQuestion = {
  id: string;
  domain?: string;       // e.g., "Working Memory", "Visual"
  intelligence?: string; // for MI
  style?: string;        // for VARK
  text: string;
};

export type UserResponses = { [questionId: string]: number };
export type AssessmentType = "free" | "paid";

export interface MIResult {
  miScores: { [type: string]: number };
  questionsUsed: string[];
  interpretation?: any; // Single interpretation object
}

function loadQuestions(filename: string): GenericQuestion[] {
  try {
    const jsonPath = path.join(process.cwd(), "src/services/" + filename);
    console.log("Loading MI questions from:", jsonPath);
    const data = fs.readFileSync(jsonPath, "utf8");
    return JSON.parse(data) as GenericQuestion[];
  } catch (err) {
    console.error("Failed to load MI questions:", err);
    throw err;
  }
}

function scoreByDomain(
  questions: GenericQuestion[],
  responses: UserResponses,
  key: "intelligence" | "domain" | "style"
): { [domain: string]: number } {
  const scores: { [domain: string]: number } = {};
  const counts: { [domain: string]: number } = {};

  for (const q of questions) {
    const domain = q[key];
    const answer = responses[q.id];
    if (!domain || answer === undefined) continue;
    scores[domain] = (scores[domain] || 0) + answer;
    counts[domain] = (counts[domain] || 0) + 1;
  }
  for (const domain in scores) {
    scores[domain] = scores[domain] / counts[domain];
  }
  return scores;
}

// Helper to fetch questions from Firestore
async function fetchQuestionsFromFirestore(collectionName: string): Promise<GenericQuestion[]> {
  const colRef = collection(db, collectionName);
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as GenericQuestion[];
}

// Convert MI scores to format needed for interpretation
function convertToMIScores(miScores: { [intelligence: string]: number }): MIScore[] {
  const maxScore = 5; // MI uses 1-5 scale
  return Object.entries(miScores).map(([intelligence, score]) => ({
    intelligence,
    score: Math.round(score * 10) / 10, // Round to 1 decimal
    maxScore,
    percentage: Math.round((score / maxScore) * 100)
  }));
}

// Usage for MI:
export async function getMIResult(
  userResponses: UserResponses, 
  assessmentType: AssessmentType = "free",
  userContext?: { age?: number; gender?: string; currentGrade?: string; }
): Promise<MIResult> {
  const questions = await fetchQuestionsFromFirestore("questions_mi");
  const miScores = scoreByDomain(questions, userResponses, "intelligence");
  
  // Convert scores for interpretation
  const miScoresForInterpretation: MIScore[] = Object.entries(miScores).map(([intelligence, score]) => ({
    intelligence,
    score
  }));
  
  // Generate single comprehensive interpretation
  const interpretation = await generateMIInterpretations(miScoresForInterpretation, userContext);
  
  return { 
    miScores, 
    questionsUsed: questions.map((q) => q.id), 
    interpretation 
  };
}

// Usage for NIH:
export async function getNIHResult(userResponses: UserResponses) {
  const questions = await fetchQuestionsFromFirestore("questions_nih");
  return scoreByDomain(questions, userResponses, "domain");
}

// Usage for Learning Style:
export async function getLearningStyleResult(userResponses: UserResponses) {
  const questions = await fetchQuestionsFromFirestore("questions_learningstyle");
  return scoreByDomain(questions, userResponses, "style");
}

// Usage for Reasoning:
export async function getReasoningResult(userResponses: UserResponses) {
  const questions = await fetchQuestionsFromFirestore("questions_reasoning");
  return scoreByDomain(questions, userResponses, "domain");
}