// Copied and adapted from AssessmentDeliveryList.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { MoreHorizontal, Search, Filter, ArrowUpDown, Eye, Edit2, Trash2, PlayCircle, BarChartHorizontalBig, Clock, CheckCircle, XCircle } from 'lucide-react'; // Added icons
import { SurveyDelivery, getSurveyDeliveryStatusInfo } from '@/types/surveyDelivery'; // Changed import
import { mockSurveyDeliveries } from '@/data/mockSurveyDeliveries'; // Changed import
import { useToast } from "@/hooks/use-toast";
import { format, parseISO, isBefore } from 'date-fns'; // Added isBefore

type SortKey = keyof SurveyDelivery | 'completionRate';
type SortDirection = 'asc' | 'desc';
type StatusFilter = 'all' | SurveyDelivery['status'];

export default function SurveyDeliveryList() {
  const [deliveries, setDeliveries] = useState<SurveyDelivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call to fetch and potentially update statuses
    setTimeout(() => {
      const now = new Date();
      const updatedDeliveries = mockSurveyDeliveries.map(delivery => {
        let currentStatus = delivery.status;
        const startDate = parseISO(delivery.startDate);
        // const endDate = parseISO(delivery.endDate); // Not used in this block for status update

        if (delivery.status === 'scheduled' && isBefore(startDate, now)) {
          currentStatus = 'active';
        }
        // This logic might be too simplistic for a list view; details page handles more complex updates.
        // For list, usually rely on backend to provide current status.
        // if (delivery.status !== 'completed' && delivery.status !== 'cancelled' && isBefore(endDate, now)) {
        //   currentStatus = 'completed'; // Or 'expired' if that status existed
        // }
        return { ...delivery, status: currentStatus };
      });
      setDeliveries(updatedDeliveries);
      setIsLoading(false);
    }, 100);
  }, []);

  const filteredAndSortedDeliveries = useMemo(() => {
    let result = deliveries.filter(delivery => {
      const matchesSearch =
        delivery.deliveryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.surveyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.targets.some(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    result.sort((a, b) => {
      let valA, valB;

      switch (sortKey) {
        case 'completionRate':
          valA = a.completionRate;
          valB = b.completionRate;
          break;
        case 'startDate':
        case 'endDate':
        case 'createdAt':
          valA = parseISO(a[sortKey]).getTime();
          valB = parseISO(b[sortKey]).getTime();
          break;
        case 'totalParticipants':
        case 'completedParticipants':
          valA = a[sortKey];
          valB = b[sortKey];
          break;
        default:
          valA = String(a[sortKey as keyof SurveyDelivery] ?? '').toLowerCase();
          valB = String(b[sortKey as keyof SurveyDelivery] ?? '').toLowerCase();
      }
      
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [deliveries, searchTerm, statusFilter, sortKey, sortDirection]);

  const handleSortChange = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };
  
  const handleViewDetails = (deliveryId: string) => {
    navigate(`/survey-deliveries/${deliveryId}`);
  };

  const handleEditDelivery = (e: React.MouseEvent, deliveryId: string) => {
    e.stopPropagation(); // Prevent row click
    // navigate(`/survey-deliveries/edit/${deliveryId}`); // TODO: Create edit page or use dialog
    toast({ title: "編集 (未実装)", description: `サーベイ配信ID: ${deliveryId} の編集機能は未実装です。詳細ページで編集できます。`});
  };

  const handleDeleteDelivery = (e: React.MouseEvent, deliveryId: string) => {
    e.stopPropagation(); // Prevent row click
    // Mock delete:
    setDeliveries(prev => prev.filter(d => d.id !== deliveryId));
    const index = mockSurveyDeliveries.findIndex(d => d.id === deliveryId);
    if (index !== -1) {
      mockSurveyDeliveries.splice(index, 1);
    }
    toast({ title: "削除成功 (Mock)", description: `サーベイ配信ID: ${deliveryId} を削除しました。`});
  };
  
  const handleViewResults = (e: React.MouseEvent, deliveryId: string) => {
    e.stopPropagation(); // Prevent row click
    navigate(`/surveys/data-analysis?deliveryId=${deliveryId}`); // Assuming data analysis can filter by deliveryId
    // toast({ title: "結果表示 (未実装)", description: `サーベイ配信ID: ${deliveryId} の結果ページは未実装です。`});
  };


  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-gray-900">サーベイ配信管理</h2>
        {/* Button to open CreateSurveyDeliveryDialog can be placed here */}
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="配信名, サーベイ名, 対象者名..."
            className="pl-8 w-full sm:w-[300px] bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-4 items-center">
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
            <SelectTrigger className="w-full sm:w-[180px] bg-white">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="ステータス" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべてのステータス</SelectItem>
              <SelectItem value="scheduled">予定</SelectItem>
              <SelectItem value="active">実施中</SelectItem>
              <SelectItem value="completed">完了</SelectItem>
              <SelectItem value="cancelled">中止</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-10">読み込み中...</div>
      ) : filteredAndSortedDeliveries.length === 0 ? (
        <div className="text-center py-10 text-gray-500">該当するサーベイ配信が見つかりません。</div>
      ) : (
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSortChange('deliveryName')} className="cursor-pointer hover:bg-muted/50">
                配信名 {sortKey === 'deliveryName' && <ArrowUpDown className="ml-2 h-3 w-3 inline" />}
              </TableHead>
              <TableHead onClick={() => handleSortChange('surveyTitle')} className="cursor-pointer hover:bg-muted/50">
                サーベイ名 {sortKey === 'surveyTitle' && <ArrowUpDown className="ml-2 h-3 w-3 inline" />}
              </TableHead>
              <TableHead>対象者</TableHead>
              <TableHead onClick={() => handleSortChange('startDate')} className="cursor-pointer hover:bg-muted/50">
                開始日 {sortKey === 'startDate' && <ArrowUpDown className="ml-2 h-3 w-3 inline" />}
              </TableHead>
              <TableHead onClick={() => handleSortChange('endDate')} className="cursor-pointer hover:bg-muted/50">
                終了日 {sortKey === 'endDate' && <ArrowUpDown className="ml-2 h-3 w-3 inline" />}
              </TableHead>
              <TableHead onClick={() => handleSortChange('status')} className="cursor-pointer hover:bg-muted/50">
                ステータス {sortKey === 'status' && <ArrowUpDown className="ml-2 h-3 w-3 inline" />}
              </TableHead>
              <TableHead onClick={() => handleSortChange('completionRate')} className="text-right cursor-pointer hover:bg-muted/50">
                完了率 {sortKey === 'completionRate' && <ArrowUpDown className="ml-2 h-3 w-3 inline" />}
              </TableHead>
              <TableHead className="text-center">アクション</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedDeliveries.map((delivery) => {
              const statusInfo = getSurveyDeliveryStatusInfo(delivery.status);
              return (
              <TableRow key={delivery.id} onClick={() => handleViewDetails(delivery.id)} className="cursor-pointer hover:bg-muted/10">
                <TableCell className="font-medium">{delivery.deliveryName}</TableCell>
                <TableCell>{delivery.surveyTitle}</TableCell>
                <TableCell>
                  {delivery.targets.length > 2 
                    ? `${delivery.targets.slice(0,2).map(t => t.name).join(', ')} 他${delivery.targets.length - 2}件`
                    : delivery.targets.map(t => t.name).join(', ')
                  }
                </TableCell>
                <TableCell>{format(parseISO(delivery.startDate), 'yyyy/MM/dd')}</TableCell>
                <TableCell>{format(parseISO(delivery.endDate), 'yyyy/MM/dd')}</TableCell>
                <TableCell>
                  <Badge variant={statusInfo.variant} className="whitespace-nowrap">
                    {statusInfo.icon && <statusInfo.icon className="mr-1 h-3 w-3 inline" />}
                    {statusInfo.text}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {delivery.totalParticipants > 0 ? `${Math.round(delivery.completionRate)}%` : 'N/A'}
                  <span className="text-xs text-gray-500 ml-1">({delivery.completedParticipants}/{delivery.totalParticipants})</span>
                </TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">アクションを開く</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>アクション</DropdownMenuLabel>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleViewDetails(delivery.id); }}>
                        <Eye className="mr-2 h-4 w-4" /> 詳細表示
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => handleViewResults(e, delivery.id)} 
                        disabled={delivery.status !== 'completed' && delivery.status !== 'active'}
                      >
                        <BarChartHorizontalBig className="mr-2 h-4 w-4" /> 結果表示
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={(e) => handleEditDelivery(e, delivery.id)} 
                        disabled={delivery.status === 'completed' || delivery.status === 'cancelled'}
                      >
                        <Edit2 className="mr-2 h-4 w-4" /> 編集
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => handleDeleteDelivery(e, delivery.id)} 
                        className="text-destructive focus:text-destructive focus:bg-destructive/10"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> 削除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </Card>
      )}
    </div>
  );
}
