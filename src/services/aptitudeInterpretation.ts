import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface AptitudeCategoryScore {
  category: string;
  correct: number;
  total: number;
  percent: number;
  label: string;
}

export interface AptitudeInterpretation {
  overallSummary: string;
  aptitudeProfile: string;
  keyStrengths: string[];
  areasForGrowth: string[];
  careerImplications: string[];
  suggestedCareers: string[];
  learningStrategies: string[];
}

export async function generateAptitudeInterpretations(
  categoryScores: AptitudeCategoryScore[],
  userContext?: {
    age?: number;
    gender?: string;
    currentGrade?: string;
  }
): Promise<AptitudeInterpretation> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
You are a career guidance expert specializing in cognitive aptitude assessment interpretation. 
Please provide a comprehensive, top-level interpretation of the aptitude scores provided.

Context: ${userContext ? `Student is ${userContext.age || 'young'} years old, ${userContext.gender || 'student'}, currently in ${userContext.currentGrade || 'school'}` : 'Young student'}

Aptitude Category Scores:
${categoryScores.map(score => `${score.category}: ${score.correct}/${score.total} (${score.percent}%) - ${score.label}`).join('\n')}

Assessment Type: Cognitive Aptitude Test

Please provide a comprehensive interpretation that includes:

1. **Overall Summary**: A 2-3 sentence overview of their cognitive abilities
2. **Aptitude Profile**: Description of strengths across categories
3. **Key Strengths**: 3-4 main cognitive strengths
4. **Areas for Growth**: 2-3 cognitive areas to develop
5. **Career Implications**: How aptitudes align with career paths
6. **Suggested Careers**: List of best-fit careers (5-7)
7. **Learning Strategies**: Best ways to improve cognitive skills

Format your response as a JSON object with this structure:
{
  "overallSummary": "Brief overview of cognitive abilities...",
  "aptitudeProfile": "Description of strengths across categories...",
  "keyStrengths": ["Strength 1", "Strength 2", "Strength 3"],
  "areasForGrowth": ["Area 1", "Area 2"],
  "careerImplications": ["Implication 1", "Implication 2", "Implication 3"],
  "suggestedCareers": ["Career 1", "Career 2", "Career 3"],
  "learningStrategies": ["Strategy 1", "Strategy 2", "Strategy 3"]
}

Be specific, actionable, and encouraging. Focus on how cognitive abilities translate to career success and academic achievement.
Consider the Indian context and available opportunities.
Provide practical insights that can guide career choices and personal growth.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse JSON response from Gemini');
    }
    
    const interpretation = JSON.parse(jsonMatch[0]) as AptitudeInterpretation;
    
    return interpretation;
  } catch (error) {
    console.error('Error generating aptitude interpretation:', error);
    
    // Fallback: return basic interpretation without AI
    return {
      overallSummary: `Your cognitive profile shows a mix of strengths that can be valuable in many careers.`,
      aptitudeProfile: `You demonstrate a combination of cognitive abilities that can open up a variety of opportunities.`,
      keyStrengths: ['Analytical thinking', 'Problem-solving', 'Attention to detail'],
      areasForGrowth: ['Speed of processing', 'Complex reasoning'],
      careerImplications: ['Fit for analytical and technical roles', 'Good at structured problem-solving', 'Adaptable learner'],
      suggestedCareers: ['Engineer', 'Analyst', 'Scientist'],
      learningStrategies: ['Practice with puzzles', 'Case study analysis', 'Project-based learning']
    };
  }
} 