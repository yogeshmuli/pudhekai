import { NextResponse } from "next/server";
import { summarizeFamilyProfile, FamilyContextResponse } from "../../../services/familyScoring";

/**
 * @openapi
 * /api/family:
 *   post:
 *     summary: Summarize family context quiz responses
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
 *                   type: string
 *     responses:
 *       200:
 *         description: Human-readable family context summary
 */
export async function POST(request: Request) {
  try {
    const { responses } = await request.json();
    if (!responses || typeof responses !== "object") {
      return NextResponse.json({ error: "Invalid or missing responses" }, { status: 400 });
    }
    const summary = summarizeFamilyProfile(responses as FamilyContextResponse);
    return NextResponse.json({ summary });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
} 