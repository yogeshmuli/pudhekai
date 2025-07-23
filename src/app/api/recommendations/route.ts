import { NextRequest, NextResponse } from 'next/server';
import { getCareerRecommendations, CareerAssessmentInput } from '../../../services/careerRecommendations';
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
 *     responses:
 *       200:
 *         description: Career recommendations
 */
// POST /api/career-recommendation
export async function POST(req: NextRequest) {
  try {
    const input = (await req.json()) as CareerAssessmentInput;

    // Validate input
    if (!input.hexaco || !input.riasec || !input.mi || !input.familyContext) {
      return NextResponse.json({ error: 'Incomplete assessment data.' }, { status: 400 });
    }

    const recommendations = await getCareerRecommendations(input);

    return NextResponse.json({ recommendations });
  } catch (error: any) {
    console.error('Career Recommendation Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to get career recommendations' },
      { status: 500 }
    );
  }
}