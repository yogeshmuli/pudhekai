import { NextResponse } from "next/server";
import { getUserFromRequest } from "@app/utils/getUserFromRequest";
import { db } from "@app/services/firebase";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { getCareerRecommendations } from "@app/services/careerRecommendations";

const REQUIRED_TYPES = ["hexaco", "riasec", "mi", "family"];

/**
 * @openapi
 * /api/recommendations:
 *   get:
 *     summary: Get career recommendations based on latest user assessments
 *     tags:
 *       - Recommendations
 *     responses:
 *       200:
 *         description: Career recommendations based on latest assessments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recommendations:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Missing required assessment(s)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       401:
 *         description: Unauthorized (no valid auth token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export async function GET(request: Request) {
  try {
    // 1. Get user UID
    const uid = await getUserFromRequest(request);
    if (!uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch all assessments
    const assessmentsSnap = await getDocs(collection(db, `users/${uid}/assessments`));
    const assessments = assessmentsSnap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
    console.log('Fetched assessments:', JSON.stringify(assessments, null, 2));

    // 3. For each required type, select the most recent assessment
    const latestByType: Record<string, any> = {};
    for (const type of REQUIRED_TYPES) {
      const filtered = assessments.filter(a => a.type === type);
      if (filtered.length > 0) {
        // Sort by createdAt, handling both Firestore timestamps and regular dates
        filtered.sort((a, b) => {
          const aTime = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
          const bTime = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
          return bTime.getTime() - aTime.getTime();
        });
        latestByType[type] = filtered[0];
      }
    }

    // 4. Check if any required assessment is missing
    for (const type of REQUIRED_TYPES) {
      if (!latestByType[type]) {
        return NextResponse.json({ error: `Missing assessment: ${type}` }, { status: 400 });
      }
    }

    // 5. Prepare input for recommendation service
    const input = {
      hexaco: latestByType.hexaco.traitScores,
      riasec: latestByType.riasec.categoryScores,
      mi: latestByType.mi.miScores,
      familyContext: latestByType.family.summary,
    };

    // 6. Get recommendations
    const recommendations = await getCareerRecommendations(input);

    // 7. Save recommendations to Firestore
    const tier = latestByType.hexaco?.assessmentType || "Free";
    await addDoc(collection(db, `users/${uid}/recommendations`), {
      recommendations,
      tier,
      createdAt: serverTimestamp(),
      inputAssessments: {
        hexaco: latestByType.hexaco?.id,
        riasec: latestByType.riasec?.id,
        mi: latestByType.mi?.id,
        family: latestByType.family?.id,
      },
    });

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Recommendations error:', error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
