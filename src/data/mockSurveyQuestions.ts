// Mock data for Survey Questions

import { SurveyQuestion } from '@/types/survey-question';

export const mockSurveyQuestions: Record<string, Record<string, SurveyQuestion[]>> = {
  "SDEF-001": { // 従業員エンゲージメントサーベイ
    "SV1-SDEF-001": [ // Version 1
      {
        id: "SQ-001-V1-1", surveyDefinitionId: "SDEF-001", versionId: "SV1-SDEF-001", order: 1,
        text: "現在の仕事に満足していますか？", type: "rating-scale", // Assuming 1-5 scale
        // options: [{id: "1", text:"全く満足していない"}, ..., {id:"5", text:"非常に満足している"}], // Could be implied by type
        points: undefined, category: "仕事の満足度", isRequired: true,
        createdAt: "2023-02-05T10:01:00Z", updatedAt: "2023-02-05T10:01:00Z"
      },
      {
        id: "SQ-001-V1-2", surveyDefinitionId: "SDEF-001", versionId: "SV1-SDEF-001", order: 2,
        text: "上司とのコミュニケーションは良好ですか？", type: "single-choice",
        options: [{id: "opt1", text: "はい"}, {id: "opt2", text: "いいえ"}, {id: "opt3", text: "どちらとも言えない"}],
        points: undefined, category: "人間関係", isRequired: true,
        createdAt: "2023-02-05T10:02:00Z", updatedAt: "2023-02-05T10:02:00Z"
      },
      {
        id: "SQ-001-V1-3", surveyDefinitionId: "SDEF-001", versionId: "SV1-SDEF-001", order: 3,
        text: "その他、職場環境についてご意見があれば自由にお書きください。", type: "text",
        points: undefined, category: "職場環境", isRequired: false,
        createdAt: "2023-02-05T10:03:00Z", updatedAt: "2023-02-05T10:03:00Z"
      },
    ],
    "SV2-SDEF-001": [ // Version 2 (Draft)
      {
        id: "SQ-001-V2-1", surveyDefinitionId: "SDEF-001", versionId: "SV2-SDEF-001", order: 1,
        text: "現在の業務内容にやりがいを感じますか？ (1-5段階評価)", type: "rating-scale",
        points: undefined, category: "仕事のやりがい", isRequired: true,
        createdAt: "2023-08-15T11:01:00Z", updatedAt: "2023-08-15T11:01:00Z"
      },
      {
        id: "SQ-001-V2-2", surveyDefinitionId: "SDEF-001", versionId: "SV2-SDEF-001", order: 2,
        text: "会社のビジョンに共感できますか？", type: "single-choice",
        options: [{id: "optA", text: "強く共感する"}, {id: "optB", text: "共感する"}, {id: "optC", text: "どちらでもない"}, {id: "optD", text: "あまり共感しない"}, {id: "optE", text: "全く共感しない"}],
        points: undefined, category: "企業文化", isRequired: true,
        createdAt: "2023-08-15T11:02:00Z", updatedAt: "2023-08-15T11:02:00Z"
      },
    ],
  },
  "SDEF-002": { // 顧客満足度調査 (CSAT)
    "SV1-SDEF-002": [ // Version 1
      {
        id: "SQ-002-V1-1", surveyDefinitionId: "SDEF-002", versionId: "SV1-SDEF-002", order: 1,
        text: "当社の製品/サービス全般について、どの程度満足されていますか？ (5段階評価: 1=非常に不満 ~ 5=非常に満足)", type: "rating-scale",
        points: undefined, category: "総合満足度", isRequired: true,
        createdAt: "2023-03-15T09:01:00Z", updatedAt: "2023-03-15T09:01:00Z"
      },
      {
        id: "SQ-002-V1-2", surveyDefinitionId: "SDEF-002", versionId: "SV1-SDEF-002", order: 2,
        text: "当社の製品/サービスを他の方に薦めたいと思いますか？ (NPS: 0=全く思わない ~ 10=非常にそう思う)", type: "nps",
        points: undefined, category: "推奨度", isRequired: true,
        createdAt: "2023-03-15T09:02:00Z", updatedAt: "2023-03-15T09:02:00Z"
      },
    ],
  },
};

export const getQuestionsForSurveyVersion = (surveyDefId: string, versionId: string): SurveyQuestion[] => {
  return mockSurveyQuestions[surveyDefId]?.[versionId]?.sort((a, b) => a.order - b.order) || [];
};

export const findSurveyQuestionById = (surveyDefId: string, versionId: string, questionId: string): SurveyQuestion | undefined => {
  const questions = getQuestionsForSurveyVersion(surveyDefId, versionId);
  return questions.find(q => q.id === questionId);
};
