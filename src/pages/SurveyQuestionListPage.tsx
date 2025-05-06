import { useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ArrowRight, Edit3 } from "lucide-react";
import { SurveyQuestion } from "@/types/survey-question";
import { getQuestionsForSurveyVersion } from "@/data/mockSurveyQuestions";
import {
  findSurveyDefinitionById,
  findSurveyVersionById,
} from "@/data/mockSurveyDefinitions";

const getQuestionTypeDisplay = (type: SurveyQuestion["type"]) => {
  switch (type) {
    case "single-choice":
      return "単一選択";
    case "multiple-choice":
      return "複数選択";
    case "text":
      return "テキスト入力";
    case "rating-scale":
      return "評価スケール";
    case "nps":
      return "NPS";
    default:
      return type;
  }
};

export default function SurveyQuestionListPage() {
  const { surveyDefId, versionId } = useParams<{
    surveyDefId: string;
    versionId: string;
  }>();
  const navigate = useNavigate();

  const surveyDefinition = useMemo(
    () => (surveyDefId ? findSurveyDefinitionById(surveyDefId) : undefined),
    [surveyDefId]
  );
  const version = useMemo(
    () =>
      surveyDefId && versionId
        ? findSurveyVersionById(surveyDefId, versionId)
        : undefined,
    [surveyDefId, versionId]
  );

  const questions = useMemo(() => {
    if (surveyDefId && versionId) {
      return getQuestionsForSurveyVersion(surveyDefId, versionId);
    }
    return [];
  }, [surveyDefId, versionId]);

  useEffect(() => {
    if (!surveyDefId || !versionId || !surveyDefinition || !version) {
      console.warn(
        "Survey Definition ID, Version ID, Survey Definition, or Version is missing."
      );
      // navigate('/surveys'); // Example redirect
    }
  }, [surveyDefId, versionId, surveyDefinition, version, navigate]);

  const columns: ColumnDef<SurveyQuestion>[] = [
    {
      accessorKey: "order",
      header: "No.",
    },
    {
      accessorKey: "id",
      header: "設問ID",
    },
    {
      accessorKey: "text",
      header: "設問文",
      cell: ({ row }) => (
        <div className="truncate w-64">{row.original.text}</div>
      ),
    },
    {
      accessorKey: "type",
      header: "回答形式",
      cell: ({ row }) => getQuestionTypeDisplay(row.original.type),
    },
    {
      accessorKey: "category",
      header: "カテゴリ",
      cell: ({ row }) => row.original.category || "N/A",
    },
    {
      accessorKey: "isRequired",
      header: "必須",
      cell: ({ row }) =>
        row.original.isRequired ? (
          <Badge>必須</Badge>
        ) : (
          <Badge variant="outline">任意</Badge>
        ),
    },
    // { // Difficulty might not be relevant for all surveys
    //   accessorKey: 'difficulty',
    //   header: '難易度',
    //   cell: ({ row }) => getDifficultyBadge(row.original.difficulty),
    // },
    {
      id: "actions",
      header: "操作",
      cell: () => {
        // Placeholder for edit link, adapt path as needed
        return (
          <Button
            variant="outline"
            size="sm"
            // asChild // Uncomment if using Link component
            // onClick={() => navigate(`/surveys/${question.surveyDefinitionId}/versions/${question.versionId}/questions/edit/${question.id}`)}
            disabled // Edit functionality for survey questions not yet implemented
          >
            <Edit3 className="mr-2 h-4 w-4" /> 編集
          </Button>
        );
      },
    },
  ];

  if (!surveyDefinition || !version) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">設問一覧</h1>
        <p>
          サーベイ定義またはバージョンが見つかりません。正しいIDを指定してください。
        </p>
        <Button onClick={() => navigate("/surveys/versions")} className="mt-4">
          バージョン一覧へ戻る
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">サーベイ設問一覧</h1>
        <p className="text-lg text-gray-600">
          サーベイ: {surveyDefinition.title} (ID: {surveyDefId})
        </p>
        <p className="text-md text-gray-500">
          バージョン: v{version.versionNumber} (ID: {versionId}) -{" "}
          {version.status === "draft"
            ? "下書き"
            : version.status === "active"
            ? "公開中"
            : "アーカイブ済"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>設問リスト ({questions.length}件)</CardTitle>
            {version.status === "draft" && (
              <Button
                // asChild // Uncomment if using Link component
                // onClick={() => navigate(`/surveys/${surveyDefId}/versions/${versionId}/questions/add`)}
                disabled // Add functionality for survey questions not yet implemented
              >
                <ArrowRight className="mr-2 h-4 w-4" /> 新規設問追加
              </Button>
            )}
          </div>
          <CardDescription>
            このバージョンのすべての設問が表示されています。設問文またはカテゴリでフィルタリングできます。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={questions}
            filterInputPlaceholder="設問文、カテゴリで検索..."
            filterColumnId="text"
          />
        </CardContent>
      </Card>
      <Button
        // onClick={() => navigate(`/surveys/detail/${surveyDefId}`)} // This path might be for survey instances, not definitions
        onClick={() => navigate("/surveys")} // Go back to survey instance list for now
        variant="outline"
        className="mt-6"
      >
        サーベイ一覧へ戻る
      </Button>
    </div>
  );
}
