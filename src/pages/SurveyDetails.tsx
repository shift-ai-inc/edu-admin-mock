// Copied and adapted from AssessmentDetails.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Users, BarChart3, Info, Edit3, Send, ListChecks, Users2, FileText, AlertTriangle } from 'lucide-react';
import { SurveyDetail, getDifficultyText, getSkillLevelText, SampleQuestion, getMockSurveyDetail } from '@/types/survey'; // Updated import
// import CreateSurveyDeliveryDialog from '@/components/CreateSurveyDeliveryDialog'; // For delivery from details page

export default function SurveyDetails() {
  const { surveyId } = useParams<{ surveyId: string }>();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState<SurveyDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // const [isCreateDeliveryDialogOpen, setIsCreateDeliveryDialogOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    if (surveyId) {
      // Simulate API call
      setTimeout(() => {
        const fetchedSurvey = getMockSurveyDetail(surveyId); // Uses the imported function
        setSurvey(fetchedSurvey || null);
        setIsLoading(false);
      }, 100);
    } else {
      setIsLoading(false);
    }
  }, [surveyId]);

  // const handleConfigureDeliveryClick = () => {
  //   setIsCreateDeliveryDialogOpen(true);
  // };

  // const handleDeliveryCreated = (details: any) => {
  //   console.log("Survey Delivery creation successful from details:", details);
  //   // Potentially navigate to delivery list or show toast
  // };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><p>読み込み中...</p></div>;
  }

  if (!survey) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-8">
        <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold text-destructive mb-2">サーベイが見つかりません</h2>
        <p className="text-gray-600 mb-6">
          指定されたIDのサーベイは存在しないか、アクセスできません。
        </p>
        <Button onClick={() => navigate('/surveys')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> サーベイ一覧に戻る
        </Button>
      </div>
    ); // Removed comma here
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> 戻る
      </Button>

      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/40 p-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-start">
            <div>
              <CardTitle className="text-2xl font-bold mb-1">{survey.title}</CardTitle>
              <CardDescription className="text-md text-gray-600">{survey.description}</CardDescription>
            </div>
            <Badge variant="secondary" className="mt-2 sm:mt-0 text-sm shrink-0">{survey.category}</Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center"><Info className="mr-2 h-5 w-5 text-primary" />基本情報</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="flex items-center"><Clock className="mr-2 h-4 w-4 text-gray-500" /> <strong>所要時間:</strong> 約{survey.estimatedTime}分</p>
                <p className="flex items-center"><ListChecks className="mr-2 h-4 w-4 text-gray-500" /> <strong>タイプ:</strong> {survey.type}</p>
                <p className="flex items-center"><Users2 className="mr-2 h-4 w-4 text-gray-500" /> <strong>対象レベル:</strong> {getSkillLevelText(survey.skillLevel)}</p>
                <p className="flex items-center"><BarChart3 className="mr-2 h-4 w-4 text-gray-500" /> <strong>難易度:</strong> {getDifficultyText(survey.difficulty)}</p>
                <div className="flex items-start"><FileText className="mr-2 h-4 w-4 text-gray-500 shrink-0 mt-0.5" />
                  <div>
                    <strong>タグ:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {survey.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center"><Users className="mr-2 h-5 w-5 text-primary" />利用統計</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p><strong>総配信回数:</strong> {survey.statistics.totalDeliveries?.toLocaleString() ?? 'N/A'}</p>
                <p><strong>完了率 (平均):</strong> {survey.statistics.completionRate !== undefined ? `${survey.statistics.completionRate}%` : 'N/A'}</p>
                <p><strong>最終配信日:</strong> {survey.statistics.lastDelivered ? new Date(survey.statistics.lastDelivered).toLocaleDateString() : 'N/A'}</p>
                <p><strong>総利用回数 (受検者ベース):</strong> {survey.usageCount?.toLocaleString() ?? 'N/A'}</p>
              </CardContent>
            </Card>
          </div>

          {/* Structure and Content Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center"><ListChecks className="mr-2 h-5 w-5 text-primary" />構成と内容</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm"><strong>構成概要:</strong> {survey.structureDescription}</p>
              <div>
                <h4 className="font-semibold mb-1">カテゴリ内訳:</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {survey.categories.map(cat => <li key={cat.name}>{cat.name} ({cat.questionCount}問)</li>)}
                </ul>
              </div>
              {survey.targetAudience && survey.targetAudience.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-1">主な対象者:</h4>
                  <p className="text-sm">{survey.targetAudience.join(', ')}</p>
                </div>
              )}
              {survey.measurableItems && survey.measurableItems.length > 0 && (
                 <div>
                   <h4 className="font-semibold mb-1">測定項目:</h4>
                   <p className="text-sm">{survey.measurableItems.join(', ')}</p>
                 </div>
              )}
            </CardContent>
          </Card>

          {/* Sample Questions Section */}
          {survey.sampleQuestions && survey.sampleQuestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center"><Edit3 className="mr-2 h-5 w-5 text-primary" />サンプル設問</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {survey.sampleQuestions.map((q: SampleQuestion) => (
                  <div key={q.id} className="p-3 border rounded-md bg-muted/20">
                    <p className="text-sm font-medium">{q.text}</p>
                    <p className="text-xs text-gray-500 mt-1">タイプ: {q.type}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </CardContent>

        <CardFooter className="p-6 bg-muted/40 flex justify-end gap-2">
           <Button size="lg" onClick={() => navigate(`/survey/${surveyId}`)} variant="default">
            <Send className="mr-2 h-4 w-4" /> このサーベイを受検する (デモ)
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
