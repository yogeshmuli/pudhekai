import { NextResponse } from 'next/server';
import { generateCareerReport } from '@app/services/reportService';
import { getUserFromRequest } from '@app/utils/getUserFromRequest';
import { db } from '@app/services/firebase';
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';

/**
 * @swagger
 * /api/report:
 *   get:
 *     summary: Generate comprehensive career assessment report for a subscription
 *     tags:
 *       - Report Generation
 *     parameters:
 *       - in: query
 *         name: subscription
 *         schema:
 *           type: string
 *         required: true
 *         description: Subscription ID to generate report for
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

    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get('subscription');
    
    if (!subscriptionId) {
      return NextResponse.json({ error: 'Subscription ID is required' }, { status: 400 });
    }

    // Fetch user info
    const userDoc = await getDoc(doc(db, "users", uid));
    if (!userDoc.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const user = userDoc.data() as any;

    // Fetch subscription details
    const subscriptionDoc = await getDoc(doc(db, `users/${uid}/subscriptions`, subscriptionId));
    if (!subscriptionDoc.exists()) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }
    const subscription = subscriptionDoc.data() as any;

    // Fetch all assessments for this subscription
    const assessmentsSnap = await getDocs(
      query(
        collection(db, `users/${uid}/assessments`),
        where("subscriptionId", "==", subscriptionId)
      )
    );
    
    const assessmentsArr = assessmentsSnap.docs.map(doc => ({ 
      id: doc.id, 
      ...(doc.data() as any) 
    }));

    // Group assessments by type and get the latest for each
    const getLatest = (type: string) => {
      const filtered = assessmentsArr.filter(a => a.type === type);
      if (filtered.length > 0) {
        filtered.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });
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

    // Fetch recommendations for this subscription
    const recosSnap = await getDocs(
      query(
        collection(db, `users/${uid}/recommendations`),
        where("subscriptionId", "==", subscriptionId)
      )
    );
    
    const recos = recosSnap.docs.map(doc => ({ 
      id: doc.id, 
      ...(doc.data() as any) 
    }));
    
    let recommendations: any[] = [];
    if (recos.length > 0) {
      recos.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
      recommendations = recos[0].recommendations || [];
    }

    // Generate comprehensive report
    const report = generateCareerReport({ 
      user, 
      assessments, 
      recommendations,
      subscription 
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error('Report generation error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}