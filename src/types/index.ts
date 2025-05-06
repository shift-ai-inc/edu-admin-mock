export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  adminName: string;
  adminEmail: string;
  status: "active" | "pending" | "suspended";
  createdAt: string;
}

export interface SystemAdmin {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Admin" | "Support"; // Example roles
  lastLogin: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface CompanyAdmin {
  id: string;
  name: string;
  email: string;
  companyName?: string; // Optional: denormalized for display
  createdAt: string;
  lastLogin?: string;
  groups?: string[]; // 担当部署/グループ
}

export interface Contract {
  id: string;
  companyId: string;
  companyName: string; // Denormalized for easy display
  plan: string;
  startDate: string; // ISO Date string
  endDate: string; // ISO Date string
  status: "active" | "expired" | "cancelled" | "pending_renewal";
  amount: string; // Monthly or annual amount
  billingCycle: "monthly" | "annually";
  autoRenew: boolean;
  createdAt: string;
  updatedAt: string;
  userCount: number; // Number of users covered by the contract
}

export interface BillingRecord {
  id: string;
  contractId: string;
  invoiceNumber: string;
  issueDate: string; // ISO Date string
  dueDate: string; // ISO Date string
  amount: number;
  status: "paid" | "pending" | "overdue" | "cancelled";
  paymentDate?: string; // ISO Date string, if paid
  paymentMethod?: string; // e.g., "Credit Card", "Bank Transfer"
  notes?: string;
}

// Added for AssessmentVersionList page
export interface DisplayableAssessmentVersion {
  assessmentId: string;
  assessmentTitle: string;
  versionId: string;
  versionNumber: number;
  createdAt: string;
  createdBy?: string;
  status: "draft" | "active" | "archived";
  questionCount: number;
  updatedAt: string;
}

// Added for SurveyVersionList page
export interface DisplayableSurveyVersion {
  surveyDefinitionId: string;
  surveyTitle: string;
  versionId: string;
  versionNumber: number;
  createdAt: string;
  createdBy?: string;
  status: "draft" | "active" | "archived";
  questionCount: number;
  updatedAt: string;
}
