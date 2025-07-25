import { NextResponse } from "next/server";
import { summarizeFamilyProfile, FamilyContextResponse } from "../../../services/familyScoring";
import { getUserFromRequest } from "@app/utils/getUserFromRequest";
import { validateSubscription } from "@app/utils/subscriptionValidation";
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

    const { responses, subscriptionId } = await request.json();
    if (!responses || typeof responses !== "object") {
      return NextResponse.json({ error: "Invalid or missing responses" }, { status: 400 });
    }

    // Validate subscription (subscriptionId can be null for free tier)
    const validation = await validateSubscription(uid, subscriptionId);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 403 });
    }

    const summary = summarizeFamilyProfile(responses as FamilyContextResponse);

    // Save to Firestore under users/{uid}/assessments
    const assessmentData = {
      type: "family",
      summary,
      subscriptionId: subscriptionId || validation.subscription?.id || null,
      createdAt: serverTimestamp(),
    };
    await addDoc(collection(db, `users/${uid}/assessments`), assessmentData);

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error in family assessment submission:', error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
} 