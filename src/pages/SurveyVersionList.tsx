import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button'; // For future actions
import { mockSurveyDefinitionVersions, findSurveyDefinitionById } from '@/data/mockSurveyDefinitions';
import { getQuestionsForSurveyVersion } from '@/data/mockSurveyQuestions';
import { DisplayableSurveyVersion } from '@/types';

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return 'Invalid Date';
  }
};

const getStatusBadge = (status: 'draft' | 'active' | 'archived') => {
  switch (status) {
    case 'active':
      return <Badge variant="default">公開中</Badge>;
    case 'draft':
      return <Badge variant="outline">下書き</Badge>;
    case 'archived':
      return <Badge variant="secondary">アーカイブ済</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export default function SurveyVersionList() {
  const data = useMemo(() => {
    const allVersions: DisplayableSurveyVersion[] = [];
    Object.keys(mockSurveyDefinitionVersions).forEach(surveyDefId => {
      const surveyDefInfo = findSurveyDefinitionById(surveyDefId);
      const versions = mockSurveyDefinitionVersions[surveyDefId];
      versions.forEach(version => {
        const questionCount = getQuestionsForSurveyVersion(surveyDefId, version.id).length;
        allVersions.push({
          surveyDefinitionId: surveyDefId,
          surveyTitle: surveyDefInfo?.title || 'N/A',
          versionId: version.id,
          versionNumber: version.versionNumber,
          createdAt: formatDate(version.createdAt),
          createdBy: version.createdBy || 'N/A',
          status: version.status,
          questionCount: questionCount,
          updatedAt: formatDate(version.updatedAt),
        });
      });
    });
    return allVersions.sort((a, b) => b.versionNumber - a.versionNumber)
                      .sort((a,b) => a.surveyTitle.localeCompare(b.surveyTitle));
  }, []);

  const columns: ColumnDef<DisplayableSurveyVersion>[] = [
    {
      accessorKey: 'surveyTitle',
      header: 'サーベイ名',
    },
    {
      accessorKey: 'versionNumber',
      header: 'バージョン',
      cell: ({ row }) => `v${row.original.versionNumber}`,
    },
    {
      accessorKey: 'status',
      header: 'ステータス',
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      accessorKey: 'questionCount',
      header: '設問数',
    },
    {
      accessorKey: 'createdBy',
      header: '作成者',
    },
    {
      accessorKey: 'createdAt',
      header: '作成日時',
    },
    {
      accessorKey: 'updatedAt',
      header: '最終更新日時',
    },
    // Future actions column:
    // {
    //   id: 'actions',
    //   header: 'アクション',
    //   cell: ({ row }) => {
    //     // const version = row.original;
    //     // return (
    //     //   <Button variant="outline" size="sm" onClick={() => console.log("View details for", version.surveyDefinitionId, version.versionId)}>
    //     //     詳細
    //     //   </Button>
    //     // );
    //   },
    // },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        サーベイバージョン一覧
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>全サーベイバージョン</CardTitle>
          {/* TODO: Add filtering options if needed */}
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={data} 
            filterInputPlaceholder="バージョンを検索..."
            filterColumnId="surveyTitle" // Allow filtering by survey title
          />
        </CardContent>
      </Card>
    </div>
  );
}
