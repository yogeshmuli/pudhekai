import { NextResponse } from 'next/server';
import { generateCareerReportPdf } from '@app/services/pdfReportService';

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