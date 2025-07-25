import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface CareerAssessmentInput {
  hexaco: { [trait: string]: number };
  riasec: { [type: string]: number };
  mi: { [domain: string]: number };
  familyContext: string;
}

export async function getCareerRecommendations(
  input: CareerAssessmentInput
): Promise<any[]> {
  // For testing purposes, return mock data if no Gemini API key is configured
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
  if (!process.env.GEMINI_API_KEY || process.env.NODE_ENV === 'test') {
    console.log('No Gemini API key found or in test environment, returning mock recommendations for testing');
    return [
      {
        jobTitle: "Software Engineer",
        industry: "Technology",
        jobDuties: "Develop software applications, write code, debug issues, collaborate with team members",
        keySkills: "Programming, problem-solving, teamwork, communication",
        salary: "₹8-15 LPA",
        education: "Bachelor's in Computer Science or related field",
        careerPath: "Junior Developer → Senior Developer → Tech Lead → Engineering Manager",
        cities: "Bangalore, Mumbai, Delhi, Hyderabad",
        workEnvironment: "Office-based with remote options",
        whyFit: "Based on your logical reasoning and technical aptitude scores",
        alternatives: "Data Scientist, DevOps Engineer, Product Manager"
      },
      {
        jobTitle: "Data Analyst",
        industry: "Technology/Finance",
        jobDuties: "Analyze data, create reports, identify trends, present findings to stakeholders",
        keySkills: "Analytical thinking, statistics, Excel, SQL, visualization tools",
        salary: "₹6-12 LPA",
        education: "Bachelor's in Statistics, Mathematics, or related field",
        careerPath: "Junior Analyst → Senior Analyst → Data Scientist → Analytics Manager",
        cities: "Bangalore, Mumbai, Delhi, Pune",
        workEnvironment: "Office-based with some remote work",
        whyFit: "Your pattern recognition and analytical skills align well with this role",
        alternatives: "Business Analyst, Market Research Analyst, Financial Analyst"
      },
      {
        jobTitle: "Marketing Manager",
        industry: "Marketing/Advertising",
        jobDuties: "Develop marketing strategies, manage campaigns, analyze market trends, coordinate with creative teams",
        keySkills: "Communication, creativity, strategic thinking, project management",
        salary: "₹7-14 LPA",
        education: "Bachelor's in Marketing, Business, or related field",
        careerPath: "Marketing Executive → Senior Executive → Marketing Manager → Marketing Director",
        cities: "Mumbai, Delhi, Bangalore, Chennai",
        workEnvironment: "Office-based with client meetings",
        whyFit: "Your interpersonal skills and creative thinking make this a good fit",
        alternatives: "Brand Manager, Digital Marketing Manager, Sales Manager"
      }
    ];
  }

  const prompt = `
You are a career counselor for Indian students. Suggest 3 personalized career options with all details, based on these assessments:

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

For each career, provide in markdown:
1. **Job Title**
2. **Job Duties**
3. **Key Skills Required**
4. **Average Salary in INR (India, 2024)**
5. **Typical Career Path**
6. **Why this career fits the student's profile**

Be specific, use Indian data, and match the recommendations to the profile.
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the markdown response into structured recommendations
    // For now, return a simple array with the text content
    return [
      {
        jobTitle: "Career Recommendation",
        industry: "Based on assessment results",
        jobDuties: "See detailed analysis below",
        keySkills: "Skills will be determined based on your profile",
        salary: "Varies by role and experience",
        education: "Depends on chosen career path",
        careerPath: "Will be outlined based on your interests",
        cities: "Multiple cities across India",
        workEnvironment: "Varies by industry",
        whyFit: "Based on your assessment results",
        alternatives: "Multiple options available",
        rawResponse: text
      }
    ];
  } catch (error) {
    console.error("Gemini API Error in getCareerRecommendations:", error);
    throw error;
  }
}
