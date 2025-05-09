// Define shared types for surveys (copied from assessment.ts)

export interface AvailableSurvey {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  type: '従業員満足度' | '組織文化' | '研修後フィードバック' | 'その他'; // Survey specific types
  difficulty: 'easy' | 'medium' | 'hard'; // May not be relevant for all surveys, but kept for structure
  skillLevel: 'all'; // Typically 'all' for surveys
  estimatedTime: number; // minutes
  isPopular: boolean;
  isRecommended: boolean;
  tags: string[];
  category: string; // e.g., '満足度調査', '組織診断'
  createdAt: string; // ISO date string
  usageCount: number;
}

export interface SurveyCategory { // Renamed from AssessmentCategory
  name: string;
  questionCount: number;
}

export interface DifficultyDistribution { // Kept for structure, may be less relevant
  easy: number;
  medium: number;
  hard: number;
}

export interface SampleQuestion {
  id: string;
  text: string;
  type: 'multiple-choice' | 'text' | 'rating' | 'scale'; // Added 'scale' for Likert etc.
}

export interface SurveyStatistics { // Renamed from AssessmentStatistics
  totalDeliveries: number;
  averageScore?: number; // Optional, might not apply to all types
  completionRate?: number; // Optional
  lastDelivered?: string; // ISO date string or formatted date
}

// Detailed Survey type extending the base AvailableSurvey
export interface SurveyDetail extends AvailableSurvey { // Renamed from AssessmentDetail
  structureDescription: string; // e.g., "全30問: 選択式25問、自由記述5問。"
  categories: SurveyCategory[]; // Breakdown by category/section
  difficultyDistribution: DifficultyDistribution; // Kept for structure
  sampleQuestions: SampleQuestion[];
  targetAudience: string[]; // e.g., '全従業員', '新入社員', '管理職'
  measurableItems: string[]; // Items/constructs measured
  statistics: SurveyStatistics; // Delivery stats
}


// Helper function to get display text for difficulty (kept for structure)
export const getDifficultyText = (difficulty: AvailableSurvey['difficulty']) => {
  switch (difficulty) {
    case 'easy': return '易しい';
    case 'medium': return '普通';
    case 'hard': return '難しい';
    default: return '';
  }
};

// Helper function to get display text for skill level (kept for structure, typically 'all')
export const getSkillLevelText = (level: AvailableSurvey['skillLevel']) => {
  switch (level) {
    case 'all': return '全対象';
    default: return '';
  }
};

// Moved from src/data/mockSurveyDetails.ts
export const mockSurveyDetailsMap: Map<string, SurveyDetail> = new Map([
  [
    'survey-001',
    {
      id: 'survey-001',
      title: '従業員満足度調査 (年次)',
      description: '従業員の満足度、エンゲージメント、職場環境に関する包括的な調査です。',
      thumbnailUrl: '/images/survey-satisfaction-thumb.png',
      type: '従業員満足度',
      difficulty: 'easy',
      skillLevel: 'all',
      estimatedTime: 20,
      isPopular: true,
      isRecommended: true,
      tags: ['満足度', 'エンゲージメント', 'HR'],
      category: '満足度調査',
      createdAt: '2023-11-01T10:00:00Z',
      usageCount: 250,
      structureDescription: '全5セクション、合計40問。主に5段階評価スケールを使用し、一部自由記述を含みます。',
      categories: [
        { name: '仕事内容について', questionCount: 8 },
        { name: '職場環境について', questionCount: 10 },
        { name: '上司・同僚との関係', questionCount: 7 },
        { name: '成長機会とキャリアパス', questionCount: 8 },
        { name: '会社全体について', questionCount: 7 },
      ],
      difficultyDistribution: { easy: 40, medium: 0, hard: 0 }, // Simplified for survey
      sampleQuestions: [
        { id: 'q1', text: '現在の仕事内容に満足していますか？', type: 'scale' },
        { id: 'q2', text: '職場の物理的な環境は快適ですか？', type: 'scale' },
        { id: 'q3', text: '改善してほしい点があれば自由にご記入ください。', type: 'text' },
      ],
      targetAudience: ['全従業員'],
      measurableItems: ['仕事満足度', '職場環境満足度', '人間関係', '成長実感', '会社への帰属意識'],
      statistics: {
        totalDeliveries: 5,
        completionRate: 85, // Example
        lastDelivered: '2023-11-15T00:00:00Z',
      },
    },
  ],
  [
    'survey-002',
    {
      id: 'survey-002',
      title: '組織文化サーベイ',
      description: '現在の組織文化の強みと弱みを特定し、改善のためのインサイトを得ます。',
      thumbnailUrl: '/images/survey-culture-thumb.png',
      type: '組織文化',
      difficulty: 'medium',
      skillLevel: 'all',
      estimatedTime: 25,
      isPopular: false,
      isRecommended: true,
      tags: ['組織文化', '風土改革', 'HR'],
      category: '組織診断',
      createdAt: '2023-10-10T14:30:00Z',
      usageCount: 120,
      structureDescription: '全60問。組織文化の多面的な側面を測定します。',
      categories: [
        { name: 'コミュニケーション', questionCount: 10 },
        { name: 'リーダーシップ', questionCount: 10 },
        { name: '意思決定プロセス', questionCount: 10 },
        { name: 'イノベーションと変化への対応', questionCount: 10 },
        { name: 'チームワークと協力', questionCount: 10 },
        { name: '価値観と行動規範', questionCount: 10 },
      ],
      difficultyDistribution: { easy: 60, medium: 0, hard: 0 },
      sampleQuestions: [
        { id: 'q1', text: '組織内の情報共有はオープンであると感じますか？', type: 'scale' },
        { id: 'q2', text: '新しいアイデアや提案は歓迎される雰囲気ですか？', type: 'scale' },
      ],
      targetAudience: ['全従業員', '管理職層'],
      measurableItems: ['コミュニケーションの透明性', 'リーダーシップスタイル', '変化への適応力', '協調性'],
      statistics: {
        totalDeliveries: 3,
        completionRate: 78,
        lastDelivered: '2023-10-25T00:00:00Z',
      },
    },
  ],
  // Add more mock survey details as needed
]);

// Moved from src/data/mockSurveyDetails.ts
export const getMockSurveyDetail = (id: string): SurveyDetail | undefined => {
  return mockSurveyDetailsMap.get(id);
};
