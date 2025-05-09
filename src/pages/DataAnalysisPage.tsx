import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverallResults from './OverallResults';
import GroupResults from './GroupResults';
import GeneralUserResultsPage from './GeneralUserResultsPage';
import BenchmarkComparison from './BenchmarkComparison';

// Removed context prop as it's now only for assessments
const DataAnalysisPage: React.FC = () => {
  const pageTitle = 'アセスメントデータ分析'; // Hardcoded title
  const defaultTab = "overall";

  return (
    <div className="p-0 md:p-2 lg:p-4 space-y-6">
      <h1 className="text-2xl font-semibold mb-4">{pageTitle}</h1>
      
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-4">
          <TabsTrigger value="overall">全体の結果分析</TabsTrigger>
          <TabsTrigger value="group">グループの結果分析</TabsTrigger>
          <TabsTrigger value="user">ユーザーの結果分析</TabsTrigger>
          <TabsTrigger value="benchmark">ベンチマーク比較</TabsTrigger>
        </TabsList>

        <TabsContent value="overall">
          <OverallResults />
        </TabsContent>
        <TabsContent value="group">
          <GroupResults />
        </TabsContent>
        <TabsContent value="user">
          <GeneralUserResultsPage />
        </TabsContent>
        <TabsContent value="benchmark">
          <BenchmarkComparison />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataAnalysisPage;
