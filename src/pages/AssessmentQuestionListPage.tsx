import { useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Edit3 } from 'lucide-react';
import { AssessmentQuestion } from '@/types/assessment-question';
import { getQuestionsForVersion } from '@/data/mockAssessmentQuestions';
import { findAssessmentById, findVersionById } from '@/data/mockAssessmentVersions'; // Assuming findVersionById exists

const getQuestionTypeDisplay = (type: AssessmentQuestion['type']) => {
  switch (type) {
    case 'single-choice': return '単一選択';
    case 'multiple-choice': return '複数選択';
    case 'text': return 'テキスト入力';
    default: return type;
  }
};

const getDifficultyBadge = (difficulty?: 'easy' | 'medium' | 'hard') => {
  if (!difficulty) return <Badge variant="outline">未設定</Badge>;
  switch (difficulty) {
    case 'easy': return <Badge className="bg-green-500 hover:bg-green-600">易</Badge>;
    case 'medium': return <Badge className="bg-yellow-500 hover:bg-yellow-600">中</Badge>;
    case 'hard': return <Badge className="bg-red-500 hover:bg-red-600">難</Badge>;
    default: return <Badge variant="outline">{difficulty}</Badge>;
  }
};

export default function AssessmentQuestionListPage() {
  const { assessmentId, versionId } = useParams<{ assessmentId: string; versionId: string }>();
  const navigate = useNavigate();

  const assessment = useMemo(() => assessmentId ? findAssessmentById(assessmentId) : undefined, [assessmentId]);
  const version = useMemo(() => assessmentId && versionId ? findVersionById(assessmentId, versionId) : undefined, [assessmentId, versionId]);
  
  const questions = useMemo(() => {
    if (assessmentId && versionId) {
      return getQuestionsForVersion(assessmentId, versionId);
    }
    return [];
  }, [assessmentId, versionId]);

  useEffect(() => {
    if (!assessmentId || !versionId || !assessment || !version) {
      // Handle invalid or missing IDs, perhaps redirect or show an error
      // For now, let's assume valid IDs are passed or App.tsx handles redirection for the generic path
      console.warn("Assessment ID, Version ID, Assessment, or Version is missing.");
      // navigate('/assessments'); // Example redirect
    }
  }, [assessmentId, versionId, assessment, version, navigate]);

  const columns: ColumnDef<AssessmentQuestion>[] = [
    {
      accessorKey: 'order',
      header: 'No.',
    },
    {
      accessorKey: 'id',
      header: '設問ID',
    },
    {
      accessorKey: 'text',
      header: '設問文',
      cell: ({ row }) => <div className="truncate w-64">{row.original.text}</div>,
    },
    {
      accessorKey: 'type',
      header: '回答形式',
      cell: ({ row }) => getQuestionTypeDisplay(row.original.type),
    },
    {
      accessorKey: 'points',
      header: '配点',
    },
    {
      accessorKey: 'category',
      header: 'カテゴリ',
      cell: ({ row }) => row.original.category || 'N/A',
    },
    {
      accessorKey: 'difficulty',
      header: '難易度',
      cell: ({ row }) => getDifficultyBadge(row.original.difficulty),
    },
    {
      id: 'actions',
      header: '操作',
      cell: ({ row }) => {
        const question = row.original;
        return (
          <Button 
            variant="outline" 
            size="sm" 
            asChild
          >
            <Link to={`/assessments/${question.assessmentId}/versions/${question.versionId}/questions/edit/${question.id}`}>
              <Edit3 className="mr-2 h-4 w-4" /> 編集
            </Link>
          </Button>
        );
      },
    },
  ];

  if (!assessment || !version) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">設問一覧</h1>
        <p>アセスメントまたはバージョンが見つかりません。正しいIDを指定してください。</p>
        <Button onClick={() => navigate('/assessments/versions')} className="mt-4">
          バージョン一覧へ戻る
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">設問一覧</h1>
        <p className="text-lg text-gray-600">
          アセスメント: {assessment.title} (ID: {assessmentId})
        </p>
        <p className="text-md text-gray-500">
          バージョン: v{version.versionNumber} (ID: {versionId}) - {version.status === 'draft' ? '下書き' : version.status === 'active' ? '公開中' : 'アーカイブ済'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>設問リスト ({questions.length}件)</CardTitle>
            {version.status === 'draft' && (
                 <Button asChild>
                    <Link to={`/assessments/${assessmentId}/versions/${versionId}/questions/add`}>
                        <ArrowRight className="mr-2 h-4 w-4" /> 新規設問追加
                    </Link>
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
            filterColumnId="text" // Primary filter on question text
            // TODO: Add secondary filter capability or a more complex filter setup if needed for category
          />
        </CardContent>
      </Card>
       <Button onClick={() => navigate(`/assessments/detail/${assessmentId}`)} variant="outline" className="mt-6">
        アセスメント詳細へ戻る
      </Button>
    </div>
  );
}
