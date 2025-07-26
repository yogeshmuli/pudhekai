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

  // HEXACO Personality Interpretations
  let y = 600;
  if (report.summary.hexacoInterpretation) {
    page.drawText('Personality Analysis (HEXACO):', { x: 50, y, size: 14, font });
    y -= 20;
    
    const hexaco = report.summary.hexacoInterpretation;
    
    if (hexaco.overallSummary) {
      page.drawText('Overall Summary:', { x: 55, y, size: 12, font, color: rgb(0.1, 0.7, 0.67) });
      y -= 15;
      page.drawText(hexaco.overallSummary, { x: 60, y, size: 11, font: fontRegular, maxWidth: 475 });
      y -= 20;
    }
    
    if (hexaco.personalityProfile) {
      page.drawText('Personality Profile:', { x: 55, y, size: 12, font, color: rgb(0.1, 0.7, 0.67) });
      y -= 15;
      page.drawText(hexaco.personalityProfile, { x: 60, y, size: 11, font: fontRegular, maxWidth: 475 });
      y -= 20;
    }
    
    if (hexaco.keyStrengths && hexaco.keyStrengths.length > 0) {
      page.drawText('Key Strengths:', { x: 55, y, size: 12, font, color: rgb(0.1, 0.7, 0.67) });
      y -= 15;
      page.drawText(hexaco.keyStrengths.join(', '), { x: 60, y, size: 11, font: fontRegular, maxWidth: 475 });
      y -= 20;
    }
    
    if (hexaco.areasForGrowth && hexaco.areasForGrowth.length > 0) {
      page.drawText('Areas for Growth:', { x: 55, y, size: 12, font, color: rgb(0.1, 0.7, 0.67) });
      y -= 15;
      page.drawText(hexaco.areasForGrowth.join(', '), { x: 60, y, size: 11, font: fontRegular, maxWidth: 475 });
      y -= 20;
    }
    
    if (hexaco.careerImplications && hexaco.careerImplications.length > 0) {
      page.drawText('Career Implications:', { x: 55, y, size: 12, font, color: rgb(0.1, 0.7, 0.67) });
      y -= 15;
      page.drawText(hexaco.careerImplications.join(', '), { x: 60, y, size: 11, font: fontRegular, maxWidth: 475 });
      y -= 20;
    }
    
    if (hexaco.leadershipStyle) {
      page.drawText('Leadership Style:', { x: 55, y, size: 12, font, color: rgb(0.1, 0.7, 0.67) });
      y -= 15;
      page.drawText(hexaco.leadershipStyle, { x: 60, y, size: 11, font: fontRegular, maxWidth: 475 });
      y -= 20;
    }
    
    if (hexaco.workStyle) {
      page.drawText('Work Style:', { x: 55, y, size: 12, font, color: rgb(0.1, 0.7, 0.67) });
      y -= 15;
      page.drawText(hexaco.workStyle, { x: 60, y, size: 11, font: fontRegular, maxWidth: 475 });
      y -= 20;
    }
    
    if (hexaco.communicationStyle) {
      page.drawText('Communication Style:', { x: 55, y, size: 12, font, color: rgb(0.1, 0.7, 0.67) });
      y -= 15;
      page.drawText(hexaco.communicationStyle, { x: 60, y, size: 11, font: fontRegular, maxWidth: 475 });
      y -= 20;
    }
    
    if (hexaco.teamDynamics) {
      page.drawText('Team Dynamics:', { x: 55, y, size: 12, font, color: rgb(0.1, 0.7, 0.67) });
      y -= 15;
      page.drawText(hexaco.teamDynamics, { x: 60, y, size: 11, font: fontRegular, maxWidth: 475 });
      y -= 20;
    }
    
    if (hexaco.stressManagement) {
      page.drawText('Stress Management:', { x: 55, y, size: 12, font, color: rgb(0.1, 0.7, 0.67) });
      y -= 15;
      page.drawText(hexaco.stressManagement, { x: 60, y, size: 11, font: fontRegular, maxWidth: 475 });
      y -= 20;
    }
    
    if (hexaco.learningApproach) {
      page.drawText('Learning Approach:', { x: 55, y, size: 12, font, color: rgb(0.1, 0.7, 0.67) });
      y -= 15;
      page.drawText(hexaco.learningApproach, { x: 60, y, size: 11, font: fontRegular, maxWidth: 475 });
      y -= 20;
    }
  }

  // RIASEC Career Interest Interpretations
  if (report.summary.riasecInterpretation) {
    page.drawText('Career Interest Analysis (RIASEC):', { x: 50, y, size: 14, font });
    y -= 20;
    
    const riasec = report.summary.riasecInterpretation;
    
    if (riasec.overallSummary) {
      page.drawText('Overall Summary:', { x: 55, y, size: 12, font, color: rgb(0.1, 0.7, 0.67) });
      y -= 15;
      page.drawText(riasec.overallSummary, { x: 60, y, size: 11, font: fontRegular, maxWidth: 475 });
      y -= 20;
    }
    
    if (riasec.interestProfile) {
      page.drawText('Interest Profile:', { x: 55, y, size: 12, font, color: rgb(0.1, 0.7, 0.67) });
      y -= 15;
      page.drawText(riasec.interestProfile, { x: 60, y, size: 11, font: fontRegular, maxWidth: 475 });
      y -= 20;
    }
    
    if (riasec.keyStrengths && riasec.keyStrengths.length > 0) {
      page.drawText('Key Strengths:', { x: 55, y, size: 12, font, color: rgb(0.1, 0.7, 0.67) });
      y -= 15;
      page.drawText(riasec.keyStrengths.join(', '), { x: 60, y, size: 11, font: fontRegular, maxWidth: 475 });
      y -= 20;
    }
    
    if (riasec.areasForGrowth && riasec.areasForGrowth.length > 0) {
      page.drawText('Areas for Growth:', { x: 55, y, size: 12, font, color: rgb(0.1, 0.7, 0.67) });
      y -= 15;
      page.drawText(riasec.areasForGrowth.join(', '), { x: 60, y, size: 11, font: fontRegular, maxWidth: 475 });
      y -= 20;
    }
    
    if (riasec.careerImplications && riasec.careerImplications.length > 0) {
      page.drawText('Career Implications:', { x: 55, y, size: 12, font, color: rgb(0.1, 0.7, 0.67) });
      y -= 15;
      page.drawText(riasec.careerImplications.join(', '), { x: 60, y, size: 11, font: fontRegular, maxWidth: 475 });
      y -= 20;
    }
    
    if (riasec.suggestedCareers && riasec.suggestedCareers.length > 0) {
      page.drawText('Suggested Careers:', { x: 55, y, size: 12, font, color: rgb(0.1, 0.7, 0.67) });
      y -= 15;
      page.drawText(riasec.suggestedCareers.join(', '), { x: 60, y, size: 11, font: fontRegular, maxWidth: 475 });
      y -= 20;
    }
    
    if (riasec.workStyle) {
      page.drawText('Work Style:', { x: 55, y, size: 12, font, color: rgb(0.1, 0.7, 0.67) });
      y -= 15;
      page.drawText(riasec.workStyle, { x: 60, y, size: 11, font: fontRegular, maxWidth: 475 });
      y -= 20;
    }
    
    if (riasec.learningApproach) {
      page.drawText('Learning Approach:', { x: 55, y, size: 12, font, color: rgb(0.1, 0.7, 0.67) });
      y -= 15;
      page.drawText(riasec.learningApproach, { x: 60, y, size: 11, font: fontRegular, maxWidth: 475 });
      y -= 20;
    }
  }

  // MI Intelligence Interpretations
  if (report.summary.miInterpretation) {
    page.drawText('Multiple Intelligences Analysis:', { x: 50, y, size: 14, font });
    y -= 20;
    
    const mi = report.summary.miInterpretation;
    
    if (mi.overallSummary) {
      page.drawText('Overall Summary:', { x: 55, y, size: 12, font, color: rgb(0.1, 0.7, 0.67) });
      y -= 15;
      page.drawText(mi.overallSummary, { x: 60, y, size: 11, font: fontRegular, maxWidth: 475 });
      y -= 20;
    }
    
    if (mi.intelligenceProfile) {
      page.drawText('Intelligence Profile:', { x: 55, y, size: 12, font, color: rgb(0.1, 0.7, 0.67) });
      y -= 15;
      page.drawText(mi.intelligenceProfile, { x: 60, y, size: 11, font: fontRegular, maxWidth: 475 });
      y -= 20;
    }
    
    if (mi.keyStrengths && mi.keyStrengths.length > 0) {
      page.drawText('Key Strengths:', { x: 55, y, size: 12, font, color: rgb(0.1, 0.7, 0.67) });
      y -= 15;
      page.drawText(mi.keyStrengths.join(', '), { x: 60, y, size: 11, font: fontRegular, maxWidth: 475 });
      y -= 20;
    }
    
    if (mi.areasForGrowth && mi.areasForGrowth.length > 0) {
      page.drawText('Areas for Growth:', { x: 55, y, size: 12, font, color: rgb(0.1, 0.7, 0.67) });
      y -= 15;
      page.drawText(mi.areasForGrowth.join(', '), { x: 60, y, size: 11, font: fontRegular, maxWidth: 475 });
      y -= 20;
    }
    
    if (mi.careerImplications && mi.careerImplications.length > 0) {
      page.drawText('Career Implications:', { x: 55, y, size: 12, font, color: rgb(0.1, 0.7, 0.67) });
      y -= 15;
      page.drawText(mi.careerImplications.join(', '), { x: 60, y, size: 11, font: fontRegular, maxWidth: 475 });
      y -= 20;
    }
    
    if (mi.suggestedCareers && mi.suggestedCareers.length > 0) {
      page.drawText('Suggested Careers:', { x: 55, y, size: 12, font, color: rgb(0.1, 0.7, 0.67) });
      y -= 15;
      page.drawText(mi.suggestedCareers.join(', '), { x: 60, y, size: 11, font: fontRegular, maxWidth: 475 });
      y -= 20;
    }
    
    if (mi.learningStrategies && mi.learningStrategies.length > 0) {
      page.drawText('Learning Strategies:', { x: 55, y, size: 12, font, color: rgb(0.1, 0.7, 0.67) });
      y -= 15;
      page.drawText(mi.learningStrategies.join(', '), { x: 60, y, size: 11, font: fontRegular, maxWidth: 475 });
      y -= 20;
    }
  }

  // Aptitude Cognitive Interpretations
  if (report.summary.aptitudeInterpretation) {
    page.drawText('Cognitive Aptitude Analysis:', { x: 50, y, size: 14, font });
    y -= 20;
    
    const aptitude = report.summary.aptitudeInterpretation;
    
    if (aptitude.overallSummary) {
      page.drawText('Overall Summary:', { x: 55, y, size: 12, font, color: rgb(0.1, 0.7, 0.67) });
      y -= 15;
      page.drawText(aptitude.overallSummary, { x: 60, y, size: 11, font: fontRegular, maxWidth: 475 });
      y -= 20;
    }
    
    if (aptitude.aptitudeProfile) {
      page.drawText('Aptitude Profile:', { x: 55, y, size: 12, font, color: rgb(0.1, 0.7, 0.67) });
      y -= 15;
      page.drawText(aptitude.aptitudeProfile, { x: 60, y, size: 11, font: fontRegular, maxWidth: 475 });
      y -= 20;
    }
    
    if (aptitude.keyStrengths && aptitude.keyStrengths.length > 0) {
      page.drawText('Key Strengths:', { x: 55, y, size: 12, font, color: rgb(0.1, 0.7, 0.67) });
      y -= 15;
      page.drawText(aptitude.keyStrengths.join(', '), { x: 60, y, size: 11, font: fontRegular, maxWidth: 475 });
      y -= 20;
    }
    
    if (aptitude.areasForGrowth && aptitude.areasForGrowth.length > 0) {
      page.drawText('Areas for Growth:', { x: 55, y, size: 12, font, color: rgb(0.1, 0.7, 0.67) });
      y -= 15;
      page.drawText(aptitude.areasForGrowth.join(', '), { x: 60, y, size: 11, font: fontRegular, maxWidth: 475 });
      y -= 20;
    }
    
    if (aptitude.careerImplications && aptitude.careerImplications.length > 0) {
      page.drawText('Career Implications:', { x: 55, y, size: 12, font, color: rgb(0.1, 0.7, 0.67) });
      y -= 15;
      page.drawText(aptitude.careerImplications.join(', '), { x: 60, y, size: 11, font: fontRegular, maxWidth: 475 });
      y -= 20;
    }
    
    if (aptitude.suggestedCareers && aptitude.suggestedCareers.length > 0) {
      page.drawText('Suggested Careers:', { x: 55, y, size: 12, font, color: rgb(0.1, 0.7, 0.67) });
      y -= 15;
      page.drawText(aptitude.suggestedCareers.join(', '), { x: 60, y, size: 11, font: fontRegular, maxWidth: 475 });
      y -= 20;
    }
    
    if (aptitude.learningStrategies && aptitude.learningStrategies.length > 0) {
      page.drawText('Learning Strategies:', { x: 55, y, size: 12, font, color: rgb(0.1, 0.7, 0.67) });
      y -= 15;
      page.drawText(aptitude.learningStrategies.join(', '), { x: 60, y, size: 11, font: fontRegular, maxWidth: 475 });
      y -= 20;
    }
  }

  // Assessment Summary (other assessments)
  page.drawText('Other Assessment Results:', { x: 50, y, size: 14, font });
  y -= 20;
  page.drawText(`Family Context: ${report.summary.familyContext}`, { x: 55, y, size: 12, font: fontRegular, maxWidth: 480 });
  y -= 20;

  // Strengths and Areas for Improvement
  if (report.summary.strengths && report.summary.strengths.length > 0) {
    page.drawText('Key Strengths:', { x: 50, y, size: 14, font });
    y -= 20;
    for (const strength of report.summary.strengths.slice(0, 5)) {
      page.drawText(`• ${strength}`, { x: 55, y, size: 12, font: fontRegular, maxWidth: 480 });
      y -= 15;
    }
    y -= 10;
  }

  if (report.summary.improvements && report.summary.improvements.length > 0) {
    page.drawText('Areas for Growth:', { x: 50, y, size: 14, font });
    y -= 20;
    for (const improvement of report.summary.improvements.slice(0, 3)) {
      page.drawText(`• ${improvement}`, { x: 55, y, size: 12, font: fontRegular, maxWidth: 480 });
      y -= 15;
    }
    y -= 10;
  }

  // Recommendations
  page.drawText('Career Recommendations:', { x: 50, y, size: 14, font });
  y -= 20;
  for (const rec of report.recommendations.slice(0, 3)) { // Show top 3 for brevity
    page.drawText(`- ${rec.jobTitle}: ${rec.whyFit}`, { x: 55, y, size: 12, font: fontRegular, maxWidth: 480 });
    y -= 20;
  }

  // Next Steps
  page.drawText('Next Steps:', { x: 50, y, size: 14, font });
  y -= 20;
  for (const step of report.nextSteps) {
    page.drawText(`- ${step}`, { x: 55, y, size: 12, font: fontRegular, maxWidth: 480 });
    y -= 15;
  }

  // Disclaimer
  page.drawText('Disclaimer:', { x: 50, y, size: 12, font });
  page.drawText(report.disclaimer, { x: 50, y: y - 15, size: 10, font: fontRegular, maxWidth: 495 });

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