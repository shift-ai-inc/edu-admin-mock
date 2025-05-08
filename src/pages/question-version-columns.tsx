import { ColumnDef } from "@tanstack/react-table";
import { QuestionVersion, getVersionStatusName, getQuestionTypeName, getQuestionDifficultyName } from "@/types/assessment";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, MoreHorizontal, Eye } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { toast } from "@/hooks/use-toast"; // No longer needed for this action
import { NavigateFunction } from "react-router-dom";


export const questionVersionColumns = (navigate: NavigateFunction): ColumnDef<QuestionVersion>[] => [
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
    cell: ({ row }) => row.original.questionData.category,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "questionData.difficulty",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        難易度
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const difficulty = row.original.questionData.difficulty;
      let badgeVariant: "default" | "secondary" | "outline" = "secondary";
      if (difficulty === "easy") badgeVariant = "default";
      else if (difficulty === "medium") badgeVariant = "outline";
      else if (difficulty === "hard") badgeVariant = "default"; // Consider a different color for hard

      return <Badge variant={badgeVariant} className={difficulty === 'hard' ? 'bg-red-100 text-red-700 border-red-300' : ''}>{getQuestionDifficultyName(difficulty)}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "questionData.points",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        配点
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => row.original.questionData.points,
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
            <DropdownMenuItem onClick={() => navigate(`/assessments/questions/${questionVersion.id}`)}>
              <Eye className="mr-2 h-4 w-4" />
              詳細/編集
            </DropdownMenuItem>
            {/* Add other actions like 'Compare with previous version' etc. */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
