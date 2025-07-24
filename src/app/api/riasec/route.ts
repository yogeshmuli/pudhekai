import { NextResponse } from "next/server";
import { getRiasecResult, UserResponses } from "../../../services/riasecScoring";

/**
 * @openapi
 * /api/riasec:
 *   post:
 *     summary: Calculate RIASEC category scores
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
 *         description: Category scores and questions used
 */
export async function POST(request: Request) {
  try {
    const { responses, assessmentType } = await request.json();
    if (!responses || typeof responses !== "object") {
      return NextResponse.json({ error: "Invalid or missing responses" }, { status: 400 });
    }

    const { categoryScores, questionsUsed } = await getRiasecResult(
      responses as UserResponses,
      assessmentType || "free"
    );

    return NextResponse.json({ categoryScores, questionsUsed });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
} 