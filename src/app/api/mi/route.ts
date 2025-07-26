import { NextResponse } from "next/server";
import { getMIResult, UserResponses } from "../../../services/miScoring";
import { getUserFromRequest } from "@app/utils/getUserFromRequest";
import { validateSubscription } from "@app/utils/subscriptionValidation";
import { db } from "@app/services/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

/**
 * @openapi
 * /api/mi:
 *   post:
 *     summary: Calculate Multiple Intelligences (MI) scores
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
 *     responses:
 *       200:
 *         description: MI scores by intelligence type
 */
export async function POST(request: Request) {
  try {
    // Get logged-in user UID
    const uid = await getUserFromRequest(request);
    if (!uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { responses, assessmentType, subscriptionId } = await request.json();
    if (!responses || typeof responses !== "object") {
      return NextResponse.json({ error: "Invalid or missing responses" }, { status: 400 });
    }

    // Validate subscription
    const validation = await validateSubscription(uid, subscriptionId);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 403 });
    }

    const miScores = await getMIResult(responses as UserResponses);

    // Save to Firestore under users/{uid}/assessments
    const assessmentData = {
      type: "mi",
      miScores,
      assessmentType: assessmentType || "free",
      subscriptionId: subscriptionId || null,
      createdAt: serverTimestamp(),
    };
    await addDoc(collection(db, `users/${uid}/assessments`), assessmentData);

    return NextResponse.json({ miScores });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
} 