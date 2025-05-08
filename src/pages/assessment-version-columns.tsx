import { ColumnDef } from "@tanstack/react-table";
import { AssessmentVersion, getVersionStatusName } from "@/types/assessment";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Eye } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

export const assessmentVersionColumns = (
  onSelectVersion: (version: AssessmentVersion) => void
): ColumnDef<AssessmentVersion>[] => [
  {
    accessorKey: "versionNumber",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        バージョン
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => `v${row.original.versionNumber}`,
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
    accessorKey: "description",
    header: "説明",
    cell: ({ row }) => <p className="truncate max-w-xs">{row.original.description}</p>,
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
    cell: ({ row }) => format(new Date(row.original.createdAt), "PPP p", { locale: ja }),
  },
  {
    accessorKey: "publishedAt",
    header: "公開日時",
    cell: ({ row }) => row.original.publishedAt ? format(new Date(row.original.publishedAt), "PPP p", { locale: ja }) : "N/A",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Button variant="outline" size="sm" onClick={() => onSelectVersion(row.original)}>
        <Eye className="mr-2 h-4 w-4" />
        設問一覧表示
      </Button>
    ),
  },
];
