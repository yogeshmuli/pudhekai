import { NextResponse } from 'next/server';
import { generateCareerReportPdf } from '@app/services/pdfReportService';

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
export async function GET() {
  const pdfBytes = await generateCareerReportPdf();

  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="career-report.pdf"',
    },
  });
} 