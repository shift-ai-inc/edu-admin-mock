import { ColumnDef } from "@tanstack/react-table";
import {
  Assessment,
  getAssessmentTypeName,
  getAssessmentDifficultyName,
  getSkillLevelName,
} from "@/types/assessment";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, MoreHorizontal, Send, Eye, Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom"; // Import useNavigate

// Placeholder for deliver assessment action
const handleDeliverAssessment = (assessment: Assessment) => {
  toast({
    title: "アセスメント配信 (仮)",
    description: `${assessment.title} の配信設定を行います。`,
  });
  console.log("Deliver assessment:", assessment.title);
};

export const assessmentColumns: ColumnDef<Assessment>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        タイトル
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const assessment = row.original;
      const navigate = useNavigate(); // Hook for navigation

      const handleViewDetails = (assessmentToView: Assessment) => {
        navigate(`/assessments/detail/${assessmentToView.id}`);
      };

      return (
        <div
          className="flex flex-col cursor-pointer hover:underline"
          onClick={() => handleViewDetails(assessment)}
        >
          <span className="font-medium">{assessment.title}</span>
          <p className="text-xs text-muted-foreground truncate max-w-xs">
            {assessment.description}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "種類",
    cell: ({ row }) => getAssessmentTypeName(row.original.type),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "difficulty",
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
      const difficulty = row.original.difficulty;
      let badgeVariant: "default" | "secondary" | "outline" | "destructive" =
        "secondary";
      if (difficulty === "beginner") badgeVariant = "default";
      else if (difficulty === "intermediate") badgeVariant = "outline";
      else if (difficulty === "advanced") badgeVariant = "destructive";

      return (
        <Badge variant={badgeVariant}>
          {getAssessmentDifficultyName(difficulty)}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "targetSkillLevel",
    header: "対象スキル",
    cell: ({ row }) =>
      row.original.targetSkillLevel.map(getSkillLevelName).join(", "),
    filterFn: (row, id, value) => {
      const rowValue = row.getValue(id) as string[];
      return rowValue.some((skill) => value.includes(skill));
    },
  },
  {
    accessorKey: "estimatedDurationMinutes",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        所要時間
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => `${row.original.estimatedDurationMinutes} 分`,
  },
  {
    id: "statusBadges",
    header: " ",
    cell: ({ row }) => {
      const assessment = row.original;
      return (
        <div className="flex space-x-1">
          {assessment.isPopular && (
            <Badge
              variant="outline"
              className="bg-yellow-100 text-yellow-700 border-yellow-300"
            >
              <Star className="mr-1 h-3 w-3" /> 人気
            </Badge>
          )}
          {assessment.isRecommended && (
            <Badge
              variant="outline"
              className="bg-green-100 text-green-700 border-green-300"
            >
              <Star className="mr-1 h-3 w-3" /> 推奨
            </Badge>
          )}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const assessment = row.original;
      const navigate = useNavigate(); // Hook for navigation

      const handleViewDetails = (assessmentToView: Assessment) => {
        navigate(`/assessments/detail/${assessmentToView.id}`);
      };

      return (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDeliverAssessment(assessment);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Send className="mr-2 h-4 w-4" />
            配信
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>アクション</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails(assessment);
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                詳細を見る
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
