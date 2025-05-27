import React, { useState, useMemo } from 'react';
import { DataTable } from '@/components/data-table';
import { assessmentColumns } from './assessment-columns';
import { mockAssessments } from '@/data/mockAssessments';
import { Assessment, AssessmentType, AssessmentDifficulty, SkillLevel, getAssessmentTypeName, getAssessmentDifficultyName, getSkillLevelName } from '@/types/assessment';
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
import { ListFilter, Plus, Search } from 'lucide-react';
import { CreateAssessmentModal } from '@/components/features/assessment/CreateAssessmentModal';

const assessmentTypes: AssessmentType[] = ["multiple-choice", "coding-test", "scenario-based", "video-submission"];
const assessmentDifficulties: AssessmentDifficulty[] = ["beginner", "intermediate", "advanced", "expert"];
const skillLevels: SkillLevel[] = ["entry", "junior", "mid-level", "senior", "lead"];


export default function AssessmentList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<Set<AssessmentType>>(new Set());
  const [selectedDifficulties, setSelectedDifficulties] = useState<Set<AssessmentDifficulty>>(new Set());
  const [selectedSkillLevels, setSelectedSkillLevels] = useState<Set<SkillLevel>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredAssessments = useMemo(() => {
    return mockAssessments.filter((assessment) => {
      const term = searchTerm.toLowerCase();
      const matchesSearchTerm =
        assessment.title.toLowerCase().includes(term) ||
        assessment.description.toLowerCase().includes(term);

      const matchesType =
        selectedTypes.size === 0 || selectedTypes.has(assessment.type);
      
      const matchesDifficulty =
        selectedDifficulties.size === 0 || selectedDifficulties.has(assessment.difficulty);

      const matchesSkillLevel =
        selectedSkillLevels.size === 0 || assessment.targetSkillLevel.some(skill => selectedSkillLevels.has(skill));

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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSaveAssessment = async (data: any) => {
    // TODO: Save assessment data
    console.log('Assessment data to save:', data);
    handleCloseModal();
  };


  return (
    <div className="p-4 md:p-8">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
          <div>
            <CardTitle>アセスメント一覧</CardTitle>
            <p className="text-sm text-muted-foreground">
              配信可能なアセスメントを管理します。
            </p>
          </div>
          <Button className="flex items-center gap-1" onClick={handleOpenModal}>
            <Plus size={16} /> 新規登録
          </Button>
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
                  {assessmentTypes.map((type) => (
                    <DropdownMenuCheckboxItem
                      key={type}
                      checked={selectedTypes.has(type)}
                      onCheckedChange={() => toggleFilter(selectedTypes, type, setSelectedTypes)}
                    >
                      {getAssessmentTypeName(type)}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <ListFilter className="mr-2 h-4 w-4" />
                    難易度 ({selectedDifficulties.size > 0 ? selectedDifficulties.size : '全て'})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>難易度で絞り込み</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {assessmentDifficulties.map((difficulty) => (
                    <DropdownMenuCheckboxItem
                      key={difficulty}
                      checked={selectedDifficulties.has(difficulty)}
                      onCheckedChange={() => toggleFilter(selectedDifficulties, difficulty, setSelectedDifficulties)}
                    >
                      {getAssessmentDifficultyName(difficulty)}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <ListFilter className="mr-2 h-4 w-4" />
                    対象スキル ({selectedSkillLevels.size > 0 ? selectedSkillLevels.size : '全て'})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>対象スキルで絞り込み</DropdownMenuLabel>
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
            columns={assessmentColumns}
            data={filteredAssessments}
            // No global filter input here as we have specific search and dropdown filters
            // filterColumnId="title" // Example, if you wanted a global filter on title
            // filterInputPlaceholder="アセスメントを検索..."
            // onRowClick={(row) => console.log("Row clicked:", row.original)} // Example row click
          />
        </CardContent>
      </Card>
      <CreateAssessmentModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveAssessment} />
    </div>
  );
}
