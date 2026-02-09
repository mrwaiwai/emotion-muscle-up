// 遊戲化測驗問題數據結構
export type GameType = 
  | 'slider'           // 滑桿
  | 'card-select'      // 卡牌選擇
  | 'drag-match'       // 拖拉配對/連線
  | 'multi-select'     // 多選 Checkbox
  | 'word-cloud'       // 詞雲點擊
  | 'hotspot'          // 點擊熱點
  | 'video-observe';   // 影片觀察

export type SkillType = 'recognizing' | 'understanding' | 'labeling' | 'expressing' | 'regulating';

export interface GameOption {
  id: string;
  text: string;
  textEn?: string;
  score: number;
  icon?: string;
}

export interface DragItem {
  id: string;
  text: string;
  textEn?: string;
  type: 'source' | 'target';
  icon?: string;
}

export interface DragMatch {
  sourceId: string;
  targetId: string;
  score: number;
}

export interface SliderConfig {
  min: number;
  max: number;
  step: number;
  labels?: { value: number; text: string; textEn?: string }[];
  scoreRanges: { min: number; max: number; score: number }[];
}

export interface GameQuestion {
  id: string;
  skill: SkillType;
  gameType: GameType;
  icon: string;
  scenarioText: string;
  scenarioTextEn?: string;
  questionText: string;
  questionTextEn?: string;
  
  // 根據 gameType 使用不同的配置
  options?: GameOption[];           // card-select, multi-select, word-cloud
  sliderConfig?: SliderConfig;      // slider
  dragItems?: DragItem[];           // drag-match
  dragMatches?: DragMatch[];        // drag-match 的正確配對
  hotspots?: { id: string; label: string; labelEn?: string }[];  // hotspot
  
  // 多選題的計分邏輯
  multiSelectScoring?: {
    minSelections?: number;
    maxSelections?: number;
    scoringType: 'sum' | 'count-based';  // sum: 加總分數, count-based: 根據選擇數量
    countScores?: { count: number; score: number }[];
  };
  
  // 即時回饋文字
  feedback?: {
    low: string;
    lowEn?: string;
    medium: string;
    mediumEn?: string;
    high: string;
    highEn?: string;
  };
}

// ============================================
// 技能 1：辨別 (Recognizing) —— 4 題
// ============================================

const recognizingQuestions: GameQuestion[] = [
  // R1: 觀察線索 - 點擊熱點 + 卡牌選擇
  {
    id: 'gr1',
    skill: 'recognizing',
    gameType: 'card-select',
    icon: '🔍',
    scenarioText: '睇下呢張圖：一個小朋友坐喺角落，手抱住膝頭，頭垂低。',
    scenarioTextEn: 'Look at this picture: A child sitting in a corner, hugging their knees, head down.',
    questionText: '你覺得呢個小朋友而家最可能係咩感覺？',
    questionTextEn: 'How do you think this child is feeling right now?',
    hotspots: [
      { id: 'eyes', label: '眼神', labelEn: 'Eyes' },
      { id: 'posture', label: '身體姿勢', labelEn: 'Body posture' },
      { id: 'environment', label: '周圍環境', labelEn: 'Surroundings' }
    ],
    options: [
      { id: 'gr1-a', text: '好開心玩緊遊戲', textEn: 'Having fun playing games', score: 1, icon: '😊' },
      { id: 'gr1-b', text: '唔開心或者孤單', textEn: 'Sad or lonely', score: 3, icon: '😢' },
      { id: 'gr1-c', text: '覺得好攰想瞓覺', textEn: 'Feeling tired and sleepy', score: 2, icon: '😴' }
    ],
    feedback: {
      low: '試下再仔細觀察佢嘅身體語言！',
      lowEn: 'Try to observe the body language more carefully!',
      medium: '你有留意到一啲線索！',
      mediumEn: 'You noticed some clues!',
      high: '好叻！你觀察得好仔細！',
      highEn: 'Great job! You observed very carefully!'
    }
  },
  
  // R2: 情緒溫度計 - Slider
  {
    id: 'gr2',
    skill: 'recognizing',
    gameType: 'slider',
    icon: '🌡️',
    scenarioText: '今日考試唔合格，你覺得好失望。',
    scenarioTextEn: 'You failed the test today and feel disappointed.',
    questionText: '如果呢個係你，你嘅「失望程度」有幾多？',
    questionTextEn: 'If this happened to you, how disappointed would you feel?',
    sliderConfig: {
      min: 0,
      max: 100,
      step: 5,
      labels: [
        { value: 0, text: '完全唔失望', textEn: 'Not disappointed' },
        { value: 50, text: '有啲失望', textEn: 'Somewhat disappointed' },
        { value: 100, text: '非常失望', textEn: 'Very disappointed' }
      ],
      scoreRanges: [
        { min: 0, max: 30, score: 1 },
        { min: 31, max: 70, score: 2 },
        { min: 71, max: 100, score: 3 }
      ]
    },
    feedback: {
      low: '你似乎對呢個情緒感知較輕',
      lowEn: 'You seem to have a light perception of this emotion',
      medium: '你有適度嘅情緒感知',
      mediumEn: 'You have moderate emotional awareness',
      high: '你對情緒好敏感！',
      highEn: 'You are very emotionally sensitive!'
    }
  },
  
  // R3: 無聲觀察 - 卡牌選擇
  {
    id: 'gr3',
    skill: 'recognizing',
    gameType: 'card-select',
    icon: '🎭',
    scenarioText: '想像一下：你睇到一個小朋友笑住，但眼紅紅...',
    scenarioTextEn: 'Imagine: You see a child smiling, but their eyes are red...',
    questionText: '你估佢真實感覺係咩？',
    questionTextEn: 'What do you think they are really feeling?',
    options: [
      { id: 'gr3-a', text: '真係好開心', textEn: 'Really happy', score: 1, icon: '😊' },
      { id: 'gr3-b', text: '其實好傷心，但扮開心', textEn: 'Actually sad, but pretending to be happy', score: 3, icon: '😢' },
      { id: 'gr3-c', text: '有啲唔肯定', textEn: 'Not quite sure', score: 2, icon: '😕' }
    ],
    feedback: {
      low: '有時表面同內心唔一樣㗎！',
      lowEn: 'Sometimes appearance differs from feelings!',
      medium: '你開始留意到表裡不一！',
      mediumEn: 'You\'re noticing the difference!',
      high: '你好識睇人！',
      highEn: 'You\'re very perceptive!'
    }
  },
  
  // R4: 身體訊號連線 - 拖拉配對
  {
    id: 'gr4',
    skill: 'recognizing',
    gameType: 'drag-match',
    icon: '🔗',
    scenarioText: '身體會透過唔同方式話你知你嘅情緒！',
    scenarioTextEn: 'Your body tells you about your emotions in different ways!',
    questionText: '將身體訊號同情緒連埋一齊！',
    questionTextEn: 'Match the body signals with the emotions!',
    dragItems: [
      // Sources (身體反應)
      { id: 'heart-fast', text: '心跳加速', textEn: 'Heart racing', type: 'source', icon: '💓' },
      { id: 'sweaty-palms', text: '手心出汗', textEn: 'Sweaty palms', type: 'source', icon: '💧' },
      { id: 'tummy-ache', text: '肚痛', textEn: 'Stomach ache', type: 'source', icon: '🤢' },
      { id: 'cant-stop-laugh', text: '笑到停唔到', textEn: 'Can\'t stop laughing', type: 'source', icon: '😂' },
      // Targets (情緒)
      { id: 'scared', text: '驚', textEn: 'Scared', type: 'target', icon: '😨' },
      { id: 'nervous', text: '緊張', textEn: 'Nervous', type: 'target', icon: '😰' },
      { id: 'happy', text: '開心', textEn: 'Happy', type: 'target', icon: '😊' },
      { id: 'angry', text: '嬲', textEn: 'Angry', type: 'target', icon: '😠' }
    ],
    dragMatches: [
      { sourceId: 'heart-fast', targetId: 'scared', score: 1 },
      { sourceId: 'sweaty-palms', targetId: 'nervous', score: 1 },
      { sourceId: 'tummy-ache', targetId: 'nervous', score: 1 },
      { sourceId: 'cant-stop-laugh', targetId: 'happy', score: 1 }
    ],
    multiSelectScoring: {
      scoringType: 'count-based',
      countScores: [
        { count: 1, score: 1 },
        { count: 2, score: 1 },
        { count: 3, score: 2 },
        { count: 4, score: 3 }
      ]
    },
    feedback: {
      low: '再試下配對多啲！',
      lowEn: 'Try matching more!',
      medium: '配對得唔錯！',
      mediumEn: 'Good matching!',
      high: '你好了解身體同情緒嘅關係！',
      highEn: 'You understand the body-emotion connection well!'
    }
  }
];

// ============================================
// 技能 2：理解 (Understanding) —— 4 題
// ============================================

const understandingQuestions: GameQuestion[] = [
  // U1: 朋友唔理你 - 卡牌翻轉
  {
    id: 'gu1',
    skill: 'understanding',
    gameType: 'card-select',
    icon: '🃏',
    scenarioText: '你嘅好朋友今日見到你，但突然走開唔理你。',
    scenarioTextEn: 'Your good friend saw you today but suddenly walked away ignoring you.',
    questionText: '你覺得最有可能係咩原因？',
    questionTextEn: 'What do you think is the most likely reason?',
    options: [
      { id: 'gu1-a', text: '佢嬲緊我做錯咗啲嘢', textEn: 'They\'re upset at me for doing something wrong', score: 3, icon: '😤' },
      { id: 'gu1-b', text: '佢今日心情唔好', textEn: 'They\'re in a bad mood today', score: 2, icon: '😔' },
      { id: 'gu1-c', text: '佢唔鍾意我', textEn: 'They don\'t like me', score: 1, icon: '💔' },
      { id: 'gu1-d', text: '佢趕住返屋企', textEn: 'They\'re in a hurry to go home', score: 2, icon: '🏠' }
    ],
    feedback: {
      low: '試下從多個角度諗吓原因！',
      lowEn: 'Try thinking from multiple perspectives!',
      medium: '你有考慮到唔同可能性！',
      mediumEn: 'You considered different possibilities!',
      high: '你好識換位思考！',
      highEn: 'You\'re great at perspective-taking!'
    }
  },
  
  // U2: 自我反思 - 卡牌選擇
  {
    id: 'gu2',
    skill: 'understanding',
    gameType: 'card-select',
    icon: '🪞',
    scenarioText: '你而家好嬲，想摔嘢！',
    scenarioTextEn: 'You\'re very angry right now and want to throw things!',
    questionText: '你估自己點解咁嬲？',
    questionTextEn: 'Why do you think you\'re so angry?',
    options: [
      { id: 'gu2-a', text: '因為有人激嬲我', textEn: 'Because someone provoked me', score: 3, icon: '😡' },
      { id: 'gu2-b', text: '因為做唔到啲嘢', textEn: 'Because I couldn\'t do something', score: 3, icon: '😤' },
      { id: 'gu2-c', text: '唔知點解', textEn: 'I don\'t know why', score: 1, icon: '❓' }
    ],
    feedback: {
      low: '了解自己嘅情緒原因好重要㗎！',
      lowEn: 'Understanding your emotions is important!',
      medium: '你開始明白自己點解有呢個感覺！',
      mediumEn: 'You\'re starting to understand your feelings!',
      high: '你好了解自己！',
      highEn: 'You understand yourself well!'
    }
  },
  
  // U3: 情緒根源樹 - 拖拉配對
  {
    id: 'gu3',
    skill: 'understanding',
    gameType: 'drag-match',
    icon: '🌳',
    scenarioText: '你而家好嬲！😠',
    scenarioTextEn: 'You\'re very angry right now! 😠',
    questionText: '邊個事件最有可能令你嬲？拖佢去情緒臉度！',
    questionTextEn: 'Which event most likely made you angry? Drag it to the emotion face!',
    dragItems: [
      { id: 'sibling-grab', text: '細佬搶玩具', textEn: 'Sibling grabbed my toy', type: 'source', icon: '🧸' },
      { id: 'homework', text: '功課太多', textEn: 'Too much homework', type: 'source', icon: '📚' },
      { id: 'hungry', text: '肚餓', textEn: 'Hungry', type: 'source', icon: '🍽️' },
      { id: 'friend-laugh', text: '朋友笑我', textEn: 'Friend laughed at me', type: 'source', icon: '😆' },
      { id: 'alone', text: '冇人同我玩', textEn: 'No one to play with', type: 'source', icon: '🚶' },
      { id: 'angry-face', text: '嬲 😠', textEn: 'Angry 😠', type: 'target', icon: '😠' }
    ],
    dragMatches: [
      { sourceId: 'sibling-grab', targetId: 'angry-face', score: 3 },
      { sourceId: 'friend-laugh', targetId: 'angry-face', score: 3 },
      { sourceId: 'homework', targetId: 'angry-face', score: 2 },
      { sourceId: 'alone', targetId: 'angry-face', score: 2 },
      { sourceId: 'hungry', targetId: 'angry-face', score: 1 }
    ],
    feedback: {
      low: '諗下邊啲事會令人嬲！',
      lowEn: 'Think about what makes people angry!',
      medium: '你揀咗一個可能嘅原因！',
      mediumEn: 'You chose a possible reason!',
      high: '你好明白情緒嘅來源！',
      highEn: 'You understand emotional triggers well!'
    }
  },
  
  // U4: 情緒日記 - 卡牌選擇
  {
    id: 'gu4',
    skill: 'understanding',
    gameType: 'card-select',
    icon: '📔',
    scenarioText: '你今日好開心！',
    scenarioTextEn: 'You\'re very happy today!',
    questionText: '你會唔會諗下自己點解開心？',
    questionTextEn: 'Would you think about why you\'re happy?',
    options: [
      { id: 'gu4-a', text: '會，我想知自己點解開心', textEn: 'Yes, I want to know why I\'m happy', score: 3, icon: '🤔' },
      { id: 'gu4-b', text: '有時會諗', textEn: 'Sometimes I think about it', score: 2, icon: '😐' },
      { id: 'gu4-c', text: '唔會，開心就算啦', textEn: 'No, just enjoy being happy', score: 1, icon: '😊' }
    ],
    feedback: {
      low: '了解開心嘅原因可以幫你搵到更多快樂！',
      lowEn: 'Understanding happiness helps you find more joy!',
      medium: '有時反思係好嘅習慣！',
      mediumEn: 'Reflection is a good habit!',
      high: '你好識自我反思！',
      highEn: 'You\'re great at self-reflection!'
    }
  }
];

// ============================================
// 技能 3：標記 (Labeling) —— 4 題
// ============================================

const labelingQuestions: GameQuestion[] = [
  // L1: 詞語選擇 - 詞雲/多選
  {
    id: 'gl1',
    skill: 'labeling',
    gameType: 'word-cloud',
    icon: '☁️',
    scenarioText: '你考試考得好好！',
    scenarioTextEn: 'You did very well on your test!',
    questionText: '揀 2-3 個最貼近你感受嘅詞語！',
    questionTextEn: 'Choose 2-3 words that best describe your feelings!',
    options: [
      { id: 'gl1-a', text: '開心', textEn: 'Happy', score: 1, icon: '😊' },
      { id: 'gl1-b', text: '自豪', textEn: 'Proud', score: 2, icon: '🏆' },
      { id: 'gl1-c', text: '滿足', textEn: 'Satisfied', score: 2, icon: '😌' },
      { id: 'gl1-d', text: '興奮', textEn: 'Excited', score: 2, icon: '🎉' },
      { id: 'gl1-e', text: '放鬆', textEn: 'Relaxed', score: 1, icon: '😮‍💨' },
      { id: 'gl1-f', text: '驚訝', textEn: 'Surprised', score: 1, icon: '😲' },
      { id: 'gl1-g', text: '感激', textEn: 'Grateful', score: 2, icon: '🙏' },
      { id: 'gl1-h', text: '平靜', textEn: 'Calm', score: 1, icon: '😇' },
      { id: 'gl1-i', text: '得意', textEn: 'Pleased', score: 2, icon: '😎' },
      { id: 'gl1-j', text: '雀躍', textEn: 'Thrilled', score: 2, icon: '🤩' }
    ],
    multiSelectScoring: {
      minSelections: 2,
      maxSelections: 3,
      scoringType: 'count-based',
      countScores: [
        { count: 1, score: 1 },
        { count: 2, score: 2 },
        { count: 3, score: 3 }
      ]
    },
    feedback: {
      low: '試下揀多啲詞語形容你嘅感覺！',
      lowEn: 'Try choosing more words to describe your feelings!',
      medium: '你識用唔同詞語！',
      mediumEn: 'You know different words!',
      high: '你嘅情緒詞彙好豐富！',
      highEn: 'Your emotional vocabulary is rich!'
    }
  },
  
  // L2: 情緒雙胞胎 - 拖拉比較
  {
    id: 'gl2',
    skill: 'labeling',
    gameType: 'card-select',
    icon: '👯',
    scenarioText: '「緊張」同「驚」係唔係一樣㗎？',
    scenarioTextEn: 'Are "nervous" and "scared" the same?',
    questionText: '呢兩個詞係唔係一樣？',
    questionTextEn: 'Are these two words the same?',
    options: [
      { id: 'gl2-a', text: '一樣', textEn: 'Same', score: 1, icon: '=' },
      { id: 'gl2-b', text: '唔同', textEn: 'Different', score: 3, icon: '≠' }
    ],
    feedback: {
      low: '呢兩個詞其實有分別㗎！',
      lowEn: 'These words are actually different!',
      medium: '你開始留意到差異！',
      mediumEn: 'You\'re noticing the differences!',
      high: '你好識分辨情緒詞語！',
      highEn: 'You\'re great at distinguishing emotion words!'
    }
  },
  
  // L3: 讚美詞語寶箱 - 多選
  {
    id: 'gl3',
    skill: 'labeling',
    gameType: 'multi-select',
    icon: '📦',
    scenarioText: '老師讚你做得好！',
    scenarioTextEn: 'The teacher praised you for doing well!',
    questionText: '揀 3 個詞語，放入你嘅情緒寶箱！',
    questionTextEn: 'Choose 3 words to put in your emotion box!',
    options: [
      { id: 'gl3-a', text: '開心', textEn: 'Happy', score: 1, icon: '😊' },
      { id: 'gl3-b', text: '驕傲', textEn: 'Proud', score: 2, icon: '🎖️' },
      { id: 'gl3-c', text: '感激', textEn: 'Grateful', score: 2, icon: '🙏' },
      { id: 'gl3-d', text: '滿足', textEn: 'Satisfied', score: 2, icon: '😌' },
      { id: 'gl3-e', text: '被認同', textEn: 'Recognized', score: 2, icon: '✨' },
      { id: 'gl3-f', text: '自豪', textEn: 'Self-proud', score: 2, icon: '💪' },
      { id: 'gl3-g', text: '興奮', textEn: 'Excited', score: 1, icon: '🎉' }
    ],
    multiSelectScoring: {
      minSelections: 1,
      maxSelections: 3,
      scoringType: 'count-based',
      countScores: [
        { count: 1, score: 1 },
        { count: 2, score: 2 },
        { count: 3, score: 3 }
      ]
    },
    feedback: {
      low: '試下揀多啲詞語！',
      lowEn: 'Try choosing more words!',
      medium: '好！你識用唔同詞語！',
      mediumEn: 'Good! You know different words!',
      high: '你嘅情緒詞彙好多元！',
      highEn: 'Your emotional vocabulary is diverse!'
    }
  },
  
  // L4: 情緒細節放大鏡 - 拖拉配對
  {
    id: 'gl4',
    skill: 'labeling',
    gameType: 'drag-match',
    icon: '🔎',
    scenarioText: '「失望」同「傷心」有咩分別？',
    scenarioTextEn: 'What\'s the difference between "disappointed" and "sad"?',
    questionText: '將情緒詞語拖去啱嘅解釋！',
    questionTextEn: 'Drag the emotion words to the correct explanation!',
    dragItems: [
      { id: 'disappointed', text: '失望', textEn: 'Disappointed', type: 'source', icon: '😞' },
      { id: 'sad', text: '傷心', textEn: 'Sad', type: 'source', icon: '😢' },
      { id: 'expectation', text: '期望落空', textEn: 'Unmet expectations', type: 'target', icon: '💭' },
      { id: 'deep-pain', text: '深層痛苦', textEn: 'Deep pain', type: 'target', icon: '💔' }
    ],
    dragMatches: [
      { sourceId: 'disappointed', targetId: 'expectation', score: 2 },
      { sourceId: 'sad', targetId: 'deep-pain', score: 2 }
    ],
    multiSelectScoring: {
      scoringType: 'count-based',
      countScores: [
        { count: 0, score: 1 },
        { count: 1, score: 2 },
        { count: 2, score: 3 }
      ]
    },
    feedback: {
      low: '呢兩個詞嘅意思唔同㗎！',
      lowEn: 'These two words have different meanings!',
      medium: '你配對咗一個！',
      mediumEn: 'You matched one!',
      high: '你好明白呢兩個詞嘅分別！',
      highEn: 'You understand the difference well!'
    }
  }
];

// ============================================
// 技能 4：表達 (Expressing) —— 4 題
// ============================================

const expressingQuestions: GameQuestion[] = [
  // E1: 委屈求助 - 卡牌選擇
  {
    id: 'ge1',
    skill: 'expressing',
    gameType: 'card-select',
    icon: '💬',
    scenarioText: '你覺得好委屈...',
    scenarioTextEn: 'You feel wronged...',
    questionText: '你會搵邊個傾？',
    questionTextEn: 'Who would you talk to?',
    options: [
      { id: 'ge1-a', text: '搵人傾（媽媽/老師/朋友）', textEn: 'Talk to someone (mom/teacher/friend)', score: 3, icon: '👨‍👩‍👦' },
      { id: 'ge1-b', text: '唔搵人，自己收埋', textEn: 'Keep it to myself', score: 1, icon: '🤐' },
      { id: 'ge1-c', text: '視乎情況', textEn: 'Depends on the situation', score: 2, icon: '🤔' }
    ],
    feedback: {
      low: '搵人傾可以幫你feel好啲！',
      lowEn: 'Talking to someone can help you feel better!',
      medium: '有時候講出嚟會好啲！',
      mediumEn: 'Sometimes speaking up helps!',
      high: '你好識表達自己！',
      highEn: 'You\'re good at expressing yourself!'
    }
  },
  
  // E2: 表達勇氣挑戰 - Slider
  {
    id: 'ge2',
    skill: 'expressing',
    gameType: 'slider',
    icon: '💪',
    scenarioText: '你想同朋友講你嘅感受。',
    scenarioTextEn: 'You want to share your feelings with a friend.',
    questionText: '對你嚟講有幾難？',
    questionTextEn: 'How difficult is this for you?',
    sliderConfig: {
      min: 0,
      max: 100,
      step: 5,
      labels: [
        { value: 0, text: '好容易', textEn: 'Very easy' },
        { value: 50, text: '有啲難', textEn: 'Somewhat difficult' },
        { value: 100, text: '好難', textEn: 'Very difficult' }
      ],
      scoreRanges: [
        { min: 0, max: 30, score: 3 },
        { min: 31, max: 70, score: 2 },
        { min: 71, max: 100, score: 1 }
      ]
    },
    feedback: {
      low: '表達感受需要練習！',
      lowEn: 'Expressing feelings takes practice!',
      medium: '繼續努力，會越來越容易！',
      mediumEn: 'Keep trying, it gets easier!',
      high: '你好勇敢表達自己！',
      highEn: 'You\'re brave in expressing yourself!'
    }
  },
  
  // E3: 感激表達卡 - 卡牌選擇
  {
    id: 'ge3',
    skill: 'expressing',
    gameType: 'card-select',
    icon: '🎁',
    scenarioText: '朋友幫咗你一個大忙。',
    scenarioTextEn: 'A friend helped you a lot.',
    questionText: '你會點樣多謝佢？',
    questionTextEn: 'How would you thank them?',
    options: [
      { id: 'ge3-a', text: '直接講「多謝你！」', textEn: 'Say "Thank you!" directly', score: 3, icon: '💬' },
      { id: 'ge3-b', text: '送佢份小禮物', textEn: 'Give them a small gift', score: 3, icon: '🎁' },
      { id: 'ge3-c', text: '俾個 Like', textEn: 'Give a Like', score: 2, icon: '👍' },
      { id: 'ge3-d', text: '唔出聲，心裡面多謝', textEn: 'Stay quiet, thank them in my heart', score: 1, icon: '🤐' }
    ],
    feedback: {
      low: '表達感謝會令對方開心！',
      lowEn: 'Expressing thanks makes others happy!',
      medium: '有心就好！',
      mediumEn: 'It\'s the thought that counts!',
      high: '你好識表達感謝！',
      highEn: 'You\'re great at expressing gratitude!'
    }
  },
  
  // E4: 情緒傳達挑戰 - 多選
  {
    id: 'ge4',
    skill: 'expressing',
    gameType: 'multi-select',
    icon: '📢',
    scenarioText: '你而家好嬲！',
    scenarioTextEn: 'You\'re very angry right now!',
    questionText: '你會用邊啲方式話俾人知？（可以揀多個）',
    questionTextEn: 'How would you let others know? (Select multiple)',
    options: [
      { id: 'ge4-a', text: '用說話講出嚟', textEn: 'Say it out loud', score: 3, icon: '🗣️' },
      { id: 'ge4-b', text: '用表情同身體語言', textEn: 'Use facial expressions and body language', score: 2, icon: '😤' },
      { id: 'ge4-c', text: '寫低佢', textEn: 'Write it down', score: 2, icon: '✍️' },
      { id: 'ge4-d', text: '唔講，自己收埋', textEn: 'Keep it to myself', score: 1, icon: '🤐' },
      { id: 'ge4-e', text: '畫圖表達', textEn: 'Express through drawing', score: 2, icon: '🎨' }
    ],
    multiSelectScoring: {
      minSelections: 1,
      maxSelections: 5,
      scoringType: 'sum'
    },
    feedback: {
      low: '試下用多啲方式表達！',
      lowEn: 'Try more ways to express yourself!',
      medium: '你識用唔同方法表達！',
      mediumEn: 'You know different ways to express!',
      high: '你表達方式好多元！',
      highEn: 'Your expression methods are diverse!'
    }
  }
];

// ============================================
// 技能 5：調節 (Regulating) —— 4 題
// ============================================

const regulatingQuestions: GameQuestion[] = [
  // G1: 冷靜策略選擇 - 多選
  {
    id: 'gg1',
    skill: 'regulating',
    gameType: 'multi-select',
    icon: '🧘',
    scenarioText: '你好嬲，想摔嘢！',
    scenarioTextEn: 'You\'re very angry and want to throw things!',
    questionText: '揀 2 個工具幫你冷靜返！',
    questionTextEn: 'Choose 2 tools to help you calm down!',
    options: [
      { id: 'gg1-a', text: '深呼吸', textEn: 'Deep breathing', score: 3, icon: '🌬️' },
      { id: 'gg1-b', text: '數 1-10', textEn: 'Count 1-10', score: 3, icon: '🔢' },
      { id: 'gg1-c', text: '行開一陣', textEn: 'Walk away for a bit', score: 3, icon: '🚶' },
      { id: 'gg1-d', text: '同人傾', textEn: 'Talk to someone', score: 2, icon: '💬' },
      { id: 'gg1-e', text: '大叫發洩', textEn: 'Shout to vent', score: 1, icon: '😤' },
      { id: 'gg1-f', text: '打機', textEn: 'Play games', score: 1, icon: '🎮' }
    ],
    multiSelectScoring: {
      minSelections: 2,
      maxSelections: 2,
      scoringType: 'sum'
    },
    feedback: {
      low: '試下揀啲更有效嘅方法！',
      lowEn: 'Try choosing more effective methods!',
      medium: '你揀咗啲OK嘅方法！',
      mediumEn: 'You chose some OK methods!',
      high: '你好識冷靜自己！',
      highEn: 'You know how to calm yourself well!'
    }
  },
  
  // G2: 適應力測試 - 卡牌選擇
  {
    id: 'gg2',
    skill: 'regulating',
    gameType: 'card-select',
    icon: '🌧️',
    scenarioText: '你計劃咗去公園，但落雨取消咗。',
    scenarioTextEn: 'You planned to go to the park, but it was cancelled due to rain.',
    questionText: '你會點做？',
    questionTextEn: 'What would you do?',
    options: [
      { id: 'gg2-a', text: '接受現實，諗其他活動', textEn: 'Accept it and think of other activities', score: 3, icon: '💡' },
      { id: 'gg2-b', text: '好失望，但慢慢接受', textEn: 'Disappointed but slowly accept', score: 2, icon: '😔' },
      { id: 'gg2-c', text: '好嬲，唔肯接受', textEn: 'Angry and refuse to accept', score: 1, icon: '😠' }
    ],
    feedback: {
      low: '有時候要接受改變！',
      lowEn: 'Sometimes we need to accept changes!',
      medium: '慢慢接受係正常嘅！',
      mediumEn: 'It\'s normal to accept slowly!',
      high: '你適應力好強！',
      highEn: 'You\'re very adaptable!'
    }
  },
  
  // G3: 考試前減壓站 - 多選
  {
    id: 'gg3',
    skill: 'regulating',
    gameType: 'multi-select',
    icon: '📝',
    scenarioText: '聽日考試，你好緊張！',
    scenarioTextEn: 'You have a test tomorrow and you\'re very nervous!',
    questionText: '揀出你會用嘅減壓方法！（可揀多個）',
    questionTextEn: 'Choose the stress relief methods you would use! (Select multiple)',
    options: [
      { id: 'gg3-a', text: '溫習準備', textEn: 'Study and prepare', score: 3, icon: '📖' },
      { id: 'gg3-b', text: '深呼吸放鬆', textEn: 'Deep breathing to relax', score: 3, icon: '🌬️' },
      { id: 'gg3-c', text: '早啲瞓', textEn: 'Sleep early', score: 3, icon: '😴' },
      { id: 'gg3-d', text: '同人傾', textEn: 'Talk to someone', score: 2, icon: '💬' },
      { id: 'gg3-e', text: '聽音樂', textEn: 'Listen to music', score: 2, icon: '🎵' },
      { id: 'gg3-f', text: '畫畫', textEn: 'Draw', score: 2, icon: '🎨' },
      { id: 'gg3-g', text: '打機分散注意力', textEn: 'Play games to distract', score: 1, icon: '🎮' },
      { id: 'gg3-h', text: '唔理佢', textEn: 'Ignore it', score: 1, icon: '🙈' }
    ],
    multiSelectScoring: {
      minSelections: 1,
      maxSelections: 4,
      scoringType: 'sum'
    },
    feedback: {
      low: '試下揀多啲有效嘅減壓方法！',
      lowEn: 'Try choosing more effective stress relief methods!',
      medium: '你識用一啲減壓方法！',
      mediumEn: 'You know some stress relief methods!',
      high: '你好識調節壓力！',
      highEn: 'You\'re great at managing stress!'
    }
  },
  
  // G4: 自我療癒膠囊 - 卡牌選擇
  {
    id: 'gg4',
    skill: 'regulating',
    gameType: 'card-select',
    icon: '💊',
    scenarioText: '你好傷心...',
    scenarioTextEn: 'You\'re very sad...',
    questionText: '你會點樣安慰自己？',
    questionTextEn: 'How would you comfort yourself?',
    options: [
      { id: 'gg4-a', text: '同自己講「冇事嘅，會好返」', textEn: 'Tell myself "It\'s okay, it will get better"', score: 3, icon: '💭' },
      { id: 'gg4-b', text: '諗返開心嘅嘢', textEn: 'Think of happy things', score: 3, icon: '😊' },
      { id: 'gg4-c', text: '搵人幫手', textEn: 'Ask someone for help', score: 2, icon: '🤝' },
      { id: 'gg4-d', text: '唔識點做', textEn: 'Don\'t know what to do', score: 1, icon: '❓' }
    ],
    feedback: {
      low: '試下學啲安慰自己嘅方法！',
      lowEn: 'Try learning ways to comfort yourself!',
      medium: '搵人幫手都係好方法！',
      mediumEn: 'Asking for help is also good!',
      high: '你好識照顧自己嘅情緒！',
      highEn: 'You\'re great at caring for your emotions!'
    }
  }
];

// ============================================
// 匯出所有問題
// ============================================

export const gameQuestions: GameQuestion[] = [
  ...recognizingQuestions,
  ...understandingQuestions,
  ...labelingQuestions,
  ...expressingQuestions,
  ...regulatingQuestions
];

// 按技能分組
export const gameQuestionsBySkill: Record<SkillType, GameQuestion[]> = {
  recognizing: recognizingQuestions,
  understanding: understandingQuestions,
  labeling: labelingQuestions,
  expressing: expressingQuestions,
  regulating: regulatingQuestions
};

// 遊戲元數據
export const gameMetadata = {
  totalQuestions: 20,
  questionsPerSkill: 4,
  maxScorePerQuestion: 3,
  maxScorePerSkill: 12,
  skills: ['recognizing', 'understanding', 'labeling', 'expressing', 'regulating'] as SkillType[]
};
