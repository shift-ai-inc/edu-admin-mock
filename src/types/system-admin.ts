export type PermissionLevel = 'super_admin' | 'admin' | 'read_only';

export type SystemAdminStatus = 'active' | 'inactive';

export type SystemAdmin = {
  id: string;
  name: string;
  email: string;
  permissionLevel: PermissionLevel;
  status: SystemAdminStatus;
  lastLogin: Date | null;
  createdAt: Date;
  detailedPermissions: string[]; // Added: Detailed operational permissions
  lastPasswordIssuedAt?: Date | null; // Added: Last temporary password issuance date
};

// Helper function to map permission level ID to display name
export const getPermissionLevelName = (level: PermissionLevel): string => {
  switch (level) {
    case 'super_admin': return 'スーパー管理者';
    case 'admin': return '管理者';
    case 'read_only': return '読み取り専用';
    default: return '不明';
  }
};

// Helper function to map status ID to display name
export const getStatusName = (status: SystemAdminStatus): string => {
  switch (status) {
    case 'active': return '有効';
    case 'inactive': return '無効';
    default: return '不明';
  }
};

// Mock operational permissions (can be shared or defined where needed)
export const mockOperationalPermissionsList = [
  { id: "manage_system_admins", label: "システム管理者管理" },
  { id: "manage_companies", label: "企業管理" },
  { id: "manage_company_admins", label: "企業管理者管理" },
  { id: "manage_contracts", label: "契約管理" },
  { id: "manage_assessments", label: "アセスメント管理" },
  { id: "manage_surveys", label: "アンケート管理" },
  { id: "view_reports", label: "レポート閲覧" },
  { id: "manage_settings", label: "システム設定" },
];

export const mockPermissionLevelOptions = [
  { id: "super_admin", name: "スーパー管理者" },
  { id: "admin", name: "管理者" },
  { id: "read_only", name: "読み取り専用" },
];
