// 情緒 MUSCLE UP Assessment Questions
// Configurable question structure for easy modifications

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
  // Recognizing Questions
  {
    id: 'r1',
    type: 'scenario',
    skill: 'recognizing',
    questionText: '當你看到同學一個人坐在角落不說話，你覺得他可能有什麼感受？',
    questionTextEn: 'Recognizing others\' feelings',
    icon: '👀',
    options: [
      { id: 'r1a', text: '他可能傷心或不開心', score: 3 },
      { id: 'r1b', text: '他應該只是想安靜一下', score: 2 },
      { id: 'r1c', text: '我不太確定他的感受', score: 1 },
    ],
  },
  {
    id: 'r2',
    type: 'self-description',
    skill: 'recognizing',
    questionText: '當你心情不好時，你通常能察覺到嗎？',
    questionTextEn: 'Recognizing your own feelings',
    icon: '💭',
    options: [
      { id: 'r2a', text: '是的，我很快就能感覺到', score: 3 },
      { id: 'r2b', text: '有時候可以，有時候不行', score: 2 },
      { id: 'r2c', text: '我經常不知道自己心情不好', score: 1 },
    ],
  },

  // Understanding Questions
  {
    id: 'u1',
    type: 'scenario',
    skill: 'understanding',
    questionText: '小明的朋友突然不理他了，小明很傷心。你覺得小明為什麼會傷心？',
    questionTextEn: 'Understanding why we feel',
    icon: '🤔',
    options: [
      { id: 'u1a', text: '因為他覺得被朋友拒絕了，這讓他很難過', score: 3 },
      { id: 'u1b', text: '因為他沒有人可以玩', score: 2 },
      { id: 'u1c', text: '我不太清楚原因', score: 1 },
    ],
  },
  {
    id: 'u2',
    type: 'self-description',
    skill: 'understanding',
    questionText: '當你感到生氣時，你能明白自己為什麼生氣嗎？',
    questionTextEn: 'Understanding your emotions',
    icon: '❓',
    options: [
      { id: 'u2a', text: '是的，我通常知道原因', score: 3 },
      { id: 'u2b', text: '有時候知道，有時候不確定', score: 2 },
      { id: 'u2c', text: '我經常不知道為什麼生氣', score: 1 },
    ],
  },

  // Labeling Questions
  {
    id: 'l1',
    type: 'emotion-image',
    skill: 'labeling',
    questionText: '當你考試考得很好時，你會用什麼詞語形容自己的心情？',
    questionTextEn: 'Labeling your feelings',
    icon: '🏷️',
    options: [
      { id: 'l1a', text: '驕傲、開心、滿足', score: 3 },
      { id: 'l1b', text: '高興', score: 2 },
      { id: 'l1c', text: '我不太會形容', score: 1 },
    ],
  },
  {
    id: 'l2',
    type: 'scenario',
    skill: 'labeling',
    questionText: '你能分辨「緊張」和「害怕」有什麼不同嗎？',
    questionTextEn: 'Differentiating emotions',
    icon: '📝',
    options: [
      { id: 'l2a', text: '可以，它們是不同的感覺', score: 3 },
      { id: 'l2b', text: '有點像，但不太一樣', score: 2 },
      { id: 'l2c', text: '我覺得差不多', score: 1 },
    ],
  },

  // Expressing Questions
  {
    id: 'e1',
    type: 'scenario',
    skill: 'expressing',
    questionText: '當你覺得委屈時，你會怎麼做？',
    questionTextEn: 'Expressing your feelings',
    icon: '💬',
    options: [
      { id: 'e1a', text: '我會找人說出我的感受', score: 3 },
      { id: 'e1b', text: '我會自己想辦法處理', score: 2 },
      { id: 'e1c', text: '我會把感覺藏起來', score: 1 },
    ],
  },
  {
    id: 'e2',
    type: 'self-description',
    skill: 'expressing',
    questionText: '你覺得告訴別人你的感受容易嗎？',
    questionTextEn: 'Sharing emotions with others',
    icon: '🗣️',
    options: [
      { id: 'e2a', text: '容易，我喜歡分享感受', score: 3 },
      { id: 'e2b', text: '有時候容易，有時候很難', score: 2 },
      { id: 'e2c', text: '很難，我不太會表達', score: 1 },
    ],
  },

  // Regulating Questions
  {
    id: 'g1',
    type: 'scenario',
    skill: 'regulating',
    questionText: '當你非常生氣時，你會怎麼讓自己冷靜下來？',
    questionTextEn: 'Calming yourself down',
    icon: '🧘',
    options: [
      { id: 'g1a', text: '深呼吸、數數或離開一下', score: 3 },
      { id: 'g1b', text: '等一會兒就好了', score: 2 },
      { id: 'g1c', text: '我不知道怎麼冷靜', score: 1 },
    ],
  },
  {
    id: 'g2',
    type: 'self-description',
    skill: 'regulating',
    questionText: '當事情不如你想像時，你能接受嗎？',
    questionTextEn: 'Adapting to changes',
    icon: '🔄',
    options: [
      { id: 'g2a', text: '可以，我會想其他辦法', score: 3 },
      { id: 'g2b', text: '需要一點時間，但可以', score: 2 },
      { id: 'g2c', text: '很難接受，我會很不開心', score: 1 },
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
