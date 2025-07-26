import { NextResponse } from "next/server";
import { getUserFromRequest } from "@app/utils/getUserFromRequest";
import { db } from "@app/services/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

const TEST_TYPES = ["hexaco", "riasec", "mi", "family", "aptitude"];
const SIX_MONTHS_MS = 1000 * 60 * 60 * 24 * 30 * 6;

export async function GET(request: Request) {
  try {
    // 1. Get user UID
    const uid = await getUserFromRequest(request);
    if (!uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch user info
    const userDoc = await getDoc(doc(db, "users", uid));
    const userData = userDoc.exists() ? userDoc.data() : {};

    // 3. Fetch all assessments
    const assessmentsSnap = await getDocs(
      collection(db, `users/${uid}/assessments`)
    );
    const assessments = assessmentsSnap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as any),
    }));

    // 4. Build assessment history and find last taken date per test type
    const history = [];
    const lastTaken: Record<string, Date | null> = {};
    const tierUsed: Record<string, string> = {};
    for (const testType of TEST_TYPES) {
      lastTaken[testType] = null;
      tierUsed[testType] = "Free";
    }
    for (const a of assessments) {
      if (TEST_TYPES.includes(a.type) && a.createdAt?.toDate) {
        const date = a.createdAt.toDate();
        if (!lastTaken[a.type] || date > lastTaken[a.type]!) {
          lastTaken[a.type] = date;
          tierUsed[a.type] = a.assessmentType || "Free";
        }
        history.push({
          type: a.type,
          date: date.toISOString(),
          tier: a.assessmentType || "Free",
        });
      }
    }

    // 5. Calculate eligibility for each test type
    const eligibility: Record<
      string,
      { canTake: boolean; nextAvailable?: string }
    > = {};
    const now = new Date();
    for (const testType of TEST_TYPES) {
      if (!lastTaken[testType]) {
        eligibility[testType] = { canTake: true };
      } else {
        const diff = now.getTime() - lastTaken[testType]!.getTime();
        if (diff >= SIX_MONTHS_MS) {
          eligibility[testType] = { canTake: true };
        } else {
          const nextAvailable = new Date(
            lastTaken[testType]!.getTime() + SIX_MONTHS_MS
          );
          eligibility[testType] = {
            canTake: false,
            nextAvailable: nextAvailable.toISOString(),
          };
        }
      }
    }

    // 6. Compose response
    return NextResponse.json({
      user: {
        uid,
        ...userData,
      },
      assessments: history,
      eligibility,
    });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
