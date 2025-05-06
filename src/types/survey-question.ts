export interface SurveyQuestion {
  id: string; // Unique identifier for the question (e.g., "SQ-001")
  surveyDefinitionId: string; // ID of the survey definition it belongs to
  versionId: string; // ID of the survey version it belongs to
  order: number; // Display order within the version
  text: string; // The question text itself
  type: 'single-choice' | 'multiple-choice' | 'text' | 'rating-scale' | 'nps'; // Example types
  options?: { id: string; text: string }[]; // Possible answers for choice questions
  // For rating-scale or NPS, specific properties might be needed, e.g., scaleMin, scaleMax
  points?: number; // Optional: Points if applicable
  category?: string; // Optional: e.g., "エンゲージメント", "満足度"
  difficulty?: 'easy' | 'medium' | 'hard'; // Optional: If applicable to surveys
  isRequired?: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface SurveyQuestionFormData {
  text: string;
  type: SurveyQuestion['type'];
  options: { text: string }[];
  points?: number;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  isRequired?: boolean;
}
