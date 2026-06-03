import jsPDF from 'jspdf';
import { Tables } from '@/integrations/supabase/types';

type AssessmentSession = Tables<'assessment_sessions'>;
type AssessmentAnswer = Tables<'assessment_answers'>;

type SkillKey =
  | 'score_recognizing'
  | 'score_understanding'
  | 'score_labeling'
  | 'score_expressing'
  | 'score_regulating';

const skillRows: Array<{ label: string; key: SkillKey; color: string }> = [
  { label: '辨別', key: 'score_recognizing', color: '#ec4899' },
  { label: '理解', key: 'score_understanding', color: '#3b82f6' },
  { label: '標記', key: 'score_labeling', color: '#f59e0b' },
  { label: '表達', key: 'score_expressing', color: '#a78bfa' },
  { label: '調節', key: 'score_regulating', color: '#22c55e' },
];

const page = {
  width: 1240,
  height: 1754,
  margin: 90,
  footerY: 1680,
};

const fontFamily = '"Nunito", "PingFang TC", "Microsoft JhengHei", "Noto Sans CJK TC", sans-serif';

function safeText(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === '') return '-';
  return String(value);
}

function formatDate(value: string | null) {
  if (!value) return '-';
  return new Date(value).toLocaleString('zh-HK', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const paragraphs = text.split('\n');
  let currentY = y;

  paragraphs.forEach((paragraph) => {
    let line = '';
    Array.from(paragraph).forEach((char) => {
      const testLine = `${line}${char}`;
      if (line && ctx.measureText(testLine).width > maxWidth) {
        ctx.fillText(line, x, currentY);
        currentY += lineHeight;
        line = char;
      } else {
        line = testLine;
      }
    });

    ctx.fillText(line, x, currentY);
    currentY += lineHeight;
  });

  return currentY;
}

function createReportPage() {
  const canvas = document.createElement('canvas');
  canvas.width = page.width;
  canvas.height = page.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Cannot create PDF canvas');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, page.width, page.height);

  return { canvas, ctx };
}

function drawHeader(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#fff0eb';
  ctx.fillRect(0, 0, page.width, 230);

  ctx.fillStyle = '#46372d';
  ctx.font = `700 42px ${fontFamily}`;
  ctx.fillText('Emotion MUSCLE UP', page.margin, 108);

  ctx.fillStyle = '#6e5a50';
  ctx.font = `700 24px ${fontFamily}`;
  ctx.fillText('學生情緒能力評估報告', page.margin, 158);
}

function drawFooter(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#8c8c8c';
  ctx.font = `400 18px ${fontFamily}`;
  ctx.fillText('僅供教育參考，並非心理診斷。', page.margin, page.footerY);
}

function addPageToPdf(pdf: jsPDF, canvas: HTMLCanvasElement, pageIndex: number) {
  if (pageIndex > 0) pdf.addPage();
  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
}

export function downloadSessionReportPdf(session: AssessmentSession, answers: AssessmentAnswer[] = []) {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  let pageIndex = 0;
  let { canvas, ctx } = createReportPage();
  let y = 300;

  const finishPage = () => {
    drawFooter(ctx);
    addPageToPdf(pdf, canvas, pageIndex);
    pageIndex += 1;
    ({ canvas, ctx } = createReportPage());
    drawHeader(ctx);
    y = 285;
  };

  const ensureSpace = (requiredHeight: number) => {
    if (y + requiredHeight <= page.footerY - 35) return;
    finishPage();
  };

  drawHeader(ctx);

  ctx.fillStyle = '#2d2d2d';
  ctx.font = `700 30px ${fontFamily}`;
  ctx.fillText('學生摘要', page.margin, y);
  y += 52;

  ctx.font = `400 23px ${fontFamily}`;
  const infoRows = [
    ['學生姓名', session.student_name],
    ['年級', session.student_class],
    ['學校', session.school_name],
    ['完成時間', formatDate(session.completed_at)],
    ['總分', session.total_score !== null ? `${session.total_score}%` : '-'],
  ];

  infoRows.forEach(([label, value]) => {
    ctx.fillStyle = '#333333';
    ctx.fillText(`${label}：${safeText(value)}`, page.margin, y);
    y += 42;
  });

  y += 35;
  ctx.fillStyle = '#2d2d2d';
  ctx.font = `700 30px ${fontFamily}`;
  ctx.fillText('五項技能分數', page.margin, y);
  y += 48;

  skillRows.forEach(({ label, key, color }) => {
    ensureSpace(58);
    const value = session[key];

    ctx.fillStyle = '#3f3f46';
    ctx.font = `500 23px ${fontFamily}`;
    ctx.fillText(label, page.margin, y);

    ctx.fillStyle = '#2d2d2d';
    ctx.font = `700 23px ${fontFamily}`;
    ctx.textAlign = 'right';
    ctx.fillText(value !== null ? `${value}%` : '-', page.width - page.margin, y);
    ctx.textAlign = 'left';

    y += 16;
    ctx.fillStyle = '#ededed';
    ctx.beginPath();
    ctx.roundRect(page.margin, y, page.width - page.margin * 2, 12, 6);
    ctx.fill();

    if (value !== null) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(page.margin, y, ((page.width - page.margin * 2) * value) / 100, 12, 6);
      ctx.fill();
    }

    y += 42;
  });

  y += 38;
  ensureSpace(80);
  ctx.fillStyle = '#2d2d2d';
  ctx.font = `700 30px ${fontFamily}`;
  ctx.fillText('答題記錄', page.margin, y);
  y += 48;

  ctx.font = `400 20px ${fontFamily}`;
  if (answers.length === 0) {
    ctx.fillStyle = '#555555';
    ctx.fillText('未有詳細答題記錄。', page.margin, y);
  } else {
    answers.forEach((answer, index) => {
      const answerText = `Q${index + 1}：${safeText(answer.selected_option_text)}（${answer.score}/${answer.max_score}）`;
      const lineCount = Math.max(1, Math.ceil(ctx.measureText(answerText).width / (page.width - page.margin * 2)));
      ensureSpace(lineCount * 31 + 10);

      ctx.fillStyle = '#333333';
      y = drawWrappedText(ctx, answerText, page.margin, y, page.width - page.margin * 2, 31) + 5;
    });
  }

  drawFooter(ctx);
  addPageToPdf(pdf, canvas, pageIndex);

  const safeName = session.student_name.replace(/[\\/:*?"<>|]/g, '_');
  pdf.save(`Emotion_MUSCLE_UP_${safeName}.pdf`);
}
