/**
 * Represents the basic details of an assessment.
 */
export interface Assessment {
  id: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents a specific version of an assessment.
 */
export interface AssessmentVersion {
  id: string; // Unique identifier for the version (e.g., "V1", "V2")
  assessmentId: string; // ID of the assessment this version belongs to
  versionNumber: number; // The version number (e.g., 1, 2, 3)
  status: 'draft' | 'active' | 'archived'; // Status of the version
  createdAt: string; // ISO date string when the version was created
  updatedAt: string; // ISO date string when the version was last updated
  createdBy?: string; // Name or ID of the user who created this version
  changelog?: string; // Added: Changelog or notes for this version
}

/**
 * Represents the basic details of an assessment (used by findAssessmentById).
 * This might be expanded or fetched differently in a real application.
 * Note: This type might be redundant if `Assessment` covers its use cases,
 * or it could be specialized for specific scenarios. For now, keeping it
 * as it was in the context, but its usage should be reviewed.
 */
export interface AssessmentBaseInfo {
    id: string;
    title: string;
    category: string;
    difficulty: string; // This field was in the original context for AssessmentBaseInfo
    estimatedTime: number; // This field was in the original context for AssessmentBaseInfo
    targetSkillLevel: string; // This field was in the original context for AssessmentBaseInfo
    status: 'draft' | 'active' | 'archived'; // This field was in the original context for AssessmentBaseInfo
    createdAt: string; // This field was in the original context for AssessmentBaseInfo
    description?: string;
}
