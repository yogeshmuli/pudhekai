import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  baseURL: process.env.OPENAI_API_BASE, // e.g., https://iconnectdevopenai01.openai.azure.com/
  defaultQuery: { "api-version": process.env.OPENAI_API_VERSION }, // e.g., "2023-05-15"
  defaultHeaders: { "api-key": process.env.OPENAI_API_KEY }
});

// Change this to your model deployment name, not just the model name!
//const DEPLOYMENT_NAME = "gpt-4-32k"; // or whatever your Azure deployment is called

export interface CareerAssessmentInput {
  hexaco: { [trait: string]: number };
  riasec: { [type: string]: number };
  mi: { [domain: string]: number };
  familyContext: string;
  aptitude?: {
    categories: { [type: string]: { correct: number; total: number; percent: number; label: string } };
    totalScore: number;
    totalQuestions: number;
    totalPercent: number;
    summary: string;
  };
  isPaidTier?: boolean;
}

export async function getCareerRecommendations(
  input: CareerAssessmentInput
): Promise<string> {
  let aptitudeSection = '';
  
  // Include aptitude data only for paid tier users
  if (input.isPaidTier && input.aptitude) {
    aptitudeSection = `
Aptitude Test Results (Paid Tier Assessment):
${Object.entries(input.aptitude.categories)
  .map(([type, data]) => `${type.replace(/_/g, ' ')}: ${data.correct}/${data.total} (${data.percent}% - ${data.label})`)
  .join(", ")}

Overall Aptitude Score: ${input.aptitude.totalScore}/${input.aptitude.totalQuestions} (${input.aptitude.totalPercent}%)
Aptitude Summary: ${input.aptitude.summary}
`;
  }

  const prompt = `
You are a career counselor for Indian students. Suggest 3 personalized career options with comprehensive details, based on these assessments:

Personality (HEXACO): 
${Object.entries(input.hexaco)
  .map(([trait, val]) => `${trait}: ${val}`)
  .join(", ")}

Interests (RIASEC): 
${Object.entries(input.riasec)
  .map(([type, val]) => `${type}: ${val}`)
  .join(", ")}

Multiple Intelligences & Learning Profile: 
${Object.entries(input.mi)
  .map(([domain, val]) => `${domain}: ${val}`)
  .join(", ")}

Family Context: 
${input.familyContext}
${aptitudeSection}

For each career, provide in markdown format with these exact sections:

1. **Job Title**
2. **Industry/Sector**
3. **Job Duties** (3-4 key responsibilities)
4. **Key Skills Required** (technical and soft skills)
5. **Average Salary in INR (India, 2024)** (mention experience level)
6. **Education/Training Required** (degree, certifications, courses)
7. **Typical Career Path/Progression** (entry to senior level progression)
8. **Cities/Regions with Most Opportunities** (top 3-4 Indian cities/regions)
9. **Work Environment** (office, lab, remote, hybrid, outdoors, etc.)
10. **Why this career matches the student's profile** (connect to their assessment results)
11. **Alternative career options** (2-3 related careers with similar skill sets)

${input.isPaidTier && input.aptitude ? 'Consider the aptitude test results to suggest careers that align with the student\'s cognitive abilities and reasoning skills. Higher aptitude scores may indicate suitability for more analytical or complex roles.' : ''}

Be specific, use current Indian data, and ensure each recommendation is tailored to the student's unique profile. Focus on practical, achievable career paths with good growth potential.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: "system", content: "You are a helpful, expert Indian career counselor." },
        { role: "user", content: prompt }
      ],
      temperature: 0.6,
      max_tokens: 1200
    });
    return completion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("OpenAI API Error in getCareerRecommendations:", error);
    throw error;
  }
}