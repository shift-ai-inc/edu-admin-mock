import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Building2,
  AlertCircle,
  BarChart3,
  FileText,
  Calendar,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// サンプルデータ
const recentActivities = [
  {
    id: 1,
    title: "株式会社テクノロジーズがサーベイに回答しました",
    type: "survey",
    time: "1時間前",
  },
  {
    id: 2,
    title: "新規契約: ABCコンサルティング",
    type: "contract",
    time: "3時間前",
  },
  {
    id: 3,
    title: "リーダーシップ能力診断の結果が更新されました",
    type: "assessment",
    time: "5時間前",
  },
  {
    id: 4,
    title: "グローバルメディア株式会社のアカウント情報が更新されました",
    type: "company",
    time: "1日前",
  },
  {
    id: 5,
    title: "新規アセスメント「チームワーク診断」が作成されました",
    type: "assessment",
    time: "1日前",
  },
];

const upcomingSurveys = [
  {
    id: "SUR-2023-004",
    title: "マネジメント評価サーベイ",
    company: "フューチャーイノベーション",
    date: "2023-07-01",
    status: "scheduled",
  },
  {
    id: "SUR-2023-005",
    title: "1on1フィードバックサーベイ",
    company: "スマートソリューションズ",
    date: "2023-07-10",
    status: "draft",
  },
];

// アクティビティタイプに応じたアイコンを取得
const getActivityIcon = (type: string) => {
  switch (type) {
    case "survey":
      return <FileText className="h-4 w-4 text-blue-500" />;
    case "contract":
      return <FileText className="h-4 w-4 text-green-500" />;
    case "assessment":
      return <BarChart3 className="h-4 w-4 text-purple-500" />;
    case "company":
      return <Building2 className="h-4 w-4 text-orange-500" />;
    default:
      return <Bell className="h-4 w-4 text-gray-500" />;
  }
};

export default function Dashboard() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            ダッシュボード
          </h1>
          <p className="text-gray-500 mt-1">
            SHIFT AI管理ポータルのアクティビティと統計情報
          </p>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            今月
          </Button>
          <Button variant="outline">レポートを生成</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">管理企業数</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-2">
              <div className="text-3xl font-bold">2,350</div>
              <div className="text-sm font-medium text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                8.3%
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">先月比 +180社</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              アクティブユーザー
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-2">
              <div className="text-3xl font-bold">12,234</div>
              <div className="text-sm font-medium text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                2.1%
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">先週比 +250人</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              アセスメント利用率
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-2">
              <div className="text-3xl font-bold">74.5%</div>
              <div className="text-sm font-medium text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                5.1%
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              先月比 +5.1ポイント
            </p>
            <Progress value={74.5} className="mt-2 h-1.5" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              未解決サポート
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-2">
              <div className="text-3xl font-bold">13</div>
              <div className="text-sm font-medium text-red-600 flex items-center">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                36%
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">先週比 -4件</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>最近のアクティビティ</CardTitle>
            <CardDescription>システム全体の最新アクティビティ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="mt-1">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              すべてのアクティビティを表示
            </Button>
          </CardFooter>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>予定されているサーベイ</CardTitle>
            <CardDescription>今後2週間の予定</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>サーベイ名</TableHead>
                  <TableHead>対象企業</TableHead>
                  <TableHead>開始日</TableHead>
                  <TableHead>ステータス</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingSurveys.map((survey) => (
                  <TableRow key={survey.id}>
                    <TableCell className="font-medium">
                      {survey.title}
                    </TableCell>
                    <TableCell>{survey.company}</TableCell>
                    <TableCell>
                      {new Date(survey.date).toLocaleDateString("ja-JP")}
                    </TableCell>
                    <TableCell>
                      {survey.status === "scheduled" ? (
                        <Badge className="bg-blue-500">予定</Badge>
                      ) : (
                        <Badge variant="outline">下書き</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center"
            >
              すべてのサーベイ <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>アセスメント利用状況</CardTitle>
            <CardDescription>過去30日間の利用統計</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border border-dashed rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-8 w-8 mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  グラフ表示領域（実際の実装では、Rechartsなどのライブラリを使用）
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>人気アセスメント</CardTitle>
            <CardDescription>利用企業数ランキング</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">
                    リーダーシップ能力診断
                  </div>
                  <div className="text-sm text-muted-foreground">65社</div>
                </div>
                <Progress value={65} className="h-1.5" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">組織文化サーベイ</div>
                  <div className="text-sm text-muted-foreground">52社</div>
                </div>
                <Progress value={52} className="h-1.5" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">
                    エンジニアスキル評価
                  </div>
                  <div className="text-sm text-muted-foreground">48社</div>
                </div>
                <Progress value={48} className="h-1.5" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">
                    マネジメントスキル診断
                  </div>
                  <div className="text-sm text-muted-foreground">41社</div>
                </div>
                <Progress value={41} className="h-1.5" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">
                    コミュニケーション適性テスト
                  </div>
                  <div className="text-sm text-muted-foreground">37社</div>
                </div>
                <Progress value={37} className="h-1.5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
