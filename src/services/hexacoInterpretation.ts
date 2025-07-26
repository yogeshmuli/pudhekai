import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface HexacoTraitScore {
  trait: string;
  score: number;
}

export interface HexacoInterpretation {
  overallSummary: string;
  personalityProfile: string;
  keyStrengths: string[];
  areasForGrowth: string[];
  careerImplications: string[];
  leadershipStyle: string;
  workStyle: string;
  communicationStyle: string;
  teamDynamics: string;
  stressManagement: string;
  learningApproach: string;
}

export async function generateHexacoInterpretations(
  traitScores: HexacoTraitScore[],
  userContext?: { age?: number; gender?: string; currentGrade?: string; }
): Promise<HexacoInterpretation> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
You are a career guidance expert specializing in personality assessment interpretation. 
Please provide a comprehensive, top-level interpretation of the HEXACO personality scores provided.

Context: ${userContext ? `Student is ${userContext.age || 'young'} years old, ${userContext.gender || 'student'}, currently in ${userContext.currentGrade || 'school'}` : 'Young student'}

HEXACO Personality Scores:
${traitScores.map(score => `${score.trait}: ${score.score}`).join('\n')}

Assessment Type: HEXACO Personality Inventory

Please provide a comprehensive interpretation that includes:

1. **Overall Summary**: A 2-3 sentence overview of their personality profile
2. **Personality Profile**: Detailed description of their personality characteristics
3. **Key Strengths**: 3-4 main personality strengths that will help in career success
4. **Areas for Growth**: 2-3 personality areas they could develop further
5. **Career Implications**: How their personality traits translate to career success
6. **Leadership Style**: What kind of leader they would be
7. **Work Style**: How they prefer to work and collaborate
8. **Communication Style**: How they communicate and interact with others
9. **Team Dynamics**: How they function in team environments
10. **Stress Management**: How they handle pressure and challenges
11. **Learning Approach**: How they prefer to learn and develop skills

Format your response as a JSON object with this structure:
{
  "overallSummary": "Brief overview of personality profile...",
  "personalityProfile": "Detailed description of personality characteristics...",
  "keyStrengths": ["Strength 1", "Strength 2", "Strength 3"],
  "areasForGrowth": ["Area 1", "Area 2"],
  "careerImplications": ["Implication 1", "Implication 2", "Implication 3"],
  "leadershipStyle": "Description of leadership approach...",
  "workStyle": "Description of preferred work style...",
  "communicationStyle": "Description of communication approach...",
  "teamDynamics": "Description of team interaction style...",
  "stressManagement": "Description of stress handling approach...",
  "learningApproach": "Description of learning preferences..."
}

Be specific, actionable, and encouraging. Focus on how personality traits translate to career success and personal development.
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
    
    const interpretation = JSON.parse(jsonMatch[0]) as HexacoInterpretation;
    
    return interpretation;
  } catch (error) {
    console.error('Error generating HEXACO interpretation:', error);
    
    // Fallback: return basic interpretation without AI
    return {
      overallSummary: `Your HEXACO personality profile shows a balanced personality with various strengths across different traits.`,
      personalityProfile: `You demonstrate a mix of personality characteristics that can be valuable in different career contexts.`,
      keyStrengths: ['Adaptability', 'Interpersonal skills', 'Work ethic'],
      areasForGrowth: ['Confidence building', 'Stress management'],
      careerImplications: ['Suitable for various career paths', 'Good team player', 'Adaptable to different work environments'],
      leadershipStyle: 'Collaborative and supportive leadership approach',
      workStyle: 'Methodical and detail-oriented work approach',
      communicationStyle: 'Clear and direct communication style',
      teamDynamics: 'Effective team player who contributes positively',
      stressManagement: 'Generally handles stress well with room for improvement',
      learningApproach: 'Prefers structured learning with practical applications'
    };
  }
} 