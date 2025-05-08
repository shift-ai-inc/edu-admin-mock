import { ColumnDef } from "@tanstack/react-table";
import { SurveyVersion, getVersionStatusName } from "@/types/survey"; // Changed
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { format } from 'date-fns';

export const surveyVersionColumns = ( // Changed
  onSelectVersion: (version: SurveyVersion) => void // Changed
): ColumnDef<SurveyVersion>[] => [ // Changed
  {
    accessorKey: "versionNumber",
    header: "バージョン",
    cell: ({ row }) => `v${row.original.versionNumber}`,
  },
  {
    accessorKey: "description",
    header: "説明",
    cell: ({ row }) => <p className="truncate max-w-xs">{row.original.description}</p>,
  },
  {
    accessorKey: "questionCount",
    header: "設問数",
  },
  {
    accessorKey: "status",
    header: "ステータス",
    cell: ({ row }) => {
      const status = row.original.status;
      let badgeVariant: "default" | "secondary" | "outline" | "destructive" = "secondary";
      if (status === "published") badgeVariant = "default";
      else if (status === "draft") badgeVariant = "outline";
      else if (status === "archived") badgeVariant = "destructive";
      return <Badge variant={badgeVariant}>{getVersionStatusName(status)}</Badge>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "作成日",
    cell: ({ row }) => format(new Date(row.original.createdAt), "yyyy/MM/dd HH:mm"),
  },
  {
    accessorKey: "publishedAt",
    header: "公開日",
    cell: ({ row }) => row.original.publishedAt ? format(new Date(row.original.publishedAt), "yyyy/MM/dd HH:mm") : "N/A",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const version = row.original;
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onSelectVersion(version);
          }}
        >
          <Eye className="mr-2 h-4 w-4" />
          設問一覧表示
        </Button>
      );
    },
  },
];
