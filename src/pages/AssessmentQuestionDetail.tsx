import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuestionVersionById, updateMockQuestionVersion } from '@/data/mockAssessmentDetails';
import { QuestionVersion, getQuestionTypeName, getQuestionDifficultyName, getVersionStatusName } from '@/types/assessment';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, HelpCircle, FileText, Tag, BarChart, Clock, GitCommit, Info } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { EditQuestionVersionModal, EditQuestionVersionFormData } from '@/components/features/assessment/EditQuestionVersionModal';
import { useToast } from '@/hooks/use-toast';

export default function AssessmentQuestionDetail() {
  const { questionVersionId } = useParams<{ questionVersionId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [questionVersion, setQuestionVersion] = useState<QuestionVersion | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (questionVersionId) {
      setLoading(true);
      const data = getQuestionVersionById(questionVersionId);
      setQuestionVersion(data || null);
      setLoading(false);
    } else {
      setQuestionVersion(null);
      setLoading(false);
    }
  }, [questionVersionId]);

  const handleOpenEditModal = () => setIsEditModalOpen(true);
  const handleCloseEditModal = () => setIsEditModalOpen(false);

  const handleSaveQuestionVersion = async (
    id: string,
    data: EditQuestionVersionFormData
  ): Promise<QuestionVersion | null> => {
    try {
      const updatedVersion = updateMockQuestionVersion(id, data);
      if (updatedVersion) {
        setQuestionVersion(updatedVersion); // Update local state to re-render the page
        // Toast is handled by the modal on successful promise resolution
        return updatedVersion;
      } else {
        throw new Error("設問バージョンの更新に失敗しました。");
      }
    } catch (error) {
      toast({
        title: "エラー",
        description: (error as Error).message || "設問バージョンの更新に失敗しました。",
        variant: "destructive",
      });
      return null;
    }
  };


  if (loading) {
    return <div className="p-8 text-center">データを読み込み中...</div>;
  }

  if (!questionVersion) {
    return (
      <div className="p-8 text-center">
        <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="text-xl text-red-600">設問バージョンが見つかりません</h1>
        <p className="text-muted-foreground mb-4">ID: {questionVersionId}</p>
        <Button onClick={() => navigate(-1)} className="mt-4">
          戻る
        </Button>
      </div>
    );
  }

  const { questionData } = questionVersion;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate(-1)} className="flex items-center gap-2">
          <ArrowLeft size={16} />
          戻る
        </Button>
        <Button variant="outline" onClick={handleOpenEditModal}>
          <Edit size={16} className="mr-2" />
          設問内容を編集
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <FileText size={28} /> 設問詳細 (バージョン: v{questionVersion.versionNumber})
          </CardTitle>
          <CardDescription>
            設問ID: {questionVersion.questionId} / 設問バージョンID: {questionVersion.id}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose max-w-none">
            <p className="text-lg whitespace-pre-wrap">{questionData.text}</p>
          </div>

          {(questionData.type === 'multiple-choice' || questionData.type === 'single-choice') && questionData.options && (
            <div>
              <h3 className="font-semibold mb-2 text-md">選択肢:</h3>
              <ul className="list-disc list-inside pl-4 space-y-1">
                {questionData.options.map((option, index) => (
                  <li key={index} className={
                    Array.isArray(questionData.correctAnswer) ? 
                      (questionData.correctAnswer.includes(option) ? 'font-bold text-green-600' : '') :
                      (questionData.correctAnswer === option ? 'font-bold text-green-600' : '')
                  }>
                    {option}
                    {Array.isArray(questionData.correctAnswer) ? 
                      (questionData.correctAnswer.includes(option) ? ' (正解)' : '') :
                      (questionData.correctAnswer === option ? ' (正解)' : '')
                    }
                  </li>
                ))}
              </ul>
            </div>
          )}

          {questionData.type !== 'multiple-choice' && questionData.type !== 'single-choice' && questionData.correctAnswer && (
             <div>
              <h3 className="font-semibold mb-2 text-md">正解/模範解答:</h3>
              <p className="text-sm bg-gray-50 p-3 rounded whitespace-pre-wrap">{Array.isArray(questionData.correctAnswer) ? questionData.correctAnswer.join(', ') : questionData.correctAnswer}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm pt-4 border-t">
            <div className="flex items-center gap-2"><Info size={16} className="text-muted-foreground" /><strong>回答形式:</strong> {getQuestionTypeName(questionData.type)}</div>
            <div className="flex items-center gap-2"><Tag size={16} className="text-muted-foreground" /><strong>カテゴリ:</strong> {questionData.category}</div>
            <div className="flex items-center gap-2"><BarChart size={16} className="text-muted-foreground" /><strong>難易度:</strong> <Badge variant={questionData.difficulty === 'hard' ? 'destructive' : questionData.difficulty === 'easy' ? 'default' : 'secondary'}>{getQuestionDifficultyName(questionData.difficulty)}</Badge></div>
            <div className="flex items-center gap-2"><Clock size={16} className="text-muted-foreground" /><strong>配点:</strong> {questionData.points} 点</div>
            <div className="flex items-center gap-2"><GitCommit size={16} className="text-muted-foreground" /><strong>ステータス:</strong> <Badge variant={questionVersion.status === 'published' ? 'default' : questionVersion.status === 'archived' ? 'destructive' : 'secondary'}>{getVersionStatusName(questionVersion.status)}</Badge></div>
          </div>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground space-y-1 flex-col items-start">
            <p><strong>変更ログ:</strong> {questionVersion.changeLog || '変更履歴なし'}</p>
            <p><strong>作成者:</strong> {questionVersion.createdBy}</p>
            <p><strong>作成日時:</strong> {format(new Date(questionVersion.createdAt), "PPP p", { locale: ja })}</p>
        </CardFooter>
      </Card>

      {questionVersion && (
        <EditQuestionVersionModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          questionVersion={questionVersion}
          onSave={handleSaveQuestionVersion}
        />
      )}
    </div>
  );
}
