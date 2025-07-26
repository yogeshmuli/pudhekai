import { NextResponse } from "next/server";
import { getRiasecResult, UserResponses, AssessmentType } from "../../../services/riasecScoring";
import { getUserFromRequest } from "@app/utils/getUserFromRequest";
import { validateSubscription } from "@app/utils/subscriptionValidation";
import { db } from "@app/services/firebase";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";

/**
 * @openapi
 * /api/riasec:
 *   post:
 *     summary: Calculate RIASEC category scores with AI interpretations
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
 *         description: Category scores, interpretations, and questions used
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

    // Fetch user context for better interpretations
    let userContext = undefined;
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        userContext = {
          age: userData.age || undefined,
          gender: userData.gender || undefined,
          currentGrade: userData.currentGrade || undefined,
        };
      }
    } catch (error) {
      console.warn("Could not fetch user context for interpretations:", error);
    }

    const { categoryScores, questionsUsed, interpretation } = await getRiasecResult(
      responses as UserResponses,
      assessmentType as AssessmentType || "free",
      userContext
    );
    
    const assessmentData = {
      type: "riasec",
      categoryScores,
      questionsUsed,
      interpretation, // Store single AI-generated interpretation
      assessmentType: assessmentType || "free",
      subscriptionId: subscriptionId || null,
      createdAt: serverTimestamp(),
    };
    await addDoc(collection(db, `users/${uid}/assessments`), assessmentData);
    
    return NextResponse.json({ categoryScores, questionsUsed, interpretation });
  } catch (error) {
    console.error("RIASEC assessment error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
} 