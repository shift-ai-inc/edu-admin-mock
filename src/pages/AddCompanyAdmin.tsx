import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ArrowLeft, PlusCircle, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addMockCompanyAdmin } from '@/data/mockCompanyAdmins';
import { mockGroups } from '@/data/mockGroups';
import { AdminAuthority, getAuthorityDisplayName } from '@/types/companyAdmin';
import { addPermissionLog } from '@/data/mockPermissionLogs';
import { cn } from '@/lib/utils';

const addAdminSchema = z.object({
  name: z.string().min(1, { message: '氏名は必須です。' }).max(50, { message: '氏名は50文字以内で入力してください。'}),
  email: z.string().email({ message: '有効なメールアドレスを入力してください。' }).max(100, { message: 'メールアドレスは100文字以内で入力してください。'}),
  authority: z.enum(['system_admin', 'results_viewer'], { required_error: '権限を選択してください。' }),
  affiliatedGroupIds: z.array(z.string()).min(0), // Can be empty if no groups are mandatory
});

type AddAdminFormData = z.infer<typeof addAdminSchema>;

const AddCompanyAdmin: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);

  const { control, handleSubmit, register, formState: { errors } } = useForm<AddAdminFormData>({
    resolver: zodResolver(addAdminSchema),
    defaultValues: {
      name: '',
      email: '',
      authority: undefined, // Or a default like 'results_viewer'
      affiliatedGroupIds: [],
    },
  });

  const handleGroupChange = (groupId: string) => {
    setSelectedGroupIds(prev =>
      prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]
    );
  };

  const onSubmit = (data: AddAdminFormData) => {
    setIsSubmitting(true);
    try {
      const newAdminData = {
        ...data,
        affiliatedGroupIds: selectedGroupIds,
      };
      const newAdmin = addMockCompanyAdmin(newAdminData);

      addPermissionLog({
        adminId: newAdmin.id,
        adminName: newAdmin.name,
        changedBy: 'System (Current User)',
        action: 'admin_created',
        details: `新しい企業管理者「${newAdmin.name}」が登録されました。権限: ${getAuthorityDisplayName(newAdmin.authority)}`,
      });

      toast({
        title: '登録成功',
        description: `企業管理者「${newAdmin.name}」さんを登録しました。`,
      });
      navigate('/company-admins');
    } catch (error) {
      console.error('企業管理者の登録エラー:', error);
      toast({
        title: '登録失敗',
        description: '企業管理者の登録中にエラーが発生しました。',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Button onClick={() => navigate('/company-admins')} variant="outline" size="sm" className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> 企業管理者一覧に戻る
      </Button>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">新規企業管理者登録</CardTitle>
          <CardDescription>新しい企業管理者の情報を入力してください。</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="name">氏名</Label>
              <Input id="name" {...register('name')} className={cn(errors.name && 'border-red-500 focus-visible:ring-red-500')} disabled={isSubmitting} />
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="email">メールアドレス</Label>
              <Input id="email" type="email" {...register('email')} className={cn(errors.email && 'border-red-500 focus-visible:ring-red-500')} disabled={isSubmitting} />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <Label htmlFor="authority">権限</Label>
              <Controller
                name="authority"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                    <SelectTrigger id="authority" className={cn(errors.authority && 'border-red-500 focus-visible:ring-red-500')}>
                      <SelectValue placeholder="権限を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system_admin">{getAuthorityDisplayName('system_admin')}</SelectItem>
                      <SelectItem value="results_viewer">{getAuthorityDisplayName('results_viewer')}</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.authority && <p className="text-sm text-red-600 mt-1">{errors.authority.message}</p>}
            </div>

            <div>
              <Label>所属グループ（複数選択可）</Label>
              <ScrollArea className="h-40 w-full rounded-md border p-2 mt-1">
                <div className="space-y-1">
                  {mockGroups.map((group) => (
                    <div key={group.id} className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded">
                      <Checkbox
                        id={`group-${group.id}`}
                        checked={selectedGroupIds.includes(group.id)}
                        onCheckedChange={() => handleGroupChange(group.id)}
                        disabled={isSubmitting}
                      />
                      <Label htmlFor={`group-${group.id}`} className="font-normal text-sm">{group.name}</Label>
                    </div>
                  ))}
                  {mockGroups.length === 0 && <p className="text-sm text-gray-500 p-2">利用可能なグループがありません。</p>}
                </div>
              </ScrollArea>
              {errors.affiliatedGroupIds && <p className="text-sm text-red-600 mt-1">{errors.affiliatedGroupIds.message}</p>}
            </div>
            <p className="text-xs text-muted-foreground">
              注意: パスワードは初回ログイン時に設定するフローを想定しています (このフォームでは設定しません)。
            </p>
          </CardContent>
          <CardFooter className="flex justify-end space-x-3 pt-6">
            <Button type="button" variant="outline" onClick={() => navigate('/company-admins')} disabled={isSubmitting}>
              <X className="mr-2 h-4 w-4" /> キャンセル
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" /> {isSubmitting ? '登録中...' : '登録する'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddCompanyAdmin;
