export type SurveyType = "multiple-choice" | "coding-test" | "scenario-based" | "video-submission";
export type SurveyDifficulty = "beginner" | "intermediate" | "advanced" | "expert";
export type SkillLevel = "entry" | "junior" | "mid-level" | "senior" | "lead"; // Assuming SkillLevel is generic, or rename if Survey has different levels
export type VersionStatus = "draft" | "published" | "archived";
export type QuestionType = "multiple-choice" | "single-choice" | "free-text" | "code";
export type QuestionDifficulty = "easy" | "medium" | "hard";

export interface Survey {
  id: string;
  title: string;
  type: SurveyType;
  difficulty: SurveyDifficulty;
  targetSkillLevel: SkillLevel[]; // Or a more generic "targetAudience"
  estimatedDurationMinutes: number;
  description: string;
  thumbnailUrl?: string;
  isPopular?: boolean;
  isRecommended?: boolean;
  questionsCount: number; // Total questions in the latest/active version
  createdAt: Date;
  updatedAt: Date;
}

export interface Question { // This Question interface can be shared or duplicated/adapted for Survey context
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  correctAnswer?: string | string[]; // May not apply to all survey questions
  points: number; // May not apply to all survey questions
  category: string;
  difficulty: QuestionDifficulty;
}

export interface QuestionVersion { // This QuestionVersion can be shared or duplicated/adapted
  id: string;
  questionId: string;
  versionNumber: number;
  questionData: Question;
  createdAt: Date;
  createdBy: string;
  status: VersionStatus;
  changeLog: string;
}

export interface SurveyVersion {
  id:string;
  surveyId: string; // ID of the parent survey
  versionNumber: number;
  description: string;
  questions: QuestionVersion[];
  questionCount: number;
  createdAt: Date;
  createdBy: string;
  status: VersionStatus;
  publishedAt?: Date;
}

export const SURVEY_TYPES: SurveyType[] = ["multiple-choice", "coding-test", "scenario-based", "video-submission"];
export const SURVEY_DIFFICULTIES: SurveyDifficulty[] = ["beginner", "intermediate", "advanced", "expert"];
export const SKILL_LEVELS: SkillLevel[] = ["entry", "junior", "mid-level", "senior", "lead"]; // Re-evaluate if this applies to Survey
export const QUESTION_DIFFICULTIES: QuestionDifficulty[] = ['easy','medium', 'hard']; // Corrected based on type

export const getSurveyTypeName = (type: SurveyType): string => {
  switch (type) {
    case "multiple-choice": return "多肢選択式";
    case "coding-test": return "コーディングテスト"; // Re-evaluate if this type name is suitable for Survey
    case "scenario-based": return "シナリオベース";
    case "video-submission": return "動画提出";
    default: return type;
  }
};

export const getSurveyDifficultyName = (difficulty: SurveyDifficulty): string => {
  switch (difficulty) {
    case "beginner": return "初級";
    case "intermediate": return "中級";
    case "advanced": return "上級";
    case "expert": return "エキスパート";
    default: return difficulty;
  }
};

export const getSkillLevelName = (level: SkillLevel): string => { // Re-evaluate if this applies to Survey
  switch (level) {
    case "entry": return "入門";
    case "junior": return "ジュニア";
    case "mid-level": return "ミドル";
    case "senior": return "シニア";
    case "lead": return "リード";
    default: return level;
  }
};

export const getVersionStatusName = (status: VersionStatus): string => {
  switch (status) {
    case "draft": return "下書き";
    case "published": return "公開中";
    case "archived": return "アーカイブ済";
    default: return status;
  }
};

export const getQuestionTypeName = (type: QuestionType): string => {
  switch (type) {
    case "multiple-choice": return "多肢選択";
    case "single-choice": return "単一選択";
    case "free-text": return "自由記述";
    case "code": return "コード記述";
    default: return type;
  }
};

export const getQuestionDifficultyName = (difficulty: QuestionDifficulty): string => {
  switch (difficulty) {
    case "easy": return "易";
    case "medium": return "中";
    case "hard": return "難";
    default: return difficulty;
  }
};

// Add missing types and functions that are being imported in other files
export interface SurveyDetail extends Survey {
  categories: Array<{ name: string; questionCount: number }>;
  skillAreas: string[];
  tags: string[];
  skillLevel: SkillLevel;
  estimatedTime: number;
  targetAudience?: string[];
  measurableItems?: string[];
  structureDescription: string;
  statistics: {
    totalDeliveries?: number;
    completionRate?: number;
    lastDelivered?: string;
  };
  category?: string;
  sampleQuestions: Array<SampleQuestion>;
  usageCount?: number;
  questions: {
    text: string;
    type: QuestionType;
    category: string;
    difficulty: QuestionDifficulty;
  }[];
}

export interface AvailableSurvey {
  id: string;
  title: string;
  type: SurveyType;
  difficulty: SurveyDifficulty;
  targetSkillLevel: SkillLevel[];
  estimatedTime: number; // in minutes
  description: string;
  thumbnailUrl?: string;
}

export interface SampleQuestion {
  id: string;
  text: string;
  type: string;
  options?: string[];
}

export interface SurveyQuestionVersion extends QuestionVersion {
  // Any additional fields specific to survey question versions
}

// Alias functions for backward compatibility
export const getDifficultyText = getSurveyDifficultyName;
export const getSkillLevelText = getSkillLevelName;

// Function to get mock survey detail (referenced in Survey.tsx)
export const getMockSurveyDetail = (id: string): SurveyDetail => {
  // Return a mock survey detail object
  return {
    id,
    title: "モックアンケート",
    type: "multiple-choice",
    difficulty: "beginner",
    targetSkillLevel: ["entry"],
    estimatedDurationMinutes: 15,
    description: "これはモックアンケートです",
    questionsCount: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
    categories: [
      { name: "一般", questionCount: 3 },
      { name: "フィードバック", questionCount: 2 }
    ],
    skillAreas: ["一般スキル"],
    tags: ["研修", "フィードバック"],
    skillLevel: "entry",
    estimatedTime: 15,
    structureDescription: "このアンケートは一般的なフィードバック質問を含みます。",
    statistics: {
      totalDeliveries: 0,
      completionRate: 0
    },
    category: "フィードバック",
    sampleQuestions: [
      {
        id: "sample1",
        text: "この研修内容全般について、どの程度満足しましたか？",
        type: "rating"
      }
    ],
    targetAudience: ["新入社員", "中堅社員"],
    measurableItems: ["満足度", "理解度"],
    questions: [
      {
        text: "この研修内容全般について、どの程度満足しましたか？",
        type: "multiple-choice",
        category: "フィードバック",
        difficulty: "easy"
      }
    ]
  };
};

// Survey delivery types
export interface SurveyDeliveryTarget {
  type: 'user' | 'group' | 'company';
  id: string;
  name: string;
}

export interface SurveyDelivery {
  id: string;
  surveyId: string;
  surveyTitle: string;
  deliveryName: string;
  targets: SurveyDeliveryTarget[];
  startDate: string;
  endDate: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
  totalParticipants: number;
  completedParticipants: number;
  completionRate: number;
}
