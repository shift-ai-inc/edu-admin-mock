export interface SurveyVersion {
  id: string; // e.g., "SV1", "SV2" - unique within a SurveyDefinition
  surveyDefinitionId: string; // Foreign key to SurveyDefinition
  versionNumber: number;
  status: 'draft' | 'active' | 'archived';
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  createdBy?: string; // User ID or name
  changelog?: string;
}
