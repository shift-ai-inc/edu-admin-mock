import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Edit, Save, X, Building, MapPin, Phone, Mail, UserCircle, FileText, AlertTriangle, CheckCircle, Power } from "lucide-react";
import { Label } from "@/components/ui/label";
import { mockCompanies } from '@/data/mockCompanies'; // Import mockCompanies

// Validation schema remains the same
const updateCompanyFormSchema = z.object({
  companyId: z.string(),
  companyName: z.string().min(1, { message: "企業名を入力してください。" }),
  address: z.string().optional(),
  contactInfo: z.string().optional(),
  billingContactName: z.string().optional(),
  billingContactEmail: z
    .string()
    .email({ message: "有効なメールアドレスを入力してください。" })
    .optional()
    .or(z.literal("")),
  billingAddress: z.string().optional(),
  billingNotes: z.string().optional(),
  adminName: z.string().optional(),
  adminEmail: z
    .string()
    .email({ message: "有効なメールアドレスを入力してください。" })
    .optional()
    .or(z.literal("")),
  isActive: z.boolean().default(true),
});

type UpdateCompanyFormValues = z.infer<typeof updateCompanyFormSchema>;

// Updated fetchCompanyData to use mockCompanies
const fetchCompanyData = async (
  companyIdToFind: string
): Promise<UpdateCompanyFormValues> => {
  console.log(`[fetchCompanyData] Attempting to find company with ID: "${companyIdToFind}"`);
  
  // Log the state of mockCompanies before attempting to find
  console.log('[fetchCompanyData] mockCompanies content at time of search:', JSON.stringify(mockCompanies, null, 2));
  if (!mockCompanies || mockCompanies.length === 0) {
    console.error('[fetchCompanyData] mockCompanies is empty or undefined!');
  } else {
    console.log('[fetchCompanyData] IDs in mockCompanies:');
    mockCompanies.forEach(c => console.log(`  - "${c.id}" (name: ${c.name})`));
  }

  const company = mockCompanies.find(c => {
    const isMatch = c.id === companyIdToFind;
    if (!isMatch) {
      // This log can be very verbose if many companies, enable if needed for deep debugging
      // console.log(`[fetchCompanyData] Comparing: route_id="${companyIdToFind}" vs mock_id="${c.id}" -> NO MATCH`);
    }
    return isMatch;
  });

  if (!company) {
    console.error(`[fetchCompanyData] Company with ID "${companyIdToFind}" NOT FOUND in mockCompanies.`);
    throw new Error(`Company with ID ${companyIdToFind} not found.`);
  }

  console.log(`[fetchCompanyData] Found company: Name = ${company.name}, ID = ${company.id}`);
  // Simulate fetching more details for this company, or expand mockCompanies to include all these details
  return Promise.resolve({
    companyId: company.id,
    companyName: company.name,
    address: `東京都サンプル区 ${company.name}ビル`, // Example dynamic address
    contactInfo: "03-1234-5678", // Placeholder
    billingContactName: `経理担当 ${company.name}`, // Example
    billingContactEmail: `keiri@${company.id.replace('company-','')}.example.com`, // Example
    billingAddress: `請求先住所: 東京都千代田区丸の内1-1-1 ${company.name}事業所`, // Example
    billingNotes: "請求書はPDFで送付希望。\n毎月20日締め、翌月末払い。", // Placeholder
    adminName: `管理者 ${company.name}`, // Example
    adminEmail: `admin@${company.id.replace('company-','')}.example.com`, // Example
    isActive: true, // Default or could be part of extended mockCompany type
  });
};

// Helper component to display info item
const InfoItem = ({ icon, label, value }: { icon: React.ElementType, label: string, value?: string | null | React.ReactNode }) => (
  <div>
    <Label className="text-xs text-muted-foreground">{label}</Label>
    <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 min-h-[36px] mt-1">
      {React.createElement(icon, { className: "h-4 w-4 text-gray-500 flex-shrink-0" })}
      <span className="text-sm">{value || "-"}</span>
    </div>
  </div>
);

const InfoTextareaItem = ({ icon, label, value }: { icon: React.ElementType, label: string, value?: string | null }) => (
  <div>
    <Label className="text-xs text-muted-foreground">{label}</Label>
    <div className="flex items-start gap-2 p-2 border rounded-md bg-gray-50 min-h-[60px] mt-1">
      {React.createElement(icon, { className: "h-4 w-4 text-gray-500 flex-shrink-0 mt-1" })}
      <p className="text-sm whitespace-pre-line">{value || "-"}</p>
    </div>
  </div>
);


export default function UpdateCompany() {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState<UpdateCompanyFormValues | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [initialIsActive, setInitialIsActive] = useState<boolean | undefined>(undefined);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);

  const form = useForm<UpdateCompanyFormValues>({
    resolver: zodResolver(updateCompanyFormSchema),
    mode: "onChange",
  });

  const watchedIsActiveInForm = form.watch("isActive");

  useEffect(() => {
    const companyIdFromParams = companyId;
    console.log("[UpdateCompany useEffect] Hook triggered. Received companyId from params:", companyIdFromParams);

    if (!companyIdFromParams) {
      toast({
        title: "エラー",
        description: "企業IDが見つかりません。URLを確認してください。",
        variant: "destructive",
      });
      setIsLoading(false);
      navigate("/companies"); 
      return;
    }
    const loadData = async () => {
      setIsLoading(true);
      console.log(`[UpdateCompany loadData] Attempting to load data for companyId: "${companyIdFromParams}"`);
      try {
        const data = await fetchCompanyData(companyIdFromParams);
        console.log("[UpdateCompany loadData] Successfully fetched data:", data);
        setCompanyData(data);
        form.reset(data); 
        setInitialIsActive(data.isActive);
      } catch (error) {
        console.error("[UpdateCompany loadData] Failed to fetch company data:", error);
        toast({
          title: "データ取得エラー",
          description: "企業情報の読み込みに失敗しました。指定された企業が見つからない可能性があります。",
          variant: "destructive",
        });
        setCompanyData(null); 
      } finally {
        setIsLoading(false);
        console.log("[UpdateCompany loadData] Finished loading attempt.");
      }
    };
    loadData();
  }, [companyId, form, navigate]); // companyId from useParams is the key dependency here

  const deactivateRequiresConfirm =
    initialIsActive === true && watchedIsActiveInForm === false;

  const handleFormSubmit = (data: UpdateCompanyFormValues) => {
    if (deactivateRequiresConfirm && !showDeactivateConfirm) {
      setShowDeactivateConfirm(true);
      return;
    }
    setShowDeactivateConfirm(false);
    submitData(data);
  };

  const submitData = (data: UpdateCompanyFormValues) => {
    console.log("[UpdateCompany submitData] Submitting updated data:", data);
    // Simulate API call
    // In a real app, you'd also update mockCompanies array if it's the source of truth
    // For example:
    // const companyIndex = mockCompanies.findIndex(c => c.id === data.companyId);
    // if (companyIndex > -1) {
    //   mockCompanies[companyIndex] = { ...mockCompanies[companyIndex], name: data.companyName /*, other relevant fields */ };
    // }
    setCompanyData(data); 
    setInitialIsActive(data.isActive); 
    setIsEditDialogOpen(false); 
    form.reset(data); 

    toast({
      title: "企業情報が更新されました",
      description: `${data.companyName} の情報が正常に更新されました。`,
    });
  };

  const handleOpenEditDialog = () => {
    if (companyData) {
      form.reset(companyData); 
    }
    setIsEditDialogOpen(true);
  };


  if (isLoading) {
    return <div className="p-8 text-center">読み込み中...</div>;
  }

  if (!companyData) {
    return (
      <div className="p-8 text-center text-red-600">
        企業情報の読み込みに失敗しました。企業一覧に戻ってください。
        <Button onClick={() => navigate("/companies")} className="mt-4">企業一覧へ</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          {companyData.companyName}
        </h1>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" onClick={handleOpenEditDialog}>
              <Edit className="mr-2 h-4 w-4" />
              企業情報を編集
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>企業情報編集</DialogTitle>
              <DialogDescription>
                {companyData.companyName} の情報を編集します。
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleFormSubmit)}
                className="space-y-6 py-4"
              >
                {/* Basic Info Section in Dialog */}
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
                      <FormLabel>企業住所</FormLabel>
                      <FormControl><Input placeholder="例: 東京都千代田区..." {...field} /></FormControl>
                      <FormDescription>（企業の代表住所など）</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>企業連絡先</FormLabel>
                      <FormControl><Input placeholder="例: 03-xxxx-xxxx" {...field} /></FormControl>
                      <FormDescription>（企業の代表連絡先など）</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Billing Info Section in Dialog */}
                <h3 className="text-lg font-medium border-b pb-2 mb-4 pt-4">請求情報</h3>
                <FormField
                  control={form.control}
                  name="billingContactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>請求先 担当者名</FormLabel>
                      <FormControl><Input placeholder="例: 経理 太郎" {...field} /></FormControl>
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
                      <FormControl><Input type="email" placeholder="例: keiri@example.com" {...field} /></FormControl>
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
                      <FormControl><Textarea placeholder="例: 〒100-0000 東京都千代田区..." className="resize-none" {...field} /></FormControl>
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
                      <FormControl><Textarea placeholder="請求書送付に関する特記事項など" className="resize-none" {...field} /></FormControl>
                      <FormDescription>（任意）</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Admin Info Section in Dialog */}
                <h3 className="text-lg font-medium border-b pb-2 mb-4 pt-4">管理者情報</h3>
                <FormField
                  control={form.control}
                  name="adminName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>代表管理者名</FormLabel>
                      <FormControl><Input placeholder="例: 管理者 太郎" {...field} /></FormControl>
                      <FormDescription>（このシステムを利用する企業の代表管理者）</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="adminEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>代表管理者メールアドレス</FormLabel>
                      <FormControl><Input type="email" placeholder="例: admin@example.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Account Status Section in Dialog */}
                <h3 className="text-lg font-medium border-b pb-2 mb-4 pt-4">アカウントステータス</h3>
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">アカウント有効</FormLabel>
                        <FormDescription>
                          アカウントが無効の場合、関連するユーザーはログインできなくなります。
                        </FormDescription>
                        {deactivateRequiresConfirm && (
                          <p className="text-sm font-medium text-red-600 mt-1">
                            <AlertTriangle className="inline-block mr-1 h-4 w-4" />
                            アカウントを無効化すると、関連ユーザーがアクセスできなくなります。
                          </p>
                        )}
                      </div>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                  )}
                />
                <DialogFooter className="pt-4">
                  <DialogClose asChild>
                    <Button variant="outline" type="button"><X className="mr-2 h-4 w-4" />キャンセル</Button>
                  </DialogClose>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    <Save className="mr-2 h-4 w-4" />
                    {form.formState.isSubmitting ? "保存中..." : "変更を保存"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Display Company Data in Cards */}
      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>基本情報</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <InfoItem icon={Building} label="企業名" value={companyData.companyName} />
            <InfoItem icon={MapPin} label="企業住所" value={companyData.address} />
            <InfoItem icon={Phone} label="企業連絡先" value={companyData.contactInfo} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>請求情報</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <InfoItem icon={UserCircle} label="請求先 担当者名" value={companyData.billingContactName} />
            <InfoItem icon={Mail} label="請求先 メールアドレス" value={companyData.billingContactEmail} />
            <InfoTextareaItem icon={MapPin} label="請求先 住所" value={companyData.billingAddress} />
            <InfoTextareaItem icon={FileText} label="請求に関する備考" value={companyData.billingNotes} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>管理者情報</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <InfoItem icon={UserCircle} label="代表管理者名" value={companyData.adminName} />
            <InfoItem icon={Mail} label="代表管理者メールアドレス" value={companyData.adminEmail} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>アカウントステータス</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 min-h-[36px]">
              {companyData.isActive ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-green-700">有効</span>
                </>
              ) : (
                <>
                  <Power className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-red-700">無効</span>
                </>
              )}
            </div>
             <p className="text-xs text-muted-foreground mt-2">
                アカウントが無効の場合、この企業に所属する全てのユーザーはシステムにアクセスできなくなります。
             </p>
          </CardContent>
        </Card>
      </div>


      {/* Deactivation Confirmation Dialog (separate from edit dialog) */}
      <AlertDialog
        open={showDeactivateConfirm}
        onOpenChange={setShowDeactivateConfirm}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>アカウント無効化の確認</AlertDialogTitle>
            <AlertDialogDescription>
              アカウントを無効にすると、この企業に所属するすべてのユーザーがシステムにアクセスできなくなります。本当に無効化しますか？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                form.setValue("isActive", true); // Revert switch in form
                setShowDeactivateConfirm(false);
              }}
            >
              キャンセル
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => submitData(form.getValues())}>
              無効化を確認して続行
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
