import { ColumnDef } from "@tanstack/react-table";
import { QuestionVersion, getVersionStatusName, getQuestionTypeName } from "@/types/survey";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Eye } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";


const handleViewSurveyQuestionDetails = (questionVersion: QuestionVersion) => {
  toast({
    title: "サーベイ設問詳細 (プレースホルダー)",
    description: `設問ID: ${questionVersion.questionId}, Ver: ${questionVersion.versionNumber} の詳細ページへ遷移します。`,
  });
  console.log("View details for survey question version:", questionVersion);
};


export const surveyQuestionVersionColumns: ColumnDef<QuestionVersion>[] = [
  {
    accessorKey: "questionData.text",
    header: "設問内容",
    cell: ({ row }) => <p className="truncate max-w-md">{row.original.questionData.text}</p>,
  },
  {
    accessorKey: "questionData.type",
    header: "回答形式",
    cell: ({ row }) => getQuestionTypeName(row.original.questionData.type),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "questionData.category",
    header: "カテゴリ",
    cell: ({ row }) => row.original.questionData.category || "N/A",
    filterFn: (row, id, value) => {
      const category = row.original.questionData.category;
      return category ? value.includes(category) : false;
    },
  },
  {
    accessorKey: "versionNumber",
    header: "Ques.Ver.",
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
    accessorKey: "createdAt",
    header: "作成日時",
    cell: ({ row }) => format(new Date(row.original.createdAt), "PP p", { locale: ja }),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const questionVersion = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleViewSurveyQuestionDetails(questionVersion)}>
              <Eye className="mr-2 h-4 w-4" />
              詳細/編集 (仮)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
