// Copied and adapted from mockAssessmentDeliveries.ts
import { SurveyDelivery } from '@/types/surveyDelivery';

export const mockSurveyDeliveries: SurveyDelivery[] = [
  {
    id: 'sdlv-001',
    surveyId: 'survey-001',
    surveyTitle: '従業員満足度調査 (年次) - 2023年Q4',
    deliveryName: '2023年度 第4四半期 従業員満足度調査',
    targets: [
      { type: 'company', id: 'comp-all', name: '全社' },
    ],
    startDate: '2023-11-01T00:00:00Z',
    endDate: '2023-11-30T23:59:59Z',
    status: 'completed',
    createdAt: '2023-10-25T00:00:00Z',
    totalParticipants: 200,
    completedParticipants: 180,
    completionRate: 90,
  },
  {
    id: 'sdlv-002',
    surveyId: 'survey-002',
    surveyTitle: '組織文化サーベイ - 2024年パイロット',
    deliveryName: '組織文化サーベイ (パイロット実施)',
    targets: [
      { type: 'group', id: 'grp-dev', name: '開発部門' },
      { type: 'group', id: 'grp-sales', name: '営業部門' },
    ],
    startDate: '2024-02-01T00:00:00Z',
    endDate: '2024-02-28T23:59:59Z',
    status: 'active',
    createdAt: '2024-01-15T00:00:00Z',
    totalParticipants: 80,
    completedParticipants: 40,
    completionRate: 50,
  },
  {
    id: 'sdlv-003',
    surveyId: 'survey-003',
    surveyTitle: '新人研修後フィードバックアンケート - 24卒',
    deliveryName: '2024年度新卒研修 フィードバック',
    targets: [
      { type: 'group', id: 'grp-newbies-2024', name: '2024年度新入社員' },
    ],
    startDate: '2024-04-15T00:00:00Z',
    endDate: '2024-04-30T23:59:59Z',
    status: 'scheduled',
    createdAt: '2024-04-01T00:00:00Z',
    totalParticipants: 30,
    completedParticipants: 0,
    completionRate: 0,
  },
];
