import React, { useEffect, useState } from 'react';
import { useParams, useNavigate }
from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, CalendarDays, Users, CheckCircle, XCircle, Clock, AlertTriangle, Edit, Send, Trash2 } from 'lucide-react';
import { AssessmentDelivery, getDeliveryStatusInfo } from '@/types/assessmentDelivery';
import { getAssessmentDeliveries } from '@/data/mockAssessmentDeliveries'; // We'll use this to find the specific delivery
import { format, isBefore, differenceInDays } from 'date-fns'; // Added differenceInDays
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const NEAR_EXPIRY_DAYS = 3;

export default function AssessmentDeliveryDetailsPage() {
  const { deliveryId } = useParams<{ deliveryId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [delivery, setDelivery] = useState<AssessmentDelivery | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState<AssessmentDelivery | null>(null);
  const [editedTargetGroup, setEditedTargetGroup] = useState('');
  const [editedEndDate, setEditedEndDate] = useState('');


  useEffect(() => {
    const fetchDeliveryDetails = async () => {
      setIsLoading(true);
      if (!deliveryId) {
        toast({ title: "エラー", description: "配信IDが見つかりません。", variant: "destructive" });
        setIsLoading(false);
        navigate('/assessment-deliveries'); // Redirect if no ID
        return;
      }

      try {
        const allDeliveries = await getAssessmentDeliveries();
        let foundDelivery = allDeliveries.find(d => d.deliveryId === deliveryId);

        if (foundDelivery) {
          // Update status similar to the list page
          const now = new Date();
          let currentStatus = foundDelivery.status;
          if (foundDelivery.status === 'scheduled' && isBefore(foundDelivery.deliveryStartDate, now)) {
            currentStatus = 'in-progress';
          }
          if (foundDelivery.status !== 'completed' && isBefore(foundDelivery.deliveryEndDate, now)) {
            if (foundDelivery.completedCount < foundDelivery.totalDelivered) {
              currentStatus = 'expired';
            } else {
              currentStatus = 'completed';
            }
          }
          foundDelivery = { ...foundDelivery, status: currentStatus };
          setDelivery(foundDelivery);
        } else {
          toast({ title: "エラー", description: "指定された配信が見つかりません。", variant: "destructive" });
          navigate('/assessment-deliveries');
        }
      } catch (error) {
        console.error("Failed to fetch assessment delivery details:", error);
        toast({ title: "エラー", description: "配信詳細の取得に失敗しました。", variant: "destructive" });
        navigate('/assessment-deliveries');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeliveryDetails();
  }, [deliveryId, navigate, toast]);

  const handleEditClick = () => {
    if (!delivery) return;
    setEditingDelivery(delivery);
    setEditedTargetGroup(delivery.targetGroup);
    setEditedEndDate(format(delivery.deliveryEndDate, 'yyyy-MM-dd'));
    setShowEditDialog(true);
  };

  const handleSaveChanges = () => {
    if (!editingDelivery) return;
    // This is a mock save. In a real app, you'd call an API.
    // For now, we'll update the local state to reflect the change.
    const updatedDelivery = {
      ...editingDelivery,
      targetGroup: editedTargetGroup,
      deliveryEndDate: new Date(editedEndDate + 'T00:00:00Z'), // Ensure it's parsed as date
    };
    setDelivery(updatedDelivery); // Update the delivery details on this page

    toast({
      title: "成功",
      description: `配信「${editingDelivery.assessment.title}」の設定を更新しました。(Mock)`,
    });
    setShowEditDialog(false);
    setEditingDelivery(null);
    // Note: This won't update the main list's data unless you have a shared state management (e.g., Context, Redux)
    // or pass a callback to refresh the list. For this mock, changes are local to this page after fetching.
  };

  const handleSendReminder = () => {
    if (!delivery) return;
    console.log(`Sending reminder (mock) for: ${delivery.assessment.title} (ID: ${delivery.deliveryId})`);
    toast({
      title: "リマインダー送信 (Mock)",
      description: `「${delivery.assessment.title}」の未完了者にリマインダーを送信しました。`,
    });
  };

  const handleDeleteDelivery = () => {
    if (!delivery) return;
    // This is a mock delete.
    console.log(`Deleting delivery (mock): ${delivery.deliveryId}`);
    toast({
      title: "削除 (Mock)",
      description: `配信「${delivery.assessment.title}」を削除しました。`,
      variant: "destructive"
    });
    navigate('/assessment-deliveries'); // Navigate back to the list after "deletion"
  };


  if (isLoading) {
    return <div className="p-8 text-center">読み込み中...</div>;
  }

  if (!delivery) {
    return (
      <div className="p-8 text-center">
        <p>配信情報が見つかりません。</p>
        <Button onClick={() => navigate('/assessment-deliveries')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> 配信一覧に戻る
        </Button>
      </div>
    );
  }

  const statusInfo = getDeliveryStatusInfo(delivery.status);
  const progressPercentage = delivery.totalDelivered > 0 ? (delivery.completedCount / delivery.totalDelivered) * 100 : 0;
  const isNearExpiry = delivery.status === 'in-progress' && differenceInDays(delivery.deliveryEndDate, new Date()) >= 0 && differenceInDays(delivery.deliveryEndDate, new Date()) <= NEAR_EXPIRY_DAYS;

  return (
    <div className="p-4 sm:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate('/assessment-deliveries')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          配信一覧に戻る
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEditClick} disabled={delivery.status === 'completed' || delivery.status === 'expired'}>
            <Edit className="mr-2 h-4 w-4" />編集
          </Button>
          <Button
            variant="outline"
            onClick={handleSendReminder}
            disabled={delivery.status === 'completed' || delivery.status === 'scheduled' || delivery.status === 'expired' || delivery.incompleteCount === 0}
          >
            <Send className="mr-2 h-4 w-4" />リマインダー送信
          </Button>
          <Button variant="destructive" onClick={handleDeleteDelivery}>
            <Trash2 className="mr-2 h-4 w-4" />削除
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl mb-1">{delivery.assessment.title}</CardTitle>
              <CardDescription>アセスメント配信詳細</CardDescription>
            </div>
            <Badge variant={statusInfo.variant} className="text-sm px-3 py-1">
              {statusInfo.text}
              {isNearExpiry && <AlertTriangle className="ml-2 h-4 w-4 inline animate-pulse" />}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="font-semibold mb-2 text-lg">基本情報</h3>
            <div className="space-y-2 text-sm">
              <p><Users className="inline mr-2 h-4 w-4 text-muted-foreground" /><strong>対象グループ/部署:</strong> {delivery.targetGroup}</p>
              <p><CalendarDays className="inline mr-2 h-4 w-4 text-muted-foreground" /><strong>配信期間:</strong> {format(delivery.deliveryStartDate, 'yyyy/MM/dd')} - {format(delivery.deliveryEndDate, 'yyyy/MM/dd')}
                {isNearExpiry && <span className="ml-2 text-destructive font-semibold">(期限間近)</span>}
              </p>
              <p><Clock className="inline mr-2 h-4 w-4 text-muted-foreground" /><strong>アセスメント時間目安:</strong> {delivery.assessment.estimatedTime}分</p>
              <p><Users className="inline mr-2 h-4 w-4 text-muted-foreground" /><strong>作成者:</strong> {delivery.createdBy}</p>
              <p><CalendarDays className="inline mr-2 h-4 w-4 text-muted-foreground" /><strong>作成日:</strong> {format(delivery.createdAt, 'yyyy/MM/dd HH:mm')}</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-lg">進捗状況</h3>
            <div className="space-y-2 text-sm">
              <p><Users className="inline mr-2 h-4 w-4 text-muted-foreground" /><strong>総配信数:</strong> {delivery.totalDelivered}</p>
              <p><CheckCircle className="inline mr-2 h-4 w-4 text-green-500" /><strong>完了数:</strong> {delivery.completedCount}</p>
              <p><XCircle className="inline mr-2 h-4 w-4 text-red-500" /><strong>未完了数:</strong> {delivery.incompleteCount}</p>
              <div className="mt-2">
                <div className="flex justify-between mb-1">
                  <span>進捗率</span>
                  <span>{progressPercentage.toFixed(0)}%</span>
                </div>
                <Progress value={progressPercentage} className="w-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Placeholder for future participant list/details */}
      <Card>
        <CardHeader>
          <CardTitle>参加者状況 (プレースホルダー)</CardTitle>
          <CardDescription>個々の参加者の進捗状況や結果をここに表示します。</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">この機能は今後の開発で実装されます。</p>
          {/* Example: Could be a table of users */}
        </CardContent>
      </Card>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>配信設定の編集</DialogTitle>
            <DialogDescription>
              「{editingDelivery?.assessment.title}」の配信設定を変更します。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="targetGroup" className="text-right">
                対象グループ
              </Label>
              <Input
                id="targetGroup"
                value={editedTargetGroup}
                onChange={(e) => setEditedTargetGroup(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                終了日
              </Label>
              <Input
                id="endDate"
                type="date"
                value={editedEndDate}
                onChange={(e) => setEditedEndDate(e.target.value)}
                className="col-span-3"
                min={format(new Date(), 'yyyy-MM-dd')} // Prevent setting past dates
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>キャンセル</Button>
            <Button onClick={handleSaveChanges}>変更を保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
