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
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

// Define the validation schema using Zod
const companyFormSchema = z.object({
  companyName: z.string().min(1, { message: '企業名を入力してください。' }),
  billingContactName: z.string().optional(),
  billingContactEmail: z.string().email({ message: '有効なメールアドレスを入力してください。' }).optional().or(z.literal('')),
  billingAddress: z.string().optional(),
  billingNotes: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

// Default values for the form
const defaultValues: Partial<CompanyFormValues> = {
  companyName: '',
  billingContactName: '',
  billingContactEmail: '',
  billingAddress: '',
  billingNotes: '',
};

interface AddCompanyFormProps {
  onSuccess: () => void;
}

export function AddCompanyForm({ onSuccess }: AddCompanyFormProps) {
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  function onSubmit(data: CompanyFormValues) {
    // TODO: Implement API call to save the company data
    console.log("New company data from modal:", data);
    toast({
      title: '企業情報が送信されました:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
    onSuccess(); // Call the success callback (e.g., to close modal)
    form.reset(); // Reset form after submission
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6"> {/* Reduced space-y from 8 to 6 for modal */}
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

        {/* Billing Info Section */}
        <h3 className="text-md font-medium border-b pb-2 mb-3 pt-3">請求情報</h3> {/* Adjusted heading size and spacing */}
        <FormField
          control={form.control}
          name="billingContactName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>請求先 担当者名</FormLabel>
              <FormControl>
                <Input placeholder="例: 経理 太郎" {...field} />
              </FormControl>
              <FormDescription>（任意）</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="billingContactEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>請求先 メールアドレス</FormLabel>
              <FormControl>
                <Input type="email" placeholder="例: keiri@example.com" {...field} />
              </FormControl>
              <FormDescription>（任意）</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="billingAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>請求先 住所</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="例: 〒100-0000 東京都千代田区..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>（任意）</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="billingNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>請求に関する備考</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="請求書送付に関する特記事項など"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>（任意）</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-2"> {/* Added pt-2 for spacing before button */}
          <Button type="submit">企業を登録</Button>
        </div>
      </form>
    </Form>
  );
}
