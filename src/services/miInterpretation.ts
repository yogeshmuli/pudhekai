import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface MIScore {
  intelligence: string;
  score: number;
}

export interface MIInterpretation {
  overallSummary: string;
  intelligenceProfile: string;
  keyStrengths: string[];
  areasForGrowth: string[];
  careerImplications: string[];
  suggestedCareers: string[];
  learningStrategies: string[];
}

export async function generateMIInterpretations(
  miScores: MIScore[],
  userContext?: { age?: number; gender?: string; currentGrade?: string; }
): Promise<MIInterpretation> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
You are a career guidance expert specializing in Multiple Intelligences (MI) interpretation. 
Please provide a comprehensive, top-level interpretation of the MI scores provided.

Context: ${userContext ? `Student is ${userContext.age || 'young'} years old, ${userContext.gender || 'student'}, currently in ${userContext.currentGrade || 'school'}` : 'Young student'}

Multiple Intelligences Scores:
${miScores.map(score => `${score.intelligence}: ${score.score}`).join('\n')}

Assessment Type: Multiple Intelligences Inventory

Please provide a comprehensive interpretation that includes:

1. **Overall Summary**: A 2-3 sentence overview of their intelligence profile
2. **Intelligence Profile**: Description of dominant intelligences
3. **Key Strengths**: 3-4 main learning/cognitive strengths
4. **Areas for Growth**: 2-3 intelligences to develop
5. **Career Implications**: How intelligences align with career paths
6. **Suggested Careers**: List of best-fit careers (5-7)
7. **Learning Strategies**: Best ways to learn and grow

Format your response as a JSON object with this structure:
{
  "overallSummary": "Brief overview of intelligence profile...",
  "intelligenceProfile": "Description of dominant intelligences...",
  "keyStrengths": ["Strength 1", "Strength 2", "Strength 3"],
  "areasForGrowth": ["Area 1", "Area 2"],
  "careerImplications": ["Implication 1", "Implication 2", "Implication 3"],
  "suggestedCareers": ["Career 1", "Career 2", "Career 3"],
  "learningStrategies": ["Strategy 1", "Strategy 2", "Strategy 3"]
}

Be specific, actionable, and encouraging. Focus on how intelligences translate to career success and personal development.
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
    
    const interpretation = JSON.parse(jsonMatch[0]) as MIInterpretation;
    
    return interpretation;
  } catch (error) {
    console.error('Error generating MI interpretation:', error);
    
    // Fallback: return basic interpretation without AI
    return {
      overallSummary: `Your intelligence profile shows a mix of strengths that can be valuable in many careers.`,
      intelligenceProfile: `You demonstrate a combination of intelligences that can open up a variety of opportunities.`,
      keyStrengths: ['Creativity', 'Logical thinking', 'Communication'],
      areasForGrowth: ['Numerical reasoning', 'Spatial skills'],
      careerImplications: ['Fit for creative and analytical roles', 'Good communicator', 'Adaptable learner'],
      suggestedCareers: ['Writer', 'Engineer', 'Psychologist'],
      learningStrategies: ['Project-based learning', 'Group discussions', 'Visual aids']
    };
  }
} 