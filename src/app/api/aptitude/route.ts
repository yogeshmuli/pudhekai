import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import { scoreAptitudeTest } from '../../../services/aptitude Scoring';
import { getUserFromRequest } from '@app/utils/getUserFromRequest';
import { validateSubscription } from '@app/utils/subscriptionValidation';
import { db } from '@app/services/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';

/**
 * @swagger
 * /api/aptitude:
 *   get:
 *     summary: Get all aptitude test questions
 *     tags:
 *       - Assessment & Results
 *     description: Retrieves all aptitude test questions without answer indices for client-side display
 *     responses:
 *       200:
 *         description: List of aptitude questions (without answers)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Unique question identifier
 *                   type:
 *                     type: string
 *                     description: Question category (pattern_recognition, logical_reasoning, numerical_reasoning, critical_reasoning)
 *                   question:
 *                     type: string
 *                     description: The question text
 *                   options:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Available answer options
 *             example:
 *               - id: "pr1"
 *                 type: "pattern_recognition"
 *                 question: "Which number comes next in the series? 2, 4, 8, 16, ___"
 *                 options: ["18", "24", "32", "20"]
 *   post:
 *     summary: Calculate aptitude test score with AI interpretations
 *     description: Calculates and returns the score for aptitude test responses with AI-generated cognitive insights
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
 *                 description: User responses with question ID as key and selected option index as value
 *               assessmentType:
 *                 type: string
 *                 enum: [free, paid]
 *               subscriptionId:
 *                 type: string
 *                 description: Subscription ID for validation
 *           example:
 *             responses:
 *               pr1: 2
 *               lr1: 1
 *               nr1: 3
 *               cr1: 0
 *     responses:
 *       200:
 *         description: Scoring result with category breakdown, overall score, and AI interpretations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: object
 *                   description: Score breakdown by question category
 *                 totalScore:
 *                   type: integer
 *                   description: Total correct answers
 *                 totalQuestions:
 *                   type: integer
 *                   description: Total number of questions
 *                 totalPercent:
 *                   type: integer
 *                   description: Overall percentage score
 *                 summary:
 *                   type: string
 *                   description: Human-readable summary of results
 *                 interpretations:
 *                   type: array
 *                   description: AI-generated cognitive interpretations
 *             example:
 *               categories:
 *                 pattern_recognition:
 *                   correct: 8
 *                   total: 10
 *                   percent: 80
 *                   label: "High"
 *               totalScore: 30
 *               totalQuestions: 40
 *               totalPercent: 75
 *               summary: "pattern recognition: 8/10 (High), logical reasoning: 7/10 (Moderate)"
 *               interpretations: [...]
 */
export async function GET() {
  try {
    const { db } = await import('@app/services/firebase');
    const { collection, getDocs } = await import('firebase/firestore');
    
    const colRef = collection(db, "questions_aptitude");
    const snapshot = await getDocs(colRef);
    const questions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const sanitizedQuestions = questions.map((question: any) => {
      const { answerIndex, ...rest } = question;
      return rest;
    });
    return NextResponse.json(sanitizedQuestions);
  } catch (error) {
    console.error('Error fetching aptitude questions:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Get logged-in user UID
    const uid = await getUserFromRequest(request);
    if (!uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { responses, assessmentType, subscriptionId } = await request.json();
    if (!responses || typeof responses !== 'object') {
      return NextResponse.json({ error: 'Invalid or missing responses' }, { status: 400 });
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

    // Load questionBank from Firebase
    const { collection, getDocs } = await import('firebase/firestore');
    
    const colRef = collection(db, "questions_aptitude");
    const snapshot = await getDocs(colRef);
    const questions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const questionBank = questions.map((q: any) => ({ id: q.id, type: q.type, answerIndex: q.answerIndex }));

    const result = await scoreAptitudeTest(questionBank, responses, userContext);

    // Save to Firestore under users/{uid}/assessments
    const assessmentData = {
      type: 'aptitude',
      categories: result.categories,
      totalScore: result.totalScore,
      totalQuestions: result.totalQuestions,
      totalPercent: result.totalPercent,
      summary: result.summary,
      interpretation: result.interpretation, // Store single AI-generated interpretation
      assessmentType: assessmentType || "free",
      subscriptionId: subscriptionId || null,
      createdAt: serverTimestamp(),
    };
    await addDoc(collection(db, `users/${uid}/assessments`), assessmentData);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Aptitude assessment error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
