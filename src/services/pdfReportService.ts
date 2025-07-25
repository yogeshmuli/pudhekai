import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function generateCareerReportPdf(): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size

  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontSize = 24;

  page.drawText('PudheKai Career Report', {
    x: 50,
    y: 780,
    size: fontSize,
    font,
    color: rgb(0.1, 0.7, 0.67),
  });

  page.drawText('Student: Priya Sharma', { x: 50, y: 740, size: 16 });
  page.drawText('Tier: Paid', { x: 50, y: 720, size: 16 });
  page.drawText('Date: 2024-01-15', { x: 50, y: 700, size: 16 });

  page.drawText('Summary:', { x: 50, y: 670, size: 18, font });
  page.drawText('You are collaborative, open to new experiences, and value honesty.', { x: 50, y: 650, size: 14 });

  // Add more hardcoded content as needed...

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
} 