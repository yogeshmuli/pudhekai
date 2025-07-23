import fs from "fs";
import path from "path";

// For MI, NIH, LearningStyle, Reasoning
export type GenericQuestion = {
  id: string;
  domain?: string;       // e.g., "Working Memory", "Visual"
  intelligence?: string; // for MI
  style?: string;        // for VARK
  text: string;
};

export type UserResponses = { [id: string]: number };

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

// Usage for MI:
export function getMIResult(userResponses: UserResponses) {
  const questions = loadQuestions("mi_questions.json");
  return scoreByDomain(questions, userResponses, "intelligence");
}

// Usage for NIH:
export function getNIHResult(userResponses: UserResponses) {
  const questions = loadQuestions("nih_questions.json");
  return scoreByDomain(questions, userResponses, "domain");
}

// Usage for Learning Style:
export function getLearningStyleResult(userResponses: UserResponses) {
  const questions = loadQuestions("learningstyle_questions.json");
  return scoreByDomain(questions, userResponses, "style");
}

// Usage for Reasoning:
export function getReasoningResult(userResponses: UserResponses) {
  const questions = loadQuestions("reasoning_questions.json");
  return scoreByDomain(questions, userResponses, "domain");
}