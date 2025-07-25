import { NextResponse } from 'next/server';
import { generateCareerReportPdf } from '@app/services/pdfReportService';
import { generateCareerReport } from '@app/services/reportService';
import { getUserFromRequest } from '@app/utils/getUserFromRequest';
import { db } from '@app/services/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

/**
 * @swagger
 * /api/report/download:
 *   get:
 *     summary: Download career assessment report as PDF
 *     tags:
 *       - Report Generation
 *     responses:
 *       200:
 *         description: PDF file containing the career assessment report
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
export async function GET(request: Request) {
  const uid = await getUserFromRequest(request);
  if (!uid) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  // Fetch user info
  const userDoc = await getDoc(doc(db, "users", uid));
  if (!userDoc.exists()) {
    return new NextResponse(JSON.stringify({ error: 'Report not found' }), { status: 404 });
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

  const pdfBytes = await generateCareerReportPdf(report);

  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="career-report.pdf"',
      'Content-Length': pdfBytes.length.toString(),
    },
  });
} 