import { useParams } from 'react-router-dom';
import { mockContracts } from '@/data/mockContracts'; // Use centralized mock data
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, isValid } from 'date-fns';
import { ja } from 'date-fns/locale';
import ContractBillingDetails from '@/components/features/billing/ContractBillingDetails';

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return '無効な日付';
    return format(date, 'PPP', { locale: ja });
  } catch {
    return 'フォーマットエラー';
  }
};

export default function ContractDetail() {
  const { contractId: id } = useParams<{ contractId: string }>(); // Changed this line
  const navigate = useNavigate();
  const contract = mockContracts.find(c => c.id === id);

  console.log('[ContractDetail] contractId from URL (now as id):', id);
  console.log('[ContractDetail] Found contract:', contract);

  if (!contract) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl text-red-600">契約が見つかりません</h1>
        <Button onClick={() => navigate('/contracts')} className="mt-4">
          契約一覧に戻る
        </Button>
      </div>
    );
  }

  console.log('[ContractDetail] Rendering ContractBillingDetails with contractId:', contract.id);

  return (
    <div className="p-8 space-y-6">
      <Button variant="outline" onClick={() => navigate('/contracts')} className="flex items-center gap-2">
        <ArrowLeft size={16} />
        契約一覧に戻る
      </Button>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{contract.companyName} - 契約詳細</CardTitle>
              <CardDescription>契約ID: {contract.id}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon"><Edit size={16} /></Button>
              <Button variant="destructive" size="icon"><Trash2 size={16} /></Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2 text-gray-700">基本情報</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">プラン:</dt>
                <dd><Badge>{contract.plan}</Badge></dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">契約金額:</dt>
                <dd className="font-semibold">{contract.amount}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">ユーザー数:</dt>
                <dd>{contract.userCount}名</dd>
              </div>
            </dl>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-gray-700">契約期間</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">開始日:</dt>
                <dd>{formatDate(contract.startDate)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">終了日:</dt>
                <dd>{formatDate(contract.endDate)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">契約ステータス:</dt>
                <dd><Badge variant={contract.status === 'active' ? 'default' : 'secondary'}>{contract.status === 'active' ? '有効' : '期限切れ'}</Badge></dd>
              </div>
            </dl>
          </div>
        </CardContent>
      </Card>

      {/* Billing Information Section */}
      {contract.id && <ContractBillingDetails contractId={contract.id} />}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText size={20}/> 関連ドキュメント</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Placeholder for related documents */}
          <p className="text-sm text-gray-500">関連ドキュメントはありません。</p>
          <Button variant="link" className="p-0 h-auto mt-2">ドキュメントをアップロード</Button>
        </CardContent>
      </Card>

    </div>
  );
}
