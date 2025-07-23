import fetch from 'node-fetch';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
//const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-pro:generateContent';
//const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent';
const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';

export async function getCareerRecommendationsGeminiApiKey(input: any): Promise<string> {
  const prompt = `
You are a career counselor for Indian students. Suggest 3 personalized career options with all details, based on these assessments:

Personality (HEXACO): 
${Object.entries(input.hexaco).map(([trait, val]) => `${trait}: ${val}`).join(", ")}

Interests (RIASEC): 
${Object.entries(input.riasec).map(([type, val]) => `${type}: ${val}`).join(", ")}

Multiple Intelligences & Learning Profile: 
${Object.entries(input.mi).map(([domain, val]) => `${domain}: ${val}`).join(", ")}

Family Context: 
${input.familyContext}

For each career, provide in markdown:
1. **Job Title**
2. **Job Duties**
3. **Key Skills Required**
4. **Average Salary in INR (India, 2024)**
5. **Typical Career Path**
6. **Why this career fits the student’s profile**
`;

  const res = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ]
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Gemini API Error: ${error}`);
  }

  const result = await res.json();
  return (
    result?.candidates?.[0]?.content?.parts?.[0]?.text ||
    ""
  );
}