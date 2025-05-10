export type AssessmentType = "multiple-choice" | "coding-test" | "scenario-based" | "video-submission";
export type AssessmentDifficulty = "beginner" | "intermediate" | "advanced" | "expert";
export type SkillLevel = "entry" | "junior" | "mid-level" | "senior" | "lead";
export type VersionStatus = "draft" | "published" | "archived";
export type QuestionType = "multiple-choice" | "single-choice" | "free-text" | "code"; // Renamed for clarity
export type QuestionDifficulty = "easy" | "medium" | "hard"; // Specific difficulty for questions

export interface Assessment {
  id: string;
  title: string;
  type: AssessmentType;
  difficulty: AssessmentDifficulty;
  targetSkillLevel: SkillLevel[];
  estimatedDurationMinutes: number;
  description: string;
  thumbnailUrl?: string;
  isPopular?: boolean;
  isRecommended?: boolean;
  questionsCount: number; // Total questions in the latest/active version
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType; // Used as answer format
  options?: string[];
  correctAnswer?: string | string[];
  points: number; // 配点
  category: string; // カテゴリ (e.g., "React Hooks", "JavaScript Fundamentals")
  difficulty: QuestionDifficulty; // 設問自体の難易度
  // For code questions, evaluation criteria might be more complex
}

export interface QuestionVersion {
  id: string; // Unique ID for this question version
  questionId: string; // ID of the parent question
  versionNumber: number;
  questionData: Question; // The actual content of the question for this version
  createdAt: Date;
  createdBy: string; // User ID or name
  status: VersionStatus;
  changeLog: string; // Description of changes in this version
}

export interface AssessmentVersion {
  id:string; // Unique ID for this assessment version
  assessmentId: string; // ID of the parent assessment
  versionNumber: number;
  description: string; // Version specific description or notes
  questions: QuestionVersion[]; // Array of question versions included in this assessment version
  questionCount: number; // Number of questions in this version
  createdAt: Date;
  createdBy: string; // User ID or name
  status: VersionStatus; // e.g., draft, published, archived
  publishedAt?: Date;
}

export const ASSESSMENT_TYPES: AssessmentType[] = ["multiple-choice", "coding-test", "scenario-based", "video-submission"];
export const ASSESSMENT_DIFFICULTIES: AssessmentDifficulty[] = ["beginner", "intermediate", "advanced", "expert"];
export const SKILL_LEVELS: SkillLevel[] = ["entry", "junior", "mid-level", "senior", "lead"];
export const QUESTION_DIFFICULTIES = ['easy','medium']

export const getAssessmentTypeName = (type: AssessmentType): string => {
  switch (type) {
    case "multiple-choice": return "多肢選択式";
    case "coding-test": return "コーディングテスト";
    case "scenario-based": return "シナリオベース";
    case "video-submission": return "動画提出";
    default: return type;
  }
};

export const getAssessmentDifficultyName = (difficulty: AssessmentDifficulty): string => {
  switch (difficulty) {
    case "beginner": return "初級";
    case "intermediate": return "中級";
    case "advanced": return "上級";
    case "expert": return "エキスパート";
    default: return difficulty;
  }
};

export const getSkillLevelName = (level: SkillLevel): string => {
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
export interface AssessmentDetail extends Assessment {
  categories: Array<{ name: string; questionCount: number }>;
  skillAreas: string[];
  tags: string[];
  targetSkills: string[];
  skillLevel: SkillLevel;
  estimatedTime: number;
  measurableAbilities: string[];
  structureDescription: string;
  difficultyDistribution: {
    easy: number;
    medium: number;
    hard: number;
  };
  sampleQuestions: Array<{
    id: string;
    type: string;
    text: string;
  }>;
  statistics: {
    averageScore: number;
    totalAttempts: number;
    completionRate: number;
    avgCompletionTime: number;
    totalDeliveries: number;
    lastDelivered?: string;
  };
  questions: {
    text: string;
    type: QuestionType;
    category: string;
    difficulty: QuestionDifficulty;
  }[];
  usageCount?: number;
}

export interface AvailableAssessment {
  id: string;
  title: string;
  type: AssessmentType;
  difficulty: AssessmentDifficulty;
  targetSkillLevel: SkillLevel[];
  estimatedTime: number; // in minutes
  description: string;
  thumbnailUrl?: string;
}

// Alias functions for backward compatibility
export const getDifficultyText = getAssessmentDifficultyName;
export const getSkillLevelText = getSkillLevelName;
