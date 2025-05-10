import React, { useState, useMemo } from 'react';
import { DataTable } from '@/components/data-table';
import { surveyColumns } from './survey-columns'; // Changed
import { mockSurveys } from '@/data/mockSurveys'; // Changed
import { Survey, SurveyType, SurveyDifficulty, SkillLevel, getSurveyTypeName, getSurveyDifficultyName, getSkillLevelName } from '@/types/survey'; // Changed
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ListFilter, Search } from 'lucide-react';

const surveyTypes: SurveyType[] = ["multiple-choice", "coding-test", "scenario-based", "video-submission"]; // Changed
const surveyDifficulties: SurveyDifficulty[] = ["beginner", "intermediate", "advanced", "expert"]; // Changed
const skillLevels: SkillLevel[] = ["entry", "junior", "mid-level", "senior", "lead"]; // Assuming this is applicable


export default function SurveyList() { // Changed
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<Set<SurveyType>>(new Set()); // Changed
  const [selectedDifficulties, setSelectedDifficulties] = useState<Set<SurveyDifficulty>>(new Set()); // Changed
  const [selectedSkillLevels, setSelectedSkillLevels] = useState<Set<SkillLevel>>(new Set());

  const filteredSurveys = useMemo(() => { // Changed
    return mockSurveys.filter((survey) => { // Changed
      const term = searchTerm.toLowerCase();
      const matchesSearchTerm =
        survey.title.toLowerCase().includes(term) ||
        survey.description.toLowerCase().includes(term);

      const matchesType =
        selectedTypes.size === 0 || selectedTypes.has(survey.type);
      
      const matchesDifficulty =
        selectedDifficulties.size === 0 || selectedDifficulties.has(survey.difficulty);

      const matchesSkillLevel = // Assuming targetSkillLevel is used for surveys
        selectedSkillLevels.size === 0 || survey.targetSkillLevel.some(skill => selectedSkillLevels.has(skill));

      return matchesSearchTerm && matchesType && matchesDifficulty && matchesSkillLevel;
    });
  }, [searchTerm, selectedTypes, selectedDifficulties, selectedSkillLevels]);

  const toggleFilter = <T extends string>(set: Set<T>, item: T, setter: React.Dispatch<React.SetStateAction<Set<T>>>) => {
    const newSet = new Set(set);
    if (newSet.has(item)) {
      newSet.delete(item);
    } else {
      newSet.add(item);
    }
    setter(newSet);
  };


  return (
    <div className="p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>サーベイ一覧</CardTitle> {/* Changed */}
          <p className="text-sm text-muted-foreground">
            配信可能なサーベイを管理します。 {/* Changed */}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="タイトルや説明で検索..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-9 w-full"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    <ListFilter className="mr-2 h-4 w-4" />
                    種類 ({selectedTypes.size > 0 ? selectedTypes.size : '全て'})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>種類で絞り込み</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {surveyTypes.map((type) => ( // Changed
                    <DropdownMenuCheckboxItem
                      key={type}
                      checked={selectedTypes.has(type)}
                      onCheckedChange={() => toggleFilter(selectedTypes, type, setSelectedTypes)}
                    >
                      {getSurveyTypeName(type)} {/* Changed */}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <ListFilter className="mr-2 h-4 w-4" />
                    複雑度 ({selectedDifficulties.size > 0 ? selectedDifficulties.size : '全て'}) {/* Changed label */}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>複雑度で絞り込み</DropdownMenuLabel> {/* Changed label */}
                  <DropdownMenuSeparator />
                  {surveyDifficulties.map((difficulty) => ( // Changed
                    <DropdownMenuCheckboxItem
                      key={difficulty}
                      checked={selectedDifficulties.has(difficulty)}
                      onCheckedChange={() => toggleFilter(selectedDifficulties, difficulty, setSelectedDifficulties)}
                    >
                      {getSurveyDifficultyName(difficulty)} {/* Changed */}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <ListFilter className="mr-2 h-4 w-4" />
                    対象者 ({selectedSkillLevels.size > 0 ? selectedSkillLevels.size : '全て'}) {/* Changed label */}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>対象者で絞り込み</DropdownMenuLabel> {/* Changed label */}
                  <DropdownMenuSeparator />
                  {skillLevels.map((level) => (
                    <DropdownMenuCheckboxItem
                      key={level}
                      checked={selectedSkillLevels.has(level)}
                      onCheckedChange={() => toggleFilter(selectedSkillLevels, level, setSelectedSkillLevels)}
                    >
                      {getSkillLevelName(level)}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <DataTable
            columns={surveyColumns} // Changed
            data={filteredSurveys} // Changed
          />
        </CardContent>
      </Card>
    </div>
  );
}
