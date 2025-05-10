/**
 * Represents a displayable assessment version for UI tables and lists
 */
export interface DisplayableAssessmentVersion {
  assessmentId: string;
  assessmentTitle: string;
  versionId: string;
  versionNumber: number;
  createdAt: string;
  createdBy: string;
  status: 'draft' | 'active' | 'archived' | 'published';
  questionCount: number;
  updatedAt: string;
}

/**
 * Represents a displayable survey version for UI tables and lists
 */
export interface DisplayableSurveyVersion {
  surveyId: string;
  surveyTitle: string;
  versionId: string;
  versionNumber: number;
  createdAt: string;
  createdBy: string;
  status: 'draft' | 'active' | 'archived' | 'published';
  questionCount: number;
  updatedAt: string;
}
