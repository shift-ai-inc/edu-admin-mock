import { Assessment, AssessmentVersion } from '@/types/assessment-version';

// Mock data for assessments (basic info)
export const mockAssessments: Assessment[] = [
  { id: "ASS-001", title: "リーダーシップ能力診断", description: "管理職向けのリーダーシップスキルを評価します。", category: "マネジメント", createdAt: "2023-01-05T00:00:00Z", updatedAt: "2023-01-05T00:00:00Z" },
  { id: "ASS-002", title: "エンジニアスキル評価", description: "ソフトウェアエンジニアの技術力を測定します。", category: "技術", createdAt: "2023-02-10T00:00:00Z", updatedAt: "2023-02-10T00:00:00Z" },
  { id: "ASS-003", title: "コミュニケーション能力テスト", description: "職場におけるコミュニケーション能力を測ります。", category: "ソフトスキル", createdAt: "2023-03-15T00:00:00Z", updatedAt: "2023-03-15T00:00:00Z" },
];

// Mock data for assessment versions, keyed by assessmentId
export const mockAssessmentVersions: Record<string, AssessmentVersion[]> = {
  "ASS-001": [
    { 
      id: "V1", 
      assessmentId: "ASS-001", 
      versionNumber: 1, 
      status: "archived", 
      createdAt: "2023-01-10T09:00:00Z", 
      updatedAt: "2023-03-01T12:00:00Z", 
      createdBy: "admin@example.com",
      changelog: "Initial version." 
    },
    { 
      id: "V2", 
      assessmentId: "ASS-001", 
      versionNumber: 2, 
      status: "active", 
      createdAt: "2023-05-15T10:00:00Z", 
      updatedAt: "2023-05-20T15:00:00Z", 
      createdBy: "editor@example.com",
      changelog: "Updated questions based on feedback. Added new scenarios." 
    },
     { 
      id: "V3", 
      assessmentId: "ASS-001", 
      versionNumber: 3, 
      status: "draft", 
      createdAt: "2024-01-20T11:00:00Z", 
      updatedAt: "2024-01-25T16:00:00Z", 
      createdBy: "admin@example.com",
      changelog: "Preparing for Q2 rollout. Added 1 new question." 
    },
  ],
  "ASS-002": [
    { 
      id: "V1", 
      assessmentId: "ASS-002", 
      versionNumber: 1, 
      status: "active", 
      createdAt: "2023-03-01T13:00:00Z", 
      updatedAt: "2023-03-05T10:00:00Z", 
      createdBy: "techlead@example.com",
      changelog: "First version for new hires." 
    },
    { 
      id: "V2", 
      assessmentId: "ASS-002", 
      versionNumber: 2, 
      status: "draft", 
      createdAt: "2023-08-01T14:00:00Z", 
      updatedAt: "2023-08-10T11:00:00Z", 
      createdBy: "techlead@example.com",
      changelog: "Revised based on latest framework updates." 
    },
  ],
  "ASS-003": [
    { 
      id: "V1", 
      assessmentId: "ASS-003", 
      versionNumber: 1, 
      status: "draft", 
      createdAt: "2023-04-01T16:00:00Z", 
      updatedAt: "2023-04-05T17:00:00Z", 
      createdBy: "hr@example.com",
      changelog: "Initial draft for internal review." 
    },
  ],
};

// Helper function to find an assessment by its ID
export const findAssessmentById = (assessmentId: string): Assessment | undefined => {
  return mockAssessments.find(assessment => assessment.id === assessmentId);
};

// Helper function to get all versions for a specific assessment
export const getVersionsForAssessment = (assessmentId: string): AssessmentVersion[] => {
  return mockAssessmentVersions[assessmentId] || [];
};

// Helper function to find a specific version by assessment ID and version ID
export const findVersionById = (assessmentId: string, versionId: string): AssessmentVersion | undefined => {
  const versions = getVersionsForAssessment(assessmentId);
  return versions.find(version => version.id === versionId);
};
