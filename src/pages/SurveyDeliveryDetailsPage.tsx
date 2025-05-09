import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, CalendarDays, Users, CheckCircle, XCircle, Clock, AlertTriangle, Edit, Send, Trash2, PlayCircle } from 'lucide-react';
import { SurveyDelivery, getSurveyDeliveryStatusInfo } from '@/types/surveyDelivery';
import { mockSurveyDeliveries } from '@/data/mockSurveyDeliveries'; // Using mock data
import { format, isBefore, differenceInDays, parseISO } from 'date-fns';
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
import { Textarea } from '@/components/ui/textarea'; // For target display

const NEAR_EXPIRY_DAYS_SURVEY = 3; // Differentiated constant name

export default function SurveyDeliveryDetailsPage() {
  const { deliveryId } = useParams<{ deliveryId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [delivery, setDelivery] = useState<SurveyDelivery | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState<SurveyDelivery | null>(null);
  // For survey, target is an array. Editing might be more complex.
  // For simplicity, let's assume we edit deliveryName and endDate.
  const [editedDeliveryName, setEditedDeliveryName] = useState('');
  const [editedEndDate, setEditedEndDate] = useState('');

  useEffect(() => {
    const fetchDeliveryDetails = async () => {
      setIsLoading(true);
      if (!deliveryId) {
        toast({ title: "エラー", description: "配信IDが見つかりません。", variant: "destructive" });
        setIsLoading(false);
        navigate('/survey-deliveries');
        return;
      }

      try {
        // Simulate API call
        // In a real app, you'd fetch this specific delivery by ID
        const foundDelivery = mockSurveyDeliveries.find(d => d.id === deliveryId);

        if (foundDelivery) {
          // Simulate status updates based on dates, similar to AssessmentDeliveryDetailsPage
          let currentDelivery = { ...foundDelivery };
          const now = new Date();
          const startDate = parseISO(currentDelivery.startDate);
          const endDate = parseISO(currentDelivery.endDate);

          if (currentDelivery.status === 'scheduled' && isBefore(startDate, now)) {
            currentDelivery.status = 'active';
          }
          if (currentDelivery.status !== 'completed' && currentDelivery.status !== 'cancelled' && isBefore(endDate, now)) {
             // If past end date and not manually completed/cancelled, mark as completed (or expired if there's such a status)
             // For simplicity, let's assume it becomes 'completed' if all participated, or stays 'active' (implying overdue)
             // Or, if we want an 'expired' status, we'd need to add it to SurveyDelivery['status']
             // Let's assume it becomes 'completed' for now if past end date.
             // A more robust logic might be needed based on business rules.
            if (currentDelivery.completedParticipants >= currentDelivery.totalParticipants) {
                currentDelivery.status = 'completed';
            } else {
                // No explicit 'expired' status in SurveyDelivery, so it might remain 'active' but overdue
                // Or, if business rule implies 'cancelled' or some other status, handle here.
                // For this example, we'll leave it as is, or one might introduce an 'expired' status.
            }
          }
          setDelivery(currentDelivery);
        } else {
          toast({ title: "エラー", description: "指定されたサーベイ配信が見つかりません。", variant: "destructive" });
          navigate('/survey-deliveries');
        }
      } catch (error) {
        console.error("Failed to fetch survey delivery details:", error);
        toast({ title: "エラー", description: "サーベイ配信詳細の取得に失敗しました。", variant: "destructive" });
        navigate('/survey-deliveries');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeliveryDetails();
  }, [deliveryId, navigate, toast]);

  const handleEditClick = () => {
    if (!delivery) return;
    setEditingDelivery(delivery);
    setEditedDeliveryName(delivery.deliveryName);
    setEditedEndDate(format(parseISO(delivery.endDate), 'yyyy-MM-dd'));
    setShowEditDialog(true);
  };

  const handleSaveChanges = () => {
    if (!editingDelivery) return;
    // Mock save
    const updatedDelivery = {
      ...editingDelivery,
      deliveryName: editedDeliveryName,
      endDate: parseISO(editedEndDate + 'T00:00:00Z').toISOString(),
    };
    setDelivery(updatedDelivery); // Update local state

    // Update in mockSurveyDeliveries (for persistence across navigations in mock environment)
    const index = mockSurveyDeliveries.findIndex(d => d.id === updatedDelivery.id);
    if (index !== -1) {
      mockSurveyDeliveries[index] = updatedDelivery;
    }

    toast({
      title: "成功",
      description: `サーベイ配信「${editingDelivery.surveyTitle}」の設定を更新しました。(Mock)`,
    });
    setShowEditDialog(false);
    setEditingDelivery(null);
  };

  const handleSendReminder = () => {
    if (!delivery) return;
    const incompleteCount = delivery.totalParticipants - delivery.completedParticipants;
    if (incompleteCount === 0) {
      toast({ title: "情報", description: "すべての対象者が完了済みです。", variant: "default" });
      return;
    }
    console.log(`Sending reminder (mock) for survey: ${delivery.surveyTitle} (ID: ${delivery.id})`);
    toast({
      title: "リマインダー送信 (Mock)",
      description: `サーベイ「${delivery.surveyTitle}」の未完了者にリマインダーを送信しました。`,
    });
  };

  const handleDeleteDelivery = () => {
    if (!delivery) return;
    // Mock delete
    const index = mockSurveyDeliveries.findIndex(d => d.id === delivery.id);
    if (index !== -1) {
      mockSurveyDeliveries.splice(index, 1);
    }
    toast({
      title: "削除 (Mock)",
      description: `サーベイ配信「${delivery.surveyTitle}」を削除しました。`,
      variant: "destructive"
    });
    navigate('/survey-deliveries');
  };

  if (isLoading) {
    return <div className="p-8 text-center">読み込み中...</div>;
  }

  if (!delivery) {
    return (
      <div className="p-8 text-center">
        <p>サーベイ配信情報が見つかりません。</p>
        <Button onClick={() => navigate('/survey-deliveries')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> サーベイ配信一覧に戻る
        </Button>
      </div>
    );
  }

  const statusInfo = getSurveyDeliveryStatusInfo(delivery.status);
  const progressPercentage = delivery.totalParticipants > 0 ? delivery.completionRate : 0;
  const incompleteCount = delivery.totalParticipants - delivery.completedParticipants;
  const isNearExpiry = delivery.status === 'active' && differenceInDays(parseISO(delivery.endDate), new Date()) >= 0 && differenceInDays(parseISO(delivery.endDate), new Date()) <= NEAR_EXPIRY_DAYS_SURVEY;
  const targetsDisplay = delivery.targets.map(t => `${t.name} (${t.type})`).join('\n');

  return (
    <div className="p-4 sm:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate('/survey-deliveries')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          サーベイ配信一覧に戻る
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEditClick} disabled={delivery.status === 'completed' || delivery.status === 'cancelled'}>
            <Edit className="mr-2 h-4 w-4" />編集
          </Button>
          <Button
            variant="outline"
            onClick={handleSendReminder}
            disabled={delivery.status === 'completed' || delivery.status === 'scheduled' || delivery.status === 'cancelled' || incompleteCount === 0}
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
              <CardTitle className="text-2xl mb-1">{delivery.deliveryName}</CardTitle>
              <CardDescription>サーベイ配信詳細 (元サーベイ: {delivery.surveyTitle})</CardDescription>
            </div>
            <Badge variant={statusInfo.variant} className="text-sm px-3 py-1">
              {statusInfo.icon && <statusInfo.icon className="mr-2 h-4 w-4 inline" />}
              {statusInfo.text}
              {isNearExpiry && <AlertTriangle className="ml-2 h-4 w-4 inline animate-pulse text-destructive" />}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-semibold mb-2 text-lg">基本情報</h3>
            <div className="space-y-3 text-sm">
              <p><Users className="inline mr-2 h-4 w-4 text-muted-foreground" /><strong>対象者/グループ:</strong></p>
              <Textarea
                readOnly
                value={targetsDisplay}
                className="h-24 text-sm bg-muted/40"
                rows={delivery.targets.length > 3 ? delivery.targets.length : 3}
              />
              <p><CalendarDays className="inline mr-2 h-4 w-4 text-muted-foreground" /><strong>配信期間:</strong> {format(parseISO(delivery.startDate), 'yyyy/MM/dd')} - {format(parseISO(delivery.endDate), 'yyyy/MM/dd')}
                {isNearExpiry && <span className="ml-2 text-destructive font-semibold">(期限間近)</span>}
              </p>
              {/* Survey type does not have createdBy or estimatedTime in mock, add if needed */}
              <p><CalendarDays className="inline mr-2 h-4 w-4 text-muted-foreground" /><strong>作成日:</strong> {format(parseISO(delivery.createdAt), 'yyyy/MM/dd HH:mm')}</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-lg">進捗状況</h3>
            <div className="space-y-2 text-sm">
              <p><Users className="inline mr-2 h-4 w-4 text-muted-foreground" /><strong>総対象者数:</strong> {delivery.totalParticipants}</p>
              <p><CheckCircle className="inline mr-2 h-4 w-4 text-green-500" /><strong>完了者数:</strong> {delivery.completedParticipants}</p>
              <p><XCircle className="inline mr-2 h-4 w-4 text-red-500" /><strong>未完了者数:</strong> {incompleteCount}</p>
              <div className="mt-2">
                <div className="flex justify-between mb-1">
                  <span>完了率</span>
                  <span>{progressPercentage.toFixed(0)}%</span>
                </div>
                <Progress value={progressPercentage} className="w-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>参加者状況 (プレースホルダー)</CardTitle>
          <CardDescription>個々の参加者の進捗状況をここに表示します。</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">この機能は今後の開発で実装されます。</p>
        </CardContent>
      </Card>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>サーベイ配信設定の編集</DialogTitle>
            <DialogDescription>
              「{editingDelivery?.deliveryName}」の配信設定を変更します。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="deliveryName" className="text-right">
                配信名
              </Label>
              <Input
                id="deliveryName"
                value={editedDeliveryName}
                onChange={(e) => setEditedDeliveryName(e.target.value)}
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
                min={format(new Date(), 'yyyy-MM-dd')}
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
