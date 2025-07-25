import { NextResponse } from 'next/server';
import { generateCareerReport } from '@app/services/reportService';
import { getUserFromRequest } from '@app/utils/getUserFromRequest';
import { db } from '@app/services/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

/**
 * @swagger
 * /api/report:
 *   get:
 *     summary: Generate comprehensive career assessment report
 *     tags:
 *       - Report Generation
 *     responses:
 *       200:
 *         description: Comprehensive career assessment report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Report not found
 *       500:
 *         description: Server error
 */
export async function GET(request: Request) {
  try {
    const uid = await getUserFromRequest(request);
    if (!uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Fetch user info
    const userDoc = await getDoc(doc(db, "users", uid));
    if (!userDoc.exists()) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }
    const user = userDoc.data() as any;
    // Fetch all assessments
    const assessmentsSnap = await getDocs(collection(db, `users/${uid}/assessments`));
    const assessmentsArr = assessmentsSnap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
    // Get latest by type
    const getLatest = (type: string) => {
      const filtered = assessmentsArr.filter(a => a.type === type && a.createdAt?.toDate);
      if (filtered.length > 0) {
        filtered.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
        return filtered[0];
      }
      return null;
    };
    const assessments = {
      hexaco: getLatest("hexaco"),
      riasec: getLatest("riasec"),
      mi: getLatest("mi"),
      family: getLatest("family"),
      aptitude: getLatest("aptitude"),
    };
    // Fetch latest recommendations
    const recosSnap = await getDocs(collection(db, `users/${uid}/recommendations`));
    const recos = recosSnap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
    let recommendations: any[] = [];
    if (recos.length > 0) {
      recos.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
      recommendations = recos[0].recommendations || [];
    }
    // Generate report
    const report = generateCareerReport({ user, assessments, recommendations });
    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}