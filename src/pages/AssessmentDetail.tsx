import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getAssessmentWithVersions,
  getAssessmentVersionDetails,
  addMockAssessmentVersion,
} from "@/data/mockAssessmentDetails";
import { updateMockAssessment } from "@/data/mockAssessments";
import {
  Assessment,
  AssessmentVersion,
  QuestionVersion,
  getAssessmentTypeName,
  getAssessmentDifficultyName,
  getSkillLevelName,
  AssessmentType,
} from "@/types/assessment";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Edit,
  PlusCircle,
  GitBranch,
  HelpCircle,
} from "lucide-react";
import { DataTable } from "@/components/data-table";
import { assessmentVersionColumns } from "./assessment-version-columns";
import { questionVersionColumns } from "./question-version-columns";
import { Badge } from "@/components/ui/badge";
import { Row } from "@tanstack/react-table";
import {
  EditAssessmentModal,
  AssessmentFormData,
} from "@/components/features/assessment/EditAssessmentModal";
import {
  CreateAssessmentVersionModal,
  CreateVersionFormData,
} from "@/components/features/assessment/CreateAssessmentVersionModal";
import { useToast } from "@/hooks/use-toast";

export default function AssessmentDetail() {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [assessmentData, setAssessmentData] = useState<
    (Assessment & { versions: AssessmentVersion[] }) | null
  >(null);
  const [selectedVersion, setSelectedVersion] =
    useState<AssessmentVersion | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateVersionModalOpen, setIsCreateVersionModalOpen] =
    useState(false);

  useEffect(() => {
    if (assessmentId) {
      const data = getAssessmentWithVersions(assessmentId);
      setAssessmentData(data || null);
      if (data && data.versions.length > 0) {
        // Default to latest published, then latest overall, then first if no published
        const latestPublished = data.versions.find(
          (v) => v.status === "published"
        );
        const latestOverall = data.versions.sort(
          (a, b) => b.versionNumber - a.versionNumber
        )[0];
        const versionToSelect = latestPublished || latestOverall;

        if (versionToSelect) {
          const fullVersionDetails = getAssessmentVersionDetails(
            assessmentId,
            versionToSelect.id
          );
          setSelectedVersion(fullVersionDetails || versionToSelect);
        } else {
          setSelectedVersion(null);
        }
      } else {
        setSelectedVersion(null);
      }
    }
  }, [assessmentId]);

  const handleSelectVersion = (version: AssessmentVersion) => {
    if (assessmentId) {
      const fullVersionDetails = getAssessmentVersionDetails(
        assessmentId,
        version.id
      );
      setSelectedVersion(fullVersionDetails || version);
    }
  };

  const memoizedAssessmentVersionColumns = useMemo(
    () => assessmentVersionColumns(handleSelectVersion),
    [assessmentId]
  );
  const memoizedQuestionVersionColumns = useMemo(
    () => questionVersionColumns(navigate),
    [navigate]
  );

  const handleQuestionRowClick = (row: Row<QuestionVersion>) => {
    const questionVersion = row.original;
    navigate(`/assessments/questions/${questionVersion.id}`);
  };

  // Edit Assessment Modal
  const handleOpenEditModal = () => {
    if (assessmentData) {
      setIsEditModalOpen(true);
    } else {
      toast({
        title: "エラー",
        description: "アセスメントデータが読み込まれていません。",
        variant: "destructive",
      });
    }
  };
  const handleCloseEditModal = () => setIsEditModalOpen(false);
  const handleSaveAssessment = async (id: string, data: AssessmentFormData) => {
    const updatedAssessment = updateMockAssessment(
      id,
      data as Partial<
        Omit<Assessment, "id" | "createdAt" | "questionsCount">
      > & { type: AssessmentType }
    ); // Cast data to the correct type
    if (updatedAssessment && assessmentData) {
      setAssessmentData((prevData) => {
        if (!prevData) return null;
        return { ...prevData, ...updatedAssessment };
      });
    } else {
      console.error(
        "Failed to update assessment in mock data or assessmentData is null"
      );
      throw new Error("Failed to update assessment");
    }
  };

  // Create New Version Modal
  const handleOpenCreateVersionModal = () => {
    if (assessmentData) {
      setIsCreateVersionModalOpen(true);
    } else {
      toast({
        title: "エラー",
        description: "アセスメントデータが読み込まれていません。",
        variant: "destructive",
      });
    }
  };
  const handleCloseCreateVersionModal = () =>
    setIsCreateVersionModalOpen(false);
  const handleSaveNewVersion = async (
    id: string,
    data: CreateVersionFormData
  ): Promise<AssessmentVersion | null> => {
    try {
      const newVersion = addMockAssessmentVersion(id, data.description);
      if (newVersion && assessmentData) {
        setAssessmentData((prev) => {
          if (!prev) return null;
          const updatedVersions = [...prev.versions, newVersion].sort(
            (a, b) => b.versionNumber - a.versionNumber
          );
          return { ...prev, versions: updatedVersions, updatedAt: new Date() };
        });
        setSelectedVersion(newVersion); // Select the newly created draft version
        // Toast is handled by the modal on successful promise resolution
        return newVersion;
      } else {
        throw new Error("新規バージョンの作成に失敗しました。");
      }
    } catch (error) {
      toast({
        title: "エラー",
        description:
          (error as Error).message || "新規バージョンの作成に失敗しました。",
        variant: "destructive",
      });
      return null;
    }
  };

  if (!assessmentData) {
    return (
      <div className="p-8 text-center">
        <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="text-xl text-red-600">アセスメントが見つかりません</h1>
        <p className="text-muted-foreground mb-4">ID: {assessmentId}</p>
        <Button onClick={() => navigate("/assessments")} className="mt-4">
          アセスメント一覧に戻る
        </Button>
      </div>
    );
  }

  const { versions, ...baseAssessmentInfo } = assessmentData;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => navigate("/assessments")}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          アセスメント一覧に戻る
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleOpenEditModal}>
            <Edit size={16} className="mr-2" />
            アセスメント編集
          </Button>
          <Button variant="outline" onClick={handleOpenCreateVersionModal}>
            <PlusCircle size={16} className="mr-2" />
            新規バージョン作成
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{baseAssessmentInfo.title}</CardTitle>
          <CardDescription>{baseAssessmentInfo.description}</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <strong>ID:</strong> {baseAssessmentInfo.id}
          </div>
          <div>
            <strong>種類:</strong>{" "}
            {getAssessmentTypeName(baseAssessmentInfo.type)}
          </div>
          <div>
            <strong>難易度:</strong>{" "}
            <Badge>
              {getAssessmentDifficultyName(baseAssessmentInfo.difficulty)}
            </Badge>
          </div>
          <div>
            <strong>対象スキル:</strong>{" "}
            {baseAssessmentInfo.targetSkillLevel
              .map(getSkillLevelName)
              .join(", ")}
          </div>
          <div>
            <strong>標準所要時間:</strong>{" "}
            {baseAssessmentInfo.estimatedDurationMinutes} 分
          </div>
          <div>
            <strong>総設問数 (最新):</strong>{" "}
            {baseAssessmentInfo.questionsCount}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <GitBranch size={20} />
            <CardTitle>アセスメントバージョン履歴</CardTitle>
          </div>
          <CardDescription>
            このアセスメントのバージョン一覧です。「設問一覧表示」ボタンで、そのバージョンの設問一覧を下に表示します。
          </CardDescription>
        </CardHeader>
        <CardContent>
          {versions && versions.length > 0 ? (
            <DataTable
              columns={memoizedAssessmentVersionColumns}
              data={versions}
            />
          ) : (
            <p className="text-muted-foreground">
              利用可能なバージョンはありません。
            </p>
          )}
        </CardContent>
      </Card>

      {selectedVersion && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle size={20} />
                <CardTitle>
                  設問一覧 (アセスメントバージョン: v
                  {selectedVersion.versionNumber})
                </CardTitle>
              </div>
            </div>
            <CardDescription>
              アセスメントバージョン{" "}
              <strong>v{selectedVersion.versionNumber}</strong> (
              {selectedVersion.description}) に含まれる設問の一覧です。
              設問内容でフィルタリングが可能です。行をクリックすると設問詳細ページに遷移します。
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedVersion.questions &&
            selectedVersion.questions.length > 0 ? (
              <DataTable
                columns={memoizedQuestionVersionColumns}
                data={selectedVersion.questions}
                filterInputPlaceholder="設問内容で検索..."
                filterColumnId="questionData.text"
                onRowClick={handleQuestionRowClick}
              />
            ) : (
              <p className="text-muted-foreground">
                このバージョンには設問がありません。
              </p>
            )}
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              将来の改善:
              バージョン間の比較機能を提供し、設問の追加・変更・削除内容をハイライト表示します。各設問の詳細編集ページへのリンクも実装予定です。
            </p>
          </CardFooter>
        </Card>
      )}
      {assessmentData && (
        <EditAssessmentModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          assessment={{
            id: baseAssessmentInfo.id,
            title: baseAssessmentInfo.title,
            description: baseAssessmentInfo.description,
            type: baseAssessmentInfo.type,
            difficulty: baseAssessmentInfo.difficulty,
            targetSkillLevel: baseAssessmentInfo.targetSkillLevel,
            estimatedDurationMinutes:
              baseAssessmentInfo.estimatedDurationMinutes,
          }}
          onSave={handleSaveAssessment}
        />
      )}
      {assessmentData && (
        <CreateAssessmentVersionModal
          isOpen={isCreateVersionModalOpen}
          onClose={handleCloseCreateVersionModal}
          assessmentId={baseAssessmentInfo.id}
          onSave={handleSaveNewVersion}
        />
      )}
    </div>
  );
}
