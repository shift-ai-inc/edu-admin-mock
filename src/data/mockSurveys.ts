import { Survey, SurveyType, SurveyDifficulty, SkillLevel } from '@/types/survey';

export let mockSurveys: Survey[] = [
  {
    id: 'survey-001',
    title: '従業員満足度サーベイ 2024 Q1',
    type: 'multiple-choice',
    difficulty: 'beginner', // Difficulty might not be directly applicable, or represent complexity
    targetSkillLevel: ['entry', 'junior', 'mid-level', 'senior', 'lead'], // Or target audience
    estimatedDurationMinutes: 15,
    description: '四半期ごとの従業員満足度を測るためのサーベイです。',
    thumbnailUrl: 'https://via.placeholder.com/150/FFC107/000000?Text=Survey1',
    isPopular: true,
    isRecommended: true,
    questionsCount: 10,
    createdAt: new Date('2024-01-10T09:00:00Z'),
    updatedAt: new Date('2024-01-15T14:30:00Z'),
  },
  {
    id: 'survey-002',
    title: '新製品アイデア募集サーベイ',
    type: 'multiple-choice', // Fixed to a valid SurveyType
    difficulty: 'intermediate',
    targetSkillLevel: ['mid-level', 'senior'],
    estimatedDurationMinutes: 20,
    description: '次期製品ラインナップのための新しいアイデアを募集します。',
    thumbnailUrl: 'https://via.placeholder.com/150/4CAF50/FFFFFF?Text=Survey2',
    isPopular: false,
    isRecommended: true,
    questionsCount: 5,
    createdAt: new Date('2024-02-01T10:00:00Z'),
    updatedAt: new Date('2024-02-05T11:00:00Z'),
  },
  {
    id: 'survey-003',
    title: '社内研修効果測定サーベイ',
    type: 'scenario-based', // Changed to scenario-based for effect measurement
    difficulty: 'advanced',
    targetSkillLevel: ['junior', 'mid-level'],
    estimatedDurationMinutes: 30,
    description: '先日実施されたリーダーシップ研修の効果を測定するためのサーベイです。',
    thumbnailUrl: 'https://via.placeholder.com/150/2196F3/FFFFFF?Text=Survey3',
    isPopular: true,
    isRecommended: false,
    questionsCount: 12,
    createdAt: new Date('2024-03-15T13:00:00Z'),
    updatedAt: new Date('2024-03-20T16:00:00Z'),
  },
];

export const updateMockSurvey = (
  id: string,
  data: Partial<Omit<Survey, 'id' | 'createdAt' | 'questionsCount'>> & { targetSkillLevel: SkillLevel[] }
): Survey | null => {
  const surveyIndex = mockSurveys.findIndex(s => s.id === id);
  if (surveyIndex === -1) {
    return null;
  }
  const originalSurvey = mockSurveys[surveyIndex];
  const updatedSurvey: Survey = {
    ...originalSurvey,
    ...data,
    updatedAt: new Date(),
  };
  mockSurveys[surveyIndex] = updatedSurvey;
  return updatedSurvey;
};
