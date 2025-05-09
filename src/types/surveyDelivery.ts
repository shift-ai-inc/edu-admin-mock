// Copied and adapted from assessmentDelivery.ts
import { AvailableSurvey } from './survey'; // Changed import
import { Clock, PlayCircle, CheckCircle, XCircle } from 'lucide-react'; // For status icons

export interface SurveyDeliveryTarget { // Renamed from AssessmentDeliveryTarget
  type: 'user' | 'group' | 'company';
  id: string;
  name: string; // Name of the user, group, or company
}

export interface SurveyDelivery { // Renamed from AssessmentDelivery
  id: string;
  surveyId: string; // Changed from assessmentId
  surveyTitle: string; // Changed from assessmentTitle
  deliveryName: string; // Name for this specific delivery instance
  targets: SurveyDeliveryTarget[];
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  createdAt: string; // ISO date string
  // Fields from mock that might be useful, ensure they are part of the actual type if needed
  totalParticipants: number;
  completedParticipants: number;
  completionRate: number; // Calculated: (completedParticipants / totalParticipants) * 100
  // createdBy?: string; // Optional, if you track who created the delivery
  // emailTemplateId?: string; // Optional: for custom email notifications
  // reminderSettings?: { interval: number; unit: 'days' | 'weeks'; count: number }; // Optional
}

// Example of a more detailed participant status for a delivery (optional extension)
export interface SurveyParticipantStatus { // Renamed from AssessmentParticipantStatus
  userId: string;
  userName: string;
  status: 'not-started' | 'in-progress' | 'completed';
  startedAt?: string;
  completedAt?: string;
  score?: number; // If applicable
}

export interface SurveyDeliveryDetails extends SurveyDelivery { // Renamed from AssessmentDeliveryDetails
  survey: AvailableSurvey; // Changed from assessment
  participantStatus?: SurveyParticipantStatus[];
  // deliveryNotes?: string;
}

// Helper for SurveyDelivery status
interface SurveyDeliveryStatusInfoType {
  text: string;
  variant: 'default' | 'secondary' | 'outline' | 'destructive';
  icon?: React.ElementType;
}

export const getSurveyDeliveryStatusInfo = (status: SurveyDelivery['status']): SurveyDeliveryStatusInfoType => {
  switch (status) {
    case 'scheduled':
      return { text: '予定', variant: 'outline', icon: Clock };
    case 'active':
      return { text: '実施中', variant: 'default', icon: PlayCircle };
    case 'completed':
      return { text: '完了', variant: 'secondary', icon: CheckCircle };
    case 'cancelled':
      return { text: '中止', variant: 'destructive', icon: XCircle };
    default:
      // This case should ideally not be reached if status types are correct
      const exhaustiveCheck: never = status; 
      return { text: `不明 (${exhaustiveCheck})`, variant: 'outline' };
  }
};
