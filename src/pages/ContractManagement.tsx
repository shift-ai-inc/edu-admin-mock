import React from 'react';
import { mockContracts } from '@/data/mockContracts';
import { Contract } from '@/types/contract';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription, // Added for more detail
  CardFooter, // Added for potential actions
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { format, differenceInDays, intervalToDuration, isPast, isValid } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Button } from '@/components/ui/button'; // For potential actions

// Define Duration type
type Duration = { years?: number; months?: number; days?: number };

// Helper function to format duration
const formatDuration = (duration: Duration): string => {
  const parts: string[] = [];
  if (duration.years && duration.years > 0) parts.push(`${duration.years}年`);
  if (duration.months && duration.months > 0) parts.push(`${duration.months}ヶ月`);
  if (duration.days && duration.days > 0) parts.push(`${duration.days}日`);
  return parts.length > 0 ? parts.join('') : '期間終了';
};

const ContractManagement: React.FC = () => {
  // For demonstration, we'll display details of the first contract.
  // In a real application, you'd likely get the contract ID from props or route params.
  const contract: Contract | undefined = mockContracts[0];
  const now = new Date();

  if (!contract) {
    return (
      <div className="container mx-auto p-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">契約情報</CardTitle>
          </CardHeader>
          <CardContent>
            <p>表示する契約情報がありません。</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const startDate = new Date(contract.startDate);
  const endDate = new Date(contract.endDate);
  let remainingDurationStr = 'N/A';
  let countdownStr = 'N/A';
  let status = { text: '無効な日付', variant: 'destructive' as const };
  let usagePercentage = 0;
  let remainingLicenses = 0;

  if (isValid(startDate) && isValid(endDate)) {
    if (isPast(endDate)) {
      status = { text: '契約終了', variant: 'destructive' };
      remainingDurationStr = '契約終了';
      countdownStr = '終了済み';
    } else {
      status = { text: '契約中', variant: 'default' }; // Changed to default for active contracts
      const duration = intervalToDuration({ start: now, end: endDate });
      remainingDurationStr = formatDuration(duration);
      const daysLeft = differenceInDays(endDate, now);
      countdownStr = `${daysLeft}日`;
    }
  }

  if (contract.totalLicenses > 0) {
    usagePercentage = Math.round((contract.usedLicenses / contract.totalLicenses) * 100);
    remainingLicenses = contract.totalLicenses - contract.usedLicenses;
  }

  return (
    <div className="container mx-auto p-6 mt-6">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">契約詳細: {contract.companyName}</CardTitle>
          <CardDescription>サービス: {contract.serviceName}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">契約期間</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <p><strong className="font-medium">契約開始日:</strong></p>
              <p>{isValid(startDate) ? format(startDate, 'yyyy年MM月dd日', { locale: ja }) : '無効な日付'}</p>
              <p><strong className="font-medium">契約終了日:</strong></p>
              <p>{isValid(endDate) ? format(endDate, 'yyyy年MM月dd日', { locale: ja }) : '無効な日付'}</p>
              <p><strong className="font-medium">残り期間:</strong></p>
              <p>{remainingDurationStr}</p>
              <p><strong className="font-medium">終了まで:</strong></p>
              <p>{countdownStr}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">ステータス</h3>
            <Badge variant={status.variant} className="text-sm">{status.text}</Badge>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">ライセンス情報</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <p><strong className="font-medium">総ライセンス数:</strong></p>
              <p>{contract.totalLicenses.toLocaleString()} 件</p>
              <p><strong className="font-medium">使用中ライセンス数:</strong></p>
              <p>{contract.usedLicenses.toLocaleString()} 件</p>
              <p><strong className="font-medium">残ライセンス数:</strong></p>
              <p>{remainingLicenses.toLocaleString()} 件</p>
            </div>
            <div className="mt-2">
              <p className="text-sm font-medium mb-1">使用率: {usagePercentage}%</p>
              <Progress value={usagePercentage} className="w-full h-3" />
            </div>
          </div>

          {contract.autoRenew !== undefined && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">自動更新</h3>
              <p className="text-sm">{contract.autoRenew ? '有効' : '無効'}</p>
            </div>
          )}

          {contract.notes && (
             <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">備考</h3>
              <p className="text-sm whitespace-pre-wrap">{contract.notes}</p>
            </div>
          )}

        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          {/* Future actions like "Edit Contract", "Renew Contract" can be added here */}
          <Button variant="outline">契約情報編集</Button>
          <Button>契約更新</Button>
        </CardFooter>
      </Card>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          これはデモンストレーションです。現在は最初の契約情報を表示しています。
        </p>
        <p className="text-sm text-gray-500">
          将来的には、特定の契約を選択して詳細を表示する機能が必要です。
        </p>
      </div>
    </div>
  );
};

export default ContractManagement;
