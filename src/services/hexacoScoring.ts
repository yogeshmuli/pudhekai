import fs from "fs";
import path from "path";

export type HexacoQuestion = {
  id: string;
  trait: string;
  facet?: string;
  reverse?: boolean;
  text: string;
};

export type UserResponses = { [id: string]: number };

export type AssessmentType = "free" | "paid";

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

// Example usage in an API handler:
export function getHexacoResult(
  userResponses: UserResponses,
  assessmentType: AssessmentType = "free"
) {
  const allQuestions = loadQuestions();
  const selectedQuestions = selectQuestions(allQuestions, assessmentType);
  const traitScores = scoreHexaco(selectedQuestions, userResponses);
  return { traitScores, questionsUsed: selectedQuestions.map((q) => q.id) };
}
