import { NextResponse } from 'next/server';
import { generateCareerReport, AssessmentSummary, CareerRecommendation } from '../../../services/reportService';

/**
 * @swagger
 * /api/report:
 *   get:
 *     summary: Generate comprehensive career assessment report
 *     tags:
 *       - Report Generation
 *     description: Generates a detailed career assessment report based on assessment results. Currently returns a demo report with hardcoded data for demonstration purposes.
 *     responses:
 *       200:
 *         description: Comprehensive career assessment report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 studentName:
 *                   type: string
 *                   description: Name of the student
 *                   example: "Priya Sharma"
 *                 tier:
 *                   type: string
 *                   enum: [Free, Paid]
 *                   description: User tier level
 *                   example: "Paid"
 *                 date:
 *                   type: string
 *                   format: date
 *                   description: Report generation date
 *                   example: "2024-01-15"
 *                 introduction:
 *                   type: string
 *                   description: Welcome message and report overview
 *                 interpretationGuide:
 *                   type: string
 *                   description: Guide on how to interpret the assessment results
 *                 summary:
 *                   type: object
 *                   description: Detailed assessment summary
 *                   properties:
 *                     traitSummary:
 *                       type: string
 *                       description: Summary of personality traits
 *                       example: "You are collaborative, open to new experiences, and value honesty."
 *                     keyTraits:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Key personality traits identified
 *                       example: ["High Honesty-Humility", "Moderate Extraversion"]
 *                     interestSummary:
 *                       type: string
 *                       description: Summary of career interests
 *                       example: "You enjoy creative and social activities."
 *                     riasecScores:
 *                       type: object
 *                       description: RIASEC career interest scores
 *                       properties:
 *                         Artistic:
 *                           type: number
 *                           example: 7
 *                         Social:
 *                           type: number
 *                           example: 8
 *                         Investigative:
 *                           type: number
 *                           example: 6
 *                         Realistic:
 *                           type: number
 *                           example: 5
 *                         Enterprising:
 *                           type: number
 *                           example: 4
 *                         Conventional:
 *                           type: number
 *                           example: 3
 *                     intelligenceSummary:
 *                       type: string
 *                       description: Summary of multiple intelligences
 *                       example: "Strong verbal and logical intelligence."
 *                     aptitudeScores:
 *                       type: object
 *                       description: Aptitude test scores (available for paid tier)
 *                       properties:
 *                         patternRecognition:
 *                           type: number
 *                           description: Raw score for pattern recognition
 *                           example: 8
 *                         logicalReasoning:
 *                           type: number
 *                           description: Raw score for logical reasoning
 *                           example: 7
 *                         numericalReasoning:
 *                           type: number
 *                           description: Raw score for numerical reasoning
 *                           example: 5
 *                         criticalReasoning:
 *                           type: number
 *                           description: Raw score for critical reasoning
 *                           example: 9
 *                         patternRecognitionPct:
 *                           type: number
 *                           description: Percentage score for pattern recognition
 *                           example: 80
 *                         logicalReasoningPct:
 *                           type: number
 *                           description: Percentage score for logical reasoning
 *                           example: 70
 *                         numericalReasoningPct:
 *                           type: number
 *                           description: Percentage score for numerical reasoning
 *                           example: 50
 *                         criticalReasoningPct:
 *                           type: number
 *                           description: Percentage score for critical reasoning
 *                           example: 90
 *                         totalScore:
 *                           type: number
 *                           description: Total aptitude score
 *                           example: 29
 *                         totalPct:
 *                           type: number
 *                           description: Total percentage score
 *                           example: 72.5
 *                     familyContext:
 *                       type: string
 *                       description: Family background and context
 *                       example: "Grew up in a middle-income family, urban area, with supportive parents."
 *                     strengths:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Identified strengths
 *                       example: ["Strong verbal skills", "Good pattern recognition", "High openness"]
 *                     improvements:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Areas for improvement
 *                       example: ["Work on numerical reasoning", "Practice analytical thinking"]
 *                 recommendations:
 *                   type: array
 *                   description: Career recommendations based on assessment
 *                   items:
 *                     type: object
 *                     properties:
 *                       jobTitle:
 *                         type: string
 *                         description: Career title
 *                         example: "Data Scientist"
 *                       industry:
 *                         type: string
 *                         description: Industry sectors
 *                         example: "IT, Finance, Healthcare, E-commerce"
 *                       jobDuties:
 *                         type: string
 *                         description: Key job responsibilities
 *                         example: "Collect, clean, and analyze large datasets. Develop and implement machine learning models."
 *                       keySkills:
 *                         type: string
 *                         description: Required skills (technical and soft skills)
 *                         example: "Programming (Python, R), Statistical Modeling, Machine Learning Algorithms"
 *                       salary:
 *                         type: string
 *                         description: Salary ranges in INR
 *                         example: "₹6–8 Lakhs (Entry-level), ₹12–20 Lakhs (Mid-level), ₹25+ Lakhs (Senior-level)"
 *                       education:
 *                         type: string
 *                         description: Required education and certifications
 *                         example: "Bachelor's/Master's in Computer Science, Statistics, Mathematics, or related fields."
 *                       careerPath:
 *                         type: string
 *                         description: Career progression path
 *                         example: "Data Analyst → Junior Data Scientist → Senior Data Scientist → Data Science Manager"
 *                       cities:
 *                         type: string
 *                         description: Top cities with opportunities
 *                         example: "Bangalore, Hyderabad, Mumbai, Delhi NCR"
 *                       workEnvironment:
 *                         type: string
 *                         description: Work environment description
 *                         example: "Primarily office-based, with potential for hybrid or remote work."
 *                       whyFit:
 *                         type: string
 *                         description: Explanation of why this career fits the student's profile
 *                         example: "High scores in logical reasoning and pattern recognition align well with the analytical demands of data science."
 *                       alternatives:
 *                         type: string
 *                         description: Alternative career options
 *                         example: "Machine Learning Engineer, Business Analyst, Data Architect"
 *                 nextSteps:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Recommended next steps for the student
 *                   example: [
 *                     "Explore the recommended career paths and research each one in more detail.",
 *                     "Reach out to professionals or alumni in your fields of interest.",
 *                     "Plan to develop skills in your areas for improvement."
 *                   ]
 *                 disclaimer:
 *                   type: string
 *                   description: Important disclaimer about the report
 *                   example: "These recommendations are generated by AI and based on your responses. Please consider discussing your report with a qualified career counsellor."
 *             example:
 *               studentName: "Priya Sharma"
 *               tier: "Paid"
 *               date: "2024-01-15"
 *               introduction: "Welcome to your personalized career assessment report!"
 *               interpretationGuide: "This report interprets your assessment results across four areas: personality, interests, cognitive abilities, and family context."
 *               summary:
 *                 traitSummary: "You are collaborative, open to new experiences, and value honesty."
 *                 keyTraits: ["High Honesty-Humility", "Moderate Extraversion"]
 *                 interestSummary: "You enjoy creative and social activities."
 *                 riasecScores:
 *                   Artistic: 7
 *                   Social: 8
 *                   Investigative: 6
 *                   Realistic: 5
 *                   Enterprising: 4
 *                   Conventional: 3
 *                 intelligenceSummary: "Strong verbal and logical intelligence."
 *                 aptitudeScores:
 *                   patternRecognition: 8
 *                   logicalReasoning: 7
 *                   numericalReasoning: 5
 *                   criticalReasoning: 9
 *                   patternRecognitionPct: 80
 *                   logicalReasoningPct: 70
 *                   numericalReasoningPct: 50
 *                   criticalReasoningPct: 90
 *                   totalScore: 29
 *                   totalPct: 72.5
 *                 familyContext: "Grew up in a middle-income family, urban area, with supportive parents."
 *                 strengths: ["Strong verbal skills", "Good pattern recognition", "High openness"]
 *                 improvements: ["Work on numerical reasoning", "Practice analytical thinking"]
 *               recommendations:
 *                 - jobTitle: "Data Scientist"
 *                   industry: "IT, Finance, Healthcare, E-commerce"
 *                   jobDuties: "Collect, clean, and analyze large datasets. Develop and implement machine learning models."
 *                   keySkills: "Programming (Python, R), Statistical Modeling, Machine Learning Algorithms"
 *                   salary: "₹6–8 Lakhs (Entry-level), ₹12–20 Lakhs (Mid-level), ₹25+ Lakhs (Senior-level)"
 *                   education: "Bachelor's/Master's in Computer Science, Statistics, Mathematics, or related fields."
 *                   careerPath: "Data Analyst → Junior Data Scientist → Senior Data Scientist → Data Science Manager"
 *                   cities: "Bangalore, Hyderabad, Mumbai, Delhi NCR"
 *                   workEnvironment: "Primarily office-based, with potential for hybrid or remote work."
 *                   whyFit: "High scores in logical reasoning and pattern recognition align well with the analytical demands of data science."
 *                   alternatives: "Machine Learning Engineer, Business Analyst, Data Architect"
 *               nextSteps: [
 *                 "Explore the recommended career paths and research each one in more detail.",
 *                 "Reach out to professionals or alumni in your fields of interest.",
 *                 "Plan to develop skills in your areas for improvement."
 *               ]
 *               disclaimer: "These recommendations are generated by AI and based on your responses. Please consider discussing your report with a qualified career counsellor."
 */
export async function GET() {
  // Hardcoded inputs for demonstration
  const summary: AssessmentSummary = {
    traitSummary: "You are collaborative, open to new experiences, and value honesty.",
    keyTraits: ["High Honesty-Humility", "Moderate Extraversion"],
    interestSummary: "You enjoy creative and social activities.",
    riasecScores: { Artistic: 7, Social: 8, Investigative: 6, Realistic: 5, Enterprising: 4, Conventional: 3 },
    intelligenceSummary: "Strong verbal and logical intelligence.",
    aptitudeScores: {
      patternRecognition: 8,
      logicalReasoning: 7,
      numericalReasoning: 5,
      criticalReasoning: 9,
      patternRecognitionPct: 80,
      logicalReasoningPct: 70,
      numericalReasoningPct: 50,
      criticalReasoningPct: 90,
      totalScore: 29,
      totalPct: 72.5,
    },
    familyContext: "Grew up in a middle-income family, urban area, with supportive parents.",
    strengths: ["Strong verbal skills", "Good pattern recognition", "High openness"],
    improvements: ["Work on numerical reasoning", "Practice analytical thinking"],
  };

  const recommendations: CareerRecommendation[] = [
    {
      jobTitle: "Data Scientist",
      industry: "IT, Finance, Healthcare, E-commerce",
      jobDuties: "Collect, clean, and analyze large datasets. Develop and implement machine learning models. Visualize data and communicate insights to stakeholders. Identify trends and patterns to solve business problems.",
      keySkills: "Programming (Python, R), Statistical Modeling, Machine Learning Algorithms, Data Visualization, Communication, Problem-solving",
      salary: "₹6–8 Lakhs (Entry-level), ₹12–20 Lakhs (Mid-level), ₹25+ Lakhs (Senior-level)",
      education: "Bachelor's/Master's in Computer Science, Statistics, Mathematics, or related fields. Certifications in Data Science, Machine Learning, and Big Data are beneficial.",
      careerPath: "Data Analyst → Junior Data Scientist → Senior Data Scientist → Data Science Manager → Chief Data Officer",
      cities: "Bangalore, Hyderabad, Mumbai, Delhi NCR",
      workEnvironment: "Primarily office-based, with potential for hybrid or remote work.",
      whyFit: "High scores in logical reasoning, numerical reasoning, and pattern recognition align well with the analytical demands of data science. High openness to experience and investigative interests indicate an aptitude for exploring complex data and discovering new insights. Conscientiousness and a stable family background suggest the ability to pursue advanced education and a demanding career path.",
      alternatives: "Machine Learning Engineer, Business Analyst, Data Architect"
    },
    {
      jobTitle: "Product Manager",
      industry: "IT, E-commerce, Fintech, Manufacturing",
      jobDuties: "Define product vision, strategy, and roadmap. Conduct market research and analyze user needs. Prioritize features and manage the product backlog. Collaborate with engineering, design, and marketing teams to launch and iterate on products.",
      keySkills: "Market Research, Product Design, Data Analysis, Communication, Problem-solving, Leadership",
      salary: "₹8–12 Lakhs (Entry-level), ₹15–25 Lakhs (Mid-level), ₹30+ Lakhs (Senior-level)",
      education: "Bachelor's/Master's in Engineering, Business Administration, or related fields. Certifications in Product Management are beneficial. Experience in technology or the family's manufacturing business can be advantageous.",
      careerPath: "Associate Product Manager → Product Manager → Senior Product Manager → Group Product Manager → Director of Product Management",
      cities: "Bangalore, Mumbai, Delhi NCR, Pune",
      workEnvironment: "Primarily office-based, with potential for hybrid or remote work.",
      whyFit: "The combination of high investigative and enterprising interests, good communication skills, and a background in a family business makes this a strong fit. The student's aptitude for pattern recognition and logical reasoning will help in market analysis and strategic decision-making. High openness and conscientiousness are valuable for innovation and diligent execution.",
      alternatives: "Project Manager, Business Development Manager, Marketing Manager"
    },
    {
      jobTitle: "User Experience (UX) Designer",
      industry: "IT, E-commerce, Design Agencies, Marketing",
      jobDuties: "Conduct user research to understand user needs and behaviors. Create wireframes, prototypes, and mockups of user interfaces. Design user-centered and intuitive digital experiences. Collaborate with developers and visual designers to implement designs.",
      keySkills: "User Research, Wireframing, Prototyping, Visual Design, Interaction Design, Communication, Empathy",
      salary: "₹5–7 Lakhs (Entry-level), ₹10–15 Lakhs (Mid-level), ₹20+ Lakhs (Senior-level)",
      education: "Bachelor's/Master's in Design, Human-Computer Interaction, or related fields. Certifications in UX Design are beneficial. Online courses and bootcamps are also viable options.",
      careerPath: "Junior UX Designer → UX Designer → Senior UX Designer → Lead UX Designer → UX Director",
      cities: "Bangalore, Mumbai, Delhi NCR, Pune, Hyderabad",
      workEnvironment: "Primarily office-based, with potential for hybrid or remote work.",
      whyFit: "The combination of artistic inclination, investigative interests, and strong interpersonal skills aligns well with UX design. Spatial reasoning abilities are crucial for designing effective interfaces. High openness to experience promotes creative problem-solving and innovative design thinking.",
      alternatives: "UI Designer, Interaction Designer, Web Designer"
    }
  ];

  const report = generateCareerReport({
    studentName: "Priya Sharma",
    tier: "Paid",
    date: new Date().toISOString().split('T')[0],
    summary,
    recommendations,
  });

  return NextResponse.json(report);
}