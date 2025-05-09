// Copied and adapted from Assessment.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { getMockSurveyDetail, SurveyDetail, SampleQuestion } from '@/types/survey'; // Changed import

// Mock survey questions - replace with actual data fetching for a real survey
const mockSurveyQuestions: SampleQuestion[] = [
  { id: 'sq1', text: 'この研修内容全般について、どの程度満足しましたか？', type: 'rating', options: ['非常に不満', '不満', 'どちらでもない', '満足', '非常に満足'] },
  { id: 'sq2', text: '研修で学んだことは、今後の業務に役立つと思いますか？', type: 'rating', options: ['全く思わない', 'あまり思わない', 'どちらとも言えない', 'やや思う', '非常に思う'] },
  { id: 'sq3', text: '研修の期間や時間配分は適切でしたか？', type: 'multiple-choice', options: ['短すぎた', '適切だった', '長すぎた'] },
  { id: 'sq4', text: '講師の説明は分かりやすかったですか？', type: 'rating', options: ['非常に分かりにくい', '分かりにくい', '普通', '分かりやすい', '非常に分かりやすい'] },
  { id: 'sq5', text: '研修内容や運営に関して、ご意見・ご要望があれば自由にご記入ください。', type: 'text' },
];


export default function Survey() {
  const { surveyId } = useParams<{ surveyId: string }>(); // Changed parameter name
  const navigate = useNavigate();
  const { toast } = useToast();

  const [surveyDetails, setSurveyDetails] = useState<SurveyDetail | null>(null); // Changed state name and type
  const [questions, setQuestions] = useState<SampleQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (surveyId) {
      // Simulate fetching survey details and questions
      setTimeout(() => {
        const details = getMockSurveyDetail(surveyId); // Changed function call
        setSurveyDetails(details || null);
        // For demo, use generic mock questions or survey-specific if available in details
        setQuestions(details?.sampleQuestions && details.sampleQuestions.length > 0 ? details.sampleQuestions : mockSurveyQuestions);
        setIsLoading(false);
      }, 200);
    } else {
      setIsLoading(false);
      toast({ title: "エラー", description: "サーベイIDが無効です。", variant: "destructive" });
      navigate("/surveys"); // Changed path
    }
  }, [surveyId, navigate, toast]);

  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Basic validation: check if all questions are answered (for demo)
    const currentQuestion = questions[currentQuestionIndex];
    if (!answers[currentQuestion.id] || (Array.isArray(answers[currentQuestion.id]) && (answers[currentQuestion.id] as string[]).length === 0)) {
        toast({
            title: "未回答の設問",
            description: "現在の設問に回答してください。",
            variant: "destructive",
        });
        return;
    }
    
    // Check if all questions have been attempted (simple check for demo)
    // A more robust check would ensure all *required* questions are answered.
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < questions.length && currentQuestionIndex < questions.length -1) {
         toast({
            title: "未完了",
            description: `まだ全ての設問に回答していません。現在の進捗: ${answeredCount}/${questions.length}`,
            variant: "default",
        });
        // Optionally, navigate to the first unanswered question or just allow submit.
        // For this demo, we'll allow submitting if on the last question, even if prior ones are skipped.
    }


    console.log("Survey Answers:", answers);
    setIsCompleted(true);
    toast({
      title: "サーベイ完了",
      description: "ご回答ありがとうございました。",
      className: "bg-green-500 text-white",
      duration: 5000,
    });
    // In a real app, submit answers to the backend here
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><p>サーベイを読み込み中...</p></div>;
  }

  if (!surveyDetails || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-8">
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold text-destructive mb-2">サーベイの読み込みエラー</h2>
        <p className="text-gray-600 mb-6">
          サーベイ情報を取得できませんでした。サーベイが存在しないか、問題が発生した可能性があります。
        </p>
        <Button onClick={() => navigate('/surveys')}> {/* Changed path */}
          サーベイ一覧に戻る
        </Button>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-8">
        <CheckCircle2 className="w-20 h-20 text-green-500 mb-6" />
        <h1 className="text-3xl font-bold mb-3">ご回答ありがとうございました！</h1>
        <p className="text-lg text-gray-700 mb-8">サーベイ「{surveyDetails.title}」へのご協力に感謝いたします。</p>
        <Button onClick={() => navigate('/dashboard')}>ダッシュボードに戻る</Button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-6">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-bold text-gray-800">{surveyDetails.title}</CardTitle>
          <CardDescription>設問 {currentQuestionIndex + 1} / {questions.length}</CardDescription>
          <Progress value={progress} className="w-full mt-2" />
        </CardHeader>
        <CardContent className="py-8 px-6 sm:px-10">
          <div key={currentQuestion.id}>
            <h3 className="text-lg font-semibold mb-1 text-gray-700">{currentQuestionIndex + 1}. {currentQuestion.text}</h3>
            <p className="text-sm text-gray-500 mb-6">タイプ: {currentQuestion.type}</p>

            {currentQuestion.type === 'rating' && currentQuestion.options && (
              <RadioGroup
                value={answers[currentQuestion.id] as string || ""}
                onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                className="space-y-2"
              >
                {currentQuestion.options.map((option: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2 p-3 border rounded-md hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value={option} id={`${currentQuestion.id}-option-${index}`} />
                    <Label htmlFor={`${currentQuestion.id}-option-${index}`} className="flex-1 cursor-pointer">{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
               <RadioGroup
                value={answers[currentQuestion.id] as string || ""}
                onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                className="space-y-2"
              >
                {currentQuestion.options.map((option: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2 p-3 border rounded-md hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value={option} id={`${currentQuestion.id}-option-${index}`} />
                    <Label htmlFor={`${currentQuestion.id}-option-${index}`} className="flex-1 cursor-pointer">{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
            
            {currentQuestion.type === 'scale' && currentQuestion.options && ( // Assuming scale is like rating for now
               <RadioGroup
                value={answers[currentQuestion.id] as string || ""}
                onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                className="space-y-2"
              >
                {currentQuestion.options.map((option: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2 p-3 border rounded-md hover:bg-gray-50 transition-colors">
                    <RadioGroupItem value={option} id={`${currentQuestion.id}-option-${index}`} />
                    <Label htmlFor={`${currentQuestion.id}-option-${index}`} className="flex-1 cursor-pointer">{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {currentQuestion.type === 'text' && (
              <Textarea
                value={answers[currentQuestion.id] as string || ""}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                placeholder="ご自由にご記入ください..."
                rows={5}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center border-t pt-6">
          <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
            戻る
          </Button>
          {currentQuestionIndex < questions.length - 1 ? (
            <Button onClick={handleNext} disabled={!answers[currentQuestion.id] || (Array.isArray(answers[currentQuestion.id]) && (answers[currentQuestion.id] as string[]).length === 0)}>
              次へ
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700" disabled={!answers[currentQuestion.id] || (Array.isArray(answers[currentQuestion.id]) && (answers[currentQuestion.id] as string[]).length === 0)}>
              サーベイを完了する
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
