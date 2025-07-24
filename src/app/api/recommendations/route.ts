import { NextRequest, NextResponse } from 'next/server';
import { getCareerRecommendations, CareerAssessmentInput } from '../../../services/recommendationsOpenAI';
import { getCareerRecommendationsGemini, parseGeminiRecommendations } from '../../../services/recommendationsGemini';
/**
 * @openapi
 * /api/recommendations:
 *   post:
 *     summary: Get career recommendations based on assessment results
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hexaco:
 *                 type: object
 *                 additionalProperties:
 *                   type: number
 *               riasec:
 *                 type: object
 *                 additionalProperties:
 *                   type: number
 *               mi:
 *                 type: object
 *                 additionalProperties:
 *                   type: number
 *               familyContext:
 *                 type: string
 *               aptitude:
 *                 type: object
 *                 description: Aptitude test results (required for paid tier)
 *                 properties:
 *                   categories:
 *                     type: object
 *                     additionalProperties:
 *                       type: object
 *                       properties:
 *                         correct:
 *                           type: number
 *                         total:
 *                           type: number
 *                         percent:
 *                           type: number
 *                         label:
 *                           type: string
 *                   totalScore:
 *                     type: number
 *                   totalQuestions:
 *                     type: number
 *                   totalPercent:
 *                     type: number
 *                   summary:
 *                     type: string
 *               isPaidTier:
 *                 type: boolean
 *                 description: Whether the user has paid tier access
 *               provider:
 *                 type: string
 *                 enum: [openai, gemini]
 *     responses:
 *       200:
 *         description: Career recommendations
 *       400:
 *         description: Incomplete assessment data or missing aptitude for paid tier
 */
// POST /api/recommendations
export async function POST(req: NextRequest) {
  try {
    const input = await req.json();

    // Validate input
    if (!input.hexaco || !input.riasec || !input.mi || !input.familyContext) {
      return NextResponse.json({ error: 'Incomplete assessment data.' }, { status: 400 });
    }

    // Validate aptitude data for paid tier
    if (input.isPaidTier && !input.aptitude) {
      return NextResponse.json({ 
        error: 'Aptitude test results are required for paid tier recommendations.' 
      }, { status: 400 });
    }

    let recommendations;
    if (input.provider === 'gemini') {
      const raw = await getCareerRecommendationsGemini(input);
      recommendations = parseGeminiRecommendations(raw);
    } else {
      recommendations = await getCareerRecommendations(input);
    }

    return NextResponse.json({ recommendations });
  } catch (error: any) {
    console.error('Career Recommendation Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to get career recommendations' },
      { status: 500 }
    );
  }
}