import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  MoreHorizontal,
  Download,
  FileText,
  Search,
  Filter,
  Plus,
} from "lucide-react";

// サンプルデータ
const contracts = [
  {
    id: "CON-2023-001",
    companyName: "株式会社テクノロジーズ",
    plan: "エンタープライズ",
    startDate: "2023-04-01",
    endDate: "2024-03-31",
    status: "active",
    amount: "¥2,400,000",
  },
  {
    id: "CON-2023-002",
    companyName: "ABCコンサルティング",
    plan: "ビジネス",
    startDate: "2023-05-15",
    endDate: "2024-05-14",
    status: "active",
    amount: "¥1,200,000",
  },
  {
    id: "CON-2023-003",
    companyName: "グローバルメディア株式会社",
    plan: "スタンダード",
    startDate: "2023-06-01",
    endDate: "2024-05-31",
    status: "active",
    amount: "¥600,000",
  },
  {
    id: "CON-2022-042",
    companyName: "フューチャーイノベーション",
    plan: "エンタープライズ",
    startDate: "2022-10-01",
    endDate: "2023-09-30",
    status: "expiring",
    amount: "¥2,400,000",
  },
  {
    id: "CON-2022-038",
    companyName: "スマートソリューションズ",
    plan: "ビジネス",
    startDate: "2022-08-15",
    endDate: "2023-08-14",
    status: "expired",
    amount: "¥1,200,000",
  },
];

export default function Contracts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);

  // ステータスに応じたバッジのスタイル
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">有効</Badge>;
      case "expiring":
        return <Badge className="bg-yellow-500">まもなく期限切れ</Badge>;
      case "expired":
        return <Badge className="bg-red-500">期限切れ</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // 日付のフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 検索フィルタリング
  const filteredContracts = contracts.filter(
    (contract) =>
      contract.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.plan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">契約管理</h1>
          <p className="text-gray-500 mt-1">企業との契約情報を管理します</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <Download size={16} />
            エクスポート
          </Button>
          <Button variant="outline" className="flex items-center gap-1">
            <FileText size={16} />
            レポート
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus size={16} />
                新規契約
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>新規契約の追加</DialogTitle>
                <DialogDescription>
                  新しい契約の詳細情報を入力してください
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="company" className="text-right">
                    企業名
                  </Label>
                  <Input id="company" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="plan" className="text-right">
                    プラン
                  </Label>
                  <Input id="plan" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="startDate" className="text-right">
                    開始日
                  </Label>
                  <Input id="startDate" type="date" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="endDate" className="text-right">
                    終了日
                  </Label>
                  <Input id="endDate" type="date" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    契約金額
                  </Label>
                  <Input id="amount" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowAddDialog(false)}
                >
                  キャンセル
                </Button>
                <Button type="submit">保存</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="bg-gray-50 pb-4">
          <div className="flex justify-between items-center">
            <CardTitle>契約一覧</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="企業名・契約IDで検索..."
                  className="pl-8 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>契約ID</TableHead>
                <TableHead>企業名</TableHead>
                <TableHead>プラン</TableHead>
                <TableHead>開始日</TableHead>
                <TableHead>終了日</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead>契約金額</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium">{contract.id}</TableCell>
                  <TableCell>{contract.companyName}</TableCell>
                  <TableCell>{contract.plan}</TableCell>
                  <TableCell>{formatDate(contract.startDate)}</TableCell>
                  <TableCell>{formatDate(contract.endDate)}</TableCell>
                  <TableCell>{getStatusBadge(contract.status)}</TableCell>
                  <TableCell>{contract.amount}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>アクション</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>詳細を表示</DropdownMenuItem>
                        <DropdownMenuItem>編集</DropdownMenuItem>
                        <DropdownMenuItem>更新履歴</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          契約解除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
