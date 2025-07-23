import { NextRequest, NextResponse } from 'next/server';
import { getCareerRecommendations, CareerAssessmentInput } from '../../../services/careerRecommendations';
import { getCareerRecommendationsGeminiApiKey } from '../../../services/recommendationsGemini';

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
 *               hexaco: { type: object }
 *               riasec: { type: object }
 *               mi: { type: object }
 *               familyContext: { type: string }
 *               provider: { type: string, enum: [openai, gemini] }
 *     responses:
 *       200:
 *         description: Career recommendations
 */
export async function POST(req: NextRequest) {
  try {
    const input = await req.json();

    // Validate input
    if (!input.hexaco || !input.riasec || !input.mi || !input.familyContext) {
      return NextResponse.json({ error: 'Incomplete assessment data.' }, { status: 400 });
    }

    let recommendations;
    if (input.provider === 'gemini') {
      recommendations = await getCareerRecommendationsGeminiApiKey(input);
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