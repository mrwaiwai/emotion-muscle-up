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

export const skillInfo: Record<SkillType, { name: string; nameEn: string; color: string; description: string; descriptionEn: string }> = {
  recognizing: {
    name: '辨別',
    nameEn: 'Recognizing',
    color: 'emotion-recognizing',
    description: '察覺並辨認自己的情緒和他人的感受',
    descriptionEn: 'Noticing and identifying your own emotions and others\' feelings',
  },
  understanding: {
    name: '理解',
    nameEn: 'Understanding',
    color: 'emotion-understanding',
    description: '深入了解情緒背後的原因及其影響',
    descriptionEn: 'Understanding why emotions happen and how they affect us',
  },
  labeling: {
    name: '標記',
    nameEn: 'Labeling',
    color: 'emotion-labeling',
    description: '準確命名各種情緒，增強表達能力',
    descriptionEn: 'Accurately naming different emotions to express yourself better',
  },
  expressing: {
    name: '表達',
    nameEn: 'Expressing',
    color: 'emotion-expressing',
    description: '用適當方式表達情緒，促進有效溝通',
    descriptionEn: 'Sharing emotions in appropriate ways for effective communication',
  },
  regulating: {
    name: '調節',
    nameEn: 'Regulating',
    color: 'emotion-regulating',
    description: '掌握調控情緒的方法，在挑戰中保持平衡',
    descriptionEn: 'Managing emotions to stay balanced during challenges',
  },
};

export const questions: Question[] = [
  // Recognizing Questions - 辨別 (4 questions)
  {
    id: 'r1',
    type: 'scenario',
    skill: 'recognizing',
    questionText: '同學一個人坐喺角落唔出聲，你覺得佢點呀？',
    questionTextEn: 'A classmate is sitting alone in the corner quietly. How do you think they feel?',
    icon: '👀',
    videoUrl: '/videos/q1.mp4',
    options: [
      { id: 'r1a', text: '佢可能唔開心 😢', textEn: 'They might be sad 😢', score: 3 },
      { id: 'r1b', text: '佢想靜吓 🤫', textEn: 'They want some quiet time 🤫', score: 2 },
      { id: 'r1c', text: '我唔知道 🤷', textEn: "I don't know 🤷", score: 1 },
    ],
  },
  {
    id: 'r2',
    type: 'self-description',
    skill: 'recognizing',
    questionText: '你唔開心嘅時候，你會知道嗎？',
    questionTextEn: 'When you feel sad, do you notice it?',
    icon: '💭',
    videoUrl: '/videos/q2.mp4',
    options: [
      { id: 'r2a', text: '會呀，我好快就知 ✓', textEn: 'Yes, I notice quickly ✓', score: 3 },
      { id: 'r2b', text: '有時知，有時唔知 🤔', textEn: 'Sometimes yes, sometimes no 🤔', score: 2 },
      { id: 'r2c', text: '好多時都唔知 ❓', textEn: "Often I don't notice ❓", score: 1 },
    ],
  },
  {
    id: 'r3',
    type: 'scenario',
    skill: 'recognizing',
    questionText: '朋友笑緊，但眼仔紅紅，你覺得佢點？',
    questionTextEn: 'Your friend is smiling but has red eyes. How do you think they feel?',
    icon: '🔍',
    videoUrl: '/videos/q11.mp4',
    options: [
      { id: 'r3a', text: '佢可能強顏歡笑 😔', textEn: 'They might be hiding sadness 😔', score: 3 },
      { id: 'r3b', text: '可能眼攰咗 👁️', textEn: 'Maybe their eyes are tired 👁️', score: 2 },
      { id: 'r3c', text: '冇嘢嘅，佢笑緊 😊', textEn: "Nothing's wrong, they're smiling 😊", score: 1 },
    ],
  },
  {
    id: 'r4',
    type: 'self-description',
    skill: 'recognizing',
    questionText: '當你個心跳得好快，你知唔知係咩感覺？',
    questionTextEn: 'When your heart beats fast, do you know what you are feeling?',
    icon: '💓',
    videoUrl: '/videos/q12.mp4',
    options: [
      { id: 'r4a', text: '知，可能係緊張或興奮 💓', textEn: 'Yes, maybe nervous or excited 💓', score: 3 },
      { id: 'r4b', text: '有時會諗吓 🤔', textEn: 'Sometimes I think about it 🤔', score: 2 },
      { id: 'r4c', text: '冇留意過 🤷', textEn: "I don't pay attention 🤷", score: 1 },
    ],
  },

  // Understanding Questions - 理解 (4 questions)
  {
    id: 'u1',
    type: 'scenario',
    skill: 'understanding',
    questionText: '朋友突然唔理你，你會點諗？',
    questionTextEn: 'Your friend suddenly ignores you. What do you think?',
    icon: '🤔',
    videoUrl: '/videos/q3.mp4',
    options: [
      { id: 'u1a', text: '可能佢今日心情唔好 💭', textEn: 'Maybe they are having a bad day 💭', score: 3 },
      { id: 'u1b', text: '可能佢好忙 ⏰', textEn: 'Maybe they are busy ⏰', score: 2 },
      { id: 'u1c', text: '我唔知點解 🤷', textEn: "I don't know why 🤷", score: 1 },
    ],
  },
  {
    id: 'u2',
    type: 'self-description',
    skill: 'understanding',
    questionText: '你嬲嘅時候，知唔知自己點解嬲？',
    questionTextEn: 'When you are angry, do you know why?',
    icon: '❓',
    videoUrl: '/videos/q4.mp4',
    options: [
      { id: 'u2a', text: '知呀，我明白原因 💡', textEn: 'Yes, I understand the reason 💡', score: 3 },
      { id: 'u2b', text: '有時知，有時唔清楚 🤷', textEn: 'Sometimes yes, sometimes not clear 🤷', score: 2 },
      { id: 'u2c', text: '多數唔知點解 ❓', textEn: "Usually I don't know why ❓", score: 1 },
    ],
  },
  {
    id: 'u3',
    type: 'scenario',
    skill: 'understanding',
    questionText: '細佬妹搶你玩具，你嬲咗。你知唔知點解會嬲？',
    questionTextEn: 'Your sibling takes your toy and you get angry. Do you know why?',
    icon: '🧸',
    videoUrl: '/videos/q13.mp4',
    options: [
      { id: 'u3a', text: '因為我覺得唔公平 ⚖️', textEn: 'Because I feel it is unfair ⚖️', score: 3 },
      { id: 'u3b', text: '因為佢搶咗我嘢 😠', textEn: 'Because they took my stuff 😠', score: 2 },
      { id: 'u3c', text: '唔知，總之好嬲 😤', textEn: "Don't know, just angry 😤", score: 1 },
    ],
  },
  {
    id: 'u4',
    type: 'self-description',
    skill: 'understanding',
    questionText: '當你開心嘅時候，你會諗吓點解開心嗎？',
    questionTextEn: 'When you are happy, do you think about why?',
    icon: '☀️',
    videoUrl: '/videos/q14.mp4',
    options: [
      { id: 'u4a', text: '會，我鍾意知道原因 🌟', textEn: 'Yes, I like to know why 🌟', score: 3 },
      { id: 'u4b', text: '有時會諗吓 💭', textEn: 'Sometimes I think about it 💭', score: 2 },
      { id: 'u4c', text: '唔會，開心就得 🎈', textEn: "No, just happy that's enough 🎈", score: 1 },
    ],
  },

  // Labeling Questions - 標記 (4 questions)
  {
    id: 'l1',
    type: 'emotion-image',
    skill: 'labeling',
    questionText: '考試攞到好成績，你會點形容心情？',
    questionTextEn: 'You got good grades. How would you describe your feeling?',
    icon: '🏷️',
    videoUrl: '/videos/q5.mp4',
    options: [
      { id: 'l1a', text: '開心、驕傲、滿足 🎉', textEn: 'Happy, proud, satisfied 🎉', score: 3 },
      { id: 'l1b', text: '好高興 😊', textEn: 'Very happy 😊', score: 2 },
      { id: 'l1c', text: '唔識講 🤷', textEn: "Don't know how to say 🤷", score: 1 },
    ],
  },
  {
    id: 'l2',
    type: 'scenario',
    skill: 'labeling',
    questionText: '「緊張」同「驚」係咪一樣㗎？',
    questionTextEn: 'Are "nervous" and "scared" the same?',
    icon: '📝',
    videoUrl: '/videos/q6.mp4',
    options: [
      { id: 'l2a', text: '唔一樣，係兩種感覺 ✓', textEn: 'No, they are two different feelings ✓', score: 3 },
      { id: 'l2b', text: '有啲似，但唔同 🤔', textEn: 'Similar but different 🤔', score: 2 },
      { id: 'l2c', text: '差唔多 🤷', textEn: 'Almost the same 🤷', score: 1 },
    ],
  },
  {
    id: 'l3',
    type: 'emotion-image',
    skill: 'labeling',
    questionText: '俾人讚嘅時候，你會用咩詞語形容？',
    questionTextEn: 'When someone praises you, how would you describe your feeling?',
    icon: '🌈',
    videoUrl: '/videos/q15.mp4',
    options: [
      { id: 'l3a', text: '自豪、受重視、感激 🌟', textEn: 'Proud, valued, grateful 🌟', score: 3 },
      { id: 'l3b', text: '開心 😊', textEn: 'Happy 😊', score: 2 },
      { id: 'l3c', text: '唔知點講 🤷', textEn: "Don't know how to say 🤷", score: 1 },
    ],
  },
  {
    id: 'l4',
    type: 'scenario',
    skill: 'labeling',
    questionText: '「失望」同「傷心」有咩分別？',
    questionTextEn: 'What is the difference between "disappointed" and "sad"?',
    icon: '💔',
    videoUrl: '/videos/q16.mp4',
    options: [
      { id: 'l4a', text: '失望係期望落空，傷心係難過 💭', textEn: 'Disappointed is unmet expectations, sad is feeling hurt 💭', score: 3 },
      { id: 'l4b', text: '都係唔開心 😢', textEn: 'Both are unhappy 😢', score: 2 },
      { id: 'l4c', text: '唔知呀 🤷', textEn: "Don't know 🤷", score: 1 },
    ],
  },

  // Expressing Questions - 表達 (4 questions)
  {
    id: 'e1',
    type: 'scenario',
    skill: 'expressing',
    questionText: '你覺得委屈嘅時候，會點做？',
    questionTextEn: 'When you feel wronged, what do you do?',
    icon: '💬',
    videoUrl: '/videos/q7.mp4',
    options: [
      { id: 'e1a', text: '搵人傾吓 🗣️', textEn: 'Talk to someone 🗣️', score: 3 },
      { id: 'e1b', text: '自己諗辦法 💭', textEn: 'Figure it out myself 💭', score: 2 },
      { id: 'e1c', text: '收埋唔講 🤐', textEn: 'Keep it to myself 🤐', score: 1 },
    ],
  },
  {
    id: 'e2',
    type: 'self-description',
    skill: 'expressing',
    questionText: '同人講自己嘅感受，容唔容易？',
    questionTextEn: 'Is it easy to tell others how you feel?',
    icon: '🗣️',
    videoUrl: '/videos/q8.mp4',
    options: [
      { id: 'e2a', text: '好容易，我鍾意分享 💚', textEn: 'Easy, I like sharing 💚', score: 3 },
      { id: 'e2b', text: '有時易，有時難 🤔', textEn: 'Sometimes easy, sometimes hard 🤔', score: 2 },
      { id: 'e2c', text: '好難，我唔識講 😶', textEn: "Hard, I don't know how 😶", score: 1 },
    ],
  },
  {
    id: 'e3',
    type: 'scenario',
    skill: 'expressing',
    questionText: '你想多謝朋友幫你，你會點做？',
    questionTextEn: 'You want to thank a friend for helping you. What do you do?',
    icon: '🙏',
    videoUrl: '/videos/q17.mp4',
    options: [
      { id: 'e3a', text: '直接講多謝同點解 💬', textEn: 'Say thanks and explain why 💬', score: 3 },
      { id: 'e3b', text: '話聲多謝 👋', textEn: 'Just say thanks 👋', score: 2 },
      { id: 'e3c', text: '心入面多謝就得 🤫', textEn: 'Thank them in my heart 🤫', score: 1 },
    ],
  },
  {
    id: 'e4',
    type: 'self-description',
    skill: 'expressing',
    questionText: '當你嬲緊，你會點樣話俾人知？',
    questionTextEn: 'When you are angry, how do you let others know?',
    icon: '😠',
    videoUrl: '/videos/q18.mp4',
    options: [
      { id: 'e4a', text: '平靜咁講我嬲咗 🗣️', textEn: 'Calmly say I am upset 🗣️', score: 3 },
      { id: 'e4b', text: '臉色會變差 😤', textEn: 'My face shows it 😤', score: 2 },
      { id: 'e4c', text: '忍住唔講 😶', textEn: 'Hold it in 😶', score: 1 },
    ],
  },

  // Regulating Questions - 調節 (4 questions)
  {
    id: 'g1',
    type: 'scenario',
    skill: 'regulating',
    questionText: '好嬲嘅時候，你會點樣冷靜返？',
    questionTextEn: 'When you are very angry, how do you calm down?',
    icon: '🧘',
    videoUrl: '/videos/q9.mp4',
    options: [
      { id: 'g1a', text: '深呼吸、數數或者行開吓 🌬️', textEn: 'Deep breaths, count, or walk away 🌬️', score: 3 },
      { id: 'g1b', text: '等一陣就好返 ⏳', textEn: 'Wait and it gets better ⏳', score: 2 },
      { id: 'g1c', text: '唔知點冷靜 😤', textEn: "Don't know how to calm down 😤", score: 1 },
    ],
  },
  {
    id: 'g2',
    type: 'self-description',
    skill: 'regulating',
    questionText: '如果事情唔係你想咁，你接受到嗎？',
    questionTextEn: 'If things do not go your way, can you accept it?',
    icon: '🔄',
    videoUrl: '/videos/q10.mp4',
    options: [
      { id: 'g2a', text: '可以，我會諗其他辦法 💪', textEn: 'Yes, I will think of another way 💪', score: 3 },
      { id: 'g2b', text: '要啲時間，但OK 🕐', textEn: 'Need time, but OK 🕐', score: 2 },
      { id: 'g2c', text: '好難接受 😢', textEn: 'Hard to accept 😢', score: 1 },
    ],
  },
  {
    id: 'g3',
    type: 'scenario',
    skill: 'regulating',
    questionText: '考試前好緊張，你會點做？',
    questionTextEn: 'You feel nervous before an exam. What do you do?',
    icon: '📚',
    videoUrl: '/videos/q19.mp4',
    options: [
      { id: 'g3a', text: '深呼吸，同自己講會OK 💪', textEn: 'Deep breaths, tell myself it will be OK 💪', score: 3 },
      { id: 'g3b', text: '諗吓其他嘢分散注意 🎮', textEn: 'Think of other things to distract 🎮', score: 2 },
      { id: 'g3c', text: '好難唔緊張 😰', textEn: 'Hard not to be nervous 😰', score: 1 },
    ],
  },
  {
    id: 'g4',
    type: 'self-description',
    skill: 'regulating',
    questionText: '當你傷心嘅時候，你識唔識令自己好返？',
    questionTextEn: 'When you are sad, can you help yourself feel better?',
    icon: '🌈',
    videoUrl: '/videos/q20.mp4',
    options: [
      { id: 'g4a', text: '識，我有好多方法 🌟', textEn: 'Yes, I have many ways 🌟', score: 3 },
      { id: 'g4b', text: '有時得，有時唔得 🤔', textEn: 'Sometimes yes, sometimes no 🤔', score: 2 },
      { id: 'g4c', text: '好難，唔識點做 😢', textEn: "Hard, don't know how 😢", score: 1 },
    ],
  },
];

export const emotionAbilityInfo = {
  resilience: {
    name: '情緒韌性',
    nameEn: 'Emotional Resilience',
    description: '在面對壓力或困難時，能夠迅速恢復情緒平衡',
    descriptionEn: 'Ability to quickly recover emotional balance when facing stress or difficulties',
    relatedSkills: ['regulating', 'understanding'] as SkillType[],
  },
  agility: {
    name: '情緒敏捷',
    nameEn: 'Emotional Agility',
    description: '靈活應對不同情境中的情緒變化',
    descriptionEn: 'Flexibly responding to emotional changes in different situations',
    relatedSkills: ['expressing', 'regulating'] as SkillType[],
  },
  literacy: {
    name: '情緒閱讀力',
    nameEn: 'Emotional Literacy',
    description: '準確辨識、理解和表達情緒',
    descriptionEn: 'Accurately identifying, understanding, and expressing emotions',
    relatedSkills: ['recognizing', 'labeling', 'understanding'] as SkillType[],
  },
};
