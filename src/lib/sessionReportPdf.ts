import jsPDF from 'jspdf';
import { Tables } from '@/integrations/supabase/types';

type AssessmentSession = Tables<'assessment_sessions'>;
type AssessmentAnswer = Tables<'assessment_answers'>;

const skillRows = [
  ['辨別', 'score_recognizing'],
  ['理解', 'score_understanding'],
  ['標記', 'score_labeling'],
  ['表達', 'score_expressing'],
  ['調節', 'score_regulating'],
] as const;

export function downloadSessionReportPdf(session: AssessmentSession, answers: AssessmentAnswer[] = []) {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 16;
  let y = 18;

  pdf.setFillColor(255, 240, 235);
  pdf.rect(0, 0, pageWidth, 38, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(20);
  pdf.setTextColor(70, 55, 45);
  pdf.text('Emotion MUSCLE UP', margin, y);
  y += 9;
  pdf.setFontSize(12);
  pdf.setTextColor(110, 90, 80);
  pdf.text('Student Assessment Report', margin, y);

  y = 50;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.setTextColor(45, 45, 45);
  pdf.text('Student Summary', margin, y);
  y += 9;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  const infoRows = [
    ['Student', session.student_name],
    ['Class', session.student_class || '-'],
    ['School', session.school_name || '-'],
    ['Completed', session.completed_at ? new Date(session.completed_at).toLocaleString('zh-HK') : '-'],
    ['Total Score', session.total_score !== null ? `${session.total_score}%` : '-'],
  ];

  infoRows.forEach(([label, value]) => {
    pdf.text(`${label}: ${value}`, margin, y);
    y += 7;
  });

  y += 5;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text('Skill Scores', margin, y);
  y += 9;

  pdf.setFontSize(10);
  skillRows.forEach(([label, key]) => {
    const value = session[key];
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${label}`, margin, y);
    pdf.setFont('helvetica', 'bold');
    pdf.text(value !== null ? `${value}%` : '-', pageWidth - margin - 18, y);
    y += 7;
  });

  y += 5;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text('Answer Records', margin, y);
  y += 8;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  if (answers.length === 0) {
    pdf.text('No detailed answers available.', margin, y);
  } else {
    answers.forEach((answer, index) => {
      if (y > 270) {
        pdf.addPage();
        y = 18;
      }
      const line = `Q${index + 1}: ${answer.selected_option_text} (${answer.score}/${answer.max_score})`;
      pdf.text(line.slice(0, 95), margin, y);
      y += 6;
    });
  }

  pdf.setFontSize(8);
  pdf.setTextColor(140, 140, 140);
  pdf.text('For educational reference only. Not a psychological diagnosis.', margin, 288);

  const safeName = session.student_name.replace(/[\\/:*?"<>|]/g, '_');
  pdf.save(`Emotion_MUSCLE_UP_${safeName}.pdf`);
}
