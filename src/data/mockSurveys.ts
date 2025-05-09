// Copied and adapted from mockAssessments.ts
import { AvailableSurvey } from '@/types/survey';

export const mockAvailableSurveys: AvailableSurvey[] = [
  {
    id: 'survey-001',
    title: '従業員満足度調査 (年次)',
    description: '従業員の満足度、エンゲージメント、職場環境に関する包括的な調査です。',
    thumbnailUrl: '/images/survey-satisfaction-thumb.png', // Placeholder path
    type: '従業員満足度',
    difficulty: 'easy', // Kept for structure
    skillLevel: 'all',
    estimatedTime: 20,
    isPopular: true,
    isRecommended: true,
    tags: ['満足度', 'エンゲージメント', 'HR'],
    category: '満足度調査',
    createdAt: '2023-11-01T10:00:00Z',
    usageCount: 250,
  },
  {
    id: 'survey-002',
    title: '組織文化サーベイ',
    description: '現在の組織文化の強みと弱みを特定し、改善のためのインサイトを得ます。',
    thumbnailUrl: '/images/survey-culture-thumb.png', // Placeholder path
    type: '組織文化',
    difficulty: 'medium', // Kept for structure
    skillLevel: 'all',
    estimatedTime: 25,
    isPopular: false,
    isRecommended: true,
    tags: ['組織文化', '風土改革', 'HR'],
    category: '組織診断',
    createdAt: '2023-10-10T14:30:00Z',
    usageCount: 120,
  },
  {
    id: 'survey-003',
    title: '新人研修後フィードバックアンケート',
    description: '新人研修プログラムの効果測定と改善点収集のためのアンケートです。',
    thumbnailUrl: '/images/survey-training-thumb.png', // Placeholder path
    type: '研修後フィードバック',
    difficulty: 'easy', // Kept for structure
    skillLevel: 'all',
    estimatedTime: 10,
    isPopular: true,
    isRecommended: false,
    tags: ['研修', 'フィードバック', '新人'],
    category: '研修評価',
    createdAt: '2024-01-20T09:00:00Z',
    usageCount: 180,
  },
  {
    id: 'survey-004',
    title: 'リモートワーク環境調査',
    description: 'リモートワークを行っている従業員の作業環境、課題、満足度を把握します。',
    thumbnailUrl: '/images/survey-remote-thumb.png', // Placeholder path
    type: 'その他',
    difficulty: 'easy', // Kept for structure
    skillLevel: 'all',
    estimatedTime: 15,
    isPopular: false,
    isRecommended: true,
    tags: ['リモートワーク', '働き方改革'],
    category: 'その他',
    createdAt: '2023-12-15T11:00:00Z',
    usageCount: 95,
  },
];
