export interface SurveyDefinition {
  id: string; // e.g., "SDEF-001"
  title: string;
  description?: string;
  category?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
