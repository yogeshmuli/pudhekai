// import OpenAI from "openai";

// const openai = new OpenAI({});

// // Change this to your model deployment name, not just the model name!
// //const DEPLOYMENT_NAME = "gpt-4-32k"; // or whatever your Azure deployment is called

// export interface CareerAssessmentInput {
//   hexaco: { [trait: string]: number };
//   riasec: { [type: string]: number };
//   mi: { [domain: string]: number };
//   familyContext: string;
// }

// export async function getCareerRecommendations(
//   input: CareerAssessmentInput
// ): Promise<string> {
//   const prompt = `
// You are a career counselor for Indian students. Suggest 3 personalized career options with all details, based on these assessments:

// Personality (HEXACO):
// ${Object.entries(input.hexaco)
//   .map(([trait, val]) => `${trait}: ${val}`)
//   .join(", ")}

// Interests (RIASEC):
// ${Object.entries(input.riasec)
//   .map(([type, val]) => `${type}: ${val}`)
//   .join(", ")}

// Multiple Intelligences & Learning Profile:
// ${Object.entries(input.mi)
//   .map(([domain, val]) => `${domain}: ${val}`)
//   .join(", ")}

// Family Context:
// ${input.familyContext}

// For each career, provide in markdown:
// 1. **Job Title**
// 2. **Job Duties**
// 3. **Key Skills Required**
// 4. **Average Salary in INR (India, 2024)**
// 5. **Typical Career Path**
// 6. **Why this career fits the student’s profile**

// Be specific, use Indian data, and match the recommendations to the profile.
// `;

//   try {
//     const completion = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo", // <-- deployment name, not "gpt-4"
//       messages: [
//         {
//           role: "system",
//           content: "You are a helpful, expert Indian career counselor.",
//         },
//         { role: "user", content: prompt },
//       ],
//       temperature: 0.6,
//       max_tokens: 1200,
//     });
//     return completion.choices[0]?.message?.content || "";
//   } catch (error) {
//     console.error("OpenAI API Error in getCareerRecommendations:", error);
//     throw error;
//   }
// }
