import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Import Tabs
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeft, Eye, GitCompareArrows, History, Edit, CheckCircle, Settings2, Send } from 'lucide-react'; // Added/updated icons

// --- Mock Data Types ---
interface AssessmentVersion {
  versionNumber: number;
  createdAt: string;
  author: string;
  status: 'published' | 'draft' | 'archived';
  questionCount: number;
  // isLatest is useful but 'delivered' is a separate concept
}

interface Assessment {
  id: string;
  title: string;
  type: string;
  // questions: number; // This might be derived from the delivered version
  // companies: number; // This might be less relevant here or fetched separately
  status: 'published' | 'draft' | 'archived'; // Overall status might still be useful
  createdAt: string;
  description?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;
  targetSkillLevel: string;
}


// --- Mock Data ---

// Find assessment function (replace with API call later)
const findAssessmentById = (id: string): Assessment | undefined => {
  const assessments: Assessment[] = [
    {
      id: "ASS-001",
      title: "リーダーシップ能力診断",
      type: "能力診断",
      status: "published",
      createdAt: "2023-02-15",
      description: "リーダーとしての潜在能力と現在のスキルセットを評価します。チームマネジメント、意思決定、コミュニケーション能力に焦点を当てています。",
      difficulty: "medium",
      estimatedTime: 60,
      targetSkillLevel: "intermediate",
    },
    {
      id: "ASS-002",
      title: "エンジニアスキル評価",
      type: "スキル評価",
      status: "published",
      createdAt: "2023-03-10",
      description: "ソフトウェアエンジニア向けの技術スキル評価。アルゴリズム、データ構造、特定のプログラミング言語に関する知識を測定します。",
      difficulty: "hard",
      estimatedTime: 90,
      targetSkillLevel: "advanced",
    },
     // Add more assessments if needed
  ];
  return assessments.find(assessment => assessment.id === id);
};

// Mock Version History Data (replace with API call later)
const getAssessmentVersions = (assessmentId: string): AssessmentVersion[] => {
  console.log("Fetching versions for:", assessmentId); // Simulate API call
  if (assessmentId === 'ASS-001') {
    return [
      { versionNumber: 3, createdAt: "2024-07-20", author: "田中 太郎", status: "published", questionCount: 45 },
      { versionNumber: 2, createdAt: "2024-05-10", author: "佐藤 花子", status: "archived", questionCount: 40 },
      { versionNumber: 1, createdAt: "2023-02-15", author: "田中 太郎", status: "archived", questionCount: 35 },
    ].sort((a, b) => b.versionNumber - a.versionNumber); // Ensure descending order
  }
  if (assessmentId === 'ASS-002') {
     return [
      { versionNumber: 2, createdAt: "2023-03-10", author: "鈴木 一郎", status: "published", questionCount: 60 },
      { versionNumber: 1, createdAt: "2023-01-05", author: "鈴木 一郎", status: "archived", questionCount: 55 },
    ].sort((a, b) => b.versionNumber - a.versionNumber);
  }
  return [
     { versionNumber: 1, createdAt: "2023-10-01", author: "管理者", status: "draft", questionCount: 10 },
  ].sort((a, b) => b.versionNumber - a.versionNumber);
};

// --- Component ---
export default function AssessmentDetail() {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [versions, setVersions] = useState<AssessmentVersion[]>([]);
  const [selectedVersionNumber, setSelectedVersionNumber] = useState<number | null>(null);
  const [deliveredVersionNumber, setDeliveredVersionNumber] = useState<number | null>(null); // Track the delivered version

  useEffect(() => {
    if (assessmentId) {
      const foundAssessment = findAssessmentById(assessmentId);
      const foundVersions = getAssessmentVersions(assessmentId);

      if (foundAssessment && foundVersions.length > 0) {
        setAssessment(foundAssessment);
        setVersions(foundVersions);
        // Default selected tab to the latest version
        const latestVersion = foundVersions[0]; // Assuming sorted desc
        setSelectedVersionNumber(latestVersion.versionNumber);

        // Simulate fetching/determining the currently delivered version
        // For now, let's assume the latest *published* version is delivered, or the latest if none are published
        const delivered = foundVersions.find(v => v.status === 'published') || latestVersion;
        setDeliveredVersionNumber(delivered.versionNumber);

      } else {
         // Handle assessment not found or no versions
         navigate('/assessments'); // Or show a not found message
      }
    } else {
      navigate('/assessments');
    }
  }, [assessmentId, navigate]);

  // --- Helper Functions ---
  const getStatusBadge = (status: AssessmentVersion['status']) => {
    switch (status) {
      case "published": return <Badge variant="default">公開中</Badge>;
      case "draft": return <Badge variant="outline">下書き</Badge>;
      case "archived": return <Badge variant="secondary">アーカイブ</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const getDifficultyBadge = (difficulty: Assessment['difficulty']) => {
    switch (difficulty) {
      case "easy": return <Badge variant="secondary">易しい</Badge>;
      case "medium": return <Badge variant="outline">普通</Badge>;
      case "hard": return <Badge variant="destructive">難しい</Badge>;
      default: return <Badge>{difficulty}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });
  };

  // --- Action Handlers ---
  const handleEditBasicInfo = () => {
    console.log(`Edit basic info for assessment ${assessmentId}`);
    // navigate(`/assessments/edit/${assessmentId}`); // Navigate to a dedicated edit page/modal
  };

  const handleViewEditQuestions = (versionNumber: number) => {
    console.log(`View/Edit questions for version ${versionNumber} of assessment ${assessmentId}`);
    // navigate(`/assessments/${assessmentId}/versions/${versionNumber}/edit`);
  };

  const handleCompareVersions = (versionNumber: number) => {
    const previousVersionNumber = versionNumber - 1;
    if (previousVersionNumber < 1) return; // Cannot compare the first version
    console.log(`Compare version ${versionNumber} and ${previousVersionNumber} for assessment ${assessmentId}`);
    // Implement comparison logic/UI
  };

  const handleSetDeliveredVersion = (versionNumber: number) => {
    console.log(`Setting version ${versionNumber} as delivered for assessment ${assessmentId}`);
    // TODO: API Call to update the delivered version
    setDeliveredVersionNumber(versionNumber);
    // Optionally, update the status of the old delivered version if needed (e.g., to 'archived'?)
    // Or ensure the new delivered version is 'published'
    setVersions(prevVersions =>
      prevVersions.map(v =>
        v.versionNumber === versionNumber ? { ...v, status: 'published' } : v
      )
    );
     setSelectedVersionNumber(versionNumber); // Switch tab focus
  };

  const handleChangeVersionStatus = (versionNumber: number, newStatus: AssessmentVersion['status']) => {
    console.log(`Changing status of version ${versionNumber} to ${newStatus} for assessment ${assessmentId}`);
    // TODO: API Call to update status

    // Prevent changing status of the delivered version to non-published? Or handle implications.
    if (versionNumber === deliveredVersionNumber && newStatus !== 'published') {
      alert("配信中のバージョンは「公開中」ステータスである必要があります。"); // Or use a toast
      return;
    }

    setVersions(prevVersions =>
      prevVersions.map(v =>
        v.versionNumber === versionNumber ? { ...v, status: newStatus } : v
      )
    );
  };


  if (!assessment || versions.length === 0 || selectedVersionNumber === null) {
    return <div className="p-8">読み込み中またはデータがありません...</div>;
  }

  const selectedVersion = versions.find(v => v.versionNumber === selectedVersionNumber);

  return (
    <div className="p-8 space-y-6">
      {/* Back Button and Title */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={() => navigate('/assessments')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          <span>{assessment.title}</span>
          <Badge variant="outline">{assessment.id}</Badge>
        </h1>
         <Button onClick={handleEditBasicInfo}>
           <Edit className="mr-2 h-4 w-4" />
           基本情報編集
         </Button>
      </div>

      {/* Assessment Basic Info Card (Remains mostly the same) */}
      <Card>
        <CardHeader>
          <CardTitle>基本情報</CardTitle>
          <CardDescription>アセスメント全体の概要と設定</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Removed ID/Title as they are in the header now */}
            <div><span className="font-medium text-gray-600">カテゴリ:</span> {assessment.type}</div>
            <div><span className="font-medium text-gray-600">全体ステータス:</span> {getStatusBadge(assessment.status)}</div>
            <div><span className="font-medium text-gray-600">難易度:</span> {getDifficultyBadge(assessment.difficulty)}</div>
            <div><span className="font-medium text-gray-600">対象スキル:</span> {assessment.targetSkillLevel}</div>
            <div><span className="font-medium text-gray-600">想定所要時間:</span> {assessment.estimatedTime} 分</div>
            <div><span className="font-medium text-gray-600">初回作成日:</span> {formatDate(assessment.createdAt)}</div>
          </div>
           <div>
             <span className="font-medium text-gray-600 block mb-1">説明:</span>
             <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded border">{assessment.description || '説明がありません。'}</p>
           </div>
        </CardContent>
      </Card>

      {/* Version Management Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>バージョン管理</CardTitle>
          <CardDescription>
            設問バージョンを選択して詳細確認、編集、ステータス変更を行います。
            <CheckCircle className="inline-block h-4 w-4 ml-2 text-green-600" />
            アイコンが付いているバージョンが現在配信中です。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedVersionNumber.toString()} onValueChange={(value) => setSelectedVersionNumber(parseInt(value, 10))} className="w-full">
            <TabsList className="grid w-full grid-cols-auto justify-start">
              {versions.map((version) => (
                <TabsTrigger key={version.versionNumber} value={version.versionNumber.toString()} className="relative">
                  v{version.versionNumber}
                  {version.versionNumber === deliveredVersionNumber && (
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                           <CheckCircle className="absolute -top-1 -right-1 h-4 w-4 text-green-600 bg-white rounded-full" />
                        </TooltipTrigger>
                        <TooltipContent>配信中のバージョン</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {versions.map((version) => (
              <TabsContent key={version.versionNumber} value={version.versionNumber.toString()} className="mt-4">
                <div className="space-y-4 p-4 border rounded-md bg-gray-50">
                   <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-lg mb-1">バージョン {version.versionNumber} の詳細</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><span className="font-medium">作成者:</span> {version.author}</p>
                          <p><span className="font-medium">作成日時:</span> {formatDate(version.createdAt)}</p>
                          <p><span className="font-medium">設問数:</span> {version.questionCount}</p>
                          <p className="flex items-center"><span className="font-medium mr-2">ステータス:</span> {getStatusBadge(version.status)}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                         {/* Action Buttons for the selected version */}
                         <Button size="sm" onClick={() => handleViewEditQuestions(version.versionNumber)}>
                           <Eye className="mr-2 h-4 w-4" />
                           設問表示/編集
                         </Button>
                         {version.versionNumber > 1 && (
                            <Button size="sm" variant="outline" onClick={() => handleCompareVersions(version.versionNumber)}>
                              <GitCompareArrows className="mr-2 h-4 w-4" />
                              v{version.versionNumber - 1} と比較
                            </Button>
                         )}
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Settings2 className="mr-2 h-4 w-4" />
                                ステータス変更
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>ステータスを選択</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                disabled={version.status === 'published'}
                                onClick={() => handleChangeVersionStatus(version.versionNumber, 'published')}
                              >
                                公開中にする
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                disabled={version.status === 'draft'}
                                onClick={() => handleChangeVersionStatus(version.versionNumber, 'draft')}
                              >
                                下書きにする
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                disabled={version.status === 'archived' || version.versionNumber === deliveredVersionNumber} // Cannot archive delivered version directly
                                onClick={() => handleChangeVersionStatus(version.versionNumber, 'archived')}
                              >
                                アーカイブする
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>

                         {version.versionNumber !== deliveredVersionNumber && version.status === 'published' && (
                            <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700" onClick={() => handleSetDeliveredVersion(version.versionNumber)}>
                              <Send className="mr-2 h-4 w-4" />
                              配信バージョンに設定
                            </Button>
                         )}
                         {version.versionNumber === deliveredVersionNumber && (
                             <Badge variant="default" className="bg-green-600 mt-2 flex items-center gap-1">
                               <CheckCircle className="h-3 w-3" />
                               配信中
                             </Badge>
                         )}
                      </div>
                   </div>
                   {/* Placeholder for Question List/Editor specific to this version */}
                   {/* <div className="mt-4 p-4 border rounded bg-white">
                      <p className="text-gray-500">設問リストまたはエディタがここに表示されます (v{version.versionNumber})</p>
                   </div> */}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

    </div>
  );
}
