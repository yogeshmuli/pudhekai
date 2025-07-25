import { NextResponse } from "next/server";
import { summarizeFamilyProfile, FamilyContextResponse } from "../../../services/familyScoring";
import { getUserFromRequest } from "@app/utils/getUserFromRequest";
import { db } from "@app/services/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

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
    // Get logged-in user UID
    const uid = await getUserFromRequest(request);
    if (!uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { responses } = await request.json();
    if (!responses || typeof responses !== "object") {
      return NextResponse.json({ error: "Invalid or missing responses" }, { status: 400 });
    }
    const summary = summarizeFamilyProfile(responses as FamilyContextResponse);

    // Save to Firestore under users/{uid}/assessments
    const assessmentData = {
      type: "family",
      summary,
      createdAt: serverTimestamp(),
    };
    await addDoc(collection(db, `users/${uid}/assessments`), assessmentData);

    return NextResponse.json({ summary });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
} 