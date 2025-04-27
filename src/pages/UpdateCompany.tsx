import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button, buttonVariants } from '@/components/ui/button'; // Import buttonVariants
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { useParams } from 'react-router-dom'; // To get companyId from URL
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils'; // Import cn

// Define the validation schema using Zod
// Added address, contact, admin info, and status
const updateCompanyFormSchema = z.object({
  companyId: z.string(), // Assuming ID is available
  companyName: z.string().min(1, { message: '企業名を入力してください。' }),
  address: z.string().optional(), // Added Address
  contactInfo: z.string().optional(), // Added Contact Info
  industry: z.string().min(1, { message: '業種を選択してください。' }),
  employeeSize: z.coerce.number().min(1, { message: '従業員規模は1以上である必要があります。' }),
  contractPlan: z.string().min(1, { message: '契約プランを選択してください。' }),
  contractStartDate: z.string().min(1, { message: '契約開始日を入力してください。' }),
  contractEndDate: z.string().min(1, { message: '契約終了日を入力してください。' }),
  maxUsers: z.coerce.number().min(1, { message: '最大ユーザー数は1以上である必要があります。' }),
  billingInfo: z.string().optional(),
  adminName: z.string().optional(), // Added Admin Name
  adminEmail: z.string().email({ message: '有効なメールアドレスを入力してください。' }).optional(), // Added Admin Email
  isActive: z.boolean().default(true), // Added Activation Status
});

type UpdateCompanyFormValues = z.infer<typeof updateCompanyFormSchema>;

// Placeholder for fetching company data - replace with actual API call
const fetchCompanyData = async (companyId: string): Promise<Partial<UpdateCompanyFormValues>> => {
  console.log(`Fetching data for company ID: ${companyId}`);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  // Return mock data - replace with actual fetched data
  return {
    companyId: companyId,
    companyName: `株式会社サンプル ${companyId}`,
    address: '東京都千代田区サンプル1-1-1',
    contactInfo: '03-1234-5678',
    industry: 'IT',
    employeeSize: 500,
    contractPlan: 'standard',
    contractStartDate: '2023-01-01',
    contractEndDate: '2024-12-31',
    maxUsers: 100,
    billingInfo: '請求書は月末締め、翌月末払い',
    adminName: '管理者 太郎',
    adminEmail: 'admin@example.com',
    isActive: true,
  };
};


export default function UpdateCompany() {
  const { companyId } = useParams<{ companyId: string }>(); // Get companyId from route params
  const [isLoading, setIsLoading] = useState(true);
  const [initialMaxUsers, setInitialMaxUsers] = useState<number | undefined>(undefined);
  const [initialIsActive, setInitialIsActive] = useState<boolean | undefined>(undefined);
  const [showMaxUsersConfirm, setShowMaxUsersConfirm] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);

  const form = useForm<UpdateCompanyFormValues>({
    resolver: zodResolver(updateCompanyFormSchema),
    defaultValues: { // Initialize with empty/default values
      companyId: companyId,
      companyName: '',
      address: '',
      contactInfo: '',
      industry: '',
      employeeSize: undefined,
      contractPlan: '',
      contractStartDate: '',
      contractEndDate: '',
      maxUsers: undefined,
      billingInfo: '',
      adminName: '',
      adminEmail: '',
      isActive: true,
    },
    mode: 'onChange',
  });

  const watchedMaxUsers = form.watch('maxUsers');
  const watchedIsActive = form.watch('isActive');

  // Fetch existing data on component mount
  useEffect(() => {
    if (!companyId) {
        toast({ title: "エラー", description: "企業IDが見つかりません。", variant: "destructive" });
        setIsLoading(false);
        return;
    }
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCompanyData(companyId);
        form.reset(data); // Populate form with fetched data
        setInitialMaxUsers(data.maxUsers); // Store initial value
        setInitialIsActive(data.isActive); // Store initial value
      } catch (error) {
        console.error("Failed to fetch company data:", error);
        toast({ title: "データ取得エラー", description: "企業情報の読み込みに失敗しました。", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [companyId, form]);

  // Check if maxUsers change requires confirmation (placeholder logic)
  const maxUsersChangeRequiresConfirm = (
    initialMaxUsers !== undefined &&
    watchedMaxUsers !== undefined &&
    watchedMaxUsers !== initialMaxUsers &&
    watchedMaxUsers < initialMaxUsers // Example: Confirm only if decreasing
    // Add more complex billing impact logic here if needed
  );

  // Check if deactivation requires confirmation
  const deactivateRequiresConfirm = initialIsActive === true && watchedIsActive === false;

  const handleFormSubmit = (data: UpdateCompanyFormValues) => {
    // Check if confirmations are needed before submitting
    if (maxUsersChangeRequiresConfirm && !showMaxUsersConfirm) {
      setShowMaxUsersConfirm(true); // Show max users confirmation dialog
      return; // Stop submission until confirmed
    }
    if (deactivateRequiresConfirm && !showDeactivateConfirm) {
      setShowDeactivateConfirm(true); // Show deactivation confirmation dialog
      return; // Stop submission until confirmed
    }

    // Reset confirmation flags if checks passed or weren't needed
    setShowMaxUsersConfirm(false);
    setShowDeactivateConfirm(false);

    // Proceed with the actual submission logic
    submitData(data);
  };

  const submitData = (data: UpdateCompanyFormValues) => {
    // TODO: Implement API call to update the company data
    console.log("Submitting updated data:", data);
    toast({
      title: '企業情報が更新されました:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
    // Update initial values after successful submission
    setInitialMaxUsers(data.maxUsers);
    setInitialIsActive(data.isActive);
    // Optionally redirect or give further feedback
  };

  if (isLoading) {
    return <div className="p-8">読み込み中...</div>; // Or a Skeleton loader
  }

  if (!companyId) {
     return <div className="p-8 text-red-600">企業IDが指定されていません。</div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">企業情報更新 ({form.getValues('companyName') || companyId})</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8 bg-white p-6 shadow rounded-lg">
          {/* Basic Info Section */}
          <h3 className="text-lg font-medium border-b pb-2 mb-4">基本情報</h3>
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>企業名</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>住所</FormLabel>
                <FormControl><Input placeholder="例: 東京都千代田区..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>連絡先</FormLabel>
                <FormControl><Input placeholder="例: 03-xxxx-xxxx" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>業種</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="業種を選択してください" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="商社">商社</SelectItem>
                    <SelectItem value="建設">建設</SelectItem>
                    <SelectItem value="環境">環境</SelectItem>
                    <SelectItem value="メディア">メディア</SelectItem>
                    <SelectItem value="製造">製造</SelectItem>
                    <SelectItem value="金融">金融</SelectItem>
                    <SelectItem value="その他">その他</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="employeeSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>従業員規模</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Contract Info Section */}
          <h3 className="text-lg font-medium border-b pb-2 mb-4 pt-4">契約情報</h3>
           <FormField
            control={form.control}
            name="contractPlan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>契約プラン</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="プランを選択してください" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="basic">ベーシック</SelectItem>
                    <SelectItem value="standard">スタンダード</SelectItem>
                    <SelectItem value="premium">プレミアム</SelectItem>
                    <SelectItem value="enterprise">エンタープライズ</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="contractStartDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>契約開始日</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contractEndDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>契約終了日</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="maxUsers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>最大ユーザー数</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                 {maxUsersChangeRequiresConfirm && (
                   <p className="text-sm font-medium text-yellow-600 mt-1">
                     最大ユーザー数の変更は課金に影響する可能性があります。
                   </p>
                 )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="billingInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>請求情報</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="請求先住所、担当者名、連絡先などを入力してください"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  （任意）請求に関する特記事項があれば入力してください。
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Admin Info Section */}
          <h3 className="text-lg font-medium border-b pb-2 mb-4 pt-4">管理者情報</h3>
           <FormField
            control={form.control}
            name="adminName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>管理者名</FormLabel>
                <FormControl><Input placeholder="例: 管理者 太郎" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="adminEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>管理者メールアドレス</FormLabel>
                <FormControl><Input type="email" placeholder="例: admin@example.com" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Account Status Section */}
          <h3 className="text-lg font-medium border-b pb-2 mb-4 pt-4">アカウントステータス</h3>
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    アカウント有効
                  </FormLabel>
                  <FormDescription>
                    アカウントが無効の場合、関連するユーザーはログインできなくなります。
                  </FormDescription>
                   {deactivateRequiresConfirm && (
                     <p className="text-sm font-medium text-red-600 mt-1">
                       アカウントを無効化すると、関連ユーザーがアクセスできなくなります。
                     </p>
                   )}
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Confirmation Dialogs */}
          {/* Max Users Confirmation */}
          <AlertDialog open={showMaxUsersConfirm} onOpenChange={setShowMaxUsersConfirm}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>最大ユーザー数変更の確認</AlertDialogTitle>
                <AlertDialogDescription>
                  最大ユーザー数を {watchedMaxUsers} に変更します。この変更は契約や請求額に影響を与える可能性があります。続行しますか？
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => form.setValue('maxUsers', initialMaxUsers || 0)}>キャンセル</AlertDialogCancel>
                <AlertDialogAction onClick={() => submitData(form.getValues())}>
                  変更を確認して続行
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Deactivation Confirmation */}
          <AlertDialog open={showDeactivateConfirm} onOpenChange={setShowDeactivateConfirm}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>アカウント無効化の確認</AlertDialogTitle>
                <AlertDialogDescription>
                  アカウントを無効にすると、この企業に所属するすべてのユーザーがシステムにアクセスできなくなります。本当に無効化しますか？
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => form.setValue('isActive', true)}>キャンセル</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => submitData(form.getValues())}
                  className={cn(buttonVariants({ variant: "destructive" }))} // Apply buttonVariants correctly
                >
                  無効化を確認して続行
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>


          <Button type="submit" disabled={form.formState.isSubmitting || isLoading}>
            {form.formState.isSubmitting ? '更新中...' : '企業情報を更新'}
          </Button>
        </form>
      </Form>
    </div>
  );
}