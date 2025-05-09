// Copied and adapted from AssessmentList.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { mockAvailableSurveys } from '@/data/mockSurveys'; // Changed import
import { AvailableSurvey } from '@/types/survey'; // Changed import
import { Search, Filter, ArrowUpDown, Clock, Users, Send, Info } from 'lucide-react';
import CreateSurveyDeliveryDialog from '@/components/CreateSurveyDeliveryDialog'; // Changed import
import { useToast } from "@/hooks/use-toast";

type SortKey = 'title' | 'estimatedTime' | 'category' | 'createdAt';
type SortDirection = 'asc' | 'desc';
type CategoryFilter = 'all' | '満足度調査' | '組織診断' | '研修評価' | 'その他'; // Survey specific categories

export default function SurveyList() {
  const [surveys, setSurveys] = useState<AvailableSurvey[]>([]); // Changed state name and type
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [assigningSurvey, setAssigningSurvey] = useState<AvailableSurvey | null>(null); // Changed state name
  const [isCreateDeliveryDialogOpen, setIsCreateDeliveryDialogOpen] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setSurveys(mockAvailableSurveys); // Changed data source
      setIsLoading(false);
    }, 50);
  }, []);

  const filteredAndSortedSurveys = useMemo(() => { // Changed variable name
    let result = surveys.filter(survey => { // Changed variable name
      const matchesSearch =
        survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        survey.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        survey.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || survey.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    result.sort((a, b) => {
      let compareA = a[sortKey];
      let compareB = b[sortKey];

      if (sortKey === 'createdAt') {
        compareA = new Date(a.createdAt).getTime();
        compareB = new Date(b.createdAt).getTime();
      } else if (sortKey === 'estimatedTime') {
        compareA = Number(a.estimatedTime);
        compareB = Number(b.estimatedTime);
      }

      let comparison = 0;
      if (compareA > compareB) {
        comparison = 1;
      } else if (compareA < compareB) {
        comparison = -1;
      }
      return sortDirection === 'desc' ? comparison * -1 : comparison;
    });
    return result;
  }, [surveys, searchTerm, categoryFilter, sortKey, sortDirection]); // Changed dependency

  const handleSortChange = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const handleViewDetails = (surveyId: string) => { // Changed parameter name
    navigate(`/surveys/${surveyId}`); // Changed path
  };

  const handleConfigureDeliveryClick = (survey: AvailableSurvey) => { // Changed parameter type
    setAssigningSurvey(survey); // Changed state setter
    setIsCreateDeliveryDialogOpen(true);
  };

  const handleDeliveryCreated = (details: any) => {
     console.log("Survey Delivery creation successful (in parent list):", details);
     toast({ title: "サーベイ配信設定完了", description: "サーベイの配信設定が正常に作成されました。" });
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        サーベイ一覧
      </h2>

      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="検索 (タイトル, 説明, カテゴリ)..."
            className="pl-8 w-[300px] bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as CategoryFilter)}>
            <SelectTrigger className="w-[180px] bg-white">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="カテゴリ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべてのカテゴリ</SelectItem>
              <SelectItem value="満足度調査">満足度調査</SelectItem>
              <SelectItem value="組織診断">組織診断</SelectItem>
              <SelectItem value="研修評価">研修評価</SelectItem>
              <SelectItem value="その他">その他</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={() => handleSortChange('title')}>
            タイトル
            {sortKey === 'title' && <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />}
          </Button>
           <Button variant="outline" size="sm" onClick={() => handleSortChange('estimatedTime')}>
             所要時間
             {sortKey === 'estimatedTime' && <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />}
           </Button>
           <Button variant="outline" size="sm" onClick={() => handleSortChange('createdAt')}>
             作成日
             {sortKey === 'createdAt' && <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />}
           </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10">読み込み中...</div>
      ) : filteredAndSortedSurveys.length === 0 ? ( // Changed variable name
        <div className="text-center py-10 text-gray-500">該当するサーベイが見つかりません。</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedSurveys.map((survey) => ( // Changed variable name
            <Card key={survey.id} className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                   <CardTitle className="text-lg">{survey.title}</CardTitle>
                   <Badge variant="secondary">{survey.category}</Badge>
                </div>
                <CardDescription className="text-sm line-clamp-3 h-[60px]">{survey.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-gray-500" />
                    <span>所要時間: 約{survey.estimatedTime}分</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-gray-500" />
                    <span>利用回数: {survey.usageCount?.toLocaleString() ?? 'N/A'}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => handleViewDetails(survey.id)}>
                  <Info className="mr-1.5 h-4 w-4" />
                  詳細
                </Button>
                <Button size="sm" onClick={() => handleConfigureDeliveryClick(survey)}>
                  <Send className="mr-1.5 h-4 w-4" />
                  配信設定
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

       <CreateSurveyDeliveryDialog // Changed component
         survey={assigningSurvey} // Changed prop name
         open={isCreateDeliveryDialogOpen}
         onOpenChange={setIsCreateDeliveryDialogOpen}
         onDeliveryCreated={handleDeliveryCreated}
       />
    </div>
  );
}
