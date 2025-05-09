import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Added import
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AssessmentDelivery, DeliveryStatus, getDeliveryStatusInfo } from '@/types/assessmentDelivery';
import { getAssessmentDeliveries } from '@/data/mockAssessmentDeliveries';
import { format, differenceInDays, isBefore, parseISO } from 'date-fns';
import { Search, Edit, MoreHorizontal, Trash2, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const NEAR_EXPIRY_DAYS = 3; // Highlight if deadline is within 3 days

export default function AssessmentDeliveryList() {
  const navigate = useNavigate(); // Added hook
  const [deliveries, setDeliveries] = useState<AssessmentDelivery[]>([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState<AssessmentDelivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<DeliveryStatus | 'all'>('all');
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState<AssessmentDelivery | null>(null);
  const [editedTargetGroup, setEditedTargetGroup] = useState('');
  const [editedEndDate, setEditedEndDate] = useState(''); // Store as string YYYY-MM-DD

  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getAssessmentDeliveries();
        const updatedData = data.map(d => {
          const now = new Date();
          let currentStatus = d.status;
          if (d.status === 'scheduled' && isBefore(d.deliveryStartDate, now)) {
            currentStatus = 'in-progress';
          }
          if (d.status !== 'completed' && isBefore(d.deliveryEndDate, now)) {
             if (d.completedCount < d.totalDelivered) {
                currentStatus = 'expired';
             } else {
                 currentStatus = 'completed';
             }
          }
          return { ...d, status: currentStatus };
        });
        setDeliveries(updatedData);
      } catch (error) {
        console.error("Failed to fetch assessment deliveries:", error);
        toast({
          title: "エラー",
          description: "配信リストの取得に失敗しました。",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  // Filtering Logic
  useEffect(() => {
    let result = deliveries.filter(delivery => {
      const matchesSearch =
        delivery.assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.targetGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    setFilteredDeliveries(result);
  }, [searchTerm, statusFilter, deliveries]);

  // --- Mock Actions ---

  const handleEditClick = (delivery: AssessmentDelivery, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click when clicking edit button
    setEditingDelivery(delivery);
    setEditedTargetGroup(delivery.targetGroup);
    setEditedEndDate(format(delivery.deliveryEndDate, 'yyyy-MM-dd'));
    setShowEditDialog(true);
  };

  const handleSaveChanges = () => {
    if (!editingDelivery) return;
    setDeliveries(prev => prev.map(d =>
      d.deliveryId === editingDelivery.deliveryId
        ? { ...d, targetGroup: editedTargetGroup, deliveryEndDate: parseISO(editedEndDate + 'T00:00:00') }
        : d
    ));
    toast({
      title: "成功",
      description: `配信「${editingDelivery.assessment.title}」の設定を更新しました。(Mock)`,
    });
    setShowEditDialog(false);
    setEditingDelivery(null);
  };


  const handleSendReminder = (deliveryId: string, assessmentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    console.log(`Sending reminder (mock) for: ${assessmentTitle} (ID: ${deliveryId})`);
    toast({
      title: "リマインダー送信 (Mock)",
      description: `「${assessmentTitle}」の未完了者にリマインダーを送信しました。`,
    });
  };

  const handleDeleteDelivery = (deliveryId: string, assessmentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    console.log(`Deleting single delivery (mock): ${deliveryId}`);
    setDeliveries(prev => prev.filter(d => d.deliveryId !== deliveryId));
    toast({ title: "削除 (Mock)", description: `配信「${assessmentTitle}」を削除しました。`, variant: "destructive"});
  };

  // --- Helper Functions ---
  const isNearExpiry = (endDate: Date, status: DeliveryStatus): boolean => {
    if (status !== 'in-progress') return false;
    const daysRemaining = differenceInDays(endDate, new Date());
    return daysRemaining >= 0 && daysRemaining <= NEAR_EXPIRY_DAYS;
  };

  const handleRowClick = (deliveryId: string) => {
    navigate(`/assessment-deliveries/${deliveryId}`);
  };

  return (
    <div className="p-4 sm:p-8">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>
            <h2 className="text-2xl font-semibold text-gray-900">
              アセスメント配信一覧
            </h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-4 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="検索 (タイトル, 対象, 作成者)..."
                  className="pl-8 w-[250px] sm:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as DeliveryStatus | 'all')}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="ステータス" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべてのステータス</SelectItem>
                  <SelectItem value="scheduled">予定</SelectItem>
                  <SelectItem value="in-progress">進行中</SelectItem>
                  <SelectItem value="completed">完了</SelectItem>
                  <SelectItem value="expired">期限切れ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Delivery Table */}
          <div className="border rounded-md overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>アセスメント名</TableHead>
                  <TableHead>対象グループ/部署</TableHead>
                  <TableHead>配信期間</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead>進捗 (配信/完了/未完了)</TableHead>
                  <TableHead className="text-right">アクション</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      読み込み中...
                    </TableCell>
                  </TableRow>
                ) : filteredDeliveries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      該当する配信が見つかりません。
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDeliveries.map((delivery) => {
                    const statusInfo = getDeliveryStatusInfo(delivery.status);
                    const nearExpiry = isNearExpiry(delivery.deliveryEndDate, delivery.status);

                    return (
                      <TableRow
                        key={delivery.deliveryId}
                        className={`${nearExpiry ? 'bg-yellow-50 hover:bg-yellow-100' : 'hover:bg-muted/50'} cursor-pointer`}
                        onClick={() => handleRowClick(delivery.deliveryId)}
                      >
                        <TableCell className="font-medium" onClick={(e) => e.stopPropagation()}><a href="#" onClick={(e) => { e.preventDefault(); handleRowClick(delivery.deliveryId);}} className="hover:underline">{delivery.assessment.title}</a></TableCell>
                        <TableCell>{delivery.targetGroup}</TableCell>
                        <TableCell>
                          {format(delivery.deliveryStartDate, 'yyyy/MM/dd')} - {format(delivery.deliveryEndDate, 'yyyy/MM/dd')}
                          {nearExpiry && <Badge variant="destructive" className="ml-2 animate-pulse">期限間近</Badge>}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>
                        </TableCell>
                        <TableCell>
                          {delivery.totalDelivered} / {delivery.completedCount} / {delivery.incompleteCount}
                        </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}> {/* Prevent row click for actions cell */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">アクションを開く</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>アクション</DropdownMenuLabel>
                              <DropdownMenuItem onClick={(e) => handleEditClick(delivery, e)}>
                                <Edit className="mr-2 h-4 w-4" />
                                編集
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => handleSendReminder(delivery.deliveryId, delivery.assessment.title, e)}
                                disabled={delivery.status === 'completed' || delivery.status === 'scheduled'}
                              >
                                <Send className="mr-2 h-4 w-4" />
                                リマインダー送信
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-red-600 focus:text-red-600 focus:bg-red-100"
                                    onClick={(e) => handleDeleteDelivery(delivery.deliveryId, delivery.assessment.title, e)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    削除
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
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
