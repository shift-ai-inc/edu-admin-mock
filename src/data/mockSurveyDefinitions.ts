// Mock data for Survey Definitions and their Versions

import { SurveyDefinition } from '@/types/survey-definition';
import { SurveyVersion } from '@/types/survey-version';

export const mockSurveyDefinitions: SurveyDefinition[] = [
  {
    id: "SDEF-001",
    title: "従業員エンゲージメントサーベイ",
    description: "従業員のエンゲージメントレベルを測定するための標準サーベイです。",
    category: "エンゲージメント",
    createdAt: "2023-02-01T00:00:00Z",
    updatedAt: "2023-02-01T00:00:00Z",
  },
  {
    id: "SDEF-002",
    title: "顧客満足度調査 (CSAT)",
    description: "製品・サービスに対する顧客満足度を測るための調査です。",
    category: "顧客満足度",
    createdAt: "2023-03-10T00:00:00Z",
    updatedAt: "2023-03-10T00:00:00Z",
  },
];

export const mockSurveyDefinitionVersions: Record<string, SurveyVersion[]> = {
  "SDEF-001": [
    {
      id: "SV1-SDEF-001",
      surveyDefinitionId: "SDEF-001",
      versionNumber: 1,
      status: "active",
      createdAt: "2023-02-05T10:00:00Z",
      updatedAt: "2023-02-05T10:00:00Z",
      createdBy: "admin@example.com",
      changelog: "初期バージョン",
    },
    {
      id: "SV2-SDEF-001",
      surveyDefinitionId: "SDEF-001",
      versionNumber: 2,
      status: "draft",
      createdAt: "2023-08-15T11:00:00Z",
      updatedAt: "2023-08-16T11:00:00Z",
      createdBy: "editor@example.com",
      changelog: "質問項目を一部見直し、新しい評価軸を追加。",
    },
  ],
  "SDEF-002": [
    {
      id: "SV1-SDEF-002",
      surveyDefinitionId: "SDEF-002",
      versionNumber: 1,
      status: "active",
      createdAt: "2023-03-15T09:00:00Z",
      updatedAt: "2023-03-15T09:00:00Z",
      createdBy: "marketing@example.com",
      changelog: "標準CSAT設問セット",
    },
  ],
};

export const findSurveyDefinitionById = (surveyDefId: string): SurveyDefinition | undefined => {
  return mockSurveyDefinitions.find(def => def.id === surveyDefId);
};

export const getVersionsForSurveyDefinition = (surveyDefId: string): SurveyVersion[] => {
  return mockSurveyDefinitionVersions[surveyDefId]?.sort((a, b) => b.versionNumber - a.versionNumber) || [];
};

export const findSurveyVersionById = (surveyDefId: string, versionId: string): SurveyVersion | undefined => {
  const versions = getVersionsForSurveyDefinition(surveyDefId);
  return versions.find(v => v.id === versionId);
};
