import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Download,
  FileText,
  Search,
  Filter,
  Plus,
  AlertTriangle,
} from "lucide-react";
import {
  differenceInDays,
  parseISO,
  isBefore,
  startOfDay,
  isValid,
  format,
} from "date-fns";
import { ja } from "date-fns/locale";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { mockContracts } from "@/data/mockContracts"; // Import from new location

// --- Date & Status Logic for Contract Expiry ---
const today = startOfDay(new Date());

const getContractExpiryStatus = (
  endDateString: string
): { status: string; daysLeft?: number } => {
  try {
    const endDate = startOfDay(parseISO(endDateString));
    if (!isValid(endDate)) return { status: "invalid_date" };

    const daysDiff = differenceInDays(endDate, today);

    if (isBefore(endDate, today)) {
      return { status: "expired" };
    }
    if (daysDiff <= 7) {
      return { status: "expiring-7", daysLeft: daysDiff };
    }
    if (daysDiff <= 14) {
      return { status: "expiring-14", daysLeft: daysDiff };
    }
    if (daysDiff <= 30) {
      return { status: "expiring-30", daysLeft: daysDiff };
    }
    return { status: "active" };
  } catch {
    return { status: "invalid_date" };
  }
};

const getStatusBadgeForContract = (statusInfo: { status: string; daysLeft?: number }) => {
  switch (statusInfo.status) {
    case "active":
      return (
        <Badge className="bg-green-100 text-green-800 border border-green-300">
          有効
        </Badge>
      );
    case "expiring-7":
      return (
        <Badge className="bg-red-100 text-red-800 border border-red-300 flex items-center gap-1">
          <AlertTriangle size={12} /> 残り{statusInfo.daysLeft}日
        </Badge>
      );
    case "expiring-14":
      return (
        <Badge className="bg-orange-100 text-orange-800 border border-orange-300 flex items-center gap-1">
          <AlertTriangle size={12} /> 残り{statusInfo.daysLeft}日
        </Badge>
      );
    case "expiring-30":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-300 flex items-center gap-1">
          <AlertTriangle size={12} /> 残り{statusInfo.daysLeft}日
        </Badge>
      );
    case "expired":
      return (
        <Badge className="bg-gray-100 text-gray-800 border border-gray-300">
          期限切れ
        </Badge>
      );
    case "invalid_date":
      return <Badge variant="destructive">無効な日付</Badge>;
    default:
      return <Badge>{statusInfo.status}</Badge>;
  }
};

const formatDate = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return "無効な日付";
    return format(date, "PPP", { locale: ja });
  } catch {
    return "フォーマットエラー";
  }
};
// --- End Date & Status Logic ---

const ITEMS_PER_PAGE = 5;

export default function Contracts() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredContracts = mockContracts.filter( // Use mockContracts from import
    (contract) =>
      contract.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.plan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredContracts.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentContracts = filteredContracts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleAddContract = () => {
    console.log("Adding new contract...");
    // Logic to add contract to mockContracts (if desired for demo)
    // For now, just closes dialog
    setShowAddDialog(false);
  };

  const handleRowClick = (contractId: string) => {
    navigate(`/contracts/detail/${contractId}`);
  };

  const renderPaginationItems = () => {
    const pageItems = [];
    const maxPagesToShow = 5; 
    const halfMaxPages = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageItems.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(i);
              }}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      pageItems.push(
        <PaginationItem key={1}>
          <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(1); }} isActive={currentPage === 1}>1</PaginationLink>
        </PaginationItem>
      );
      if (currentPage > halfMaxPages + 1) {
        pageItems.push(<PaginationItem key="start-ellipsis"><PaginationEllipsis /></PaginationItem>);
      }
      let startPage = Math.max(2, currentPage - halfMaxPages + (maxPagesToShow % 2 === 0 ? 1 : 0));
      let endPage = Math.min(totalPages - 1, currentPage + halfMaxPages - 1 + (maxPagesToShow % 2 === 0 ? 1 : 0));
      if (currentPage <= halfMaxPages) {
        startPage = 2;
        endPage = Math.min(totalPages - 1, maxPagesToShow - 1);
      } else if (currentPage >= totalPages - halfMaxPages + 1) {
        startPage = Math.max(2, totalPages - maxPagesToShow + 2);
        endPage = totalPages - 1;
      }
      for (let i = startPage; i <= endPage; i++) {
        pageItems.push(
          <PaginationItem key={i}>
            <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(i); }} isActive={currentPage === i}>{i}</PaginationLink>
          </PaginationItem>
        );
      }
      if (currentPage < totalPages - halfMaxPages) {
        pageItems.push(<PaginationItem key="end-ellipsis"><PaginationEllipsis /></PaginationItem>);
      }
      pageItems.push(
        <PaginationItem key={totalPages}>
          <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(totalPages); }} isActive={currentPage === totalPages}>{totalPages}</PaginationLink>
        </PaginationItem>
      );
    }
    return pageItems;
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">契約管理</h1>
          <p className="text-gray-500 mt-1">企業との契約情報を管理します</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <Download size={16} /> エクスポート
          </Button>
          <Button variant="outline" className="flex items-center gap-1">
            <FileText size={16} /> レポート
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus size={16} /> 新規契約
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>新規契約の追加</DialogTitle>
                <DialogDescription>新しい契約の詳細情報を入力してください</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {/* Form fields for adding contract */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="company" className="text-right">企業名</Label>
                  <Input id="company" placeholder="株式会社サンプル" className="col-span-3" />
                </div>
                {/* ... other fields ... */}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>キャンセル</Button>
                <Button type="submit" onClick={handleAddContract}>保存</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>契約一覧</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="企業名・契約ID・プランで検索..."
                  className="pl-8 w-full sm:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); 
                  }}
                />
              </div>
              <Button variant="outline" size="icon" className="w-full sm:w-auto">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>契約ID</TableHead>
                  <TableHead>企業名</TableHead>
                  <TableHead>プラン</TableHead>
                  <TableHead>ユーザー数</TableHead>
                  <TableHead>開始日</TableHead>
                  <TableHead>終了日</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead>契約金額</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentContracts.length > 0 ? (
                  currentContracts.map((contract) => {
                    const contractStatusInfo = getContractExpiryStatus(contract.endDate);
                    return (
                      <TableRow
                        key={contract.id}
                        onClick={() => handleRowClick(contract.id)}
                        className="cursor-pointer hover:bg-gray-50"
                      >
                        <TableCell className="font-medium">{contract.id}</TableCell>
                        <TableCell>{contract.companyName}</TableCell>
                        <TableCell>{contract.plan}</TableCell>
                        <TableCell>{contract.userCount}</TableCell>
                        <TableCell>{formatDate(contract.startDate)}</TableCell>
                        <TableCell>{formatDate(contract.endDate)}</TableCell>
                        <TableCell>{getStatusBadgeForContract(contractStatusInfo)}</TableCell>
                        <TableCell>{contract.amount}</TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      {filteredContracts.length === 0 && searchTerm !== ""
                        ? "検索条件に一致する契約が見つかりません。"
                        : "契約データがありません。"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        {totalPages > 0 && (
          <CardFooter className="flex flex-col sm:flex-row items-center justify-between py-4">
            <div className="text-xs text-muted-foreground mb-2 sm:mb-0">
              全 {filteredContracts.length} 件中 {indexOfFirstItem + 1} -{" "}
              {Math.min(indexOfLastItem, filteredContracts.length)} 件を表示
            </div>
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}/>
                  </PaginationItem>
                  {renderPaginationItems()}
                  <PaginationItem>
                    <PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}/>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
