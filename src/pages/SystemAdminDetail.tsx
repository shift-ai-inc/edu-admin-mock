import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockSystemAdmins } from "@/data/mockSystemAdmins";
import {
  SystemAdmin,
  getPermissionLevelName,
  getStatusName,
  mockOperationalPermissionsList,
  mockPermissionLevelOptions,
  PermissionLevel,
} from "@/types/system-admin";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, KeyRound, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

// --- Validation Schema for Permissions Edit ---
const editPermissionsFormSchema = z.object({
  permissionLevel: z
    .string()
    .min(1, { message: "権限レベルを選択してください。" }),
  detailedPermissions: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      // Ensure at least one item is selected
      message: "少なくとも1つの操作権限を選択してください。",
    }),
});

type EditPermissionsFormValues = z.infer<typeof editPermissionsFormSchema>;

export default function SystemAdminDetail() {
  const { adminId } = useParams<{ adminId: string }>();
  const navigate = useNavigate();

  const [admin, setAdmin] = useState<SystemAdmin | undefined>(
    mockSystemAdmins.find((a) => a.id === adminId)
  );

  const [isEditPermissionsModalOpen, setIsEditPermissionsModalOpen] =
    useState(false);
  const [isIssueTempPasswordModalOpen, setIsIssueTempPasswordModalOpen] =
    useState(false);

  const form = useForm<EditPermissionsFormValues>({
    resolver: zodResolver(editPermissionsFormSchema),
    defaultValues: {
      permissionLevel: "",
      detailedPermissions: [],
    },
    mode: "onChange",
  });

  const { reset } = form; // Destructure reset for stable reference in useEffect

  useEffect(() => {
    const currentAdminData = mockSystemAdmins.find((a) => a.id === adminId);
    setAdmin(currentAdminData);

    if (currentAdminData) {
      reset({
        permissionLevel: currentAdminData.permissionLevel,
        detailedPermissions: currentAdminData.detailedPermissions || [], // Ensure array
      });
    } else {
      // If admin is not found, reset to default empty state
      reset({
        permissionLevel: "",
        detailedPermissions: [],
      });
    }
  }, [adminId, reset]);

  if (!admin) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>エラー</CardTitle>
          </CardHeader>
          <CardContent>
            <p>指定されたシステム管理者は見つかりませんでした。</p>
            <Button onClick={() => navigate("/system-admins")} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> 一覧に戻る
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (date: Date | null | undefined): string => {
    if (!date) return "N/A";
    return date.toLocaleString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleEditPermissionsSubmit = (formData: EditPermissionsFormValues) => {
    const adminIndex = mockSystemAdmins.findIndex((a) => a.id === adminId);
    if (adminIndex !== -1 && admin) {
      // Ensure admin is not null
      mockSystemAdmins[adminIndex] = {
        ...mockSystemAdmins[adminIndex],
        permissionLevel: formData.permissionLevel as PermissionLevel,
        detailedPermissions: formData.detailedPermissions,
      };
      setAdmin(mockSystemAdmins[adminIndex]);
      toast({
        title: "権限更新成功",
        description: `${admin.name} の権限情報が更新されました。`,
      });
    } else {
      toast({
        title: "エラー",
        description: "管理者の更新に失敗しました。",
        variant: "destructive",
      });
    }
    setIsEditPermissionsModalOpen(false);
  };

  const handleIssueTemporaryPassword = () => {
    const tempPassword = Math.random().toString(36).slice(-8);
    const adminIndex = mockSystemAdmins.findIndex((a) => a.id === adminId);

    if (adminIndex !== -1 && admin) {
      // Ensure admin is not null
      mockSystemAdmins[adminIndex].lastPasswordIssuedAt = new Date();
      setAdmin({ ...mockSystemAdmins[adminIndex] });

      console.log(`仮パスワード発行:
      管理者: ${admin.name} (${admin.email})
      仮パスワード: ${tempPassword}
      発行日時: ${new Date().toISOString()}`);

      toast({
        title: "仮パスワード発行完了",
        description: (
          <div>
            <p>{admin.name} の仮パスワードが発行されました。</p>
            <p className="mt-2">
              <strong>仮パスワード:</strong>{" "}
              <code className="bg-gray-200 p-1 rounded">{tempPassword}</code>
            </p>
            <p className="text-xs mt-1">
              （実際にはメールで通知されます。これは開発用の表示です。）
            </p>
          </div>
        ),
        duration: 10000,
      });
    } else {
      toast({
        title: "エラー",
        description: "仮パスワードの発行に失敗しました。",
        variant: "destructive",
      });
    }
    setIsIssueTempPasswordModalOpen(false);
  };

  return (
    <div className="p-8 space-y-6">
      <Button onClick={() => navigate("/system-admins")} variant="outline">
        <ArrowLeft className="mr-2 h-4 w-4" /> システム管理者一覧に戻る
      </Button>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{admin.name}</CardTitle>
              <CardDescription>{admin.email}</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => navigate(`/system-admins/edit/${adminId}`)}
              >
                <Pencil className="mr-2 h-4 w-4" /> 基本情報編集
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-1">権限レベル</h4>
              <p>{getPermissionLevelName(admin.permissionLevel)}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">ステータス</h4>
              <Badge
                variant={admin.status === "active" ? "default" : "secondary"}
              >
                {getStatusName(admin.status)}
              </Badge>
            </div>
            <div>
              <h4 className="font-semibold mb-1">最終ログイン</h4>
              <p>{formatDate(admin.lastLogin)}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">登録日時</h4>
              <p>{formatDate(admin.createdAt)}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">最終仮パスワード発行</h4>
              <p>{formatDate(admin.lastPasswordIssuedAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">権限管理</CardTitle>
            <Button
              variant="outline"
              onClick={() => setIsEditPermissionsModalOpen(true)}
            >
              <ShieldCheck className="mr-2 h-4 w-4" /> 権限を編集
            </Button>
          </div>
          <CardDescription>
            このシステム管理者の権限レベルと詳細な操作権限を管理します。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <h4 className="font-semibold">現在の権限レベル:</h4>
            <p>{getPermissionLevelName(admin.permissionLevel)}</p>
          </div>
          <Separator className="my-4" />
          <div>
            <h4 className="font-semibold mb-2">詳細な操作権限:</h4>
            {admin.detailedPermissions &&
            admin.detailedPermissions.length > 0 ? (
              <ul className="list-disc list-inside space-y-1 columns-2">
                {admin.detailedPermissions.map((permissionId) => {
                  const permission = mockOperationalPermissionsList.find(
                    (p) => p.id === permissionId
                  );
                  return (
                    <li key={permissionId}>
                      {permission ? permission.label : permissionId}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>詳細な操作権限は設定されていません。</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">仮パスワード発行</CardTitle>
          <CardDescription>
            システム管理者のために新しい仮パスワードを発行します。発行されたパスワードは（実際には）メールで通知されます。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-1">
            最終発行日時: {formatDate(admin.lastPasswordIssuedAt)}
          </p>
          <p className="text-sm text-muted-foreground">
            セキュリティのため、仮パスワードは発行後一度のみ有効です。
          </p>
        </CardContent>
        <CardFooter>
          <Button
            variant="destructive"
            onClick={() => setIsIssueTempPasswordModalOpen(true)}
          >
            <KeyRound className="mr-2 h-4 w-4" /> 新しい仮パスワードを発行
          </Button>
        </CardFooter>
      </Card>

      <Dialog
        open={isEditPermissionsModalOpen}
        onOpenChange={setIsEditPermissionsModalOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>権限を編集: {admin.name}</DialogTitle>
            <DialogDescription>
              システム管理者の権限レベルと詳細な操作権限を変更します。
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleEditPermissionsSubmit)}
              className="space-y-6 pt-4 pb-2"
            >
              <FormField
                control={form.control}
                name="permissionLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>権限レベル</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="権限レベルを選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockPermissionLevelOptions.map((level) => (
                          <SelectItem key={level.id} value={level.id}>
                            {level.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="detailedPermissions"
                render={() => (
                  <FormItem>
                    <div className="mb-2">
                      <FormLabel className="text-base">
                        詳細な操作権限
                      </FormLabel>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 max-h-60 overflow-y-auto p-1 border rounded-md">
                      {mockOperationalPermissionsList.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="detailedPermissions"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.id}
                                className="flex flex-row items-center space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      const currentValue = field.value || [];
                                      if (checked) {
                                        field.onChange([
                                          ...currentValue,
                                          item.id,
                                        ]);
                                      } else {
                                        field.onChange(
                                          currentValue.filter(
                                            (value) => value !== item.id
                                          )
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal text-sm">
                                  {item.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="pt-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    キャンセル
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={!form.formState.isValid}>
                  権限を保存
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isIssueTempPasswordModalOpen}
        onOpenChange={setIsIssueTempPasswordModalOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>仮パスワード発行確認</AlertDialogTitle>
            <AlertDialogDescription>
              {admin.name} の新しい仮パスワードを発行しますか？
              現在のパスワードは無効になり、新しい仮パスワードが（実際にはメールで）通知されます。
              この操作は取り消せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleIssueTemporaryPassword}
              className="bg-destructive hover:bg-destructive/90"
            >
              発行する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
