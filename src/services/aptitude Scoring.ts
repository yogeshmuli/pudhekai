import { generateAptitudeInterpretations, AptitudeCategoryScore } from "./aptitudeInterpretation";

// Types
type AptitudeQuestion = {
    id: string;
    type: string; // e.g., 'pattern_recognition', 'logical_reasoning'
    answerIndex: number;
  };
  
  type AptitudeResponse = { [id: string]: number }; // e.g., { "pr1": 2, "lr1": 1, ... }

  export interface AptitudeResult {
    categories: { [type: string]: { correct: number; total: number; percent: number; label: string } };
    totalScore: number;
    totalQuestions: number;
    totalPercent: number;
    summary: string;
    interpretation?: any; // Single interpretation object
  }
  
  // Label generator for percentiles
  function getLabel(pct: number): string {
    if (pct >= 80) return "High";
    if (pct >= 60) return "Moderate";
    return "Needs Improvement";
  }

  // Convert aptitude scores to format needed for interpretation
  function convertToAptitudeScores(result: any): AptitudeCategoryScore[] {
    return Object.entries(result.categories).map(([category, data]: [string, any]) => ({
      category: category.replace(/_/g, " "),
      correct: data.correct,
      total: data.total,
      percent: data.percent,
      label: data.label
    }));
  }
  
  // Main scoring function
  export async function scoreAptitudeTest(
    questionBank: AptitudeQuestion[],
    responses: AptitudeResponse,
    userContext?: {
      age?: number;
      gender?: string;
      currentGrade?: string;
    }
  ): Promise<AptitudeResult> {
    // Organize scores by type
    const categoryScores: { [type: string]: { correct: number; total: number } } = {};
  
    for (const q of questionBank) {
      const userAnswer = responses[q.id];
      if (!categoryScores[q.type]) categoryScores[q.type] = { correct: 0, total: 0 };
      if (userAnswer === q.answerIndex) categoryScores[q.type].correct += 1;
      categoryScores[q.type].total += 1;
    }
  
    // Calculate results
    let totalCorrect = 0, totalQuestions = 0;
    const result: any = {
      categories: {}
    };
  
    for (const cat in categoryScores) {
      const { correct, total } = categoryScores[cat];
      const pct = total ? Math.round((correct / total) * 100) : 0;
      result.categories[cat] = {
        correct,
        total,
        percent: pct,
        label: getLabel(pct)
      };
      totalCorrect += correct;
      totalQuestions += total;
    }
  
    result.totalScore = totalCorrect;
    result.totalQuestions = totalQuestions;
    result.totalPercent = totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  
    // Flat summary for AI
    result.summary = Object.entries(result.categories)
      .map(([cat, val]: [string, any]) =>
        `${cat.replace(/_/g, " ")}: ${val.correct}/${val.total} (${val.label})`
      )
      .join(", ");
  
    // Generate interpretations using AI
    const aptitudeScoresForInterpretation = convertToAptitudeScores(result);
    const interpretation = await generateAptitudeInterpretations(aptitudeScoresForInterpretation, userContext);
    
    result.interpretation = interpretation;
  
    return result;
  }