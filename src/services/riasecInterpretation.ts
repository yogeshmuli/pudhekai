import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface RiasecCategoryScore {
  category: string;
  score: number;
}

export interface RiasecInterpretation {
  overallSummary: string;
  interestProfile: string;
  keyStrengths: string[];
  areasForGrowth: string[];
  careerImplications: string[];
  suggestedCareers: string[];
  workStyle: string;
  learningApproach: string;
}

export async function generateRiasecInterpretations(
  categoryScores: RiasecCategoryScore[],
  userContext?: { age?: number; gender?: string; currentGrade?: string; }
): Promise<RiasecInterpretation> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
You are a career guidance expert specializing in RIASEC career interest interpretation. 
Please provide a comprehensive, top-level interpretation of the RIASEC scores provided.

Context: ${userContext ? `Student is ${userContext.age || 'young'} years old, ${userContext.gender || 'student'}, currently in ${userContext.currentGrade || 'school'}` : 'Young student'}

RIASEC Scores:
${categoryScores.map(score => `${score.category}: ${score.score}`).join('\n')}

Assessment Type: RIASEC Career Interest Inventory

Please provide a comprehensive interpretation that includes:

1. **Overall Summary**: A 2-3 sentence overview of their career interests
2. **Interest Profile**: Detailed description of their dominant RIASEC types
3. **Key Strengths**: 3-4 main career strengths
4. **Areas for Growth**: 2-3 areas to develop
5. **Career Implications**: How their interests align with career paths
6. **Suggested Careers**: List of best-fit careers (5-7)
7. **Work Style**: Preferred work environments
8. **Learning Approach**: How they best acquire new skills

Format your response as a JSON object with this structure:
{
  "overallSummary": "Brief overview of career interests...",
  "interestProfile": "Detailed description of dominant RIASEC types...",
  "keyStrengths": ["Strength 1", "Strength 2", "Strength 3"],
  "areasForGrowth": ["Area 1", "Area 2"],
  "careerImplications": ["Implication 1", "Implication 2", "Implication 3"],
  "suggestedCareers": ["Career 1", "Career 2", "Career 3"],
  "workStyle": "Description of preferred work style...",
  "learningApproach": "Description of learning preferences..."
}

Be specific, actionable, and encouraging. Focus on how interests translate to career success and personal development.
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
    
    const interpretation = JSON.parse(jsonMatch[0]) as RiasecInterpretation;
    
    return interpretation;
  } catch (error) {
    console.error('Error generating RIASEC interpretation:', error);
    
    // Fallback: return basic interpretation without AI
    return {
      overallSummary: `Your RIASEC profile shows a mix of interests that can be valuable in many careers.`,
      interestProfile: `You demonstrate a combination of career interests that can open up a variety of opportunities.`,
      keyStrengths: ['Curiosity', 'Teamwork', 'Problem-solving'],
      areasForGrowth: ['Exploring new fields', 'Building confidence'],
      careerImplications: ['Fit for multiple career paths', 'Good collaborator', 'Adaptable to new environments'],
      suggestedCareers: ['Engineer', 'Teacher', 'Designer'],
      workStyle: 'Collaborative and creative work approach',
      learningApproach: 'Prefers hands-on and experiential learning'
    };
  }
} 