// src/types/index.ts
export * from './billing';
export * from './system-admin';
export * from './displayable-versions';

// Import and re-export only what's needed to avoid conflicts
// From assessment
import { 
  Assessment, 
  AssessmentType, 
  AssessmentDifficulty,
  AssessmentVersion,
  getAssessmentTypeName,
  getAssessmentDifficultyName
} from './assessment';

// From survey
import {
  Survey,
  SurveyType,
  SurveyDifficulty,
  SurveyVersion,
  getSurveyTypeName,
  getSurveyDifficultyName
} from './survey';

// Shared exports from assessment
export type { Assessment };
export type { AssessmentType };
export type { AssessmentDifficulty };
export type { AssessmentVersion };
export { getAssessmentTypeName, getAssessmentDifficultyName };

// Shared exports from survey
export type { Survey };
export type { SurveyType };
export type { SurveyDifficulty };
export type { SurveyVersion };
export { getSurveyTypeName, getSurveyDifficultyName };

// Import and export survey definition
export * from './survey-definition';
