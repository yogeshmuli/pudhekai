// HEXACO question schema
export type HexacoQuestion = {
    id: string;
    trait: "Honesty-Humility" | "Emotionality" | "Extraversion" | "Agreeableness" | "Conscientiousness" | "Openness";
    facet?: string;
    reverse?: boolean;
    text: string;
  };
  
  // Example: add all your questions here
  export const hexacoQuestions: HexacoQuestion[] = [
    { id: "h1", trait: "Honesty-Humility", facet: "Sincerity", reverse: false, text: "I wouldn't use flattery to get a raise or promotion at work." },
    { id: "h2", trait: "Honesty-Humility", facet: "Modesty", reverse: true, text: "I think that I am entitled to more respect than the average person." },
    { id: "e1", trait: "Emotionality", facet: "Fearfulness", reverse: false, text: "I sometimes feel that I am a burden to others." },
    { id: "x1", trait: "Extraversion", facet: "Social Self-Esteem", reverse: false, text: "I feel comfortable around people." },
    { id: "a1", trait: "Agreeableness", facet: "Forgiveness", reverse: false, text: "I rarely hold a grudge, even against people who have badly wronged me." },
    { id: "c1", trait: "Conscientiousness", facet: "Organization", reverse: false, text: "I plan ahead and organize things, to avoid scrambling at the last minute." },
    { id: "o1", trait: "Openness", facet: "Creativity", reverse: false, text: "I enjoy examining philosophical ideas." },
    // ...add more questions as needed
  ];
  
  // User responses format (id: answerValue)
  export type UserResponses = { [id: string]: number };
  
  // Scoring function
  export function scoreHexaco(questions: HexacoQuestion[], responses: UserResponses) {
    const traitScores: { [trait: string]: number } = {};
    const traitCounts: { [trait: string]: number } = {};
  
    for (const q of questions) {
      const answer = responses[q.id];
      if (answer === undefined) continue;
  
      // Assuming answer is 1-5 (Strongly Disagree to Strongly Agree)
      const scored = q.reverse ? (6 - answer) : answer;
  
      traitScores[q.trait] = (traitScores[q.trait] || 0) + scored;
      traitCounts[q.trait] = (traitCounts[q.trait] || 0) + 1;
    }
  
    // Average scores for each trait
    Object.keys(traitScores).forEach(trait => {
      traitScores[trait] = traitScores[trait] / traitCounts[trait];
    });
  
    return traitScores;
  }
  
  // Simple archetype detection based on trait scores
  export function detectArchetype(traitScores: { [trait: string]: number }): string {
    // Example mapping – tune thresholds as needed!
    if ((traitScores["Extraversion"] ?? 0) > 4.5 && (traitScores["Conscientiousness"] ?? 0) > 4.0) {
      return "Result Oriented";
    } else if ((traitScores["Agreeableness"] ?? 0) > 4.5 && (traitScores["Extraversion"] ?? 0) > 4.0) {
      return "Affiliate";
    } else if ((traitScores["Conscientiousness"] ?? 0) > 4.5) {
      return "Diligent";
    } else if ((traitScores["Openness"] ?? 0) > 4.5) {
      return "Innovator";
    } else {
      return "Balanced";
    }
  }
  
  // Example usage
  if (require.main === module) {
    const exampleResponses: UserResponses = {
      h1: 5, h2: 2,
      e1: 3,
      x1: 4,
      a1: 5,
      c1: 4,
      o1: 5,
      // ...add other answers here
    };
  
    const scores = scoreHexaco(hexacoQuestions, exampleResponses);
    const archetype = detectArchetype(scores);
  
    console.log("Trait scores:", scores);
    console.log("Detected archetype:", archetype);
  }