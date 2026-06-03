import { useCallback, useRef } from 'react';
import jsPDF from 'jspdf';
import { AssessmentResult } from '@/hooks/useAssessment';
import { SkillType, skillInfo } from '@/data/questions';
import { useLanguage } from '@/contexts/LanguageContext';

const page = {
  width: 1240,
  height: 1754,
  margin: 90,
  footerY: 1680,
};

const fontFamily = '"Nunito", "PingFang TC", "Microsoft JhengHei", "Noto Sans CJK TC", sans-serif';

const skillColors: Record<SkillType, string> = {
  recognizing: '#ec4899',
  understanding: '#3b82f6',
  labeling: '#f59e0b',
  expressing: '#a78bfa',
  regulating: '#22c55e',
};

const levelLabels = {
  high: { zh: '強項', en: 'Strong' },
  medium: { zh: '發展中', en: 'Developing' },
  support: { zh: '需要支援', en: 'Needs Support' },
};

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

function drawHeader(ctx: CanvasRenderingContext2D, isEnglish: boolean) {
  ctx.fillStyle = '#fff0eb';
  ctx.fillRect(0, 0, page.width, 230);

  ctx.fillStyle = '#46372d';
  ctx.font = `700 42px ${fontFamily}`;
  ctx.fillText('Emotion MUSCLE UP', page.margin, 108);

  ctx.fillStyle = '#6e5a50';
  ctx.font = `700 24px ${fontFamily}`;
  ctx.fillText(
    isEnglish ? "Children's Emotional Skills Assessment Report" : '學生情緒能力評估報告',
    page.margin,
    158,
  );
}

function drawFooter(ctx: CanvasRenderingContext2D, isEnglish: boolean) {
  ctx.fillStyle = '#8c8c8c';
  ctx.font = `400 18px ${fontFamily}`;
  ctx.fillText(
    isEnglish
      ? 'For educational reference only. Not a psychological diagnosis.'
      : '僅供教育參考，並非心理診斷。',
    page.margin,
    page.footerY,
  );
}

function addPageToPdf(pdf: jsPDF, canvas: HTMLCanvasElement, pageIndex: number) {
  if (pageIndex > 0) pdf.addPage();
  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
}

function drawSectionTitle(ctx: CanvasRenderingContext2D, title: string, y: number) {
  ctx.fillStyle = '#2d2d2d';
  ctx.font = `700 30px ${fontFamily}`;
  ctx.fillText(title, page.margin, y);
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

export function usePdfGenerator() {
  const resultRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  const generatePdf = useCallback(async (result: AssessmentResult) => {
    const isEnglish = language === 'en';
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const { canvas, ctx } = createReportPage();
    const totalScore = Math.round(
      result.skillScores.reduce((sum, score) => sum + score.percentage, 0) / result.skillScores.length,
    );
    let y = 300;

    drawHeader(ctx, isEnglish);

    drawSectionTitle(ctx, isEnglish ? 'Student Summary' : '學生摘要', y);
    y += 52;

    ctx.fillStyle = '#333333';
    ctx.font = `400 23px ${fontFamily}`;
    const infoRows = [
      [isEnglish ? 'Student Name' : '學生姓名', result.studentName],
      [isEnglish ? 'Completed' : '完成時間', result.completedAt.toLocaleString(isEnglish ? 'en-US' : 'zh-HK')],
      [isEnglish ? 'Overall Score' : '總分', `${totalScore}%`],
    ];
    infoRows.forEach(([label, value]) => {
      ctx.fillText(`${label}: ${value}`, page.margin, y);
      y += 42;
    });

    y += 35;
    drawSectionTitle(ctx, isEnglish ? 'Five Emotional Skills' : '五項情緒技能', y);
    y += 48;

    result.skillScores.forEach((score) => {
      const info = skillInfo[score.skill];
      const label = isEnglish ? info.nameEn : info.name;

      ctx.fillStyle = '#3f3f46';
      ctx.font = `500 23px ${fontFamily}`;
      ctx.fillText(label, page.margin, y);

      ctx.fillStyle = '#2d2d2d';
      ctx.font = `700 23px ${fontFamily}`;
      ctx.textAlign = 'right';
      ctx.fillText(`${score.percentage}%`, page.width - page.margin, y);
      ctx.textAlign = 'left';

      y += 16;
      ctx.fillStyle = '#ededed';
      ctx.beginPath();
      ctx.roundRect(page.margin, y, page.width - page.margin * 2, 12, 6);
      ctx.fill();

      ctx.fillStyle = skillColors[score.skill];
      ctx.beginPath();
      ctx.roundRect(page.margin, y, ((page.width - page.margin * 2) * score.percentage) / 100, 12, 6);
      ctx.fill();
      y += 42;
    });

    y += 38;
    drawSectionTitle(ctx, isEnglish ? 'Three Key Emotional Abilities' : '三大情緒能力', y);
    y += 48;

    result.abilityLevels.forEach((ability) => {
      ctx.fillStyle = '#fafafa';
      ctx.beginPath();
      ctx.roundRect(page.margin, y - 32, page.width - page.margin * 2, 72, 14);
      ctx.fill();

      ctx.fillStyle = '#333333';
      ctx.font = `700 23px ${fontFamily}`;
      ctx.fillText(isEnglish ? ability.nameEn : ability.name, page.margin + 24, y);

      ctx.fillStyle = '#555555';
      ctx.font = `400 20px ${fontFamily}`;
      ctx.fillText(
        `${isEnglish ? levelLabels[ability.level].en : levelLabels[ability.level].zh} - ${ability.percentage}%`,
        page.margin + 24,
        y + 30,
      );

      y += 88;
    });

    y += 25;
    ctx.fillStyle = '#fffaf0';
    ctx.beginPath();
    ctx.roundRect(page.margin, y, page.width - page.margin * 2, 165, 18);
    ctx.fill();

    ctx.fillStyle = '#644f3c';
    ctx.font = `400 22px ${fontFamily}`;
    const message = isEnglish
      ? [
          'This is the student emotional muscle map.',
          'Everyone grows at their own pace. The result shows current learning needs and strengths.',
          'With practice and support, emotional muscles can keep getting stronger.',
        ].join('\n')
      : [
          '這是學生的情緒肌肉地圖。',
          '每位學生都有自己的成長速度，結果可協助老師了解現時的學習需要與強項。',
          '透過課堂活動、工作坊和日常練習，情緒能力可以持續提升。',
        ].join('\n');
    drawWrappedText(ctx, message, page.margin + 30, y + 42, page.width - page.margin * 2 - 60, 34);

    y += 215;
    drawSectionTitle(ctx, isEnglish ? 'Teaching Suggestions' : '教學建議', y);
    y += 45;

    ctx.fillStyle = '#444444';
    ctx.font = `400 21px ${fontFamily}`;
    const suggestions = isEnglish
      ? [
          '- Continue emotional learning through workshops, games, and role-playing.',
          '- Encourage students to identify and express emotions in daily school life.',
          '- Use breathing, pausing, and reflection exercises to support regulation.',
          '- Create a safe and accepting environment for sharing feelings.',
        ]
      : [
          '- 透過工作坊、遊戲及角色扮演延續情緒學習。',
          '- 鼓勵學生在日常校園生活中辨識和表達情緒。',
          '- 運用呼吸、暫停和反思練習，支援學生調節情緒。',
          '- 建立安全、接納的環境，讓學生可以分享感受。',
        ];
    suggestions.forEach((suggestion) => {
      y = drawWrappedText(ctx, suggestion, page.margin, y, page.width - page.margin * 2, 32) + 6;
    });

    drawFooter(ctx, isEnglish);
    addPageToPdf(pdf, canvas, 0);

    const safeName = result.studentName.replace(/[\\/:*?"<>|]/g, '_');
    const date = result.completedAt.toLocaleDateString('en-US').replace(/\//g, '-');
    pdf.save(`Emotion_MUSCLE_UP_Report_${safeName}_${date}.pdf`);
  }, [language]);

  return { resultRef, generatePdf };
}
