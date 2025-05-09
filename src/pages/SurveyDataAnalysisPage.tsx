import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverallResults from './OverallResults'; // Reusing for now
import GroupResults from './GroupResults'; // Reusing for now
import GeneralUserResultsPage from './GeneralUserResultsPage'; // Reusing for now
import BenchmarkComparison from './BenchmarkComparison'; // Reusing for now

const SurveyDataAnalysisPage: React.FC = () => {
  const pageTitle = 'サーベイデータ分析';
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
          {/* TODO: Replace with Survey-specific OverallResults if needed */}
          <OverallResults />
        </TabsContent>
        <TabsContent value="group">
          {/* TODO: Replace with Survey-specific GroupResults if needed */}
          <GroupResults />
        </TabsContent>
        <TabsContent value="user">
          {/* TODO: Replace with Survey-specific GeneralUserResultsPage if needed */}
          <GeneralUserResultsPage />
        </TabsContent>
        <TabsContent value="benchmark">
          {/* TODO: Replace with Survey-specific BenchmarkComparison if needed */}
          <BenchmarkComparison />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SurveyDataAnalysisPage;
