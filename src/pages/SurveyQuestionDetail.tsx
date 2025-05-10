import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuestionVersionDetails, updateMockQuestionVersionContent } from '@/data/mockSurveyDetails'; // Changed to use survey details
import { QuestionVersion, getQuestionTypeName, getQuestionDifficultyName, getVersionStatusName } from '@/types/survey'; // Changed to use survey types
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, HelpCircle, Tag, Type, BarChart3, CheckCircle, Clock, Star, UserCog } from 'lucide-react'; // Added Star, UserCog
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { EditSurveyQuestionVersionModal, QuestionContentFormData } from '@/components/features/survey/EditSurveyQuestionVersionModal'; // Changed

export default function SurveyQuestionDetail() { // Changed
  const { questionVersionId } = useParams<{ questionVersionId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [questionVersion, setQuestionVersion] = useState<QuestionVersion | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (questionVersionId) {
      const data = getQuestionVersionDetails(questionVersionId); // This function is now in mockSurveyDetails
      setQuestionVersion(data);
    }
  }, [questionVersionId]);

  const handleOpenEditModal = () => {
    if (questionVersion) {
      setIsEditModalOpen(true);
    } else {
      toast({ title: "エラー", description: "設問データが読み込まれていません。", variant: "destructive" });
    }
  };
  const handleCloseEditModal = () => setIsEditModalOpen(false);

  const handleSaveChanges = async (id: string, data: QuestionContentFormData): Promise<QuestionVersion | null> => {
    try {
      // For surveys, correctAnswer might not be applicable or might be handled differently.
      // The updateMockQuestionVersionContent function for surveys might not need correctAnswer.
      const updatedQuestion = updateMockQuestionVersionContent(id, data.text, data.options); 
      if (updatedQuestion) {
        setQuestionVersion(updatedQuestion); // Update local state
        // Toast is handled by modal
        return updatedQuestion;
      } else {
        throw new Error("設問内容の更新に失敗しました。");
      }
    } catch (error) {
      toast({ title: "エラー", description: (error as Error).message, variant: "destructive" });
      return null;
    }
  };


  if (!questionVersion) {
    return (
      <div className="p-8 text-center">
        <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="text-xl text-red-600">設問バージョンが見つかりません</h1>
        <p className="text-muted-foreground mb-4">ID: {questionVersionId}</p>
        <Button onClick={() => navigate(-1)} className="mt-4">
          前に戻る
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
          前に戻る
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleOpenEditModal}>
            <Edit size={16} className="mr-2" />
            設問内容編集
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">サーベイ設問詳細</CardTitle> {/* Changed */}
          <CardDescription>
            設問バージョンID: {questionVersion.id} (設問ID: {questionVersion.questionId}, バージョン: v{questionVersion.versionNumber})
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">設問文:</h3>
            <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-md">{questionData.text}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            <div className="flex items-center">
              <Type size={18} className="mr-2 text-blue-500" />
              <div><strong>種類:</strong> {getQuestionTypeName(questionData.type)}</div>
            </div>
            <div className="flex items-center">
              <Tag size={18} className="mr-2 text-purple-500" />
              <div><strong>カテゴリ:</strong> {questionData.category}</div>
            </div>
            <div className="flex items-center">
              <BarChart3 size={18} className="mr-2 text-yellow-500" />
              <div><strong>難易度:</strong> <Badge variant="outline">{getQuestionDifficultyName(questionData.difficulty)}</Badge></div>
            </div>
            <div className="flex items-center">
              <CheckCircle size={18} className="mr-2 text-green-500" />
              <div><strong>ステータス:</strong> <Badge>{getVersionStatusName(questionVersion.status)}</Badge></div>
            </div>
            {questionData.points > 0 && ( // Only show points if applicable
                 <div className="flex items-center">
                    <Star size={18} className="mr-2 text-orange-500" /> {/* Changed icon to Star for points */}
                    <div><strong>配点:</strong> {questionData.points} 点</div>
                </div>
            )}
            <div className="flex items-center">
              <Clock size={18} className="mr-2 text-gray-500" />
              <div><strong>作成日:</strong> {new Date(questionVersion.createdAt).toLocaleDateString()}</div>
            </div>
             <div className="flex items-center col-span-full"> {/* Make createdBy span full width if needed */}
              <UserCog size={18} className="mr-2 text-indigo-500" /> {/* Added UserCog icon */}
              <div><strong>作成者:</strong> {questionVersion.createdBy}</div>
            </div>
          </div>

          {(questionData.type === "multiple-choice" || questionData.type === "single-choice") && questionData.options && (
            <div>
              <h3 className="text-lg font-semibold mb-2">選択肢:</h3>
              <ul className="list-disc list-inside pl-5 space-y-1 bg-gray-50 p-4 rounded-md">
                {questionData.options.map((option, index) => (
                  <li key={index} className={``}> {/* Removed problematic line */}
                    {option}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Correct Answer display might be removed or adapted for surveys */}
          {/* {questionData.correctAnswer && (questionData.type === "multiple-choice" || questionData.type === "single-choice") && (
            <div>
              <h3 className="text-lg font-semibold mb-2">正解:</h3>
              <p className="text-green-700 bg-green-50 p-3 rounded-md">
                {Array.isArray(questionData.correctAnswer) ? questionData.correctAnswer.join(', ') : questionData.correctAnswer}
              </p>
            </div>
          )} */}

          {questionData.type === "code" && (
            <div>
              <h3 className="text-lg font-semibold mb-2">備考 (コーディング問題の場合):</h3>
              <p className="text-gray-600">初期コード、評価基準、制約条件などがここに表示されます。</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            変更履歴: {questionVersion.changeLog || "記載なし"}
          </p>
        </CardFooter>
      </Card>

      {questionVersion && (
        <EditSurveyQuestionVersionModal // Changed
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          questionVersion={questionVersion}
          onSave={handleSaveChanges}
        />
      )}
    </div>
  );
}
