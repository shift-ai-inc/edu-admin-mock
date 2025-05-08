import { ColumnDef } from "@tanstack/react-table";
import {
  Survey,
  getSurveyTypeName,
  getSurveyDifficultyName,
  getSkillLevelName,
} from "@/types/survey";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, MoreHorizontal, Send, Eye, Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

const handleDeliverSurvey = (survey: Survey) => {
  toast({
    title: "サーベイ配信 (仮)",
    description: `${survey.title} の配信設定を行います。`,
  });
  console.log("Deliver survey:", survey.title);
};


export const surveyColumns: ColumnDef<Survey>[] = [
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
      const survey = row.original;
      const navigate = useNavigate();

      const handleViewDetails = (surveyToView: Survey) => {
        navigate(`/surveys/detail/${surveyToView.id}`);
      };

      return (
        <div 
          className="flex flex-col cursor-pointer hover:underline"
          onClick={() => handleViewDetails(survey)}
        >
          <span className="font-medium">{survey.title}</span>
          <p className="text-xs text-muted-foreground truncate max-w-xs">
            {survey.description}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "種類",
    cell: ({ row }) => getSurveyTypeName(row.original.type),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "difficulty", // Consider if "difficulty" is appropriate for surveys or rename
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        複雑度 {/* Changed from 難易度 */}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const difficulty = row.original.difficulty;
      let badgeVariant: "default" | "secondary" | "outline" | "destructive" = "secondary";
      if (difficulty === "beginner") badgeVariant = "default";
      else if (difficulty === "intermediate") badgeVariant = "outline";
      else if (difficulty === "advanced") badgeVariant = "destructive";
      
      return <Badge variant={badgeVariant}>{getSurveyDifficultyName(difficulty)}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "targetSkillLevel", // Consider if "targetSkillLevel" is appropriate or rename to "targetAudience"
    header: "対象者", // Changed from 対象スキル
    cell: ({ row }) =>
      row.original.targetSkillLevel.map(getSkillLevelName).join(", "),
    filterFn: (row, id, value) => {
      const rowValue = row.getValue(id) as string[];
      return rowValue.some(skill => value.includes(skill));
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
      const survey = row.original;
      return (
        <div className="flex space-x-1">
          {survey.isPopular && (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300">
              <Star className="mr-1 h-3 w-3" /> 人気
            </Badge>
          )}
          {survey.isRecommended && (
            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
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
      const survey = row.original;
      const navigate = useNavigate();

      const handleViewDetails = (surveyToView: Survey) => {
        navigate(`/surveys/detail/${surveyToView.id}`);
      };

      return (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDeliverSurvey(survey);
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
                  handleViewDetails(survey);
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
