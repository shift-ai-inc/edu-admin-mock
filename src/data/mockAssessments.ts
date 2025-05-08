import { Assessment } from '@/types/assessment';

export let mockAssessments: Assessment[] = [ // Changed to let for direct modification
  {
    id: 'asm-001',
    title: 'React基礎理解度テスト',
    type: 'multiple-choice',
    difficulty: 'beginner',
    targetSkillLevel: ['entry', 'junior'],
    estimatedDurationMinutes: 30,
    description: 'Reactの基本的な概念、コンポーネント、フックに関する知識を測るテストです。',
    thumbnailUrl: 'https://via.placeholder.com/150/007bff/ffffff?Text=React',
    isPopular: true,
    questionsCount: 20,
    createdAt: new Date('2023-01-15T09:00:00Z'),
    updatedAt: new Date('2023-01-20T14:30:00Z'),
  },
  {
    id: 'asm-002',
    title: 'JavaScriptアルゴリズムチャレンジ',
    type: 'coding-test',
    difficulty: 'intermediate',
    targetSkillLevel: ['junior', 'mid-level'],
    estimatedDurationMinutes: 60,
    description: 'JavaScriptを使用した基本的なアルゴリズム問題。効率的なコード記述能力を評価します。',
    thumbnailUrl: 'https://via.placeholder.com/150/f0db4f/000000?Text=JS',
    isRecommended: true,
    questionsCount: 5,
    createdAt: new Date('2023-02-10T11:00:00Z'),
    updatedAt: new Date('2023-02-12T16:00:00Z'),
  },
  {
    id: 'asm-003',
    title: 'カスタマーサポート対応シナリオ',
    type: 'scenario-based',
    difficulty: 'intermediate',
    targetSkillLevel: ['mid-level'],
    estimatedDurationMinutes: 45,
    description: '実際の顧客対応シナリオに基づき、問題解決能力とコミュニケーションスキルを評価します。',
    thumbnailUrl: 'https://via.placeholder.com/150/28a745/ffffff?Text=Support',
    questionsCount: 3,
    createdAt: new Date('2023-03-05T10:00:00Z'),
    updatedAt: new Date('2023-03-05T10:00:00Z'),
  },
  {
    id: 'asm-004',
    title: 'Pythonデータ分析基礎',
    type: 'coding-test',
    difficulty: 'beginner',
    targetSkillLevel: ['entry', 'junior'],
    estimatedDurationMinutes: 75,
    description: 'PandasとNumPyの基本操作を用いたデータ処理と分析のスキルを測ります。',
    thumbnailUrl: 'https://via.placeholder.com/150/34568B/ffffff?Text=Python',
    isPopular: true,
    isRecommended: true,
    questionsCount: 8,
    createdAt: new Date('2023-04-01T13:00:00Z'),
    updatedAt: new Date('2023-04-03T18:30:00Z'),
  },
  {
    id: 'asm-005',
    title: 'UI/UXデザイン原則テスト',
    type: 'multiple-choice',
    difficulty: 'intermediate',
    targetSkillLevel: ['junior', 'mid-level'],
    estimatedDurationMinutes: 40,
    description: 'ユーザビリティ、アクセシビリティ、デザイン原則に関する知識を問います。',
    thumbnailUrl: 'https://via.placeholder.com/150/ff69b4/ffffff?Text=UI/UX',
    questionsCount: 25,
    createdAt: new Date('2023-05-20T09:30:00Z'),
    updatedAt: new Date('2023-05-22T11:00:00Z'),
  },
  {
    id: 'asm-006',
    title: '高度なSQLクエリ作成',
    type: 'coding-test',
    difficulty: 'advanced',
    targetSkillLevel: ['mid-level', 'senior'],
    estimatedDurationMinutes: 90,
    description: '複雑なデータ抽出と操作のための高度なSQLクエリ作成能力を評価します。',
    thumbnailUrl: 'https://via.placeholder.com/150/6c757d/ffffff?Text=SQL',
    isRecommended: true,
    questionsCount: 4,
    createdAt: new Date('2023-06-15T15:00:00Z'),
    updatedAt: new Date('2023-06-18T10:00:00Z'),
  },
  {
    id: 'asm-007',
    title: 'プロジェクトマネジメント知識',
    type: 'multiple-choice',
    difficulty: 'intermediate',
    targetSkillLevel: ['mid-level'],
    estimatedDurationMinutes: 50,
    description: 'プロジェクト計画、実行、監視、終結に関する基本的な知識を測ります。',
    thumbnailUrl: 'https://via.placeholder.com/150/17a2b8/ffffff?Text=PM',
    questionsCount: 30,
    createdAt: new Date('2023-07-01T10:00:00Z'),
    updatedAt: new Date('2023-07-01T10:00:00Z'),
  },
  {
    id: 'asm-008',
    title: 'プレゼンテーションスキル評価（動画提出）',
    type: 'video-submission',
    difficulty: 'intermediate',
    targetSkillLevel: ['junior', 'mid-level', 'senior'],
    estimatedDurationMinutes: 15, // This is for the video length, actual effort might be more
    description: '指定されたトピックに関する短いプレゼンテーション動画を提出し、構成力や表現力を評価します。',
    thumbnailUrl: 'https://via.placeholder.com/150/fd7e14/ffffff?Text=Video',
    isPopular: true,
    questionsCount: 1, // Represents one submission task
    createdAt: new Date('2023-08-10T14:00:00Z'),
    updatedAt: new Date('2023-08-12T17:00:00Z'),
  },
];

export const updateMockAssessment = (assessmentId: string, updatedData: Partial<Omit<Assessment, 'id' | 'createdAt' | 'questionsCount'>>): Assessment | null => {
  const index = mockAssessments.findIndex(a => a.id === assessmentId);
  if (index !== -1) {
    mockAssessments[index] = { 
      ...mockAssessments[index], 
      ...updatedData, 
      updatedAt: new Date() 
    };
    return mockAssessments[index];
  }
  return null;
};
