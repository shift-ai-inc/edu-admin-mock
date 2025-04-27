import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
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
import { toast } from '@/hooks/use-toast'; // Assuming use-toast is set up

// Define the validation schema using Zod
const companyFormSchema = z.object({
  companyName: z.string().min(1, { message: '企業名を入力してください。' }),
  industry: z.string().min(1, { message: '業種を選択してください。' }),
  employeeSize: z.coerce.number().min(1, { message: '従業員規模は1以上である必要があります。' }),
  contractPlan: z.string().min(1, { message: '契約プランを選択してください。' }),
  contractStartDate: z.string().min(1, { message: '契約開始日を入力してください。' }), // Consider using a date picker
  contractEndDate: z.string().min(1, { message: '契約終了日を入力してください。' }), // Consider using a date picker
  maxUsers: z.coerce.number().min(1, { message: '最大ユーザー数は1以上である必要があります。' }),
  billingInfo: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

// Default values for the form
const defaultValues: Partial<CompanyFormValues> = {
  companyName: '',
  industry: '',
  employeeSize: undefined,
  contractPlan: '',
  contractStartDate: '',
  contractEndDate: '',
  maxUsers: undefined,
  billingInfo: '',
};

export default function AddCompany() {
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues,
    mode: 'onChange', // Validate on change
  });

  function onSubmit(data: CompanyFormValues) {
    // TODO: Implement API call to save the company data
    console.log(data);
    toast({
      title: '企業情報が送信されました:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
    // Optionally reset the form after successful submission
    // form.reset();
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">新規企業アカウント作成</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-white p-6 shadow rounded-lg">
          {/* Company Name */}
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>企業名</FormLabel>
                <FormControl>
                  <Input placeholder="例: 株式会社サンプル" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Industry */}
          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>業種</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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

          {/* Employee Size */}
          <FormField
            control={form.control}
            name="employeeSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>従業員規模</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="例: 500" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Contract Plan */}
          <FormField
            control={form.control}
            name="contractPlan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>契約プラン</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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

          {/* Contract Period */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="contractStartDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>契約開始日</FormLabel>
                  <FormControl>
                    {/* Consider replacing with a Calendar component */}
                    <Input type="date" {...field} />
                  </FormControl>
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
                  <FormControl>
                    {/* Consider replacing with a Calendar component */}
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Max Users */}
          <FormField
            control={form.control}
            name="maxUsers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>最大ユーザー数</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="例: 100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Billing Info */}
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

          <Button type="submit">企業を登録</Button>
        </form>
      </Form>
    </div>
  );
}
