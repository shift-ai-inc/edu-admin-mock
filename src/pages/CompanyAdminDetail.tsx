import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Edit, Save, X, UserCircle, Mail, Shield, Users, Briefcase, CalendarDays, Power, KeyRound, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO, isValid } from "date-fns";
import { ja } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

import { mockGroups, getGroupNamesByIds } from '@/data/mockGroups';
import { findMockCompanyAdminById, updateMockCompanyAdmin } from '@/data/mockCompanyAdmins';
import { AdminAuthority, getAuthorityDisplayName, CompanyAdministrator } from '@/types/companyAdmin';
import { addPermissionLog } from '@/data/mockPermissionLogs';

// Zod schema for validation
const adminSchema = z.object({
  name: z.string().min(1, { message: '氏名は必須です。' }).max(50, { message: '氏名は50文字以内で入力してください。'}),
  email: z.string().email({ message: '有効なメールアドレスを入力してください。' }).max(100, { message: 'メールアドレスは100文字以内で入力してください。'}),
  authority: z.enum(['system_admin', 'results_viewer'], { required_error: '権限を選択してください。' }),
  affiliatedGroupIds: z.array(z.string()).min(0, { message: '少なくとも1つのグループを選択してください。 (現在は0個でも可)' }), // Example, adjust if needed
});
type AdminFormData = z.infer<typeof adminSchema>;

// Mock details for display (can be expanded)
interface DisplayAdminDetails {
  companyName?: string; // Example: if admin is tied to a specific company context
  role?: string; // Example: 'メイン管理者', 'サブ管理者'
  lastLogin?: string | null;
  status?: 'アクティブ' | '非アクティブ' | '招待中'; // Example statuses
}

interface EnrichedAdminData extends CompanyAdministrator, DisplayAdminDetails {}

const generateTemporaryPassword = (length = 12): string => {
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
  return password.split("").sort(() => 0.5 - Math.random()).join("");
};

const formatDate = (dateString: string | null | undefined, includeTime = true) => {
  if (!dateString) return "情報なし";
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return "無効な日付";
    return format(date, includeTime ? "yyyy/MM/dd HH:mm" : "yyyy/MM/dd", { locale: ja });
  } catch {
    return "フォーマットエラー";
  }
};

export default function CompanyAdminDetail() {
  const { adminId } = useParams<{ adminId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [admin, setAdmin] = useState<EnrichedAdminData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isIssueTempPasswordDialogOpen, setIsIssueTempPasswordDialogOpen] = useState(false);
  
  const [selectedGroupIdsInDialog, setSelectedGroupIdsInDialog] = useState<string[]>([]);
  const [isSubmittingDialog, setIsSubmittingDialog] = useState(false);
  const [show2faDialog, setShow2faDialog] = useState(false);
  const [mock2faCode, setMock2faCode] = useState('');
  
  const originalAdminDataForDialog = useRef<CompanyAdministrator | null>(null);
  const pendingSubmitDataForDialog = useRef<AdminFormData | null>(null);

  const { control, handleSubmit, register, reset, watch, formState: { errors, isDirty } } = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema),
    defaultValues: { name: '', email: '', authority: undefined, affiliatedGroupIds: [] },
  });

  const loadAdminData = useCallback(() => {
    if (!adminId) {
      toast({ title: "エラー", description: "管理者IDが見つかりません。", variant: "destructive" });
      navigate("/company-admins");
      return;
    }
    setIsLoading(true);
    const adminFromSource = findMockCompanyAdminById(adminId);

    if (adminFromSource) {
      // Enrich with mock display details (can be fetched from another source or hardcoded for demo)
      const displayDetails: DisplayAdminDetails = {
        companyName: "株式会社サンプル", // Example
        role: adminFromSource.authority === 'system_admin' ? "システム全体管理者" : "結果閲覧者",
        lastLogin: "2024-07-15T10:30:00Z", // Example
        status: "アクティブ", // Example
      };
      const mergedData: EnrichedAdminData = { ...adminFromSource, ...displayDetails };
      setAdmin(mergedData);
      originalAdminDataForDialog.current = { ...adminFromSource };
      reset({
        name: adminFromSource.name,
        email: adminFromSource.email,
        authority: adminFromSource.authority,
        affiliatedGroupIds: adminFromSource.affiliatedGroupIds,
      });
      setSelectedGroupIdsInDialog(adminFromSource.affiliatedGroupIds);
    } else {
      toast({ title: "エラー", description: "指定された企業管理者は見つかりませんでした。", variant: "destructive" });
      setAdmin(null);
      navigate("/company-admins");
    }
    setIsLoading(false);
  }, [adminId, navigate, reset, toast]);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const handleGroupChangeInDialog = (groupId: string) => {
    setSelectedGroupIdsInDialog(prev =>
      prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]
    );
  };

  const permissionsChangedInDialog = (newData: AdminFormData): boolean => {
    if (!originalAdminDataForDialog.current) return false;
    const authorityChanged = newData.authority !== originalAdminDataForDialog.current.authority;
    const currentDialogGroups = selectedGroupIdsInDialog.slice().sort();
    const originalGroups = originalAdminDataForDialog.current.affiliatedGroupIds.slice().sort();
    const groupsChanged = JSON.stringify(currentDialogGroups) !== JSON.stringify(originalGroups);
    return authorityChanged || groupsChanged;
  };
  
  const watchedFormData = watch(); // Watch all form fields

  const onSubmitDialog = (data: AdminFormData) => {
    if (!admin || !originalAdminDataForDialog.current) return;
    
    const finalData = { ...data, affiliatedGroupIds: selectedGroupIdsInDialog };
    setIsSubmittingDialog(true);

    if (permissionsChangedInDialog(finalData)) {
      pendingSubmitDataForDialog.current = finalData;
      setShow2faDialog(true);
    } else {
      proceedWithUpdateInDialog(finalData);
    }
  };

  const handle2faSubmitDialog = () => {
    if (mock2faCode === '123456') { // Mock validation
      setShow2faDialog(false);
      if (pendingSubmitDataForDialog.current) {
        proceedWithUpdateInDialog(pendingSubmitDataForDialog.current);
      }
      setMock2faCode('');
    } else {
      toast({ title: '認証失敗', description: '二段階認証コードが正しくありません。', variant: 'destructive' });
      // Keep submit button disabled until 2FA is successful or cancelled
    }
  };

  const handle2faCancelDialog = () => {
    setShow2faDialog(false);
    setMock2faCode('');
    pendingSubmitDataForDialog.current = null;
    setIsSubmittingDialog(false); // Re-enable submit button on main dialog
  };

  const proceedWithUpdateInDialog = (data: AdminFormData) => {
    if (!admin || !originalAdminDataForDialog.current) {
      setIsSubmittingDialog(false);
      return;
    }

    const originalAuthority = originalAdminDataForDialog.current.authority;
    const originalGroupIds = originalAdminDataForDialog.current.affiliatedGroupIds;
    const newAuthority = data.authority as AdminAuthority;
    const newGroupIds = selectedGroupIdsInDialog;

    try {
      const updatedAdminData: CompanyAdministrator = {
        id: admin.id,
        createdAt: admin.createdAt,
        name: data.name,
        email: data.email,
        authority: newAuthority,
        affiliatedGroupIds: newGroupIds,
      };

      const success = updateMockCompanyAdmin(updatedAdminData);

      if (success) {
        toast({ title: '更新成功', description: `企業管理者「${data.name}」さんの情報を更新しました。` });

        if (newAuthority !== originalAuthority) {
          addPermissionLog({
            adminId: admin.id, adminName: data.name, changedBy: 'System (Current User)', action: 'authority_changed',
            details: `権限を「${getAuthorityDisplayName(originalAuthority)}」から「${getAuthorityDisplayName(newAuthority)}」に変更。`
          });
        }
        if (JSON.stringify(newGroupIds.sort()) !== JSON.stringify(originalGroupIds.sort())) {
          addPermissionLog({
            adminId: admin.id, adminName: data.name, changedBy: 'System (Current User)', action: 'groups_changed',
            details: `所属グループを変更しました。旧: ${getGroupNamesByIds(originalGroupIds).join(', ') || 'なし'}、新: ${getGroupNamesByIds(newGroupIds).join(', ') || 'なし'}`
          });
        }
        if (data.name !== originalAdminDataForDialog.current.name || data.email !== originalAdminDataForDialog.current.email) {
           addPermissionLog({
            adminId: admin.id, adminName: data.name, changedBy: 'System (Current User)', action: 'profile_changed',
            details: `プロフィール情報を変更しました。`
          });
        }
        
        setIsEditDialogOpen(false);
        loadAdminData(); // Reload data
      } else {
        throw new Error("モックデータの更新に失敗しました。");
      }
    } catch (error) {
      console.error("企業管理者の更新エラー:", error);
      toast({ title: '更新失敗', description: '企業管理者の更新中にエラーが発生しました。', variant: 'destructive' });
    } finally {
      setIsSubmittingDialog(false);
      pendingSubmitDataForDialog.current = null;
    }
  };

  const handleConfirmIssueTemporaryPassword = () => {
    if (!admin) return;
    const tempPassword = generateTemporaryPassword();
    
    console.log(`Audit Log: Temporary Password Issued for Admin ID: ${admin.id}, Name: ${admin.name}`);
    console.log(`Email Simulation: To: ${admin.email}, Subject: 仮パスワード発行, Body: ... Password: ${tempPassword} ...`);
    
    toast({
      title: "仮パスワード発行成功 (シミュレーション)",
      description: (
        <div>
          <p>企業管理者「{admin.name}」に仮パスワードを発行しました。</p>
          <p className="text-xs text-muted-foreground">（開発用表示）生成されたパスワード: {tempPassword}</p>
        </div>
      ),
      duration: 9000,
    });
    
    addPermissionLog({
      adminId: admin.id,
      adminName: admin.name,
      changedBy: 'System (Current User)',
      action: 'temp_password_issued',
      details: `企業管理者「${admin.name}」の仮パスワードが発行されました。`,
    });
    setIsIssueTempPasswordDialogOpen(false);
  };

  if (isLoading) {
    return <div className="p-8 text-center">読み込み中...</div>;
  }

  if (!admin) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader><CardTitle>エラー</CardTitle></CardHeader>
          <CardContent>
            <p>指定された企業管理者は見つかりませんでした。</p>
            <Button onClick={() => navigate("/company-admins")} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> 一覧に戻る
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: React.ReactNode }) => (
    <div>
      <h4 className="text-sm font-medium text-gray-500 mb-1 flex items-center"><Icon className="mr-2 h-4 w-4 text-gray-400" />{label}</h4>
      <div className="text-base text-gray-800 pl-6">{value || <span className="text-gray-400">未設定</span>}</div>
    </div>
  );

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Button onClick={() => navigate("/company-admins")} variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" /> 企業管理者一覧に戻る
        </Button>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default" size="sm">
              <Edit className="mr-2 h-4 w-4" /> 管理者情報を編集
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>管理者情報編集</DialogTitle>
              <DialogDescription>企業管理者「{admin.name}」さんの情報を編集します。</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmitDialog)}>
            <ScrollArea className="max-h-[calc(80vh-150px)] p-1 pr-4"> {/* Adjusted max height */}
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="name-dialog">氏名</Label>
                  <Input id="name-dialog" {...register('name')} className={cn(errors.name && 'border-red-500 focus-visible:ring-red-500')} disabled={isSubmittingDialog} />
                  {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="email-dialog">メールアドレス</Label>
                  <Input id="email-dialog" type="email" {...register('email')} className={cn(errors.email && 'border-red-500 focus-visible:ring-red-500')} disabled={isSubmittingDialog} />
                  {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <Label htmlFor="authority-dialog">権限</Label>
                  <Controller name="authority" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value} disabled={isSubmittingDialog}>
                      <SelectTrigger id="authority-dialog" className={cn(errors.authority && 'border-red-500 focus-visible:ring-red-500')}>
                        <SelectValue placeholder="権限を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="system_admin">{getAuthorityDisplayName('system_admin')}</SelectItem>
                        <SelectItem value="results_viewer">{getAuthorityDisplayName('results_viewer')}</SelectItem>
                      </SelectContent>
                    </Select>
                  )} />
                  {errors.authority && <p className="text-sm text-red-600 mt-1">{errors.authority.message}</p>}
                </div>
                <div>
                  <Label>所属グループ（複数選択可）</Label>
                  <ScrollArea className="h-32 w-full rounded-md border p-2 mt-1">
                    <div className="space-y-1">
                      {mockGroups.map((group) => (
                        <div key={group.id} className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded">
                          <Checkbox id={`group-dialog-${group.id}`} checked={selectedGroupIdsInDialog.includes(group.id)} onCheckedChange={() => handleGroupChangeInDialog(group.id)} disabled={isSubmittingDialog} />
                          <Label htmlFor={`group-dialog-${group.id}`} className="font-normal text-sm">{group.name}</Label>
                        </div>
                      ))}
                      {mockGroups.length === 0 && <p className="text-sm text-gray-500 p-2">利用可能なグループがありません。</p>}
                    </div>
                  </ScrollArea>
                  {errors.affiliatedGroupIds && <p className="text-sm text-red-600 mt-1">{errors.affiliatedGroupIds.message}</p>}
                </div>
                {originalAdminDataForDialog.current && permissionsChangedInDialog(watchedFormData) && (
                  <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-xs text-yellow-700 flex items-center">
                      <Info className="h-3 w-3 mr-1.5 flex-shrink-0" />
                      権限または所属グループが変更されるため、更新時に二段階認証が必要です。
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
            <DialogFooter className="pt-6">
              <DialogClose asChild><Button variant="outline" type="button" disabled={isSubmittingDialog}><X className="mr-2 h-4 w-4" />キャンセル</Button></DialogClose>
              <Button type="submit" disabled={isSubmittingDialog || !isDirty}><Save className="mr-2 h-4 w-4" />{isSubmittingDialog ? '処理中...' : '更新'}</Button>
            </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl md:text-2xl flex items-center"><UserCircle className="mr-3 h-7 w-7 text-gray-500" />{admin.name}</CardTitle>
              <CardDescription className="flex items-center mt-1 pl-10"><Mail className="mr-2 h-4 w-4 text-gray-400" />{admin.email}</CardDescription>
            </div>
            {admin.status && (
              <Badge variant="outline" className={cn("text-sm px-3 py-1", admin.status === "アクティブ" ? "border-green-300 bg-green-50 text-green-700" : "border-gray-300 bg-gray-50 text-gray-700")}>
                <Power className="mr-2 h-4 w-4" />{admin.status}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-2 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <DetailItem icon={Briefcase} label="所属企業 (例)" value={admin.companyName} />
            <DetailItem icon={UserCircle} label="役割 (例)" value={admin.role} />
            <DetailItem icon={Shield} label="システム権限" value={<Badge variant={admin.authority === 'system_admin' ? 'default' : 'secondary'}>{getAuthorityDisplayName(admin.authority)}</Badge>} />
            <DetailItem icon={Users} label="所属グループ" value={
              admin.affiliatedGroupIds.length > 0
                ? <div className="flex flex-wrap gap-1">{getGroupNamesByIds(admin.affiliatedGroupIds).map(name => <Badge key={name} variant="outline">{name}</Badge>)}</div>
                : "未割り当て"
            } />
            <DetailItem icon={CalendarDays} label="最終ログイン (例)" value={formatDate(admin.lastLogin)} />
            <DetailItem icon={CalendarDays} label="登録日" value={formatDate(admin.createdAt, false)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">アカウント操作</CardTitle>
          <CardDescription>管理者アカウントに対する操作を実行します。</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog open={isIssueTempPasswordDialogOpen} onOpenChange={setIsIssueTempPasswordDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <KeyRound className="mr-2 h-4 w-4" /> 仮パスワードを発行する
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>仮パスワード発行の確認</AlertDialogTitle>
                <AlertDialogDescription>
                  企業管理者「<strong>{admin.name}</strong>」({admin.email}) の仮パスワードを発行しますか？
                  <br />発行すると、新しいパスワードが生成され、ユーザーにメールで通知されます（シミュレーション）。この操作は元に戻せません。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmIssueTemporaryPassword}>発行する</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* 2FA Dialog (for edit dialog) */}
      <AlertDialog open={show2faDialog} onOpenChange={setShow2faDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>二段階認証</AlertDialogTitle>
            <AlertDialogDescription>
              セキュリティ保護のため、認証アプリに表示されている6桁のコードを入力してください。
              <br/> (モック環境: 「<strong>123456</strong>」を入力してください)
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input type="text" placeholder="6桁の認証コード" value={mock2faCode} onChange={(e) => setMock2faCode(e.target.value)} maxLength={6} />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handle2faCancelDialog}>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={handle2faSubmitDialog}>認証して更新</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
