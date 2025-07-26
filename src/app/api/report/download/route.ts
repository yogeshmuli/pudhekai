import { NextResponse } from 'next/server';
import { generateCareerReportPdf } from '@app/services/pdfReportService';
import { generateCareerReport } from '@app/services/reportService';
import { getUserFromRequest } from '@app/utils/getUserFromRequest';
import { db } from '@app/services/firebase';
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';

/**
 * @swagger
 * /api/report/download:
 *   post:
 *     summary: Download career assessment report as PDF for a subscription
 *     tags:
 *       - Report Generation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subscriptionId:
 *                 type: string
 *                 description: Subscription ID to generate PDF for
 *     responses:
 *       200:
 *         description: PDF file containing the career assessment report
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Report not found
 */
export async function POST(request: Request) {
  try {
    const uid = await getUserFromRequest(request);
    if (!uid) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { subscriptionId } = await request.json();
    
    if (!subscriptionId) {
      return new NextResponse(JSON.stringify({ error: 'Subscription ID is required' }), { status: 400 });
    }

    // Fetch user info
    const userDoc = await getDoc(doc(db, "users", uid));
    if (!userDoc.exists()) {
      return new NextResponse(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }
    const user = userDoc.data() as any;

    // Fetch subscription details
    const subscriptionDoc = await getDoc(doc(db, `users/${uid}/subscriptions`, subscriptionId));
    if (!subscriptionDoc.exists()) {
      return new NextResponse(JSON.stringify({ error: 'Subscription not found' }), { status: 404 });
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
    
    console.log('Report data for PDF:', JSON.stringify(report, null, 2));
    console.log('Report studentName:', report.studentName);
    console.log('Report recommendations length:', report.recommendations?.length);

    const pdfBytes = await generateCareerReportPdf(report);
    
    console.log('PDF bytes length:', pdfBytes.length);
    console.log('PDF bytes (first 100):', pdfBytes.slice(0, 100));

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="pudhekai-report-${subscriptionId}.pdf"`,
        'Content-Length': pdfBytes.length.toString(),
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return new NextResponse(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
} 