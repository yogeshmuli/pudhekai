import { NextResponse } from "next/server";
import { getHexacoResult, UserResponses, AssessmentType } from "../../../services/hexacoScoring";

/**
 * @openapi
 * /api/hexaco:
 *   post:
 *     summary: Calculate HEXACO trait scores
 *     tags:
 *       - Assessment & Results
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               responses:
 *                 type: object
 *                 additionalProperties:
 *                   type: integer
 *               assessmentType:
 *                 type: string
 *                 enum: [free, paid]
 *     responses:
 *       200:
 *         description: Trait scores and questions used
 */
export async function POST(request: Request) {
  try {
    const { responses, assessmentType } = await request.json();
    if (!responses || typeof responses !== "object") {
      return NextResponse.json({ error: "Invalid or missing responses" }, { status: 400 });
    }

    const { traitScores, questionsUsed } = await getHexacoResult(
      responses as UserResponses,
      assessmentType as AssessmentType || "free"
    );

    return NextResponse.json({ traitScores, questionsUsed });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
} 