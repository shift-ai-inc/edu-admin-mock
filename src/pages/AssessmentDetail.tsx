import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  // Copy, Play, Archive, History, // Removed unused icons
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  mockAssessmentVersions,
  findAssessmentById,
} from "@/data/mockAssessmentVersions";
import { AssessmentVersion } from "@/types/assessment-version";
import { AssessmentQuestion } from "@/types/assessment-question";
import { getQuestionsForVersion } from "@/data/mockAssessmentQuestions";

// --- Helper Functions ---
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Invalid Date";
  }
};

const getStatusBadge = (status: string | undefined) => {
  switch (status) {
    case "draft":
      return <Badge variant="outline">下書き</Badge>;
    case "active":
      return (
        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
          配信中
        </Badge>
      );
    case "archived":
      return <Badge variant="secondary">アーカイブ済</Badge>;
    default:
      return <Badge>{status || "不明"}</Badge>;
  }
};

const getQuestionTypeLabel = (type: AssessmentQuestion["type"]) => {
  switch (type) {
    case "single-choice":
      return "単一選択";
    case "multiple-choice":
      return "複数選択";
    case "text":
      return "テキスト入力";
    default:
      return type;
  }
};

// --- Component ---
export default function AssessmentDetail() {
  const navigate = useNavigate();
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const [assessment, setAssessment] = useState<ReturnType<
    typeof findAssessmentById
  > | null>(null);
  const [versions, setVersions] = useState<AssessmentVersion[]>([]);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(
    null
  );
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);

  useEffect(() => {
    if (assessmentId) {
      const foundAssessment = findAssessmentById(assessmentId);
      setAssessment(foundAssessment);
      if (foundAssessment) {
        const foundVersions = JSON.parse(
          JSON.stringify(mockAssessmentVersions[assessmentId] || [])
        );
        setVersions(foundVersions);
        if (foundVersions.length > 0) {
          const latestVersion = foundVersions.sort(
            (a: AssessmentVersion, b: AssessmentVersion) =>
              b.versionNumber - a.versionNumber
          )[0];
          setSelectedVersionId(latestVersion.id);
        }
      } else {
        console.error("Assessment not found:", assessmentId);
        navigate("/assessments");
      }
    }
  }, [assessmentId, navigate]);

  useEffect(() => {
    if (assessmentId && selectedVersionId) {
      const versionQuestions = getQuestionsForVersion(
        assessmentId,
        selectedVersionId
      );
      setQuestions(versionQuestions.sort((a, b) => a.order - b.order));
    } else {
      setQuestions([]);
    }
  }, [assessmentId, selectedVersionId]);

  if (!assessment) {
    return (
      <div className="p-8">読み込み中またはアセスメントが見つかりません...</div>
    );
  }

  const handleTabChange = (versionId: string) => {
    setSelectedVersionId(versionId);
  };

  const handleEditQuestion = (questionId: string) => {
    if (assessmentId && selectedVersionId) {
      navigate(
        `/assessments/detail/${assessmentId}/versions/${selectedVersionId}/questions/edit/${questionId}`
      );
    }
  };

  const handleDeleteQuestion = (questionId: string) => {
    console.log(
      "Delete question:",
      questionId,
      "from version:",
      selectedVersionId
    );
    alert(`機能は未実装です: 設問削除 (ID: ${questionId})`);
    // In a real app, this would involve an API call and then updating the local questions state,
    // or refetching questions for the version.
    // For mock:
    // const updatedQuestions = questions.filter(q => q.id !== questionId);
    // setQuestions(updatedQuestions);
    // // Also update mockAssessmentQuestions if you want "session persistence" for this action
    // if (assessmentId && selectedVersionId) {
    //   mockAssessmentQuestions[assessmentId][selectedVersionId] = updatedQuestions;
    // }
  };

  const handleAddQuestion = () => {
    if (assessmentId && selectedVersionId) {
      navigate(
        `/assessments/detail/${assessmentId}/versions/${selectedVersionId}/questions/add`
      );
    }
  };

  return (
    <div className="p-8">
      <Button
        onClick={() => navigate("/assessments")}
        variant="outline"
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> アセスメント一覧に戻る
      </Button>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{assessment.title}</CardTitle>
              <CardDescription>
                ID: {assessment.id} | カテゴリ: {assessment.category} | 難易度:{" "}
              </CardDescription>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/assessments/edit/${assessmentId}`)}
            >
              <Edit className="mr-2 h-4 w-4" /> 基本情報を編集
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {assessment.description || "説明がありません。"}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
            <div>
              <span className="font-medium">作成日:</span>{" "}
              {formatDate(assessment.createdAt)}
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        バージョン情報と設問
      </h2>

      {versions.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            まだバージョンが作成されていません。
          </CardContent>
        </Card>
      ) : (
        <Tabs value={selectedVersionId ?? ""} onValueChange={handleTabChange}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              {versions
                .sort((a, b) => b.versionNumber - a.versionNumber)
                .map((v) => (
                  <TabsTrigger key={v.id} value={v.id}>
                    Version {v.versionNumber}{" "}
                    {v.status === "active"
                      ? "(配信中)"
                      : v.status === "draft"
                      ? "(下書き)"
                      : "(アーカイブ済)"}
                  </TabsTrigger>
                ))}
            </TabsList>
            {/* Removed "Create new version from selected" button */}
          </div>

          {versions.map((version) => (
            <TabsContent key={version.id} value={version.id} className="mt-0">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>
                        Version {version.versionNumber} - 詳細
                      </CardTitle>
                      <CardDescription>
                        ステータス: {getStatusBadge(version.status)} | 作成日:{" "}
                        {formatDate(version.createdAt)} | 最終更新日:{" "}
                        {formatDate(version.updatedAt)}
                        {version.createdBy && ` | 作成者: ${version.createdBy}`}
                      </CardDescription>
                    </div>
                    {/* Removed version action buttons (Activate, Archive, History) */}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">
                        設問一覧 ({questions.length}件)
                      </h3>
                      <Button
                        size="sm"
                        onClick={handleAddQuestion}
                        disabled={version.status !== "draft"}
                      >
                        <Plus className="mr-2 h-4 w-4" /> 設問を追加
                      </Button>
                    </div>
                    {version.status !== "draft" && (
                      <p className="text-sm text-orange-600 mb-4">
                        注意:
                        配信中またはアーカイブ済のバージョンの設問は編集・追加・削除できません。新しいバージョンを作成してください。
                      </p>
                    )}
                    {questions.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px]">順序</TableHead>
                            <TableHead>設問テキスト</TableHead>
                            <TableHead className="w-[120px]">タイプ</TableHead>
                            <TableHead className="w-[80px]">配点</TableHead>
                            <TableHead className="w-[100px]">
                              アクション
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {questions.map((q) => (
                            <TableRow key={q.id}>
                              <TableCell>{q.order}</TableCell>
                              <TableCell className="whitespace-pre-wrap break-words">
                                {q.text}
                              </TableCell>
                              <TableCell>
                                {getQuestionTypeLabel(q.type)}
                              </TableCell>
                              <TableCell>{q.points}</TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  <TooltipProvider delayDuration={0}>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() =>
                                            handleEditQuestion(q.id)
                                          }
                                          disabled={version.status !== "draft"}
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>編集</p>
                                      </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="text-destructive hover:text-destructive"
                                          onClick={() =>
                                            handleDeleteQuestion(q.id)
                                          }
                                          disabled={version.status !== "draft"}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>削除</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        このバージョンにはまだ設問が登録されていません。
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
