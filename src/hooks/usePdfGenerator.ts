import { useCallback, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { AssessmentResult } from '@/hooks/useAssessment';
import { skillInfo } from '@/data/questions';
import { useLanguage } from '@/contexts/LanguageContext';

export function usePdfGenerator() {
  const resultRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  const generatePdf = useCallback(async (result: AssessmentResult) => {
    if (!resultRef.current) return;

    const isEnglish = language === 'en';
    const element = resultRef.current;
    
    // Create canvas from the result section for charts (captures Chinese correctly)
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);

    // Header
    pdf.setFillColor(255, 240, 235);
    pdf.rect(0, 0, pageWidth, 45, 'F');
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(24);
    pdf.setTextColor(80, 60, 50);
    pdf.text(isEnglish ? 'Emotion MUSCLE UP' : 'Emotion MUSCLE UP', margin, 25);
    
    pdf.setFontSize(14);
    pdf.setTextColor(120, 100, 90);
    pdf.text(
      isEnglish ? "Children's Emotional Skills Assessment Report" : "Children's Emotional Skills Report",
      margin, 35
    );

    // Student Info
    let yPos = 55;
    pdf.setFillColor(250, 250, 252);
    pdf.roundedRect(margin, yPos - 5, contentWidth, 25, 3, 3, 'F');
    
    pdf.setFontSize(11);
    pdf.setTextColor(60, 60, 60);
    pdf.text(
      isEnglish ? `Student Name: ${result.studentName}` : `Student Name: ${result.studentName}`,
      margin + 5, yPos + 5
    );
    pdf.text(
      isEnglish 
        ? `Test Date: ${result.completedAt.toLocaleDateString('en-US')}` 
        : `Test Date: ${result.completedAt.toLocaleDateString('en-US')}`,
      margin + 5, yPos + 14
    );
    
    yPos += 35;

    // Skills Section Title
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(80, 60, 50);
    pdf.text(isEnglish ? 'Five Core Skills Assessment' : 'Five Core Skills Assessment', margin, yPos);
    yPos += 10;

    // Skills bars
    const skillColors: Record<string, [number, number, number]> = {
      recognizing: [236, 72, 153],
      understanding: [59, 130, 246],
      labeling: [245, 158, 11],
      expressing: [167, 139, 250],
      regulating: [34, 197, 94],
    };

    result.skillScores.forEach((score) => {
      const info = skillInfo[score.skill];
      const color = skillColors[score.skill];
      
      // Skill name (use English only to avoid encoding issues)
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(80, 80, 80);
      pdf.text(info.nameEn, margin, yPos);
      
      // Percentage
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${score.percentage}%`, pageWidth - margin - 10, yPos);
      
      // Background bar
      yPos += 3;
      pdf.setFillColor(240, 240, 240);
      pdf.roundedRect(margin, yPos, contentWidth - 20, 5, 2, 2, 'F');
      
      // Progress bar
      pdf.setFillColor(color[0], color[1], color[2]);
      const barWidth = ((contentWidth - 20) * score.percentage) / 100;
      pdf.roundedRect(margin, yPos, barWidth, 5, 2, 2, 'F');
      
      yPos += 12;
    });

    yPos += 5;

    // Ability Levels Title
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(80, 60, 50);
    pdf.text(isEnglish ? 'Three Key Emotional Abilities' : 'Three Key Emotional Abilities', margin, yPos);
    yPos += 10;

    const levelLabels = isEnglish ? {
      high: 'Strong',
      medium: 'Developing',
      support: 'Needs Support',
    } : {
      high: 'Strong',
      medium: 'Developing',
      support: 'Needs Support',
    };

    result.abilityLevels.forEach((ability) => {
      pdf.setFillColor(250, 250, 252);
      pdf.roundedRect(margin, yPos - 3, contentWidth, 18, 3, 3, 'F');
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.setTextColor(60, 60, 60);
      pdf.text(ability.nameEn, margin + 5, yPos + 5);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text(`${levelLabels[ability.level]} - ${ability.percentage}%`, margin + 5, yPos + 12);
      
      yPos += 22;
    });

    yPos += 10;

    // Encouragement message
    pdf.setFillColor(255, 250, 240);
    pdf.roundedRect(margin, yPos, contentWidth, 35, 3, 3, 'F');
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(100, 80, 60);
    
    const message = isEnglish ? [
      'This is your emotional muscle map! Everyone grows at their own pace.',
      "There's no right or wrong, just different stages of development.",
      'With practice and support, your emotional muscles will get stronger!',
    ] : [
      'This is your emotional muscle map! Everyone grows at their own pace.',
      "There's no right or wrong, just different stages of development.",
      'With practice and support, your emotional muscles will get stronger!',
    ];
    
    message.forEach((line, i) => {
      pdf.text(line, margin + 5, yPos + 8 + (i * 8));
    });

    yPos += 45;

    // Teaching suggestions
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(80, 60, 50);
    pdf.text(isEnglish ? 'Teaching Suggestions' : 'Teaching Suggestions', margin, yPos);
    yPos += 8;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(80, 80, 80);

    const suggestions = isEnglish ? [
      '- Continue emotional learning through workshops, games, and role-playing',
      '- Encourage practicing identifying and expressing emotions daily',
      '- Use mindfulness exercises to help regulate emotions',
      '- Create a safe, accepting environment for sharing feelings',
    ] : [
      '- Continue emotional learning through workshops, games, and role-playing',
      '- Encourage practicing identifying and expressing emotions daily',
      '- Use mindfulness exercises to help regulate emotions',
      '- Create a safe, accepting environment for sharing feelings',
    ];

    suggestions.forEach((suggestion) => {
      pdf.text(suggestion, margin, yPos);
      yPos += 6;
    });

    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(
      isEnglish 
        ? 'Emotion MUSCLE UP Program | This report is for reference only, not a psychological diagnosis'
        : 'Emotion MUSCLE UP Program | This report is for reference only, not a psychological diagnosis',
      margin, pageHeight - 10
    );

    // Save the PDF
    const fileName = isEnglish 
      ? `Emotion_MUSCLE_UP_Report_${result.studentName}_${result.completedAt.toLocaleDateString('en-US').replace(/\//g, '-')}.pdf`
      : `Emotion_MUSCLE_UP_Report_${result.studentName}_${result.completedAt.toLocaleDateString('en-US').replace(/\//g, '-')}.pdf`;
    
    pdf.save(fileName);
  }, [language]);

  return { resultRef, generatePdf };
}
