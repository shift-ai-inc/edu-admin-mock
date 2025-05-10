import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSurveyWithVersions, getSurveyVersionDetails, addMockSurveyVersion } from '@/data/mockSurveyDetails'; // Changed
import { updateMockSurvey } from '@/data/mockSurveys'; // Changed
import { Survey, SurveyVersion, QuestionVersion, getSurveyTypeName, getSurveyDifficultyName, getSkillLevelName } from '@/types/survey'; // Changed
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, PlusCircle, GitBranch, HelpCircle, ClipboardCheck } from 'lucide-react'; // Changed Icon
import { DataTable } from '@/components/data-table';
import { surveyVersionColumns } from './survey-version-columns'; // Changed
import { questionVersionColumns } from './question-version-columns'; // Reusing this, ensure it's generic
import { Badge } from '@/components/ui/badge';
import { Row } from '@tanstack/react-table';
import { EditSurveyModal, SurveyFormData } from '@/components/features/survey/EditSurveyModal'; // Changed
import { CreateSurveyVersionModal, CreateVersionFormData } from '@/components/features/survey/CreateSurveyVersionModal'; // Changed
import { useToast } from '@/hooks/use-toast';


export default function SurveyDetail() { // Changed
  const { surveyId } = useParams<{ surveyId: string }>(); // Changed
  const navigate = useNavigate();
  const { toast } = useToast();
  const [surveyData, setSurveyData] = useState<(Survey & { versions: SurveyVersion[] }) | null>(null); // Changed
  const [selectedVersion, setSelectedVersion] = useState<SurveyVersion | null>(null); // Changed
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateVersionModalOpen, setIsCreateVersionModalOpen] = useState(false);

  useEffect(() => {
    if (surveyId) { // Changed
      const data = getSurveyWithVersions(surveyId); // Changed
      setSurveyData(data || null); // Changed
      if (data && data.versions.length > 0) {
        const latestPublished = data.versions.find(v => v.status === 'published');
        const latestOverall = data.versions.sort((a,b) => b.versionNumber - a.versionNumber)[0];
        const versionToSelect = latestPublished || latestOverall;
        
        if (versionToSelect) {
            const fullVersionDetails = getSurveyVersionDetails(surveyId, versionToSelect.id); // Changed
            setSelectedVersion(fullVersionDetails || versionToSelect);
        } else {
            setSelectedVersion(null);
        }
      } else {
        setSelectedVersion(null);
      }
    }
  }, [surveyId]); // Changed

  const handleSelectVersion = (version: SurveyVersion) => { // Changed
    if (surveyId) { // Changed
      const fullVersionDetails = getSurveyVersionDetails(surveyId, version.id); // Changed
      setSelectedVersion(fullVersionDetails || version);
    }
  };
  
  const memoizedSurveyVersionColumns = useMemo(() => surveyVersionColumns(handleSelectVersion), [surveyId]); // Changed
  const memoizedQuestionVersionColumns = useMemo(() => questionVersionColumns(navigate), [navigate]); // Reusing

  const handleQuestionRowClick = (row: Row<QuestionVersion>) => {
    const questionVersion = row.original;
    navigate(`/surveys/questions/${questionVersion.id}`); // Changed
  };

  const handleOpenEditModal = () => {
    if (surveyData) { // Changed
      setIsEditModalOpen(true);
    } else {
      toast({ title: "エラー", description: "サーベイデータが読み込まれていません。", variant: "destructive" }); // Changed
    }
  };
  const handleCloseEditModal = () => setIsEditModalOpen(false);
  const handleSaveSurvey = async (id: string, data: SurveyFormData) => { // Changed
    const updatedSurvey = updateMockSurvey(id, data); // Changed
    if (updatedSurvey && surveyData) { // Changed
      setSurveyData(prevData => { // Changed
        if (!prevData) return null;
        return { ...prevData, ...updatedSurvey };
      });
    } else {
      console.error("Failed to update survey in mock data or surveyData is null"); // Changed
      throw new Error("Failed to update survey"); // Changed
    }
  };

  const handleOpenCreateVersionModal = () => {
    if (surveyData) { // Changed
      setIsCreateVersionModalOpen(true);
    } else {
      toast({ title: "エラー", description: "サーベイデータが読み込まれていません。", variant: "destructive" }); // Changed
    }
  };
  const handleCloseCreateVersionModal = () => setIsCreateVersionModalOpen(false);
  const handleSaveNewVersion = async (id: string, data: CreateVersionFormData): Promise<SurveyVersion | null> => { // Changed
    try {
      const newVersion = addMockSurveyVersion(id, data.description); // Changed
      if (newVersion && surveyData) { // Changed
        setSurveyData(prev => { // Changed
          if (!prev) return null;
          const updatedVersions = [...prev.versions, newVersion].sort((a,b) => b.versionNumber - a.versionNumber);
          return { ...prev, versions: updatedVersions, updatedAt: new Date() };
        });
        setSelectedVersion(newVersion);
        return newVersion;
      } else {
        throw new Error("新規バージョンの作成に失敗しました。");
      }
    } catch (error) {
        toast({ title: "エラー", description: (error as Error).message || "新規バージョンの作成に失敗しました。", variant: "destructive" });
        return null;
    }
  };


  if (!surveyData) { // Changed
    return (
      <div className="p-8 text-center">
        <ClipboardCheck className="mx-auto h-12 w-12 text-muted-foreground mb-4" /> {/* Changed Icon */}
        <h1 className="text-xl text-red-600">サーベイが見つかりません</h1> {/* Changed */}
        <p className="text-muted-foreground mb-4">ID: {surveyId}</p> {/* Changed */}
        <Button onClick={() => navigate('/surveys')} className="mt-4"> {/* Changed */}
          サーベイ一覧に戻る {/* Changed */}
        </Button>
      </div>
    );
  }

  const { versions, ...baseSurveyInfo } = surveyData; // Changed

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate('/surveys')} className="flex items-center gap-2"> {/* Changed */}
          <ArrowLeft size={16} />
          サーベイ一覧に戻る {/* Changed */}
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleOpenEditModal}>
            <Edit size={16} className="mr-2" />
            サーベイ編集 {/* Changed */}
          </Button>
          <Button variant="outline" onClick={handleOpenCreateVersionModal}>
            <PlusCircle size={16} className="mr-2" />
            新規バージョン作成
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{baseSurveyInfo.title}</CardTitle> {/* Changed */}
          <CardDescription>{baseSurveyInfo.description}</CardDescription> {/* Changed */}
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4 text-sm">
          <div><strong>ID:</strong> {baseSurveyInfo.id}</div> {/* Changed */}
          <div><strong>種類:</strong> {getSurveyTypeName(baseSurveyInfo.type)}</div> {/* Changed */}
          <div><strong>複雑度:</strong> <Badge>{getSurveyDifficultyName(baseSurveyInfo.difficulty)}</Badge></div> {/* Changed label */}
          <div><strong>対象者:</strong> {baseSurveyInfo.targetSkillLevel.map(getSkillLevelName).join(', ')}</div> {/* Changed label */}
          <div><strong>標準所要時間:</strong> {baseSurveyInfo.estimatedDurationMinutes} 分</div>
          <div><strong>総設問数 (最新):</strong> {baseSurveyInfo.questionsCount}</div> {/* Changed */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <GitBranch size={20} />
            <CardTitle>サーベイバージョン履歴</CardTitle> {/* Changed */}
          </div>
          <CardDescription>このサーベイのバージョン一覧です。「設問一覧表示」ボタンで、そのバージョンの設問一覧を下に表示します。</CardDescription> {/* Changed */}
        </CardHeader>
        <CardContent>
          {versions && versions.length > 0 ? (
            <DataTable columns={memoizedSurveyVersionColumns} data={versions} /> // Changed
          ) : (
            <p className="text-muted-foreground">利用可能なバージョンはありません。</p>
          )}
        </CardContent>
      </Card>

      {selectedVersion && (
        <Card>
          <CardHeader>
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <HelpCircle size={20} />
                    <CardTitle>設問一覧 (サーベイバージョン: v{selectedVersion.versionNumber})</CardTitle> {/* Changed */}
                </div>
            </div>
            <CardDescription>
              サーベイバージョン <strong>v{selectedVersion.versionNumber}</strong> ({selectedVersion.description}) に含まれる設問の一覧です。 {/* Changed */}
              設問内容でフィルタリングが可能です。行をクリックすると設問詳細ページに遷移します。
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedVersion.questions && selectedVersion.questions.length > 0 ? (
              <DataTable 
                columns={memoizedQuestionVersionColumns} // Reusing
                data={selectedVersion.questions}
                filterInputPlaceholder="設問内容で検索..."
                filterColumnId="questionData.text"
                onRowClick={handleQuestionRowClick}
              />
            ) : (
              <p className="text-muted-foreground">このバージョンには設問がありません。</p>
            )}
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              将来の改善: バージョン間の比較機能を提供し、設問の追加・変更・削除内容をハイライト表示します。各設問の詳細編集ページへのリンクも実装予定です。
            </p>
          </CardFooter>
        </Card>
      )}
      {surveyData && ( // Changed
         <EditSurveyModal // Changed
            isOpen={isEditModalOpen}
            onClose={handleCloseEditModal}
            survey={{ // Changed
              id: baseSurveyInfo.id,
              title: baseSurveyInfo.title,
              description: baseSurveyInfo.description,
              type: baseSurveyInfo.type,
              difficulty: baseSurveyInfo.difficulty,
              targetSkillLevel: baseSurveyInfo.targetSkillLevel,
              estimatedDurationMinutes: baseSurveyInfo.estimatedDurationMinutes,
            }}
            onSave={handleSaveSurvey} // Changed
          />
      )}
      {surveyData && ( // Changed
        <CreateSurveyVersionModal // Changed
          isOpen={isCreateVersionModalOpen}
          onClose={handleCloseCreateVersionModal}
          surveyId={baseSurveyInfo.id} // Changed
          onSave={handleSaveNewVersion}
        />
      )}
    </div>
  );
}
