import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MoreHorizontal,
  Search,
  Filter,
  Plus,
  Copy,
  BarChart3,
  FileText,
} from "lucide-react";

// サンプルデータ
const assessments = [
  {
    id: "ASS-001",
    title: "リーダーシップ能力診断",
    type: "能力診断",
    questions: 45,
    companies: 8,
    status: "active",
    createdAt: "2023-02-15",
  },
  {
    id: "ASS-002",
    title: "エンジニアスキル評価",
    type: "スキル評価",
    questions: 60,
    companies: 12,
    status: "active",
    createdAt: "2023-03-10",
  },
  {
    id: "ASS-003",
    title: "組織文化サーベイ",
    type: "組織診断",
    questions: 30,
    companies: 15,
    status: "active",
    createdAt: "2023-04-22",
  },
  {
    id: "ASS-004",
    title: "マネジメントスキル診断",
    type: "能力診断",
    questions: 40,
    companies: 6,
    status: "draft",
    createdAt: "2023-06-05",
  },
  {
    id: "ASS-005",
    title: "コミュニケーション適性テスト",
    type: "適性検査",
    questions: 35,
    companies: 0,
    status: "archived",
    createdAt: "2022-11-30",
  },
];

// サンプル設問データ
const questions = [
  {
    id: 1,
    text: "チームのパフォーマンスを向上させるために、どのようなアプローチを取っていますか？",
    type: "選択式",
  },
  {
    id: 2,
    text: "困難な状況下での意思決定プロセスについて説明してください。",
    type: "記述式",
  },
  {
    id: 3,
    text: "フィードバックを受け取った際の対応方法はどうですか？",
    type: "選択式",
  },
  {
    id: 4,
    text: "あなたのリーダーシップスタイルを最もよく表しているのはどれですか？",
    type: "選択式",
  },
  {
    id: 5,
    text: "プロジェクトが計画通りに進まない場合、どのように対処しますか？",
    type: "選択式",
  },
];

export default function Assessments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showNewDialog, setShowNewDialog] = useState(false);

  // 検索フィルタリング
  const filteredAssessments = assessments.filter((assessment) => {
    // タブによるフィルタリング
    if (activeTab !== "all" && assessment.status !== activeTab) {
      return false;
    }

    // 検索語によるフィルタリング
    return (
      assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // ステータスに応じたバッジのスタイル
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">公開中</Badge>;
      case "draft":
        return <Badge variant="outline">下書き</Badge>;
      case "archived":
        return <Badge variant="secondary">アーカイブ</Badge>;
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

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            アセスメント管理
          </h1>
          <p className="text-gray-500 mt-1">
            企業に提供するアセスメントの作成と管理
          </p>
        </div>

        <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus size={16} />
              新規アセスメント作成
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>新規アセスメントの作成</DialogTitle>
              <DialogDescription>
                新しいアセスメントの基本情報を入力してください。
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  タイトル
                </Label>
                <Input
                  id="title"
                  className="col-span-3"
                  placeholder="例: リーダーシップ能力診断"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  タイプ
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="アセスメントタイプを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ability">能力診断</SelectItem>
                    <SelectItem value="skill">スキル評価</SelectItem>
                    <SelectItem value="organization">組織診断</SelectItem>
                    <SelectItem value="aptitude">適性検査</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  説明
                </Label>
                <Textarea
                  id="description"
                  className="col-span-3"
                  placeholder="アセスメントの目的や内容について説明してください"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewDialog(false)}>
                キャンセル
              </Button>
              <Button type="submit">作成</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">すべて</TabsTrigger>
            <TabsTrigger value="active">公開中</TabsTrigger>
            <TabsTrigger value="draft">下書き</TabsTrigger>
            <TabsTrigger value="archived">アーカイブ</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="アセスメントを検索..."
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

        <TabsContent value={activeTab} className="mt-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>タイトル</TableHead>
                    <TableHead>タイプ</TableHead>
                    <TableHead>設問数</TableHead>
                    <TableHead>利用企業数</TableHead>
                    <TableHead>ステータス</TableHead>
                    <TableHead>作成日</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssessments.map((assessment) => (
                    <TableRow key={assessment.id}>
                      <TableCell className="font-medium">
                        {assessment.id}
                      </TableCell>
                      <TableCell>{assessment.title}</TableCell>
                      <TableCell>{assessment.type}</TableCell>
                      <TableCell>{assessment.questions}</TableCell>
                      <TableCell>{assessment.companies}</TableCell>
                      <TableCell>{getStatusBadge(assessment.status)}</TableCell>
                      <TableCell>{formatDate(assessment.createdAt)}</TableCell>
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
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              設問編集
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <BarChart3 className="mr-2 h-4 w-4" />
                              結果分析
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-4 w-4" />
                              複製
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {assessment.status === "active" ? (
                              <DropdownMenuItem>
                                アーカイブする
                              </DropdownMenuItem>
                            ) : assessment.status === "draft" ? (
                              <DropdownMenuItem>公開する</DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem>復元する</DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 詳細パネル（オプションで切り替え可能） */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>設問サンプル: リーダーシップ能力診断</CardTitle>
          <CardDescription>
            アセスメント内の設問リスト（最初の5問）
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">No.</TableHead>
                <TableHead>設問文</TableHead>
                <TableHead className="w-[150px]">タイプ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell className="font-medium">{question.id}</TableCell>
                  <TableCell>{question.text}</TableCell>
                  <TableCell>{question.type}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline">すべての設問を表示</Button>
          <Button>設問を編集</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
