import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { CareerReport } from './reportService';

export async function generateCareerReportPdf(report: CareerReport): Promise<Uint8Array> {
  console.log('Starting PDF generation for report:', report.studentName);
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size

  // Fonts
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Branding Header
  page.drawRectangle({ x: 0, y: 800, width: 595, height: 42, color: rgb(0.11, 0.76, 0.67) });
  page.drawText('PudheKai', {
    x: 50,
    y: 815,
    size: 24,
    font,
    color: rgb(1, 1, 1),
  });
  page.drawText('AI Career Guidance Platform', {
    x: 180,
    y: 820,
    size: 12,
    font: fontRegular,
    color: rgb(1, 1, 1),
  });

  // Report Title
  page.drawText('Career Assessment Report', {
    x: 50,
    y: 780,
    size: 20,
    font,
    color: rgb(0.1, 0.7, 0.67),
  });

  // User Info
  page.drawText(`Student: ${report.studentName}`, { x: 50, y: 750, size: 14, font: fontRegular });
  page.drawText(`Tier: ${report.tier}`, { x: 50, y: 730, size: 14, font: fontRegular });
  page.drawText(`Date: ${report.date}`, { x: 50, y: 710, size: 14, font: fontRegular });

  // Introduction & Guide
  page.drawText('Introduction:', { x: 50, y: 680, size: 14, font });
  page.drawText(report.introduction, { x: 50, y: 665, size: 12, font: fontRegular, maxWidth: 495 });
  page.drawText('How to Read This Report:', { x: 50, y: 640, size: 14, font });
  page.drawText(report.interpretationGuide, { x: 50, y: 625, size: 12, font: fontRegular, maxWidth: 495 });

  // Assessment Summary (example, can be expanded)
  page.drawText('Assessment Summary:', { x: 50, y: 600, size: 14, font });
  page.drawText(`Personality: ${report.summary.traitSummary}`, { x: 50, y: 585, size: 12, font: fontRegular, maxWidth: 495 });
  page.drawText(`Interests: ${report.summary.interestSummary}`, { x: 50, y: 570, size: 12, font: fontRegular, maxWidth: 495 });
  page.drawText(`Intelligence: ${report.summary.intelligenceSummary}`, { x: 50, y: 555, size: 12, font: fontRegular, maxWidth: 495 });
  page.drawText(`Aptitude: ${JSON.stringify(report.summary.aptitudeScores)}`, { x: 50, y: 540, size: 12, font: fontRegular, maxWidth: 495 });
  page.drawText(`Family Context: ${report.summary.familyContext}`, { x: 50, y: 525, size: 12, font: fontRegular, maxWidth: 495 });

  // Recommendations
  page.drawText('Career Recommendations:', { x: 50, y: 500, size: 14, font });
  let y = 485;
  for (const rec of report.recommendations.slice(0, 3)) { // Show top 3 for brevity
    page.drawText(`- ${rec.jobTitle}: ${rec.whyFit}`, { x: 55, y, size: 12, font: fontRegular, maxWidth: 480 });
    y -= 20;
  }

  // Next Steps
  page.drawText('Next Steps:', { x: 50, y: y - 10, size: 14, font });
  y -= 25;
  for (const step of report.nextSteps) {
    page.drawText(`- ${step}`, { x: 55, y, size: 12, font: fontRegular, maxWidth: 480 });
    y -= 15;
  }

  // Disclaimer
  page.drawText('Disclaimer:', { x: 50, y: y - 10, size: 12, font });
  page.drawText(report.disclaimer, { x: 50, y: y - 25, size: 10, font: fontRegular, maxWidth: 495 });

  // Branding Footer
  page.drawRectangle({ x: 0, y: 0, width: 595, height: 32, color: rgb(0.11, 0.76, 0.67) });
  page.drawText('PudheKai | AI-powered career guidance for young minds | www.pudhekai.com', {
    x: 50,
    y: 12,
    size: 10,
    font: fontRegular,
    color: rgb(1, 1, 1),
  });

  const pdfBytes = await pdfDoc.save();
  console.log('PDF generated successfully, size:', pdfBytes.length);
  return pdfBytes;
} 