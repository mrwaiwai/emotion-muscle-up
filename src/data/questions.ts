// 情緒 MUSCLE UP Assessment Questions
// Configurable question structure for easy modifications
// 題目已簡化，適合小一至小六學生閱讀

export type SkillType = 'recognizing' | 'understanding' | 'labeling' | 'expressing' | 'regulating';

export interface QuestionOption {
  id: string;
  text: string;
  textEn?: string;
  score: number;
  icon?: string;
}

export interface Question {
  id: string;
  type: 'scenario' | 'emotion-image' | 'self-description';
  skill: SkillType;
  questionText: string;
  questionTextEn?: string;
  icon?: string;
  videoUrl?: string;
  options: QuestionOption[];
}

export const skillInfo: Record<SkillType, { name: string; nameEn: string; color: string; description: string }> = {
  recognizing: {
    name: '辨別',
    nameEn: 'Recognizing',
    color: 'emotion-recognizing',
    description: '察覺並辨認自己的情緒和他人的感受',
  },
  understanding: {
    name: '理解',
    nameEn: 'Understanding',
    color: 'emotion-understanding',
    description: '深入了解情緒背後的原因及其影響',
  },
  labeling: {
    name: '標記',
    nameEn: 'Labeling',
    color: 'emotion-labeling',
    description: '準確命名各種情緒，增強表達能力',
  },
  expressing: {
    name: '表達',
    nameEn: 'Expressing',
    color: 'emotion-expressing',
    description: '用適當方式表達情緒，促進有效溝通',
  },
  regulating: {
    name: '調節',
    nameEn: 'Regulating',
    color: 'emotion-regulating',
    description: '掌握調控情緒的方法，在挑戰中保持平衡',
  },
};

export const questions: Question[] = [
  // Recognizing Questions - 辨別
  {
    id: 'r1',
    type: 'scenario',
    skill: 'recognizing',
    questionText: '同學一個人坐喺角落唔出聲，你覺得佢點呀？',
    questionTextEn: '睇吓人哋感受',
    icon: '👀',
    videoUrl: '/videos/q1.mp4',
    options: [
      { id: 'r1a', text: '佢可能唔開心 😢', score: 3 },
      { id: 'r1b', text: '佢想靜吓 🤫', score: 2 },
      { id: 'r1c', text: '我唔知道 🤷', score: 1 },
    ],
  },
  {
    id: 'r2',
    type: 'self-description',
    skill: 'recognizing',
    questionText: '你唔開心嘅時候，你會知道嗎？',
    questionTextEn: '留意自己感受',
    icon: '💭',
    videoUrl: '/videos/q2.mp4',
    options: [
      { id: 'r2a', text: '會呀，我好快就知 ✓', score: 3 },
      { id: 'r2b', text: '有時知，有時唔知 🤔', score: 2 },
      { id: 'r2c', text: '好多時都唔知 ❓', score: 1 },
    ],
  },

  // Understanding Questions - 理解
  {
    id: 'u1',
    type: 'scenario',
    skill: 'understanding',
    questionText: '朋友突然唔理你，你會點諗？',
    questionTextEn: '明白點解會咁',
    icon: '🤔',
    videoUrl: '/videos/q3.mp4',
    options: [
      { id: 'u1a', text: '可能佢今日心情唔好 💭', score: 3 },
      { id: 'u1b', text: '可能佢好忙 ⏰', score: 2 },
      { id: 'u1c', text: '我唔知點解 🤷', score: 1 },
    ],
  },
  {
    id: 'u2',
    type: 'self-description',
    skill: 'understanding',
    questionText: '你嬲嘅時候，知唔知自己點解嬲？',
    questionTextEn: '了解自己情緒',
    icon: '❓',
    videoUrl: '/videos/q4.mp4',
    options: [
      { id: 'u2a', text: '知呀，我明白原因 💡', score: 3 },
      { id: 'u2b', text: '有時知，有時唔清楚 🤷', score: 2 },
      { id: 'u2c', text: '多數唔知點解 ❓', score: 1 },
    ],
  },

  // Labeling Questions - 標記
  {
    id: 'l1',
    type: 'emotion-image',
    skill: 'labeling',
    questionText: '考試攞到好成績，你會點形容心情？',
    questionTextEn: '講出感受',
    icon: '🏷️',
    videoUrl: '/videos/q5.mp4',
    options: [
      { id: 'l1a', text: '開心、驕傲、滿足 🎉', score: 3 },
      { id: 'l1b', text: '好高興 😊', score: 2 },
      { id: 'l1c', text: '唔識講 🤷', score: 1 },
    ],
  },
  {
    id: 'l2',
    type: 'scenario',
    skill: 'labeling',
    questionText: '「緊張」同「驚」係咪一樣㗎？',
    questionTextEn: '分辨唔同感受',
    icon: '📝',
    videoUrl: '/videos/q6.mp4',
    options: [
      { id: 'l2a', text: '唔一樣，係兩種感覺 ✓', score: 3 },
      { id: 'l2b', text: '有啲似，但唔同 🤔', score: 2 },
      { id: 'l2c', text: '差唔多 🤷', score: 1 },
    ],
  },

  // Expressing Questions - 表達
  {
    id: 'e1',
    type: 'scenario',
    skill: 'expressing',
    questionText: '你覺得委屈嘅時候，會點做？',
    questionTextEn: '講出感受',
    icon: '💬',
    videoUrl: '/videos/q7.mp4',
    options: [
      { id: 'e1a', text: '搵人傾吓 🗣️', score: 3 },
      { id: 'e1b', text: '自己諗辦法 💭', score: 2 },
      { id: 'e1c', text: '收埋唔講 🤐', score: 1 },
    ],
  },
  {
    id: 'e2',
    type: 'self-description',
    skill: 'expressing',
    questionText: '同人講自己嘅感受，容唔容易？',
    questionTextEn: '分享心情',
    icon: '🗣️',
    videoUrl: '/videos/q8.mp4',
    options: [
      { id: 'e2a', text: '好容易，我鍾意分享 💚', score: 3 },
      { id: 'e2b', text: '有時易，有時難 🤔', score: 2 },
      { id: 'e2c', text: '好難，我唔識講 😶', score: 1 },
    ],
  },

  // Regulating Questions - 調節
  {
    id: 'g1',
    type: 'scenario',
    skill: 'regulating',
    questionText: '好嬲嘅時候，你會點樣冷靜返？',
    questionTextEn: '令自己冷靜',
    icon: '🧘',
    videoUrl: '/videos/q9.mp4',
    options: [
      { id: 'g1a', text: '深呼吸、數數或者行開吓 🌬️', score: 3 },
      { id: 'g1b', text: '等一陣就好返 ⏳', score: 2 },
      { id: 'g1c', text: '唔知點冷靜 😤', score: 1 },
    ],
  },
  {
    id: 'g2',
    type: 'self-description',
    skill: 'regulating',
    questionText: '如果事情唔係你想咁，你接受到嗎？',
    questionTextEn: '接受變化',
    icon: '🔄',
    videoUrl: '/videos/q10.mp4',
    options: [
      { id: 'g2a', text: '可以，我會諗其他辦法 💪', score: 3 },
      { id: 'g2b', text: '要啲時間，但OK 🕐', score: 2 },
      { id: 'g2c', text: '好難接受 😢', score: 1 },
    ],
  },
];

export const emotionAbilityInfo = {
  resilience: {
    name: '情緒韌性',
    nameEn: 'Emotional Resilience',
    description: '在面對壓力或困難時，能夠迅速恢復情緒平衡',
    relatedSkills: ['regulating', 'understanding'] as SkillType[],
  },
  agility: {
    name: '情緒敏捷',
    nameEn: 'Emotional Agility',
    description: '靈活應對不同情境中的情緒變化',
    relatedSkills: ['expressing', 'regulating'] as SkillType[],
  },
  literacy: {
    name: '情緒閱讀力',
    nameEn: 'Emotional Literacy',
    description: '準確辨識、理解和表達情緒',
    relatedSkills: ['recognizing', 'labeling', 'understanding'] as SkillType[],
  },
};
