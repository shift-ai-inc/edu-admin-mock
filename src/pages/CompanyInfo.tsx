import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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
  Building,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  Calendar,
  Edit,
  Save,
  X,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// 会社情報の型定義
interface CompanyInfoData {
  name: string;
  legalName: string;
  industry: string;
  foundedYear: string;
  employeeCount: string;
  description: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  corporateNumber?: string;
  billingAddress?: string;
  subdomain?: string;
  language?: string;
}

// サンプル会社情報
const sampleCompanyInfo: CompanyInfoData = {
  name: "テクノバンガード株式会社",
  legalName: "テクノバンガード株式会社",
  industry: "情報技術",
  foundedYear: "2010",
  employeeCount: "150",
  description:
    "私たちは革新的なソフトウェアソリューションを提供する企業です。\nクラウドテクノロジー、AI、データ分析分野での専門知識を活かし、企業の課題解決に貢献しています。",
  address: "東京都港区六本木1-1-1 テクノタワー8階",
  postalCode: "106-0032",
  city: "東京",
  country: "日本",
  phone: "03-1234-5678",
  email: "info@technovanguard.co.jp",
  website: "https://www.technovanguard.co.jp",
};

const industries = [
  "情報技術",
  "金融",
  "医療",
  "教育",
  "小売",
  "製造",
  "不動産",
  "建設",
  "エンターテイメント",
  "旅行・観光",
  "運輸・物流",
  "エネルギー",
  "農業",
  "その他",
];

export default function CompanyInfo() {
  const [companyInfo, setCompanyInfo] =
    useState<CompanyInfoData>(sampleCompanyInfo);
  const [editingInfo, setEditingInfo] =
    useState<CompanyInfoData>(sampleCompanyInfo);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  // 編集ダイアログを開くときに現在の情報をセット
  const handleOpenEditDialog = () => {
    setEditingInfo({ ...companyInfo });
    setIsEditDialogOpen(true);
  };

  // 情報の保存
  const saveChanges = () => {
    // ここでAPI呼び出しをシミュレート
    console.log("Saving company info:", editingInfo);
    setCompanyInfo(editingInfo);
    setIsEditDialogOpen(false);
    toast({
      title: "成功",
      description: "会社情報が正常に保存されました。",
      variant: "default",
    });
  };

  // フォームの入力変更ハンドラ
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Selectコンポーネントの変更ハンドラ
  const handleSelectChange = (name: keyof CompanyInfoData, value: string) => {
    setEditingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto p-6 lg:p-8">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">会社情報</h1>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={handleOpenEditDialog}>
                <Edit className="mr-2 h-4 w-4" />
                編集
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>会社情報編集</DialogTitle>
                <DialogDescription>
                  会社の詳細情報を編集します。変更後、「保存」をクリックしてください。
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {/* 基本情報フォーム */}
                <h4 className="font-semibold text-md mb-2 border-b pb-1">基本情報</h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <Label htmlFor="name-edit-dialog">会社名</Label>
                    <Input
                      id="name-edit-dialog"
                      name="name"
                      value={editingInfo.name}
                      onChange={handleInputChange}
                      placeholder="会社名を入力"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="legalName-edit-dialog">正式社名</Label>
                    <Input
                      id="legalName-edit-dialog"
                      name="legalName"
                      value={editingInfo.legalName}
                      onChange={handleInputChange}
                      placeholder="正式社名を入力"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="space-y-1">
                    <Label htmlFor="industry-edit-dialog">業種</Label>
                    <Select
                      value={editingInfo.industry}
                      onValueChange={(value) => handleSelectChange('industry', value)}
                      // name="industry" // Select doesn't need name prop when onValueChange is used
                    >
                      <SelectTrigger id="industry-edit-dialog">
                        <SelectValue placeholder="業種を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="foundedYear-edit-dialog">設立年</Label>
                    <Input
                      id="foundedYear-edit-dialog"
                      name="foundedYear"
                      value={editingInfo.foundedYear}
                      onChange={handleInputChange}
                      placeholder="例: 2010"
                      type="number"
                      min="1800"
                      max={new Date().getFullYear()}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="employeeCount-edit-dialog">従業員数</Label>
                    <Input
                      id="employeeCount-edit-dialog"
                      name="employeeCount"
                      value={editingInfo.employeeCount}
                      onChange={handleInputChange}
                      placeholder="例: 150"
                      type="number"
                      min="0"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="description-edit-dialog">会社概要</Label>
                  <Textarea
                    id="description-edit-dialog"
                    name="description"
                    value={editingInfo.description}
                    onChange={handleInputChange}
                    placeholder="会社概要を入力"
                    rows={4}
                    className="min-h-[80px]"
                  />
                </div>

                {/* 連絡先情報フォーム */}
                <h4 className="font-semibold text-md mt-4 mb-2 border-b pb-1">連絡先情報</h4>
                <div className="space-y-1">
                  <Label htmlFor="address-edit-dialog">住所</Label>
                  <Input
                    id="address-edit-dialog"
                    name="address"
                    value={editingInfo.address}
                    onChange={handleInputChange}
                    placeholder="住所を入力"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="space-y-1">
                    <Label htmlFor="postalCode-edit-dialog">郵便番号</Label>
                    <Input
                      id="postalCode-edit-dialog"
                      name="postalCode"
                      value={editingInfo.postalCode}
                      onChange={handleInputChange}
                      placeholder="例: 100-0000"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="city-edit-dialog">市区町村</Label>
                    <Input
                      id="city-edit-dialog"
                      name="city"
                      value={editingInfo.city}
                      onChange={handleInputChange}
                      placeholder="例: 東京都千代田区"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="country-edit-dialog">国</Label>
                    <Input
                      id="country-edit-dialog"
                      name="country"
                      value={editingInfo.country}
                      onChange={handleInputChange}
                      placeholder="例: 日本"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="space-y-1">
                    <Label htmlFor="phone-edit-dialog">電話番号</Label>
                    <Input
                      id="phone-edit-dialog"
                      name="phone"
                      value={editingInfo.phone}
                      onChange={handleInputChange}
                      placeholder="例: 03-1234-5678"
                      type="tel"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email-edit-dialog">代表メールアドレス</Label>
                    <Input
                      id="email-edit-dialog"
                      name="email"
                      type="email"
                      value={editingInfo.email}
                      onChange={handleInputChange}
                      placeholder="例: info@example.com"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="website-edit-dialog">ウェブサイト</Label>
                    <Input
                      id="website-edit-dialog"
                      name="website"
                      value={editingInfo.website}
                      onChange={handleInputChange}
                      placeholder="例: https://www.example.com"
                      type="url"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" type="button"> {/* Added type="button" to prevent form submission */}
                    <X className="mr-2 h-4 w-4" />
                    キャンセル
                  </Button>
                </DialogClose>
                <Button onClick={saveChanges} type="button"> {/* Added type="button" */}
                  <Save className="mr-2 h-4 w-4" />
                  保存
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* 基本情報カード */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
            <CardDescription>
              会社の基本的な情報が表示されます。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label className="text-xs text-muted-foreground">会社名</Label>
                <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 min-h-[36px]">
                  <Building className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span>{companyInfo.name || "-"}</span>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">正式社名</Label>
                <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 min-h-[36px]">
                  <Building className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span>{companyInfo.legalName || "-"}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <Label className="text-xs text-muted-foreground">業種</Label>
                <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 min-h-[36px]">
                  <span>{companyInfo.industry || "-"}</span>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">設立年</Label>
                <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 min-h-[36px]">
                  <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span>{companyInfo.foundedYear ? `${companyInfo.foundedYear}年` : "-"}</span>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">従業員数</Label>
                <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 min-h-[36px]">
                  <Users className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span>{companyInfo.employeeCount ? `${companyInfo.employeeCount}名` : "-"}</span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">会社概要</Label>
              <div className="p-3 border rounded-md bg-gray-50 min-h-[100px]">
                <p className="text-gray-800 whitespace-pre-line">
                  {companyInfo.description || "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 連絡先情報カード */}
        <Card>
          <CardHeader>
            <CardTitle>連絡先情報</CardTitle>
            <CardDescription>会社の連絡先情報が表示されます。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">住所</Label>
              <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 min-h-[36px]">
                <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <span>{companyInfo.address || "-"}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <Label className="text-xs text-muted-foreground">郵便番号</Label>
                <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 min-h-[36px]">
                  <span>{companyInfo.postalCode || "-"}</span>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">市区町村</Label>
                <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 min-h-[36px]">
                  <span>{companyInfo.city || "-"}</span>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">国</Label>
                <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 min-h-[36px]">
                  <span>{companyInfo.country || "-"}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <Label className="text-xs text-muted-foreground">電話番号</Label>
                <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 min-h-[36px]">
                  <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span>{companyInfo.phone || "-"}</span>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">代表メールアドレス</Label>
                <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 min-h-[36px]">
                  <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span>{companyInfo.email || "-"}</span>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">ウェブサイト</Label>
                <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 min-h-[36px]">
                  <Globe className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  {companyInfo.website ? (
                     <a
                      href={companyInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate"
                    >
                      {companyInfo.website}
                    </a>
                  ) : (
                    <span>-</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
