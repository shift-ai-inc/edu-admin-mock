import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO, isValid } from "date-fns";
import { ja } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";

// --- Available Permissions Definition ---
const AVAILABLE_PERMISSIONS = {
  overallAdmin: "全体管理権限",
  assessmentAdmin: "アセスメント管理権限",
  userAdmin: "ユーザー管理権限",
  analysisView: "分析結果閲覧権限",
};
type PermissionKey = keyof typeof AVAILABLE_PERMISSIONS;

// --- Available Departments Definition ---
const AVAILABLE_DEPARTMENTS = {
  dev: "開発部",
  sales: "営業部",
  hr: "人事部",
  marketing: "マーケティング部",
  support: "サポート部",
};
type DepartmentKey = keyof typeof AVAILABLE_DEPARTMENTS;

// --- Mock Data (Updated with permissions and departments) ---
const initialMockAdmins = [
  {
    id: "adm001",
    companyId: 1,
    companyName: "株式会社テクノロジー",
    name: "田中 太郎",
    email: "tanaka.taro@tech.co.jp",
    role: "管理者",
    lastLogin: "2024-07-10T10:30:00Z",
    status: "アクティブ",
    permissions: {
      overallAdmin: true,
      assessmentAdmin: true,
      userAdmin: true,
      analysisView: true,
    },
    departments: ["dev", "sales"],
  },
  {
    id: "adm002",
    companyId: 1,
    companyName: "株式会社テクノロジー",
    name: "鈴木 一郎",
    email: "suzuki.ichiro@tech.co.jp",
    role: "担当者",
    lastLogin: "2024-07-09T15:00:00Z",
    status: "アクティブ",
    permissions: {
      overallAdmin: false,
      assessmentAdmin: true,
      userAdmin: false,
      analysisView: true,
    },
    departments: ["dev"],
  },
  {
    id: "adm003",
    companyId: 2,
    companyName: "グローバル商事",
    name: "佐藤 花子",
    email: "sato.hanako@global.com",
    role: "管理者",
    lastLogin: "2024-07-11T09:00:00Z",
    status: "アクティブ",
    permissions: {
      overallAdmin: true,
      assessmentAdmin: true,
      userAdmin: true,
      analysisView: true,
    },
    departments: ["hr", "marketing"],
  },
  {
    id: "adm004",
    companyId: 3,
    companyName: "未来建設",
    name: "高橋 健太",
    email: "takahashi.kenta@mirai.co.jp",
    role: "管理者",
    lastLogin: "2024-06-20T11:00:00Z",
    status: "非アクティブ",
    permissions: {
      overallAdmin: false,
      assessmentAdmin: false,
      userAdmin: false,
      analysisView: false,
    },
    departments: [],
  },
  {
    id: "adm005",
    companyId: 2,
    companyName: "グローバル商事",
    name: "伊藤 次郎",
    email: "ito.jiro@global.com",
    role: "担当者",
    lastLogin: null,
    status: "アクティブ",
    permissions: {
      overallAdmin: false,
      assessmentAdmin: false,
      userAdmin: true,
      analysisView: false,
    },
    departments: ["support"],
  },
];

// Type for permissions object
type Permissions = Partial<Record<PermissionKey, boolean>>;
// Type for departments array
type Departments = DepartmentKey[];

// --- Helper Functions ---
const formatDate = (dateString: string | null) => {
  if (!dateString) return "ログインなし";
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return "無効な日付";
    return format(date, "yyyy/MM/dd HH:mm", { locale: ja });
  } catch {
    return "フォーマットエラー";
  }
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "アクティブ":
      return "bg-green-100 text-green-800 border-green-300";
    case "非アクティブ":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

const generateTemporaryPassword = (length = 14): string => {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
  const all = lower + upper + digits + symbols;

  let password = "";
  password += lower[Math.floor(Math.random() * lower.length)];
  password += upper[Math.floor(Math.random() * upper.length)];
  password += digits[Math.floor(Math.random() * digits.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  for (let i = 4; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }
  // Shuffle the password to make the fixed first characters random
  return password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
};

export default function CompanyAdminDetail() {
  const { adminId } = useParams<{ adminId: string }>();
  const navigate = useNavigate();

  const [mockAdmins] = useState(initialMockAdmins);
  const admin = mockAdmins.find((a) => a.id === adminId);

  const [editablePermissions, setEditablePermissions] = useState<Permissions>(
    {}
  );
  const [editableDepartments, setEditableDepartments] = useState<Departments>(
    []
  );
  const [isIssueTempPasswordDialogOpen, setIsIssueTempPasswordDialogOpen] =
    useState(false);

  useEffect(() => {
    if (admin) {
      const initialPermissions: Permissions = {};
      Object.keys(AVAILABLE_PERMISSIONS).forEach((key) => {
        initialPermissions[key as PermissionKey] =
          !!admin.permissions?.[key as PermissionKey];
      });
      setEditablePermissions(initialPermissions);
    }
  }, [admin]);

  const handlePermissionChange = (
    permissionKey: PermissionKey,
    checked: boolean
  ) => {
    setEditablePermissions((prev) => ({
      ...prev,
      [permissionKey]: checked,
    }));
  };

  const handleDepartmentChange = (
    departmentKey: DepartmentKey,
    checked: boolean
  ) => {
    setEditableDepartments((prev) =>
      checked
        ? [...prev, departmentKey]
        : prev.filter((dep) => dep !== departmentKey)
    );
  };

  const handleSaveChanges = () => {
    if (!admin) return;

    const originalPermissions = admin.permissions;
    const originalDepartments = admin.departments || [];
    const changes: string[] = [];

    console.log(`--- Change History Simulation (Admin ID: ${admin.id}) ---`);
    console.log(
      `Changed By: SystemAdmin (Placeholder) at ${new Date().toISOString()}`
    );

    const updatedPermissions: Permissions = { ...editablePermissions };
    Object.keys(AVAILABLE_PERMISSIONS).forEach((key) => {
      const pKey = key as PermissionKey;
      const originalValue = !!originalPermissions?.[pKey];
      const newValue = !!updatedPermissions[pKey];
      if (originalValue !== newValue) {
        const changeDesc = `権限 - ${AVAILABLE_PERMISSIONS[pKey]}: ${
          originalValue ? "有効" : "無効"
        } -> ${newValue ? "有効" : "無効"}`;
        changes.push(changeDesc);
        console.log(`- ${changeDesc}`);
      }
    });

    const addedDepartments = editableDepartments.filter(
      (dep) => !originalDepartments.includes(dep)
    );

    if (addedDepartments.length > 0) {
      const changeDesc = `担当部署 - 追加: ${addedDepartments
        .map((dep) => AVAILABLE_DEPARTMENTS[dep])
        .join(", ")}`;
      changes.push(changeDesc);
      console.log(`- ${changeDesc}`);
    }

    if (changes.length === 0) {
      toast({
        title: "変更なし",
        description: "情報に変更はありませんでした。",
        variant: "default",
      });
      return;
    }

    console.log(`--- Email Notification Simulation (Account Update) ---`);
    console.log(`To: ${admin.email}`);
    console.log(`Subject: アカウント情報が変更されました`);
    console.log(
      `Body: ${
        admin.name
      }様のアカウント情報がシステム管理者によって変更されました。\n変更内容:\n${changes.join(
        "\n"
      )}`
    );
    console.log(`---------------------------------`);

    toast({
      title: "保存成功",
      description: "管理者情報が正常に更新されました。",
    });
  };

  const handleConfirmIssueTemporaryPassword = () => {
    if (!admin) return;

    const tempPassword = generateTemporaryPassword();

    // Simulate Audit Log
    console.log(`--- Audit Log: Temporary Password Issued ---`);
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log(`Admin ID: ${admin.id}`);
    console.log(`Admin Name: ${admin.name}`);
    console.log(`Issued By: SystemAdmin (Placeholder)`);
    console.log(`Action: Temporary Password Issued`);
    console.log(`Note: User must change password on first login.`);
    console.log(`------------------------------------------`);

    // Simulate Email Notification
    console.log(`--- Email Notification: Temporary Password ---`);
    console.log(`To: ${admin.email}`);
    console.log(`Subject: 仮パスワード発行のお知らせ`);
    console.log(
      `Body: ${admin.name}様\n\nシステム管理者により、お客様のアカウントの仮パスワードが発行されました。\n\n仮パスワード: ${tempPassword}\n\n初回ログイン時に、この仮パスワードを使用してログインし、新しいパスワードを設定してください。\nセキュリティのため、このメールは他人に開示せず、ログイン後は速やかにパスワードを変更してください。`
    );
    console.log(`------------------------------------------`);

    toast({
      title: "仮パスワード発行成功",
      description: (
        <div>
          <p>仮パスワードが発行されました。</p>
          <p className="text-xs text-muted-foreground">
            （開発用表示）生成されたパスワード: {tempPassword}
          </p>
          <p className="text-xs text-muted-foreground">
            ユーザーにはメールで通知されました（シミュレーション）。
          </p>
        </div>
      ),
      duration: 9000, // Longer duration for visibility of generated password
    });
    setIsIssueTempPasswordDialogOpen(false);
  };

  if (!admin) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>エラー</CardTitle>
          </CardHeader>
          <CardContent>
            <p>指定された企業管理者は見つかりませんでした。</p>
            <Button
              onClick={() => navigate("/company-admins")}
              className="mt-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> 一覧に戻る
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <Button
        onClick={() => navigate("/company-admins")}
        variant="outline"
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> 企業管理者一覧に戻る
      </Button>

      {/* Admin Details Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{admin.name}</CardTitle>
              <CardDescription>{admin.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-1">所属企業</h4>
              <p>{admin.companyName}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">役割</h4>
              <p>{admin.role}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">ステータス</h4>
              <Badge
                variant="outline"
                className={cn("border", getStatusBadgeClass(admin.status))}
              >
                {admin.status}
              </Badge>
            </div>
            <div>
              <h4 className="font-semibold mb-1">最終ログイン</h4>
              <p>{formatDate(admin.lastLogin)}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">現在の担当部署</h4>
              <p>
                {admin.departments && admin.departments.length > 0
                  ? admin.departments
                      .map(
                        (depKey) =>
                          AVAILABLE_DEPARTMENTS[depKey as DepartmentKey] ||
                          depKey
                      )
                      .join(", ")
                  : "未割り当て"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permission Management Card */}
      <Card>
        <CardHeader>
          <CardTitle>権限管理</CardTitle>
          <CardDescription>
            この管理者に付与する権限を選択してください。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(AVAILABLE_PERMISSIONS).map(([key, label]) => (
            <div key={key} className="flex items-center space-x-2">
              <Checkbox
                id={`perm-${key}`}
                checked={!!editablePermissions[key as PermissionKey]}
                onCheckedChange={(checked) =>
                  handlePermissionChange(key as PermissionKey, !!checked)
                }
              />
              <Label htmlFor={`perm-${key}`} className="font-normal">
                {label}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Department Management Card */}
      <Card>
        <CardHeader>
          <CardTitle>担当部署/グループ管理</CardTitle>
          <CardDescription>
            この管理者がアクセスできる部署/グループを選択してください。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(AVAILABLE_DEPARTMENTS).map(([key, label]) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={`dept-${key}`}
                  checked={editableDepartments.includes(key as DepartmentKey)}
                  onCheckedChange={(checked) =>
                    handleDepartmentChange(key as DepartmentKey, !!checked)
                  }
                />
                <Label htmlFor={`dept-${key}`} className="font-normal">
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Temporary Password Issuance Card */}
      <Card>
        <CardHeader>
          <CardTitle>仮パスワード発行</CardTitle>
          <CardDescription>
            新しい仮パスワードを発行し、ユーザーに通知します。初回ログイン時にパスワード変更が要求されます。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog
            open={isIssueTempPasswordDialogOpen}
            onOpenChange={setIsIssueTempPasswordDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button variant="destructive">仮パスワードを発行する</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>仮パスワード発行の確認</AlertDialogTitle>
                <AlertDialogDescription>
                  <strong>{admin.name}</strong> ({admin.email})
                  の仮パスワードを発行しますか？
                  <br />
                  発行すると、新しいパスワードが生成され、ユーザーにメールで通知されます（シミュレーション）。
                  この操作は元に戻せません。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmIssueTemporaryPassword}
                >
                  発行する
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* Combined Save Button for Permissions and Departments */}
      <div className="flex justify-end mt-6">
        <Button onClick={handleSaveChanges} size="lg">
          権限と部署の変更を保存
        </Button>
      </div>

      {/* TODO: Add section for change history (for permissions/departments) */}
      {/* <Card>
        <CardHeader>
          <CardTitle>変更履歴</CardTitle>
        </CardHeader>
        <CardContent>
          <p>ここに権限や部署変更の履歴が表示されます...</p>
        </CardContent>
      </Card> */}
    </div>
  );
}
