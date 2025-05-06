export interface BillingRecord {
  id: string; // e.g., INV-2024-001
  contractId: string;
  issueDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  amount: number;
  currency: string; // e.g., "JPY"
  status: string;
  cycle: string;
  paymentDate?: string; // YYYY-MM-DD
  notes?: string;
  generatedDate?: string; // YYYY-MM-DD
  sentDate?: string; // YYYY-MM-DD
}
