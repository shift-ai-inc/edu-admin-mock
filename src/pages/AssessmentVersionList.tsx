import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  mockAssessmentVersions,
  findAssessmentById,
} from "@/data/mockAssessmentVersions";
import { getQuestionsForVersion } from "@/data/mockAssessmentQuestions";
import { DisplayableAssessmentVersion } from "@/types"; // Assuming DisplayableAssessmentVersion is in index.ts

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return "Invalid Date";
  }
};

const getStatusBadge = (status: "draft" | "active" | "archived" | "published") => {
  switch (status) {
    case "active":
    case "published":
      return <Badge variant="default">公開中</Badge>;
    case "draft":
      return <Badge variant="outline">下書き</Badge>;
    case "archived":
      return <Badge variant="secondary">アーカイブ済</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export default function AssessmentVersionList() {
  const data = useMemo(() => {
    const allVersions: DisplayableAssessmentVersion[] = [];
    Object.keys(mockAssessmentVersions).forEach((assessmentId) => {
      const assessmentInfo = findAssessmentById(assessmentId);
      const versions = mockAssessmentVersions[assessmentId];
      versions.forEach((version) => {
        const questionCount = getQuestionsForVersion(
          assessmentId,
          version.id
        ).length;
        allVersions.push({
          assessmentId: assessmentId,
          assessmentTitle: assessmentInfo?.title || "N/A",
          versionId: version.id,
          versionNumber: version.versionNumber,
          createdAt: formatDate(version.createdAt),
          createdBy: version.createdBy || "N/A",
          status: version.status,
          questionCount: questionCount,
          updatedAt: formatDate(version.updatedAt), // As "Update History"
        });
      });
    });
    return allVersions
      .sort((a, b) => b.versionNumber - a.versionNumber) // Sort by version number desc initially
      .sort((a, b) => a.assessmentTitle.localeCompare(b.assessmentTitle)); // Then by title
  }, []);

  const columns: ColumnDef<DisplayableAssessmentVersion>[] = [
    {
      accessorKey: "assessmentTitle",
      header: "アセスメント名",
    },
    {
      accessorKey: "versionNumber",
      header: "バージョン",
      cell: ({ row }) => `v${row.original.versionNumber}`,
    },
    {
      accessorKey: "status",
      header: "ステータス",
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      accessorKey: "questionCount",
      header: "設問数",
    },
    {
      accessorKey: "createdBy",
      header: "作成者",
    },
    {
      accessorKey: "createdAt",
      header: "作成日時",
    },
    {
      accessorKey: "updatedAt",
      header: "最終更新日時", // "Update History"
    },
    // Future actions column:
    // {
    //   id: 'actions',
    //   header: 'アクション',
    //   cell: ({ row }) => {
    //     // const version = row.original;
    //     // Add buttons for view details, compare, restore etc.
    //     return (
    //       <Button variant="outline" size="sm" onClick={() => console.log("View details for", version.assessmentId, version.versionId)}>
    //         詳細
    //       </Button>
    //     );
    //   },
    // },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        アセスメントバージョン一覧
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>全アセスメントバージョン</CardTitle>
          {/* TODO: Add filtering options if needed, e.g., by assessment */}
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data}
            filterInputPlaceholder="バージョンを検索..." // Generic placeholder
            filterColumnId="assessmentTitle" // Allow filtering by assessment title
          />
        </CardContent>
      </Card>
    </div>
  );
}
