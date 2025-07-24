import fetch from 'node-fetch';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';

export async function getCareerRecommendationsGemini(input: any): Promise<string> {
  let aptitudeSection = '';
  
  // Include aptitude data only for paid tier users
  if (input.isPaidTier && input.aptitude) {
    aptitudeSection = `
Aptitude Test Results (Paid Tier Assessment):
${Object.entries(input.aptitude.categories)
  .map(([type, data]: [string, any]) => `${type.replace(/_/g, ' ')}: ${data.correct}/${data.total} (${data.percent}% - ${data.label})`)
  .join(", ")}

Overall Aptitude Score: ${input.aptitude.totalScore}/${input.aptitude.totalQuestions} (${input.aptitude.totalPercent}%)
Aptitude Summary: ${input.aptitude.summary}
`;
  }

  const prompt = `
You are a career counselor for Indian students. Suggest exactly 3 personalized career options with comprehensive details, based on these assessments.

Respond with exactly 3 options, each clearly labeled as **Option 1:**, **Option 2:**, and **Option 3:**.

Personality (HEXACO): 
${Object.entries(input.hexaco).map(([trait, val]) => `${trait}: ${val}`).join(", ")}

Interests (RIASEC): 
${Object.entries(input.riasec).map(([type, val]) => `${type}: ${val}`).join(", ")}

Multiple Intelligences & Learning Profile: 
${Object.entries(input.mi).map(([domain, val]) => `${domain}: ${val}`).join(", ")}

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
      ],
      generationConfig: {
        maxOutputTokens: 2048
      }
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

export function parseGeminiRecommendations(text: string) {
  // Split by "**Option" or "** Option" (handles both)
  const options = text.split(/\*\*Option\s*\d+:?/i).filter(Boolean);

  return options.map(optionText => {
    const jobTitle = optionText.match(/\*\*Job Title:\*\*\s*(.+)/)?.[1]?.trim();
    const industry = optionText.match(/\*\*Industry\/Sector:\*\*\s*(.+)/)?.[1]?.trim();
    const jobDuties = optionText.match(/\*\*Job Duties:\*\*([\s\S]*?)(?=\n\n\d+\.|\*\*)/)?.[1]?.trim();
    const keySkills = optionText.match(/\*\*Key Skills Required:\*\*([\s\S]*?)(?=\n\n\d+\.|\*\*)/)?.[1]?.trim();
    const salary = optionText.match(/\*\*Average Salary in INR \(India, 2024\):\*\*\s*(.+)/)?.[1]?.trim();
    const education = optionText.match(/\*\*Education\/Training Required:\*\*([\s\S]*?)(?=\n\n\d+\.|\*\*)/)?.[1]?.trim();
    const careerPath = optionText.match(/\*\*Typical Career Path\/Progression:\*\*([\s\S]*?)(?=\n\n\d+\.|\*\*)/)?.[1]?.trim();
    const cities = optionText.match(/\*\*Cities\/Regions with Most Opportunities:\*\*([\s\S]*?)(?=\n\n\d+\.|\*\*)/)?.[1]?.trim();
    const workEnvironment = optionText.match(/\*\*Work Environment:\*\*\s*(.+)/)?.[1]?.trim();
    const whyFit = optionText.match(/\*\*Why this career matches the student's profile:\*\*([\s\S]*?)(?=\n\n\d+\.|\*\*)/)?.[1]?.trim();
    const alternatives = optionText.match(/\*\*Alternative career options:\*\*\s*(.+)/)?.[1]?.trim();

    return {
      jobTitle,
      industry,
      jobDuties,
      keySkills,
      salary,
      education,
      careerPath,
      cities,
      workEnvironment,
      whyFit,
      alternatives
    };
  });
}